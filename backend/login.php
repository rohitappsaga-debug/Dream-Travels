<?php
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

// Read raw JSON
$raw = file_get_contents("php://input");
$input = json_decode($raw, true);

// Check if input received
if (!$input) {
    echo json_encode(["status" => "error", "message" => "No input received"]);
    exit();
}

$email = $input["email"] ?? "";
$password = $input["password"] ?? "";

// Validation
if (empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Email and password required"]);
    exit();
}

// Check if user exists and get role (bind_result for compatibility without mysqlnd)
$sql = "SELECT id, name, email, password_hash, role FROM users_data WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->bind_result($id, $name, $email_col, $password_hash, $role);

if (!$stmt->fetch()) {
    $stmt->close();
    $conn->close();
    echo json_encode(["status" => "error", "message" => "User not found"]);
    exit();
}

$stmt->close();

if ($password_hash === '' || $password_hash === null) {
    $conn->close();
    echo json_encode(["status" => "error", "message" => "Server configuration error: password not set"]);
    exit();
}

if (password_verify($password, $password_hash)) {
    $user = ['id' => $id, 'name' => $name, 'email' => $email_col, 'role' => $role];
    $conn->close();
    echo json_encode([
        "status" => "success",
        "message" => "Login successful",
        "user" => $user
    ]);
} else {
    $conn->close();
    echo json_encode(["status" => "error", "message" => "Invalid password"]);
}
