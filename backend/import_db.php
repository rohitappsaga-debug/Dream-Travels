<?php
$conn = @new mysqli("127.0.0.1", "root", "");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database if not exists
$conn->query("CREATE DATABASE IF NOT EXISTS dream_travellers");
$conn->select_db("dream_travellers");

$sql = file_get_contents(__DIR__ . '/db/schema.sql');
if ($conn->multi_query($sql)) {
    do {
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->more_results() && $conn->next_result());
    echo "Schema imported successfully.\n";
} else {
    echo "Error importing schema: " . $conn->error . "\n";
}
$conn->close();
?>
