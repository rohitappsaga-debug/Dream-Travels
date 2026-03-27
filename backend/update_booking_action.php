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
    echo json_encode(["success" => false, "message" => "No data received"]);
    exit;
}

$id = intval($data['id'] ?? 0);
$type = $data['type'] ?? '';
$action = $data['action'] ?? '';
$new_date = $data['new_date'] ?? '';

if ($id <= 0 || empty($type) || empty($action)) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$table = "";
$status_col = "status";
$date_col = "travel_date";

switch ($type) {
    case 'package':
        $table = "bookings_data";
        break;
    case 'bus':
        $table = "bus_bookings";
        $status_col = "booking_status";
        break;
    case 'hotel':
        $table = "hotel_bookings";
        $date_col = "check_in";
        break;
    default:
        echo json_encode(["success" => false, "message" => "Invalid booking type"]);
        exit;
}

if ($action === 'cancel') {
    $sql = "UPDATE $table SET $status_col = 'Cancelled' WHERE id = $id";
} elseif ($action === 'postpone') {
    if (empty($new_date)) {
        echo json_encode(["success" => false, "message" => "New date is required for postponement"]);
        exit;
    }
    $sql = "UPDATE $table SET $date_col = '$new_date' WHERE id = $id";
} else {
    echo json_encode(["success" => false, "message" => "Invalid action"]);
    exit;
}

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Booking " . ($action === 'cancel' ? "cancelled" : "postponed") . " successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating booking: " . $conn->error]);
}

$conn->close();
?>
