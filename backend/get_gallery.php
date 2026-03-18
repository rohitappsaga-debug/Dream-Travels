<?php
require_once __DIR__ . '/config.php';

$sql = "SELECT * FROM gallery ORDER BY created_at DESC";
$result = $conn->query($sql);

$gallery = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $gallery[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode(['status' => 'success', 'data' => $gallery]);
$conn->close();
?>
