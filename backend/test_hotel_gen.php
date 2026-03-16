<?php
require 'config.php';
// Test auto-generation
$city = "Delhi";
echo "Testing auto-generation for $city...\n";

// Emulate GET request logic by calling the script directly or its logic
ob_start();
$_GET['city'] = $city;
include 'get_hotels.php';
$output = ob_get_clean();

$data = json_decode($output, true);
if ($data && $data['status'] === 'success') {
    echo "SUCCESS: Generated " . count($data['data']) . " hotels.\n";
    foreach ($data['data'] as $h) {
        echo " - " . $h['hotel_name'] . " (ID: " . $h['id'] . ")\n";
    }
} else {
    echo "FAILED: " . ($data['message'] ?? 'Unknown error') . "\n";
}
?>
