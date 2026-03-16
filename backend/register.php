<?php
// ✅ CORS must be at the very top
// header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'config.php';

// read raw JSON
$raw = file_get_contents("php://input");
$input = json_decode($raw, true);

// check if input received
if (!$input) {
    echo json_encode(["status" => "error", "message" => "No input received"]);
    exit();
}

$name = $input["name"] ?? "";
$email = $input["email"] ?? "";
$password = $input["password"] ?? "";

// validation
if (empty($name) || empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "All fields required"]);
    exit();
}

// Check duplicate email
$check = $conn->prepare("SELECT id FROM users_data WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->bind_result($existing_id);
if ($check->fetch()) {
    $check->close();
    $conn->close();
    echo json_encode(["status" => "error", "message" => "Email already registered"]);
    exit();
}
$check->close();

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO users_data (name, email, password_hash) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $name, $email, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Registration successful"]);
} else {
    echo json_encode(["status" => "error", "message" => "Database insert failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
