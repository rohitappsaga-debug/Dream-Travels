<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['title']) || empty($data['image'])) {
    echo json_encode(["status" => "error", "message" => "Title and image are required", "success" => false]);
    exit;
}

$title = $conn->real_escape_string($data['title']);
$image = $conn->real_escape_string($data['image']);

$sql = "INSERT INTO gallery (title, image) VALUES ('$title', '$image')";

if ($conn->query($sql)) {
    echo json_encode(["status" => "success", "message" => "Gallery item added successfully", "success" => true, "id" => $conn->insert_id]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to add item: " . $conn->error, "success" => false]);
}

$conn->close();
?>
