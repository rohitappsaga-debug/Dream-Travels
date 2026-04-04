<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require __DIR__ . '/config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['status'])) {
    echo json_encode(["success" => false, "message" => "Missing id or status"]);
    exit;
}

$id = (int) $data['id'];
$status = trim((string) ($data['status'] ?? ''));

// Using standard statuses (case-insensitive in DB comparison often, but we'll follow confirmed/cancelled/completed/pending)
$allowed = ['Confirmed', 'Cancelled', 'Completed', 'Pending'];
if (!in_array($status, $allowed, true)) {
    echo json_encode(["success" => false, "message" => "Invalid status. Allowed: " . implode(', ', $allowed)]);
    exit;
}

$sql = "UPDATE hotel_bookings SET status = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
    $conn->close();
    exit;
}
$stmt->bind_param("si", $status, $id);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    require_once __DIR__ . '/sms_helper.php';
    $res = $conn->query("SELECT phone FROM hotel_bookings WHERE id = $id");
    if ($row = $res->fetch_assoc()) {
        $msg = "Dream Travellers: Your hotel booking has been updated to status: {$status}.";
        send_booking_sms($row['phone'], $msg);
    }
    echo json_encode(["success" => true, "message" => "Hotel booking status updated to " . $status]);
} else {
    echo json_encode(["success" => false, "message" => "Booking not found or no change"]);
}
$stmt->close();
$conn->close();
?>
