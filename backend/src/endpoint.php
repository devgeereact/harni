<?php

declare(strict_types=1);

// HTTP handling for POST /api/message.php. Called by the public entry file only.

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_THROW_ON_ERROR);
    exit;
}

/** Handles one request and always ends it with a JSON response. */
function handleMessageRequest(): void
{
    // Do not advertise the PHP version when the host has expose_php enabled.
    header_remove('X-Powered-By');
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        respond(405, ['ok' => false, 'message' => 'Use the contact or subscription form to send a request.']);
    }
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowedOrigins = ['https://harni.uk', 'https://www.harni.uk'];
    // A localhost origin is accepted only by PHP's local development server.
    if (PHP_SAPI === 'cli-server') {
        $allowedOrigins = array_merge($allowedOrigins, ['http://localhost:5152', 'http://127.0.0.1:5152']);
        // The local launcher may use a free custom port. Never extend production origins.
        $localPort = getenv('HARNI_WEB_PORT');
        if (is_string($localPort) && preg_match('/^[0-9]+$/D', $localPort) === 1 && (int)$localPort >= 1 && (int)$localPort <= 65535) {
            $allowedOrigins[] = 'http://127.0.0.1:' . (int)$localPort;
            $allowedOrigins[] = 'http://localhost:' . (int)$localPort;
        }
    }
    if (!in_array($origin, $allowedOrigins, true)) respond(403, ['ok' => false, 'message' => 'Please submit the form from harni.uk.']);
    if (strtolower(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]) !== 'application/json') respond(415, ['ok' => false, 'message' => 'Unsupported form format.']);
    if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 65536) respond(413, ['ok' => false, 'message' => 'Your message is too long.']);
    try {
        $raw = file_get_contents('php://input', false, null, 0, 65537);
        if ($raw === false || strlen($raw) > 65536) respond(413, ['ok' => false, 'message' => 'Your message is too long.']);
        $input = json_decode($raw, true, 16, JSON_THROW_ON_ERROR);
        if (!is_array($input)) throw new InvalidArgumentException('Please check the form fields.');
        $message = prepareMessage($input);
    } catch (JsonException | InvalidArgumentException $error) {
        respond(422, ['ok' => false, 'message' => $error instanceof JsonException ? 'Invalid form data.' : $error->getMessage()]);
    }
    if (getenv('HARNI_MAIL_ENABLED') !== '1') respond(503, ['ok' => false, 'message' => 'Online sending is not available yet. Please email ' . $message['to'] . ' directly. Nothing was sent.']);
    try {
        // REMOTE_ADDR must be the real client IP. Behind Cloudflare the host must restore it from
        // CF-Connecting-IP, trusting that header only from Cloudflare's published ranges (for
        // example Apache mod_remoteip). Otherwise every visitor shares a Cloudflare edge address
        // and the per-IP limit acts as a second global limit. Never trust a client-supplied
        // forwarding header here. Rate limiting runs after the cheap validation and before
        // mail(), the only expensive step, so malformed requests do not use up the limits.
        if (!allowRequest(getenv('HARNI_MAIL_STATE_DIR') ?: '', getenv('HARNI_MAIL_RATE_KEY') ?: '', $_SERVER['REMOTE_ADDR'] ?? 'unknown', $message['email'])) {
            header('Retry-After: 3600');
            respond(429, ['ok' => false, 'message' => 'Too many requests. Please wait an hour or email us directly.']);
        }
        $result = deliverMessage($message, fn($to, $subject, $body, $headers) => @mail($to, $subject, $body, $headers));
        respond($result['ok'] ? 200 : 502, $result);
    } catch (Throwable $error) {
        // No message contents or server configuration are exposed in responses or logs.
        respond(503, ['ok' => false, 'message' => 'Online sending is temporarily unavailable. Please email us directly.']);
    }
}
