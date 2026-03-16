<?php
require_once __DIR__ . '/config.php';

$sql = "SELECT * FROM routes ORDER BY created_at DESC";
$result = $conn->query($sql);

$routes = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $routes[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode(['status' => 'success', 'data' => $routes]);
$conn->close();
?>
