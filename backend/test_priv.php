<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$host = "localhost";
$user = "hit";
$pass = "hit@1813d";
$dbname = "dream_travellers";

$conn = new mysqli($host, $user, $pass, $dbname);
echo "Connected OK\n\n";

// Try an INSERT (change table/fields as appropriate)
$sql = "INSERT INTO services_data (title, description, price, image) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
try {
    $stmt->bind_param("ssds", $title, $desc, $price, $image);
    $title = "TEST SERVICE " . time();
    $desc  = "Test desc";
    $price = 10.0;
    $image = "test.jpg";
    $stmt->execute();
    echo "Insert OK, new id: " . $conn->insert_id;
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
$stmt->close();
$conn->close();
