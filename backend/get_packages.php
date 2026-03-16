<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require __DIR__ . '/config.php';

$sql = "SELECT * FROM packages_data";
$result = $conn->query($sql);

$packages = [];
while ($row = $result->fetch_assoc()) {
    $packages[] = $row;
}

echo json_encode(["status" => "success", "data" => $packages]);

$conn->close();
