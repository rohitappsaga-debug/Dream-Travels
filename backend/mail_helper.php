<?php
/**
 * Send email via SMTP (Mailhog on localhost:1025 by default).
 * Set MAILHOG_HOST, MAILHOG_PORT if needed. From address uses MAIL_FROM or default.
 *
 * @param string $to      Recipient email
 * @param string $subject Subject line
 * @param string $body    Plain text or HTML body
 * @param string $from    Sender email (optional)
 * @param string $fromName Sender name (optional)
 * @return bool True if sent successfully
 */
function send_mail_smtp($to, $subject, $body, $from = null, $fromName = 'Dream Travellers') {
    $host = getenv('MAILHOG_HOST') ?: '127.0.0.1';
    $port = (int) (getenv('MAILHOG_PORT') ?: 1025);
    $from = $from ?: (getenv('MAIL_FROM') ?: 'noreply@dreamtravellers.local');

    $sock = @stream_socket_client(
        "tcp://{$host}:{$port}",
        $errno,
        $errstr,
        5,
        STREAM_CLIENT_CONNECT
    );
    if (!$sock) {
        return false;
    }

    $read = function () use ($sock) {
        $line = fgets($sock);
        return $line !== false ? trim($line) : '';
    };
    $send = function ($line) use ($sock) {
        fwrite($sock, $line . "\r\n");
    };

    $read(); // 220 banner
    $send("EHLO localhost");
    while ($read() !== '');

    $send("MAIL FROM:<{$from}>");
    $read();
    $send("RCPT TO:<{$to}>");
    $read();
    $send("DATA");
    $read();

    $headers = "From: {$fromName} <{$from}>\r\n";
    $headers .= "To: {$to}\r\n";
    $headers .= "Subject: {$subject}\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "\r\n";
    $send($headers . $body);
    $send(".");
    $read();
    $send("QUIT");
    fclose($sock);
    return true;
}
