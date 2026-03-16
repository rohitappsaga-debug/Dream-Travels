<?php
require 'config.php';
$r = $conn->query("DESCRIBE bookings_data");
while($w = $r->fetch_assoc()) {
    if($w['Field'] == 'travel_date') {
        echo "COL: " . $w['Field'] . " | TYPE: " . $w['Type'] . " | NULL: " . $w['Null'] . "\n";
    }
}
$r = $conn->query("SELECT id, travel_date FROM bookings_data ORDER BY id DESC LIMIT 1");
$w = $r->fetch_assoc();
echo "LAST_ID: " . $w['id'] . " | DATE: " . $w['travel_date'] . "\n";
$conn->close();
