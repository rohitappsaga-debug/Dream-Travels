<?php
require 'config.php';
$result = $conn->query("DESCRIBE bookings_data");
$schema = [];
while ($row = $result->fetch_assoc()) {
    $schema[] = $row;
}
echo json_encode($schema, JSON_PRETTY_PRINT);
$conn->close();
