<?php
/**
 * Create a Razorpay Order and a Pending Booking.
 */

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if (!function_exists('curl_init')) {
    echo json_encode(["success" => false, "message" => "PHP CURL extension is not enabled. Please enable it in php.ini."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/razorpay_config.php';

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
    exit;
}

$type = $data['type'] ?? ''; // 'package', 'bus', 'hotel'
$amount = floatval($data['amount'] ?? 0); // Total amount in INR

if ($amount <= 0 || !in_array($type, ['package', 'bus', 'hotel'])) {
    echo json_encode(["success" => false, "message" => "Invalid amount or booking type"]);
    exit;
}

// 1. Create a "Pending" booking in the database
$booking_id = 0;
$conn->begin_transaction();

try {
    if ($type === 'package') {
        $user_id = intval($data['user_id']);
        $customer_name = $conn->real_escape_string($data['customer_name']);
        $customer_phone = $conn->real_escape_string($data['customer_phone']);
        $travel_date = $conn->real_escape_string($data['travel_date']);
        $passengers = intval($data['passengers']);
        $package_id = intval($data['package_id']);
        $package_title = $conn->real_escape_string($data['package_title']);
        $package_price = floatval($data['package_price']);

        $stmt = $conn->prepare("INSERT INTO bookings_data (customer_name, customer_phone, user_id, travel_date, passengers, payment_method, package_id, package_title, package_price, status, payment_status) VALUES (?, ?, ?, ?, ?, 'razorpay', ?, ?, ?, 'pending', 'pending')");
        $stmt->bind_param("ssisiisd", $customer_name, $customer_phone, $user_id, $travel_date, $passengers, $package_id, $package_title, $package_price);
        $stmt->execute();
        $booking_id = $conn->insert_id;
    } 
    else if ($type === 'bus') {
        $bus_id = intval($data['bus_id']);
        $user_id = intval($data['user_id']);
        $route_id = intval($data['route_id']);
        $seat_numbers = $data['seat_numbers']; // Array
        $passenger_name = $conn->real_escape_string($data['passenger_name']);
        $phone = $conn->real_escape_string($data['phone']);
        $email = $conn->real_escape_string($data['email']);
        $travel_date = $conn->real_escape_string($data['travel_date']);

        $stmt = $conn->prepare("INSERT INTO bus_bookings (bus_id, user_id, route_id, seat_number, passenger_name, phone, email, travel_date, payment_method, booking_status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'razorpay', 'Pending', 'pending')");
        
        foreach ($seat_numbers as $seat) {
            $stmt->bind_param("iiiissss", $bus_id, $user_id, $route_id, $seat, $passenger_name, $phone, $email, $travel_date);
            $stmt->execute();
        }
        $booking_id = $conn->insert_id; // Note: For multiple seats, this is the last ID. In practice, you might want a parent booking ID.
    }
    else if ($type === 'hotel') {
        $hotel_id = intval($data['hotel_id']);
        $user_id = intval($data['user_id']);
        $room_id = intval($data['room_id']);
        $guest_name = $conn->real_escape_string($data['guest_name']);
        $phone = $conn->real_escape_string($data['phone']);
        $email = $conn->real_escape_string($data['email']);
        $check_in = $conn->real_escape_string($data['check_in']);
        $check_out = $conn->real_escape_string($data['check_out']);
        $num_guests = intval($data['num_guests']);
        $num_rooms = intval($data['num_rooms']);

        $stmt = $conn->prepare("INSERT INTO hotel_bookings (hotel_id, user_id, room_id, guest_name, phone, email, check_in, check_out, num_guests, num_rooms, total_price, payment_method, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'razorpay', 'Pending', 'pending')");
        $stmt->bind_param("iiisssssiid", $hotel_id, $user_id, $room_id, $guest_name, $phone, $email, $check_in, $check_out, $num_guests, $num_rooms, $amount);
        $stmt->execute();
        $booking_id = $conn->insert_id;
    }

    // 2. Create Razorpay Order
    $order_data = [
        'amount'          => $amount * 100, // Amount in paise
        'currency'        => RAZORPAY_CURRENCY,
        'receipt'         => 'rcpt_' . $booking_id . '_' . time(),
        'notes'           => [
            'booking_id'  => $booking_id,
            'type'        => $type,
            'customer'    => $customer_name ?? $passenger_name ?? $guest_name
        ]
    ];

    $ch = curl_init('https://api.razorpay.com/v1/orders');
    curl_setopt($ch, CURLOPT_USERPWD, RAZORPAY_KEY_ID . ':' . RAZORPAY_KEY_SECRET);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($order_data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        throw new Exception("CURL Error: " . $curl_error);
    }

    if ($http_code !== 200) {
        $error_data = json_decode($response, true);
        $error_msg = $error_data['error']['description'] ?? $response;
        throw new Exception("Razorpay API Error ($http_code): " . $error_msg);
    }

    $razorpay_order = json_decode($response, true);
    $razorpay_order_id = $razorpay_order['id'];

    // 3. Update booking with razorpay_order_id
    if ($type === 'package') {
        $conn->query("UPDATE bookings_data SET razorpay_order_id = '$razorpay_order_id' WHERE id = $booking_id");
    } else if ($type === 'bus') {
         // Update all seats in this specific booking attempt
         // In a better design, we'd have a booking_group_id
         $conn->query("UPDATE bus_bookings SET razorpay_order_id = '$razorpay_order_id' WHERE id >= $booking_id - " . (count($seat_numbers)-1) . " AND id <= $booking_id");
    } else if ($type === 'hotel') {
        $conn->query("UPDATE hotel_bookings SET razorpay_order_id = '$razorpay_order_id' WHERE id = $booking_id");
    }

    $conn->commit();

    echo json_encode([
        "success"            => true,
        "razorpay_order_id"  => $razorpay_order_id,
        "booking_id"         => $booking_id,
        "amount"             => $amount,
        "key_id"             => RAZORPAY_KEY_ID
    ]);

} catch (Exception $e) {
    $conn->rollback();
    $msg = $e->getMessage();
    $code = $e->getCode();
    
    // Check for duplicate entry (MySQL Error Code 1062)
    if ($code == 1062 || strpos($msg, 'Duplicate entry') !== false) {
        if (isset($type) && $type === 'bus') {
            $msg = "This seat is already booked, please try another.";
        } else {
            $msg = "This booking already exists, please try again.";
        }
    }
    
    echo json_encode(["success" => false, "message" => $msg]);
}

$conn->close();
?>
