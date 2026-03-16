<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid input data", "success" => false]);
    exit;
}

$source = $conn->real_escape_string($data['source_city']);
$destination = $conn->real_escape_string($data['destination_city']);
$route_name = isset($data['route_name']) && !empty($data['route_name']) 
    ? $conn->real_escape_string($data['route_name']) 
    : "$source -> $destination";
$status = isset($data['status']) ? $conn->real_escape_string($data['status']) : 'Active';

if (empty($source) || empty($destination)) {
    echo json_encode(["status" => "error", "message" => "Source and Destination cities are required", "success" => false]);
    exit;
}

$sql = "INSERT INTO routes (source_city, destination_city, route_name, status) VALUES ('$source', '$destination', '$route_name', '$status')";

if ($conn->query($sql)) {
    echo json_encode(["status" => "success", "message" => "Route added successfully", "success" => true, "id" => $conn->insert_id]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to add route: " . $conn->error, "success" => false]);
}

$conn->close();
?>
