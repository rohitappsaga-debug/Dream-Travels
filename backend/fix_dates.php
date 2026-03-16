<?php
require 'config.php';
$sql = "UPDATE bookings_data SET travel_date = '2025-03-14' WHERE travel_date = '0000-00-00'";
if ($conn->query($sql)) {
    echo "Fixed " . $conn->affected_rows . " rows.\n";
} else {
    echo "Error: " . $conn->error . "\n";
}
$conn->close();
