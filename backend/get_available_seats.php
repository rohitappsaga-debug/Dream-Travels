<?php
require 'config.php';

header('Content-Type: application/json');

$bus_id = $_GET['bus_id'] ?? '';
$travel_date = $_GET['travel_date'] ?? '';

if (empty($bus_id) || empty($travel_date)) {
    echo json_encode(['success' => false, 'message' => 'Bus ID and travel date are required.']);
    exit;
}

// Get all 29 seats for the bus
$stmt = $conn->prepare("SELECT seat_number, seat_status FROM bus_seats WHERE bus_id = ? ORDER BY seat_number ASC");
$stmt->bind_param("i", $bus_id);
$stmt->execute();
$seats_result = $stmt->get_result();

$seats = [];
while ($row = $seats_result->fetch_assoc()) {
    $seats[$row['seat_number']] = [
        'seat_number' => (int)$row['seat_number'],
        'status' => 'Available' // Default
    ];
}

// Overlay actual bookings for the specific date
$stmt_bookings = $conn->prepare("SELECT seat_number FROM bus_bookings WHERE bus_id = ? AND travel_date = ? AND booking_status = 'Confirmed'");
$stmt_bookings->bind_param("is", $bus_id, $travel_date);
$stmt_bookings->execute();
$bookings_result = $stmt_bookings->get_result();

while ($booking = $bookings_result->fetch_assoc()) {
    if (isset($seats[$booking['seat_number']])) {
        $seats[$booking['seat_number']]['status'] = 'Booked';
    }
}

echo json_encode(['success' => true, 'data' => array_values($seats)]);
?>
