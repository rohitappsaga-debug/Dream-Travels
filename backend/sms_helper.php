<?php
/**
 * Helper to send SMS via Twilio API
 */

function send_booking_sms($phone, $message) {
    if (empty($phone)) {
        return false;
    }

    $sid   = getenv('TWILIO_ACCOUNT_SID') ?: '';
    $token = getenv('TWILIO_AUTH_TOKEN') ?: '';
    $from  = getenv('TWILIO_FROM_NUMBER') ?: '';

    // Clean phone number
    $to = preg_replace('/[^\d+]/', '', $phone);
    if (substr($to, 0, 1) !== '+') {
        if (strlen($to) == 10) {
            // Indian numbers start with 6,7,8,9
            if (in_array(substr($to, 0, 1), ['6', '7', '8', '9'])) {
                $to = '+91' . $to;
            } else {
                $to = '+1' . $to;
            }
        } else {
            $to = '+' . $to;
        }
    }

    $url  = "https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json";
    $post = http_build_query([
        'From' => $from,
        'To'   => $to,
        'Body' => $message,
    ]);

    // Use file_get_contents with stream context as alternative to curl
    // to avoid PHP 8+ curl_close deprecation issues
    $opts = [
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n" .
                         "Authorization: Basic " . base64_encode("{$sid}:{$token}") . "\r\n",
            'content' => $post,
            'ignore_errors' => true,
        ],
        'ssl' => [
            'verify_peer'      => false,
            'verify_peer_name' => false,
        ]
    ];

    $context  = stream_context_create($opts);
    $response = @file_get_contents($url, false, $context);
    
    if ($response === false) {
        return false;
    }

    $data = json_decode($response, true);
    // Success if 'sid' is present in response (Twilio message SID)
    if (isset($data['sid'])) {
        file_put_contents(__DIR__ . '/twilio_debug_log.txt', date('Y-m-d H:i:s') . " - SUCCESS to $to | SID: " . $data['sid'] . "\n", FILE_APPEND);
        return true;
    } else {
        error_log("Twilio SMS Error to $to: " . ($data['message'] ?? 'Unknown error') . " | full response: " . $response);
        file_put_contents(__DIR__ . '/twilio_debug_log.txt', date('Y-m-d H:i:s') . " - ERROR to $to: " . ($data['message'] ?? 'Unknown error') . " | full response: " . $response . "\n", FILE_APPEND);
        return false;
    }
}
?>
