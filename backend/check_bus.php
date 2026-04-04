<?php
require 'config.php';
$r = $conn->query("SELECT payment_details FROM bus_bookings ORDER BY id DESC LIMIT 3");
while ($row = $r->fetch_assoc()) {
    echo "payment_details: " . $row['payment_details'] . "\n";
}
