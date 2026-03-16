<?php
// header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'config.php'; // ✅ DB connection

// Read JSON body
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$id = $data['id'] ?? '';

if (empty($id)) {
    echo json_encode(["success" => false, "message" => "Package ID is required"]);
    exit();
}

$sql = "DELETE FROM packages_data WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "SQL error: " . $conn->error]);
    exit();
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "✅ Package deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "❌ Delete failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
