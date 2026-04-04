<?php
require 'config.php';
$tables = ['buses', 'routes', 'hotels', 'hotel_rooms'];
foreach ($tables as $t) {
    echo "TABLE: $t\n";
    $r = $conn->query("DESCRIBE $t");
    while ($row = $r->fetch_assoc()) echo "  " . $row['Field'] . "\n";
    echo "\n";
}
