<?php
require 'config.php';

header('Content-Type: application/json');

$hotel_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($hotel_id <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'Valid Hotel ID is required']);
    exit;
}

// 1. Get Hotel Info
$sql_hotel = "SELECT * FROM hotels WHERE id = $hotel_id";
$res_hotel = $conn->query($sql_hotel);

if ($res_hotel->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Hotel not found']);
    exit;
}

$hotel = $res_hotel->fetch_assoc();

// 2. Get Room Types
$sql_rooms = "SELECT * FROM hotel_rooms WHERE hotel_id = $hotel_id";
$res_rooms = $conn->query($sql_rooms);

$rooms = [];
while ($row = $res_rooms->fetch_assoc()) {
    $rooms[] = $row;
}

$hotel['rooms'] = $rooms;

echo json_encode(['status' => 'success', 'data' => $hotel]);
?>
