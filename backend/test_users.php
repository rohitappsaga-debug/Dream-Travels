<?php
require 'config.php';
$res = $conn->query("SELECT id, email, password_hash, role FROM users_data");
while ($row = $res->fetch_assoc()) {
    print_r($row);
}
$conn->close();
?>
