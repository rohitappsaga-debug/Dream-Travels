<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {
    echo json_encode(["status" => "error", "message" => "Invalid input data", "success" => false]);
    exit;
}

$id = (int)$data['id'];

// Cascading delete is handled by database FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
$sql = "DELETE FROM buses WHERE id = $id";

if ($conn->query($sql)) {
    echo json_encode(["status" => "success", "message" => "Bus deleted successfully", "success" => true]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to delete bus: " . $conn->error, "success" => false]);
}

$conn->close();
?>
