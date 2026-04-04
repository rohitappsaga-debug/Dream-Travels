<?php
require 'config.php';
$res = $conn->query("SELECT id, guest_name, phone, status, created_at, payment_status, razorpay_order_id FROM hotel_bookings ORDER BY id DESC LIMIT 2");
while($row = $res->fetch_assoc()) {
    print_r($row);
}
