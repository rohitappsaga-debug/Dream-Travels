<?php
require 'config.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($user_id <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid user ID"]);
    exit;
}

$all_bookings = [];

// 1. Fetch Package Bookings
$sql_pkg = "SELECT id, package_id as item_id, package_title as title, travel_date as date, status, 'package' as type, created_at,
            customer_name, customer_phone, passengers, payment_method, package_price, razorpay_payment_id, payment_status
            FROM bookings_data 
            WHERE user_id = $user_id ORDER BY created_at DESC";
$res_pkg = $conn->query($sql_pkg);
while ($row = $res_pkg->fetch_assoc()) {
    $all_bookings[] = $row;
}

// 2. Fetch Bus Bookings (grouped similar to get_bus_bookings.php)
$sql_bus = "
    SELECT 
        bb.id, 
        bb.bus_id as item_id,
        b.bus_name as title,
        bb.travel_date as date,
        bb.booking_status as status,
        'bus' as type,
        bb.created_at,
        bb.passenger_name, bb.phone, bb.email, bb.payment_method, bb.razorpay_payment_id, bb.payment_status,
        (
            SELECT GROUP_CONCAT(seat_number SEPARATOR ', ') 
            FROM bus_bookings 
            WHERE passenger_name = bb.passenger_name 
            AND phone = bb.phone 
            AND bus_id = bb.bus_id 
            AND travel_date = bb.travel_date
        ) as seat_numbers
    FROM bus_bookings bb
    JOIN buses b ON bb.bus_id = b.id
    WHERE bb.user_id = $user_id
    GROUP BY bb.passenger_name, bb.phone, bb.bus_id, bb.travel_date
    ORDER BY bb.created_at DESC
";
$res_bus = $conn->query($sql_bus);
while ($row = $res_bus->fetch_assoc()) {
    $all_bookings[] = $row;
}

// 3. Fetch Hotel Bookings
$sql_hotel = "
    SELECT 
        hb.id, 
        hb.hotel_id as item_id,
        h.hotel_name as title,
        hb.check_in as date,
        hb.check_out as end_date,
        hb.status,
        'hotel' as type,
        hb.created_at,
        hb.guest_name, hb.phone, hb.email, hb.num_guests, hb.num_rooms, hb.total_price, hb.payment_method, hb.razorpay_payment_id, hb.payment_status,
        hr.room_type
    FROM hotel_bookings hb
    JOIN hotels h ON hb.hotel_id = h.id
    JOIN hotel_rooms hr ON hb.room_id = hr.id
    WHERE hb.user_id = $user_id
    ORDER BY hb.created_at DESC
";
$res_hotel = $conn->query($sql_hotel);
while ($row = $res_hotel->fetch_assoc()) {
    $all_bookings[] = $row;
}

// Sort all by created_at DESC
usort($all_bookings, function($a, $b) {
    return strtotime($b['created_at']) - strtotime($a['created_at']);
});

echo json_encode(["success" => true, "data" => $all_bookings]);
$conn->close();
?>
