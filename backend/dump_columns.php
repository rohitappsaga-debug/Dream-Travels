<?php
require 'config.php';
$tables = ['bookings_data', 'bus_bookings', 'hotel_bookings'];
foreach($tables as $t) {
    echo "TABLE: $t\n";
    $res = $conn->query("DESCRIBE $t");
    while($row = $res->fetch_assoc()) {
        echo $row['Field'] . "\n";
    }
    echo "\n";
}
