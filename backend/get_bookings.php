<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'config.php';

// Fetch raw bookings table data only
$sql = "SELECT * FROM bookings_data ORDER BY id DESC";
$result = $conn->query($sql);

$bookings = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
}

echo json_encode([
    "status" => "success",
    "data" => $bookings
]);

$conn->close();
