<?php
require_once __DIR__ . '/config.php';

if (!isset($_GET['bus_id'])) {
    echo json_encode(["status" => "error", "message" => "Bus ID is required", "success" => false]);
    exit;
}

$bus_id = (int)$_GET['bus_id'];

$sql = "SELECT * FROM bus_seats WHERE bus_id = $bus_id ORDER BY seat_number ASC";
$result = $conn->query($sql);

$seats = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $seats[] = $row;
    }
}

echo json_encode(['status' => 'success', 'data' => $seats]);
$conn->close();
?>
