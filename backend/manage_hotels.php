<?php
require 'config.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM hotels ORDER BY id DESC";
        $result = $conn->query($sql);
        $hotels = [];
        while ($row = $result->fetch_assoc()) {
            $hotels[] = $row;
        }
        echo json_encode(['status' => 'success', 'data' => $hotels]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $conn->real_escape_string($data['hotel_name']);
        $city = $conn->real_escape_string($data['city']);
        $loc = $conn->real_escape_string($data['location']);
        $rating = floatval($data['rating'] ?? 4.0);
        $price = floatval($data['price_per_night'] ?? 0);
        $total_rooms = intval($data['total_rooms'] ?? 0);
        $img = $conn->real_escape_string($data['image'] ?? '');
        $desc = $conn->real_escape_string($data['description'] ?? '');
        $amn = $conn->real_escape_string($data['amenities'] ?? '');

        if (isset($data['id'])) {
            // Update
            $id = intval($data['id']);
            $sql = "UPDATE hotels SET hotel_name='$name', city='$city', location='$loc', rating=$rating, price_per_night=$price, total_rooms=$total_rooms, image='$img', description='$desc', amenities='$amn' WHERE id=$id";
        } else {
            // Create
            $sql = "INSERT INTO hotels (hotel_name, city, location, rating, price_per_night, total_rooms, available_rooms, image, description, amenities) 
                    VALUES ('$name', '$city', '$loc', $rating, $price, $total_rooms, $total_rooms, '$img', '$desc', '$amn')";
        }

        if ($conn->query($sql)) {
            echo json_encode(['status' => 'success', 'message' => 'Hotel saved successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => $conn->error]);
        }
        break;

    case 'DELETE':
        $id = intval($_GET['id']);
        if ($conn->query("DELETE FROM hotels WHERE id=$id")) {
            echo json_encode(['status' => 'success', 'message' => 'Hotel deleted']);
        } else {
            echo json_encode(['status' => 'error', 'message' => $conn->error]);
        }
        break;
}
?>
