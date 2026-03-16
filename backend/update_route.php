<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {
    echo json_encode(["status" => "error", "message" => "Invalid input data", "success" => false]);
    exit;
}

$id = (int)$data['id'];
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

$sql = "UPDATE routes SET source_city = '$source', destination_city = '$destination', route_name = '$route_name', status = '$status' WHERE id = $id";

if ($conn->query($sql)) {
    echo json_encode(["status" => "success", "message" => "Route updated successfully", "success" => true]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update route: " . $conn->error, "success" => false]);
}

$conn->close();
?>
