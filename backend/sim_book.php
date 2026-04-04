<?php
require 'config.php';

// Simulate frontend creating order
$create_data = [
    'type' => 'package',
    'user_id' => 2,
    'customer_name' => 'API Test User',
    'customer_phone' => '9909720310',
    'travel_date' => '2026-05-01',
    'passengers' => 2,
    'package_id' => 1,
    'package_title' => 'Goa Beach Holiday',
    'package_price' => 8500,
    'amount' => 17000
];

$ch = curl_init('http://localhost:8000/create_razorpay_order.php'); // Assuming running on 8000, wait, it's not. I'll just include the files instead? No, it's easier to simulate.
