<?php
require 'config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id']) || !isset($data['status'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request data.']);
    exit;
}

$id = (int)$data['id'];
$status = $data['status'];

$allowed_statuses = ['Confirmed', 'Cancelled'];
if (!in_array($status, $allowed_statuses)) {
    echo json_encode(['success' => false, 'message' => 'Invalid status.']);
    exit;
}

$stmt = $conn->prepare("UPDATE bus_bookings SET booking_status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Booking status updated successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error updating status: ' . $conn->error]);
}
?>
