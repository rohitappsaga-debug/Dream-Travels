<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['id'])) {
    echo json_encode(["status" => "error", "message" => "ID is required", "success" => false]);
    exit;
}

$id = (int)$data['id'];

$sql = "DELETE FROM gallery WHERE id = $id";

if ($conn->query($sql)) {
    echo json_encode(["status" => "success", "message" => "Gallery item deleted successfully", "success" => true]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to delete item: " . $conn->error, "success" => false]);
}

$conn->close();
?>
