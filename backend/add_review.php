<?php
require_once __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['name']) || empty($data['comment']) || !isset($data['rating'])) {
    echo json_encode(["status" => "error", "message" => "Name, rating, and comment are required", "success" => false]);
    exit;
}

$name = $conn->real_escape_string($data['name']);
$rating = (int) $data['rating'];
$comment = $conn->real_escape_string($data['comment']);

$sql = "INSERT INTO reviews (name, rating, comment) VALUES ('$name', $rating, '$comment')";

if ($conn->query($sql)) {
    echo json_encode(["status" => "success", "message" => "Review submitted successfully! Thank you for your feedback.", "success" => true, "id" => $conn->insert_id]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to submit review: " . $conn->error, "success" => false]);
}

$conn->close();
?>
