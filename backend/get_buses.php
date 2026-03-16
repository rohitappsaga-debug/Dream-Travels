<?php
require_once __DIR__ . '/config.php';

$sql = "SELECT b.*, r.route_name FROM buses b 
        JOIN routes r ON b.route_id = r.id 
        ORDER BY b.created_at DESC";
$result = $conn->query($sql);

$buses = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $buses[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode(['status' => 'success', 'data' => $buses]);
$conn->close();
?>
