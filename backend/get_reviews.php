<?php
require_once __DIR__ . '/config.php';

$sql = "SELECT * FROM reviews ORDER BY created_at DESC";
$result = $conn->query($sql);

$reviews = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode(['status' => 'success', 'data' => $reviews]);
$conn->close();
?>
