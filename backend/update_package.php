<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// ✅ Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['title']) || !isset($data['description']) || !isset($data['price']) || !isset($data['image'])) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit;
}

$id = (int) $data['id'];
$title = trim((string) ($data['title'] ?? ''));
$description = trim((string) ($data['description'] ?? ''));
$price = (float) $data['price'];
$image = trim((string) ($data['image'] ?? ''));

// New optional fields for richer package details
$duration_days  = isset($data['duration_days']) ? (int) $data['duration_days'] : 1;
$nights         = isset($data['nights']) ? (int) $data['nights'] : max(0, $duration_days - 1);
$start_location = trim($data['start_location'] ?? '');
$end_location   = trim($data['end_location'] ?? '');
$main_transport = $data['main_transport'] ?? 'mixed';
$highlights     = $data['highlights'] ?? '';
$inclusions     = $data['inclusions'] ?? '';
$exclusions     = $data['exclusions'] ?? '';

if ($duration_days < 1) {
    $duration_days = 1;
}
if ($nights < 0) {
    $nights = 0;
}

$sql = "UPDATE packages_data 
        SET title = ?, description = ?, price = ?, duration_days = ?, nights = ?, start_location = ?, end_location = ?, main_transport = ?, highlights = ?, inclusions = ?, exclusions = ?, image = ? 
        WHERE id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "❌ Error: " . $conn->error]);
    $conn->close();
    exit;
}
$stmt->bind_param(
    "ssddssssssssi",
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
    $image,
    $id
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "✅ Package updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "❌ Error: " . $stmt->error]);
}
$stmt->close();
$conn->close();
