<?php
require 'config.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $hotel_id = intval($_GET['hotel_id']);
        $sql = "SELECT * FROM hotel_rooms WHERE hotel_id = $hotel_id";
        $result = $conn->query($sql);
        $rooms = [];
        while ($row = $result->fetch_assoc()) {
            $rooms[] = $row;
        }
        echo json_encode(['status' => 'success', 'data' => $rooms]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $hotel_id = intval($data['hotel_id']);
        $type = $conn->real_escape_string($data['room_type']);
        $price = floatval($data['price_per_night']);
        $total = intval($data['total_rooms']);
        $desc = $conn->real_escape_string($data['description'] ?? '');
        $img = $conn->real_escape_string($data['image'] ?? '');

        if (isset($data['id'])) {
            $id = intval($data['id']);
            $sql = "UPDATE hotel_rooms SET room_type='$type', price_per_night=$price, total_rooms=$total, description='$desc', image='$img' WHERE id=$id";
        } else {
            $sql = "INSERT INTO hotel_rooms (hotel_id, room_type, price_per_night, total_rooms, available_rooms, description, image) 
                    VALUES ($hotel_id, '$type', $price, $total, $total, '$desc', '$img')";
        }

        if ($conn->query($sql)) {
            echo json_encode(['status' => 'success', 'message' => 'Room saved successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => $conn->error]);
        }
        break;

    case 'DELETE':
        $id = intval($_GET['id']);
        if ($conn->query("DELETE FROM hotel_rooms WHERE id=$id")) {
            echo json_encode(['status' => 'success', 'message' => 'Room deleted']);
        } else {
            echo json_encode(['status' => 'error', 'message' => $conn->error]);
        }
        break;
}
?>
