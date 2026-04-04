<?php
require_once 'c:\Users\Rohit S\Dream Travellers\backend\sms_helper.php';

$booking_id = 999;
$price = "8500.00";
$total = "8500.00";

$msg  = "Dear Parth Vyas,\n";
$msg .= "Your package booking is CONFIRMED! \u2714\n\n";
$msg .= "--- Booking Details ---\n";
$msg .= "Booking ID   : #{$booking_id}\n";
$msg .= "Package      : Goa Beach Holiday\n";
$msg .= "Travel Date  : 2026-04-24\n";
$msg .= "Passengers   : 1\n";
$msg .= "Price/Person : Rs.{$price}\n";
$msg .= "Total Amount : Rs.{$total}\n";
$msg .= "Payment      : Razorpay (Online)\n";
$msg .= "\nThank you for choosing Dream Travellers!";

$res = send_booking_sms('9909720310', $msg);
var_dump($res);
