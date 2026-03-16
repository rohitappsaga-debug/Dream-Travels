<?php
/**
 * Create an admin user. Run from command line only:
 *   php create_admin.php "Admin Name" "admin@example.com" "your_password"
 */

if (php_sapi_name() !== 'cli') {
    die("This script can only be run from the command line.\n");
}

if ($argc < 4) {
    echo "Usage: php create_admin.php \"Name\" \"email@example.com\" \"password\"\n";
    exit(1);
}

$name     = trim($argv[1]);
$email    = trim($argv[2]);
$password = $argv[3];

if (empty($name) || empty($email) || empty($password)) {
    echo "Error: name, email and password are required.\n";
    exit(1);
}

require __DIR__ . '/config.php';

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users_data WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    $stmt = $conn->prepare("UPDATE users_data SET name = ?, password_hash = ?, role = 'Admin' WHERE email = ?");
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt->bind_param("sss", $name, $hash, $email);
    if ($stmt->execute()) {
        echo "Updated existing user to Admin: $email\n";
    } else {
        echo "Error updating user: " . $stmt->error . "\n";
        exit(1);
    }
    $stmt->close();
    $conn->close();
    exit(0);
}
$stmt->close();

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users_data (name, email, password_hash, role) VALUES (?, ?, ?, 'Admin')");
$stmt->bind_param("sss", $name, $email, $hash);

if ($stmt->execute()) {
    echo "Admin user created: $email\n";
} else {
    echo "Error: " . $stmt->error . "\n";
    exit(1);
}

$stmt->close();
$conn->close();
