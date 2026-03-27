<?php
/**
 * Create a booking and send confirmation SMS via Twilio.
 * Set env vars (or in .env / server config): TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
 */

// Ensure no PHP notices/warnings break JSON output
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

require __DIR__ . '/config.php';

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !is_array($data)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid or empty JSON. Raw length: " . strlen($raw)
    ]);
    exit;
}

$user_id         = isset($data['user_id']) ? (int) $data['user_id'] : null;
$customer_name   = trim((string) ($data['customer_name'] ?? ''));
$customer_phone  = trim((string) ($data['customer_phone'] ?? ''));
$travel_date     = trim((string) ($data['travel_date'] ?? ''));
$passengers      = (int) ($data['passengers'] ?? 0);
$payment_method  = trim((string) ($data['payment_method'] ?? ''));
$package_id      = isset($data['package_id']) ? (int) $data['package_id'] : null;
$package_title   = trim((string) ($data['package_title'] ?? ''));
$package_price   = isset($data['package_price']) ? (float) $data['package_price'] : null;
$payment_details = trim((string) ($data['payment_details'] ?? ''));

$missing = [];
if (!$user_id) $missing[] = 'user_id';
if ($customer_name === '') $missing[] = 'customer_name';
if ($travel_date === '') $missing[] = 'travel_date';
if ($passengers < 1) $missing[] = 'passengers';
if ($payment_method === '') $missing[] = 'payment_method';
if (!$package_id) $missing[] = 'package_id';

if (count($missing) > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields: " . implode(", ", $missing)
    ]);
    exit;
}

if ($customer_phone !== '' && (strlen($customer_phone) !== 10 || !ctype_digit($customer_phone))) {
    echo json_encode([
        "success" => false,
        "message" => "Mobile number must be exactly 10 digits."
    ]);
    exit;
}

// Validate travel_date format (MySQL DATE expects YYYY-MM-DD)
if (!preg_match('/^\\d{4}-\\d{2}-\\d{2}$/', $travel_date)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid travel_date format. Expected YYYY-MM-DD, got: " . $travel_date
    ]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO bookings_data (customer_name, customer_phone, user_id, travel_date, passengers, payment_method, payment_details, package_id, package_title, package_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')");
$stmt->bind_param("ssisisisds", $customer_name, $customer_phone, $user_id, $travel_date, $passengers, $payment_method, $payment_details, $package_id, $package_title, $package_price);

if (!$stmt->execute()) {
    $stmt->close();
    $conn->close();
    echo json_encode(["success" => false, "message" => "Database error: " . $stmt->error]);
    exit;
}

$booking_id = $conn->insert_id;
$stmt->close();

// Get user email for confirmation email (use bind_result for compatibility without mysqlnd)
$customer_email = '';
$st = $conn->prepare("SELECT email FROM users_data WHERE id = ?");
$st->bind_param("i", $user_id);
$st->execute();
$st->bind_result($email);
if ($st->fetch()) {
    $customer_email = trim($email ?? '');
}
$st->close();

// Send confirmation email via Mailhog (SMTP localhost:1025)
$email_sent = false;
if (!empty($customer_email)) {
    // Sending email is best-effort only; failures should NOT affect the booking.
    try {
        require_once __DIR__ . '/mail_helper.php';
        $subject = "Booking confirmed – Dream Travellers";
        $body = "Hello {$customer_name},\n\n";
        $body .= "Your booking has been confirmed.\n\n";
        $body .= "Package: {$package_title}\n";
        $body .= "Travel date: {$travel_date}\n";
        $body .= "Passengers: {$passengers}\n";
        $body .= "Amount: ₹" . number_format((float) $package_price, 2) . "\n\n";
        $body .= "Thank you for choosing Dream Travellers!\n";
        $email_sent = send_mail_smtp($customer_email, $subject, $body) ? true : false;
    } catch (\Throwable $e) {
        // Ignore mail errors; just mark as not sent.
        $email_sent = false;
    }
}

$sms_sent = false;
if (!empty($customer_phone) && function_exists('curl_init')) {
    $sid   = getenv('TWILIO_ACCOUNT_SID') ?: '';
    $token = getenv('TWILIO_AUTH_TOKEN') ?: '';
    $from  = getenv('TWILIO_FROM_NUMBER') ?: '';
    if ($sid && $token && $from) {
        $body = "Dream Travellers: Your booking is confirmed. Package: {$package_title}, Date: {$travel_date}. Thank you!";
        $to   = preg_replace('/\s+/', '', $customer_phone);
        if (substr($to, 0, 1) !== '+') {
            $to = '+' . $to;
        }
        $url = "https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json";
        $post = http_build_query([
            'From' => $from,
            'To'   => $to,
            'Body' => $body,
        ]);
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERPWD, "{$sid}:{$token}");
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
        $response = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        $sms_sent = ($code >= 200 && $code < 300);
    }
}

$conn->close();

$parts = ["Booking successful"];
if ($email_sent) $parts[] = "Confirmation email sent";
if ($sms_sent) $parts[] = "SMS sent";

echo json_encode([
    "success"  => true,
    "message"  => implode(". ", $parts),
    "booking_id" => $booking_id,
]);
