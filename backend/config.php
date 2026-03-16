<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// ... baaki ka connection code yahan ...
$host = "127.0.0.1:3306";
$user = "root";   // default XAMPP user
$pass = "";       // no password
// your database name 
$dbname = "dream_travellers";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    if (php_sapi_name() !== 'cli') {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Database connection failed', 'success' => false]);
        exit;
    }
    die("Connection failed: " . $conn->connect_error);
}

