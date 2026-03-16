<?php
require 'config.php';

header('Content-Type: application/json');

// Simplified grouping logic to ensure seat_numbers are correctly returned
$sql = "
    SELECT 
        bb.id, 
        (
            SELECT GROUP_CONCAT(seat_number SEPARATOR ', ') 
            FROM bus_bookings 
            WHERE passenger_name = bb.passenger_name 
            AND phone = bb.phone 
            AND bus_id = bb.bus_id 
            AND travel_date = bb.travel_date
        ) as seat_numbers,
        bb.passenger_name, 
        bb.phone, 
        bb.email, 
        bb.travel_date, 
        bb.booking_status,
        bb.created_at,
        b.bus_name, 
        b.bus_code, 
        r.source_city, 
        r.destination_city
    FROM bus_bookings bb
    JOIN buses b ON bb.bus_id = b.id
    JOIN routes r ON bb.route_id = r.id
    GROUP BY bb.passenger_name, bb.phone, bb.bus_id, bb.travel_date
    ORDER BY bb.created_at DESC
";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Error fetching bookings: ' . $conn->error]);
    exit;
}

$bookings = [];
while ($row = $result->fetch_assoc()) {
    $bookings[] = $row;
}

echo json_encode(['success' => true, 'data' => $bookings]);
?>
