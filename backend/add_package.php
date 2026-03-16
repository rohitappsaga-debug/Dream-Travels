<?php
// ✅ Allow CORS (so React frontend can call API)
// header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'config.php'; // your DB connection

// Read JSON body
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$price = $data['price'] ?? '';
$image = $data['image'] ?? '';

// New optional fields for richer package details
$duration_days  = isset($data['duration_days']) ? (int) $data['duration_days'] : 1;
$nights         = isset($data['nights']) ? (int) $data['nights'] : max(0, $duration_days - 1);
$start_location = trim($data['start_location'] ?? '');
$end_location   = trim($data['end_location'] ?? '');
$main_transport = $data['main_transport'] ?? 'mixed';
$highlights     = $data['highlights'] ?? '';
$inclusions     = $data['inclusions'] ?? '';
$exclusions     = $data['exclusions'] ?? '';

// Simple validation
if (empty($title)) {
    echo json_encode(["success" => false, "message" => "Title is required"]);
    exit();
}

if ($price < 5000) {
    echo json_encode(["success" => false, "message" => "Price must be greater than or equal to 5000"]);
    exit();
}

if ($duration_days < 1) {
    $duration_days = 1;
}
if ($nights < 0) {
    $nights = 0;
}

// Insert into DB
$sql = "INSERT INTO packages_data (title, description, price, duration_days, nights, start_location, end_location, main_transport, highlights, inclusions, exclusions, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "SQL error: " . $conn->error]);
    exit();
}

$stmt->bind_param(
    "ssddssssssss",
    $title,
    $description,
    $price,
    $duration_days,
    $nights,
    $start_location,
    $end_location,
    $main_transport,
    $highlights,
    $inclusions,
    $exclusions,
    $image
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "✅ Package added successfully",
        "id" => $stmt->insert_id
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Insert failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
