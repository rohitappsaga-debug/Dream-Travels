<?php
require 'config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['status' => 'error', 'message' => 'No data received']);
    exit;
}

$hotel_id = intval($data['hotel_id'] ?? 0);
$user_id = intval($data['user_id'] ?? 0);
$room_id = intval($data['room_id'] ?? 0);
$guest_name = $conn->real_escape_string($data['guest_name'] ?? '');
$phone = $conn->real_escape_string($data['phone'] ?? '');
$email = $conn->real_escape_string($data['email'] ?? '');
$check_in = $conn->real_escape_string($data['check_in'] ?? '');
$check_out = $conn->real_escape_string($data['check_out'] ?? '');
$num_guests = intval($data['num_guests'] ?? 1);
$num_rooms = intval($data['num_rooms'] ?? 1);
$payment_method = $conn->real_escape_string($data['payment_method'] ?? '');
$payment_details = $conn->real_escape_string($data['payment_details'] ?? '');

if ($hotel_id <= 0 || $room_id <= 0 || empty($guest_name) || empty($phone) || empty($check_in) || empty($check_out)) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
    exit;
}

if (strlen($phone) !== 10 || !ctype_digit($phone)) {
    echo json_encode(['status' => 'error', 'message' => 'Mobile number must be exactly 10 digits.']);
    exit;
}

// 1. Calculate nights
$date1 = new DateTime($check_in);
$date2 = new DateTime($check_out);
$interval = $date1->diff($date2);
$nights = $interval->days;

if ($nights <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'Check-out date must be after check-in date']);
    exit;
}

// 2. Check room availability
// For simplicity, we check total rooms vs current active bookings in that range
// Effective availability = Total Rooms - Bookings that overlap with [check_in, check_out]
$sql_check = "
    SELECT SUM(num_rooms) as booked_rooms 
    FROM hotel_bookings 
    WHERE room_id = $room_id 
    AND status = 'Confirmed'
    AND NOT (check_out <= '$check_in' OR check_in >= '$check_out')
";
$res_check = $conn->query($sql_check);
$row_check = $res_check->fetch_assoc();
$booked_rooms = intval($row_check['booked_rooms'] ?? 0);

$sql_room_info = "SELECT total_rooms, price_per_night FROM hotel_rooms WHERE id = $room_id";
$res_room = $conn->query($sql_room_info);
$room = $res_room->fetch_assoc();

if (!$room) {
    echo json_encode(['status' => 'error', 'message' => 'Room type not found']);
    exit;
}

$total_available = intval($room['total_rooms']) - $booked_rooms;

if ($num_rooms > $total_available) {
    echo json_encode(['status' => 'error', 'message' => "Only $total_available rooms available for selected dates."]);
    exit;
}

// 3. Calculate price
$total_price = $room['price_per_night'] * $nights * $num_rooms;

// 4. Create booking
$ins_sql = "INSERT INTO hotel_bookings (hotel_id, user_id, room_id, guest_name, phone, email, check_in, check_out, num_guests, num_rooms, total_price, payment_method, payment_details) 
            VALUES ($hotel_id, $user_id, $room_id, '$guest_name', '$phone', '$email', '$check_in', '$check_out', $num_guests, $num_rooms, $total_price, '$payment_method', '$payment_details')";

if ($conn->query($ins_sql)) {
    $booking_id = $conn->insert_id;
    require_once __DIR__ . '/sms_helper.php';

    // Fetch hotel name and room type for SMS
    $hotel_name = 'Hotel';
    $room_type  = 'Room';
    $hinfo = $conn->query("SELECT h.hotel_name, hr.room_type FROM hotels h JOIN hotel_rooms hr ON hr.id = $room_id WHERE h.id = $hotel_id");
    if ($hrow = $hinfo->fetch_assoc()) {
        $hotel_name = $hrow['hotel_name'];
        $room_type  = $hrow['room_type'];
    }

    $price_per_night = $room['price_per_night'];

    $msg  = "Dear {$guest_name},\n";
    $msg .= "Your hotel booking is CONFIRMED! \u2714\n\n";
    $msg .= "--- Booking Details ---\n";
    $msg .= "Booking ID   : #{$booking_id}\n";
    $msg .= "Hotel        : {$hotel_name}\n";
    $msg .= "Room Type    : {$room_type}\n";
    $msg .= "Check-in     : {$check_in}\n";
    $msg .= "Check-out    : {$check_out}\n";
    $msg .= "Nights       : {$nights}\n";
    $msg .= "Rooms        : {$num_rooms}\n";
    $msg .= "Guests       : {$num_guests}\n";
    $msg .= "Price/Night  : Rs.{$price_per_night}\n";
    $msg .= "Total        : Rs.{$total_price}\n";
    $msg .= "Payment      : {$payment_method}\n";
    $msg .= "\nThank you for choosing Dream Travellers!";

    send_booking_sms($phone, $msg);

    echo json_encode([
        'status' => 'success', 
        'message' => 'Booking successful!',
        'data' => [
            'booking_id' => $booking_id,
            'total_price' => $total_price,
            'nights' => $nights
        ]
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to create booking: ' . $conn->error]);
}

$conn->close();
?>
