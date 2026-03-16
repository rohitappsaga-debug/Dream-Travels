<?php
require_once __DIR__ . '/config.php';

$sql = file_get_contents(__DIR__ . '/db/create_bus_module_tables.sql');

if ($conn->multi_query($sql)) {
    do {
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->next_result());
    echo "Bus module tables created successfully.\n";
} else {
    echo "Error creating tables: " . $conn->error . "\n";
}
$conn->close();
?>
