<?php
require 'config.php';

function testLogin($email, $password) {
    global $conn;
    $sql = "SELECT id, email, password_hash, role FROM users_data WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->bind_result($id, $email_col, $password_hash, $role);
    
    if (!$stmt->fetch()) {
        echo "User not found: $email\n";
        return;
    }
    
    if (password_verify($password, $password_hash)) {
        echo "Login SUCCESS for $email\n";
    } else {
        echo "Login FAILED for $email\n";
        echo "  Provided Password: $password\n";
        echo "  DB Hash: $password_hash\n";
    }
    $stmt->close();
}

testLogin("admin@example.com", "admin123");
testLogin("user1@test.com", "password123");

$conn->close();
?>
