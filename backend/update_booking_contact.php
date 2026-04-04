<?php
require 'config.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid input data"]);
    exit;
}

$id = intval($data['id']);
$type = $data['type'];
$phone = $conn->real_escape_string($data['phone'] ?? '');
$email = $conn->real_escape_string($data['email'] ?? '');

if ($id <= 0 || empty($type) || empty($phone)) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$success = false;
$stmt = null;

if ($type === 'package') {
    // Packages use customer_phone and don't have email.
    // Wait, the table might not have email. Let's just update phone.
    $stmt = $conn->prepare("UPDATE bookings_data SET customer_phone = ? WHERE id = ?");
    $stmt->bind_param("si", $phone, $id);
} else if ($type === 'hotel') {
    $stmt = $conn->prepare("UPDATE hotel_bookings SET phone = ?, email = ? WHERE id = ?");
    $stmt->bind_param("ssi", $phone, $email, $id);
} else if ($type === 'bus') {
    // Bus bookings are grouped by front-end, so we update all matching the group
    // First, get the old group details
    $get_stmt = $conn->prepare("SELECT user_id, bus_id, travel_date, phone FROM bus_bookings WHERE id = ?");
    $get_stmt->bind_param("i", $id);
    $get_stmt->execute();
    $res = $get_stmt->get_result();
    if ($row = $res->fetch_assoc()) {
        $stmt = $conn->prepare("UPDATE bus_bookings SET phone = ?, email = ? WHERE user_id = ? AND bus_id = ? AND travel_date = ? AND phone = ?");
        $stmt->bind_param("ssiiss", $phone, $email, $row['user_id'], $row['bus_id'], $row['travel_date'], $row['phone']);
    } else {
        echo json_encode(["success" => false, "message" => "Booking not found"]);
        exit;
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid booking type"]);
    exit;
}

if ($stmt && $stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Contact details updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update contact details"]);
}

$conn->close();
?>
