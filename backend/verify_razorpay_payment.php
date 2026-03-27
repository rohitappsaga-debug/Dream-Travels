<?php
/**
 * Verify Razorpay Payment Signature and Confirm Booking.
 */

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/razorpay_config.php';

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "No data received"]);
    exit;
}

$razorpay_order_id   = $data['razorpay_order_id'] ?? '';
$razorpay_payment_id = $data['razorpay_payment_id'] ?? '';
$razorpay_signature  = $data['razorpay_signature'] ?? '';
$booking_id          = intval($data['booking_id'] ?? 0);
$type                = $data['type'] ?? ''; // 'package', 'bus', 'hotel'

if (empty($razorpay_order_id) || empty($razorpay_payment_id) || empty($razorpay_signature)) {
    echo json_encode(["success" => false, "message" => "Missing Razorpay details"]);
    exit;
}

// 1. Verify Signature
$generated_signature = hash_hmac('sha256', $razorpay_order_id . "|" . $razorpay_payment_id, RAZORPAY_KEY_SECRET);

if ($generated_signature !== $razorpay_signature) {
    // Signature mismatch
    echo json_encode(["success" => false, "message" => "Payment verification failed: Signature mismatch"]);
    exit;
}

// 2. Signature Verified -> Confirm Booking
$conn->begin_transaction();

try {
    if ($type === 'package') {
        $stmt = $conn->prepare("UPDATE bookings_data SET status = 'confirmed', payment_status = 'success', razorpay_payment_id = ?, razorpay_signature = ? WHERE razorpay_order_id = ?");
        $stmt->bind_param("sss", $razorpay_payment_id, $razorpay_signature, $razorpay_order_id);
    } 
    else if ($type === 'bus') {
        $stmt = $conn->prepare("UPDATE bus_bookings SET booking_status = 'Confirmed', payment_status = 'success', razorpay_payment_id = ?, razorpay_signature = ? WHERE razorpay_order_id = ?");
        $stmt->bind_param("sss", $razorpay_payment_id, $razorpay_signature, $razorpay_order_id);
    }
    else if ($type === 'hotel') {
        $stmt = $conn->prepare("UPDATE hotel_bookings SET status = 'Confirmed', payment_status = 'success', razorpay_payment_id = ?, razorpay_signature = ? WHERE razorpay_order_id = ?");
        $stmt->bind_param("sss", $razorpay_payment_id, $razorpay_signature, $razorpay_order_id);
    }

    if (!$stmt->execute()) {
        throw new Exception("Database update failed: " . $stmt->error);
    }

    $conn->commit();

    // Trigger post-booking actions (SMS/Email)
    // You can call your existing mail/sms helpers here
    // For now, return success
    echo json_encode([
        "success" => true,
        "message" => "Payment verified and booking confirmed!",
        "booking_id" => $booking_id
    ]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
?>
