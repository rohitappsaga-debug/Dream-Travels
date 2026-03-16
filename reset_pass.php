<?php
require 'config.php';

$hash_admin = password_hash('admin123', PASSWORD_DEFAULT);
$stmt = $conn->prepare("UPDATE users_data SET password_hash = ? WHERE email = 'admin@example.com'");
$stmt->bind_param("s", $hash_admin);
$stmt->execute();
$stmt->close();

$hash_user = password_hash('password123', PASSWORD_DEFAULT);
$stmt = $conn->prepare("UPDATE users_data SET password_hash = ? WHERE email LIKE '%@test.com'");
$stmt->bind_param("s", $hash_user);
$stmt->execute();
$stmt->close();

echo "Passwords reset successfully.\n";
$conn->close();
?>
