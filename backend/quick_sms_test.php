<?php
require_once 'sms_helper.php';
$r = send_booking_sms('9909720310', 'Dream Travellers: Bus booking confirmed! Test from booking.');
var_dump($r);
