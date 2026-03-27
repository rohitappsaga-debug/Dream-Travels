<?php
/**
 * Razorpay Webhook Handler.
 * Setup this URL in your Razorpay Dashboard with Events: payment.captured, payment.failed
 */

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header("Content-Type: application/json");

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/razorpay_config.php';

$webhook_secret = getenv('RAZORPAY_WEBHOOK_SECRET') ?: 'YOUR_WEBHOOK_SECRET'; // Set this in Dashboard

$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] ?? '';

// 1. Verify Webhook Signature
$expected_signature = hash_hmac('sha256', $payload, $webhook_secret);

if ($expected_signature !== $signature) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid Webhook Signature"]);
    exit;
}

$data = json_decode($payload, true);
$event = $data['event'] ?? '';
$payment = $data['payload']['payment']['entity'] ?? null;

if (!$payment) {
    http_response_code(400);
    exit;
}

$razorpay_order_id = $payment['order_id'];
$razorpay_payment_id = $payment['id'];

if ($event === 'payment.captured') {
    // Confirm booking if not already confirmed
    $conn->begin_transaction();
    try {
        // Try all three tables
        $conn->query("UPDATE bookings_data SET status = 'confirmed', payment_status = 'success', razorpay_payment_id = '$razorpay_payment_id' WHERE razorpay_order_id = '$razorpay_order_id' AND status = 'pending'");
        $conn->query("UPDATE bus_bookings SET booking_status = 'Confirmed', payment_status = 'success', razorpay_payment_id = '$razorpay_payment_id' WHERE razorpay_order_id = '$razorpay_order_id' AND booking_status = 'Pending'");
        $conn->query("UPDATE hotel_bookings SET status = 'Confirmed', payment_status = 'success', razorpay_payment_id = '$razorpay_payment_id' WHERE razorpay_order_id = '$razorpay_order_id' AND status = 'Pending'");
        
        $conn->commit();
    } catch (Exception $e) {
        $conn->rollback();
    }
} 
else if ($event === 'payment.failed') {
    // Mark as failed
    $conn->query("UPDATE bookings_data SET payment_status = 'failed' WHERE razorpay_order_id = '$razorpay_order_id'");
    $conn->query("UPDATE bus_bookings SET payment_status = 'failed' WHERE razorpay_order_id = '$razorpay_order_id'");
    $conn->query("UPDATE hotel_bookings SET payment_status = 'failed' WHERE razorpay_order_id = '$razorpay_order_id'");
}

http_response_code(200);
echo json_encode(["status" => "ok"]);
?>
