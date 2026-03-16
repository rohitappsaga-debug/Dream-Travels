<?php
require 'config.php';
header('Content-Type: application/json');

$sql = "
    SELECT 
        hb.*, 
        h.hotel_name, 
        hr.room_type 
    FROM hotel_bookings hb
    JOIN hotels h ON hb.hotel_id = h.id
    JOIN hotel_rooms hr ON hb.room_id = hr.id
    ORDER BY hb.created_at DESC
";

$result = $conn->query($sql);
$bookings = [];
while ($row = $result->fetch_assoc()) {
    $bookings[] = $row;
}

echo json_encode(['status' => 'success', 'data' => $bookings]);
?>
