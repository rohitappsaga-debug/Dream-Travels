<?php
require_once 'config.php';
require_once 'sms_helper.php';

echo "=== Latest Bus Booking ===\n";
$res = $conn->query("SELECT id, passenger_name, phone, booking_status, created_at FROM bus_bookings ORDER BY id DESC LIMIT 1");
if ($row = $res->fetch_assoc()) {
    print_r($row);
    $phone = $row['phone'];
    echo "\nTesting SMS to: '$phone'\n";
    $result = send_booking_sms($phone, "Dream Travellers: Your bus booking is confirmed. This is a test.");
    echo "SMS Result: " . ($result ? "SENT OK" : "FAILED") . "\n";
} else {
    echo "No bus bookings found.\n";
}

echo "\n=== Latest Package Booking ===\n";
$res2 = $conn->query("SELECT id, customer_name, customer_phone, status, created_at FROM bookings_data ORDER BY id DESC LIMIT 1");
if ($row2 = $res2->fetch_assoc()) {
    print_r($row2);
    $phone2 = $row2['customer_phone'];
    echo "\nTesting SMS to: '$phone2'\n";
    $result2 = send_booking_sms($phone2, "Dream Travellers: Your package booking is confirmed. This is a test.");
    echo "SMS Result: " . ($result2 ? "SENT OK" : "FAILED") . "\n";
}

echo "\n=== Latest Hotel Booking ===\n";
$res3 = $conn->query("SELECT id, guest_name, phone, status, created_at FROM hotel_bookings ORDER BY id DESC LIMIT 1");
if ($row3 = $res3->fetch_assoc()) {
    print_r($row3);
    $phone3 = $row3['phone'];
    echo "\nTesting SMS to: '$phone3'\n";
    $result3 = send_booking_sms($phone3, "Dream Travellers: Your hotel booking is confirmed. This is a test.");
    echo "SMS Result: " . ($result3 ? "SENT OK" : "FAILED") . "\n";
}
