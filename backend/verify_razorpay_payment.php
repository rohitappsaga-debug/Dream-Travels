<?php
/**
 * Verify Razorpay Payment Signature and Confirm Booking.
 */

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/razorpay_config.php';

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "No data received"]);
    exit;
}

$razorpay_order_id   = $data['razorpay_order_id'] ?? '';
$razorpay_payment_id = $data['razorpay_payment_id'] ?? '';
$razorpay_signature  = $data['razorpay_signature'] ?? '';
$booking_id          = intval($data['booking_id'] ?? 0);
$type                = $data['type'] ?? ''; // 'package', 'bus', 'hotel'

if (empty($razorpay_order_id) || empty($razorpay_payment_id) || empty($razorpay_signature)) {
    echo json_encode(["success" => false, "message" => "Missing Razorpay details"]);
    exit;
}

// 1. Verify Signature
$generated_signature = hash_hmac('sha256', $razorpay_order_id . "|" . $razorpay_payment_id, RAZORPAY_KEY_SECRET);

if ($generated_signature !== $razorpay_signature) {
    // Signature mismatch
    echo json_encode(["success" => false, "message" => "Payment verification failed: Signature mismatch"]);
    exit;
}

// 2. Signature Verified -> Confirm Booking
$conn->begin_transaction();

try {
    if ($type === 'package') {
        $stmt = $conn->prepare("UPDATE bookings_data SET status = 'confirmed', payment_status = 'success', razorpay_payment_id = ?, razorpay_signature = ? WHERE razorpay_order_id = ?");
        $stmt->bind_param("sss", $razorpay_payment_id, $razorpay_signature, $razorpay_order_id);
    } 
    else if ($type === 'bus') {
        $stmt = $conn->prepare("UPDATE bus_bookings SET booking_status = 'Confirmed', payment_status = 'success', razorpay_payment_id = ?, razorpay_signature = ? WHERE razorpay_order_id = ?");
        $stmt->bind_param("sss", $razorpay_payment_id, $razorpay_signature, $razorpay_order_id);
    }
    else if ($type === 'hotel') {
        $stmt = $conn->prepare("UPDATE hotel_bookings SET status = 'Confirmed', payment_status = 'success', razorpay_payment_id = ?, razorpay_signature = ? WHERE razorpay_order_id = ?");
        $stmt->bind_param("sss", $razorpay_payment_id, $razorpay_signature, $razorpay_order_id);
    }

    if (!$stmt->execute()) {
        throw new Exception("Database update failed: " . $stmt->error);
    }

    $conn->commit();

    // Send confirmation SMS after successful payment
    require_once __DIR__ . '/sms_helper.php';

    if ($type === 'bus') {
        $row = $conn->query("
            SELECT bb.passenger_name, bb.phone, bb.travel_date, bb.seat_number, bb.payment_method,
                   b.bus_name, r.source_city, r.destination_city
            FROM bus_bookings bb
            JOIN buses b ON bb.bus_id = b.id
            JOIN routes r ON bb.route_id = r.id
            WHERE bb.razorpay_order_id = '{$razorpay_order_id}'
            LIMIT 1
        ")->fetch_assoc();

        if ($row) {
            $route = $row['source_city'] . ' to ' . $row['destination_city'];
            $msg  = "Dear {$row['passenger_name']},\n";
            $msg .= "Your bus booking is CONFIRMED!\n\n";
            $msg .= "--- Booking Details ---\n";
            $msg .= "Booking ID : #{$booking_id}\n";
            $msg .= "Bus        : {$row['bus_name']}\n";
            $msg .= "Route      : {$route}\n";
            $msg .= "Date       : {$row['travel_date']}\n";
            $msg .= "Seat(s)    : {$row['seat_number']}\n";
            $msg .= "Payment    : Online\n";
            $msg .= "\nThank you for choosing Dream Travellers";
            send_booking_sms($row['phone'], $msg);
        }

    } elseif ($type === 'package') {
        $row = $conn->query("
            SELECT customer_name, customer_phone, package_title, travel_date,
                   passengers, package_price, payment_method
            FROM bookings_data
            WHERE razorpay_order_id = '{$razorpay_order_id}'
            LIMIT 1
        ")->fetch_assoc();

        if ($row) {
            $total = number_format((float)$row['package_price'] * $row['passengers'], 2);
            $price = number_format((float)$row['package_price'], 2);
            $msg  = "Dear {$row['customer_name']},\n";
            $msg .= "Your package booking is CONFIRMED!\n\n";
            $msg .= "--- Booking Details ---\n";
            $msg .= "Booking ID   : #{$booking_id}\n";
            $msg .= "Package      : {$row['package_title']}\n";
            $msg .= "Travel Date  : {$row['travel_date']}\n";
            $msg .= "Passengers   : {$row['passengers']}\n";
            $msg .= "Price/Person : Rs.{$price}\n";
            $msg .= "Total Amount : Rs.{$total}\n";
            $msg .= "Payment      : Online\n";
            $msg .= "\nThank you for choosing Dream Travellers";
            send_booking_sms($row['customer_phone'], $msg);
        }

    } elseif ($type === 'hotel') {
        $row = $conn->query("
            SELECT hb.guest_name, hb.phone, hb.check_in, hb.check_out,
                   hb.num_guests, hb.num_rooms, hb.total_price, hb.payment_method,
                   h.hotel_name, hr.room_type, hr.price_per_night
            FROM hotel_bookings hb
            JOIN hotels h ON hb.hotel_id = h.id
            JOIN hotel_rooms hr ON hb.room_id = hr.id
            WHERE hb.razorpay_order_id = '{$razorpay_order_id}'
            LIMIT 1
        ")->fetch_assoc();

        if ($row) {
            $ci = new DateTime($row['check_in']);
            $co = new DateTime($row['check_out']);
            $nights = $ci->diff($co)->days;
            $msg  = "Dear {$row['guest_name']},\n";
            $msg .= "Your hotel booking is CONFIRMED!\n\n";
            $msg .= "--- Booking Details ---\n";
            $msg .= "Booking ID   : #{$booking_id}\n";
            $msg .= "Hotel        : {$row['hotel_name']}\n";
            $msg .= "Room Type    : {$row['room_type']}\n";
            $msg .= "Check-in     : {$row['check_in']}\n";
            $msg .= "Check-out    : {$row['check_out']}\n";
            $msg .= "Nights       : {$nights}\n";
            $msg .= "Rooms        : {$row['num_rooms']}\n";
            $msg .= "Guests       : {$row['num_guests']}\n";
            $msg .= "Price/Night  : Rs.{$row['price_per_night']}\n";
            $msg .= "Total        : Rs.{$row['total_price']}\n";
            $msg .= "Payment      : Online\n";
            $msg .= "\nThank you for choosing Dream Travellers";
            send_booking_sms($row['phone'], $msg);
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Payment verified and booking confirmed!",
        "booking_id" => $booking_id
    ]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
?>
