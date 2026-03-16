<?php
require 'config.php';
$res = $conn->query("SELECT id, title, image FROM packages_data");
$packages = [];
while ($row = $res->fetch_assoc()) {
    $packages[] = $row;
}
echo json_encode($packages, JSON_PRETTY_PRINT);
$conn->close();
