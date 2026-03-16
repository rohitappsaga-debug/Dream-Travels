<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {
    echo json_encode(["status" => "error", "message" => "Invalid input data", "success" => false]);
    exit;
}

$id = (int)$data['id'];

// Check if route is being used by any bus
$check_sql = "SELECT COUNT(*) as count FROM buses WHERE route_id = $id";
$check_res = $conn->query($check_sql);
$usage = $check_res->fetch_assoc();

if ($usage['count'] > 0) {
    echo json_encode(["status" => "error", "message" => "Cannot delete route. It is assigned to " . $usage['count'] . " buses.", "success" => false]);
    exit;
}

$sql = "DELETE FROM routes WHERE id = $id";

if ($conn->query($sql)) {
    echo json_encode(["status" => "success", "message" => "Route deleted successfully", "success" => true]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to delete route: " . $conn->error, "success" => false]);
}

$conn->close();
?>
