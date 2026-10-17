<?php
/** cPanel/PHP 8.1+ mail endpoint. Enable only after host and mailbox verification. */
declare(strict_types=1);

const HARNI_NOTICE_VERSION = '2026-10-17';
const HARNI_CONSENT_WORDING = 'I agree to receive emails from Harni Muharami. I can unsubscribe at any time.';
const HARNI_ACK_WORDING = 'I have read the Privacy Notice and agree to the Website Terms.';

function esc(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function formatWhen(int $timestamp): string
{
    return gmdate('l j F Y, H:i', $timestamp) . ' UTC';
}

/**
 * One document, two renderings. A document is: title, greeting, intro, sections and footer lines.
 * Each section has a heading and rows (label => value), a free text block, or a list of lines.
 * Every visitor-supplied value is escaped in the HTML and left as plain text in the text version.
 *
 * @return array{text: string, html: string}
 */
function renderEmail(array $doc): array
{
    $text = strtoupper($doc['title']) . "\n" . str_repeat('=', min(60, strlen($doc['title']))) . "\n\n";
    $html = '<!doctype html><html lang="en-GB"><body style="margin:0;padding:0;background:#f7f7f7;">'
        . '<div style="max-width:600px;margin:0 auto;padding:24px 16px;font-family:Arial,Helvetica,sans-serif;color:#222222;line-height:1.5;">'
        . '<div style="background:#ffffff;border:1px solid #dddddd;border-radius:12px;padding:24px;">'
        . '<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6a6a6a;">harni.uk</p>'
        . '<h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;">' . esc($doc['title']) . '</h1>';
    if (($doc['greeting'] ?? '') !== '') {
        $text .= $doc['greeting'] . "\n\n";
        $html .= '<p style="margin:0 0 12px;">' . esc($doc['greeting']) . '</p>';
    }
    foreach ($doc['intro'] ?? [] as $paragraph) {
        $text .= $paragraph . "\n\n";
        $html .= '<p style="margin:0 0 12px;">' . esc($paragraph) . '</p>';
    }
    foreach ($doc['sections'] ?? [] as $section) {
        $text .= strtoupper($section['heading']) . "\n" . str_repeat('-', min(60, strlen($section['heading']))) . "\n";
        $html .= '<h2 style="margin:20px 0 8px;font-size:15px;text-transform:uppercase;letter-spacing:.04em;border-top:1px solid #eeeeee;padding-top:16px;">' . esc($section['heading']) . '</h2>';
        foreach ($section['rows'] ?? [] as $label => $value) {
            $text .= $label . ': ' . $value . "\n";
            $html .= '<p style="margin:0 0 6px;"><strong>' . esc((string) $label) . ':</strong> ' . esc((string) $value) . '</p>';
        }
        if (($section['block'] ?? '') !== '') {
            $text .= "\n" . $section['block'] . "\n";
            $html .= '<div style="margin:8px 0 0;padding:12px 14px;background:#f7f7f7;border-left:4px solid #e00b41;border-radius:6px;white-space:pre-wrap;">' . esc($section['block']) . '</div>';
        }
        foreach ($section['lines'] ?? [] as $line) {
            $text .= '- ' . $line . "\n";
            $html .= '<p style="margin:0 0 6px;padding-left:14px;">&bull; ' . esc($line) . '</p>';
        }
        $text .= "\n";
    }
    $text .= str_repeat('-', 40) . "\n";
    $html .= '</div><div style="padding:16px 8px;font-size:12px;color:#6a6a6a;">';
    foreach ($doc['footer'] ?? [] as $line) {
        $text .= $line . "\n";
        $html .= '<p style="margin:0 0 4px;">' . esc($line) . '</p>';
    }
    $html .= '</div></div></body></html>';
    return ['text' => $text, 'html' => $html];
}

function prepareMessage(array $input): array
{
    $kind = $input['kind'] ?? '';
    if (!in_array($kind, ['contact', 'subscribe'], true)) {
        throw new InvalidArgumentException('Choose a valid form.');
    }
    foreach (['email', 'name', 'subject', 'message', 'website'] as $key) {
        if (isset($input[$key]) && !is_string($input[$key])) {
            throw new InvalidArgumentException('Please check the form fields.');
        }
    }
    if (trim($input['website'] ?? '') !== '') {
        throw new InvalidArgumentException('Unable to accept this request.');
    }
    $email = trim($input['email'] ?? '');
    if (strlen($email) > 254 || preg_match('/[\r\n\x00]/', $email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Enter a valid email address.');
    }
    $name = trim($input['name'] ?? '');
    $subject = trim($input['subject'] ?? '') ?: 'General enquiry';
    $message = trim($input['message'] ?? '');
    if ($kind === 'contact' && ($name === '' || strlen($name) > 480 || strlen($subject) > 720 || $message === '' || strlen($message) > 40000)) {
        throw new InvalidArgumentException('Enter your name and message, within the field limits.');
    }
    if (preg_match('/[\r\n\x00]/', $name . $subject) || str_contains($message, "\0")) {
        throw new InvalidArgumentException('The name or subject contains invalid characters.');
    }
    if ($kind === 'subscribe' && ($input['consent'] ?? false) !== true) {
        throw new InvalidArgumentException('Please agree to receive book updates before requesting a subscription.');
    }
    if ($kind === 'contact' && ($input['acknowledgement'] ?? false) !== true) {
        throw new InvalidArgumentException('Please acknowledge the Privacy Notice and agree to the Website Terms.');
    }
    $now = time();
    $reference = 'HM-' . gmdate('Ymd', $now) . '-' . strtoupper(bin2hex(random_bytes(6)));
    $to = $kind === 'contact' ? 'info@harni.uk' : 'subscribe@harni.uk';
    $when = formatWhen($now);
    $footer = [
        'Sent by harni.uk for Harni Muharami, an author based in London. Contact: ' . $to . '.',
        'How your details are used: https://harni.uk/privacy/',
        'Please keep the reference ' . $reference . ' if you contact me about this.',
    ];

    if ($kind === 'contact') {
        $ownerDoc = [
            'title' => 'New website enquiry',
            'intro' => ['Someone sent a message through the contact form on harni.uk. Reply to this email to answer them: their address is set as the reply address.'],
            'sections' => [
                ['heading' => 'Reference', 'rows' => ['Reference' => $reference, 'Received' => $when]],
                ['heading' => 'From', 'rows' => ['Name' => $name, 'Email' => $email, 'Subject' => $subject]],
                ['heading' => 'Message', 'block' => $message],
                ['heading' => 'Record', 'rows' => [
                    'Acknowledged' => HARNI_ACK_WORDING,
                    'Notice and terms version' => HARNI_NOTICE_VERSION,
                    'Marketing consent' => 'None. An enquiry never signs anyone up to the mailing list.',
                    'Form' => 'harni.uk contact form',
                ]],
                ['heading' => 'What to do', 'lines' => [
                    'Reply to this email. Keep the reference in the subject so both sides can find it.',
                    'The sender has been sent a copy of exactly what is above, with a note that you aim to reply within five working days.',
                    'If the message contains patient or health information, do not forward it. Delete it, and tell the sender not to send such details.',
                    'Delete this enquiry once it is dealt with, following the retention period in the privacy notice.',
                ]],
            ],
            'footer' => ['Automatic message from the harni.uk contact form. Reference ' . $reference . '.'],
        ];
        $copyDoc = [
            'title' => 'Your copy of your message to Harni Muharami',
            'greeting' => 'Hello ' . $name . ',',
            'intro' => [
                'Thank you for getting in touch. This is a copy of the message you sent from harni.uk, for your records. It is an automatic acknowledgement, not a personal reply.',
            ],
            'sections' => [
                ['heading' => 'What you sent', 'rows' => ['Reference' => $reference, 'Sent' => $when, 'Your name' => $name, 'Your email' => $email, 'Subject' => $subject]],
                ['heading' => 'Your message', 'block' => $message],
                ['heading' => 'What you agreed to', 'rows' => ['Acknowledged' => HARNI_ACK_WORDING, 'Version' => HARNI_NOTICE_VERSION], 'lines' => [
                    'This message did not sign you up to any mailing list.',
                ]],
                ['heading' => 'What happens next', 'lines' => [
                    'I read every message and aim to reply within five working days. A reply cannot be guaranteed.',
                    'To add something, reply to this email and keep the reference in the subject.',
                    'For an Amazon order, contact Amazon: I do not take orders.',
                    'Please do not send patient information or medical records. My books give general guidance, not medical advice, and I cannot give personal medical advice.',
                    'If you did not send this message, someone may have typed your address by mistake. Nothing more will be sent to you, and no further action is needed.',
                ]],
            ],
            'footer' => $footer,
        ];
        $visitorSubject = 'Your copy: your message to Harni Muharami [' . $reference . ']';
        $ownerSubject = 'Website enquiry [' . $reference . ']';
    } else {
        $ownerDoc = [
            'title' => 'New mailing list sign-up',
            'intro' => ['Someone asked to join the book-update list on harni.uk and ticked the consent box. This email is your record of that consent: keep it.'],
            'sections' => [
                ['heading' => 'Reference', 'rows' => ['Reference' => $reference, 'Received' => $when]],
                ['heading' => 'Subscriber', 'rows' => ['Email' => $email, 'Source' => 'harni.uk sign-up form']],
                ['heading' => 'Consent given', 'rows' => [
                    'Wording' => HARNI_CONSENT_WORDING,
                    'Wording version' => HARNI_NOTICE_VERSION,
                    'Status' => 'Consent given on sign-up (single step, no confirmation link)',
                ]],
                ['heading' => 'What to do', 'lines' => [
                    'Add this address to your mailing list, using this email as the consent record.',
                    'The subscriber has been sent a copy of their sign-up, with how to unsubscribe.',
                    'Honour any unsubscribe request (an email to subscribe@harni.uk) before the next mailing, and keep the address on a do-not-email list so it is not added again by mistake.',
                    'Only send what they signed up for: news about new books.',
                ]],
            ],
            'footer' => ['Automatic message from the harni.uk sign-up form. Reference ' . $reference . '.'],
        ];
        $copyDoc = [
            'title' => 'You joined Harni Muharami\'s mailing list',
            'greeting' => 'Thank you for joining my mailing list!',
            'intro' => ['I\'ll email you when a new book comes out. Here is a copy of your sign-up, for your records.'],
            'sections' => [
                ['heading' => 'Your sign-up', 'rows' => ['Reference' => $reference, 'Date and time' => $when, 'Your email' => $email]],
                ['heading' => 'What you agreed to', 'rows' => ['You ticked' => HARNI_CONSENT_WORDING, 'Wording version' => HARNI_NOTICE_VERSION]],
                ['heading' => 'What to expect', 'lines' => [
                    'News when a new book comes out. I will not share your address or sell it.',
                    'Every email will show who it is from and how to leave.',
                ]],
                ['heading' => 'How to unsubscribe', 'lines' => [
                    'Reply to this email with the word Unsubscribe, or email subscribe@harni.uk, at any time.',
                    'I will remove you before the next mailing and keep only a note that you asked not to be emailed.',
                    'If you did not sign up, someone may have typed your address by mistake. Email subscribe@harni.uk and I will remove it.',
                ]],
            ],
            'footer' => $footer,
        ];
        $visitorSubject = 'You joined the mailing list: your copy [' . $reference . ']';
        $ownerSubject = 'Subscription request [' . $reference . ']';
    }
    $owner = renderEmail($ownerDoc);
    $copy = renderEmail($copyDoc);
    return ['to' => $to, 'email' => $email, 'reference' => $reference, 'kind' => $kind,
        'subject' => $ownerSubject, 'visitorSubject' => $visitorSubject,
        'owner' => $owner['text'], 'ownerHtml' => $owner['html'],
        'copy' => $copy['text'], 'copyHtml' => $copy['html']];
}

/**
 * A text and an HTML version in one message. Fixed, injection-free headers: visitor content appears
 * only in the encoded body, never in a header.
 *
 * @return array{headers: array<string,string>, body: string}
 */
function buildMime(string $text, string $html, array $headers): array
{
    $boundary = 'hm-' . bin2hex(random_bytes(12));
    $part = static fn(string $type, string $content): string => "--$boundary\r\nContent-Type: $type; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($content));
    $headers['MIME-Version'] = '1.0';
    $headers['Content-Type'] = 'multipart/alternative; boundary="' . $boundary . '"';
    return ['headers' => $headers, 'body' => $part('text/plain', $text) . $part('text/html', $html) . "--$boundary--\r\n"];
}

function deliverMessage(array $message, callable $send): array
{
    $from = 'Harni Muharami <' . $message['to'] . '>';
    $ownerMime = buildMime($message['owner'], $message['ownerHtml'], ['From' => $from, 'Reply-To' => $message['email']]);
    if (!$send($message['to'], $message['subject'], $ownerMime['body'], $ownerMime['headers'])) {
        return ['ok' => false, 'message' => 'The mail service did not accept your request. Please email us directly.'];
    }
    $copyHeaders = ['From' => $from, 'Reply-To' => $message['to'], 'Auto-Submitted' => 'auto-replied', 'X-Auto-Response-Suppress' => 'All'];
    if (($message['kind'] ?? '') === 'subscribe') {
        $copyHeaders['List-Unsubscribe'] = '<mailto:' . $message['to'] . '?subject=Unsubscribe>';
    }
    $copyMime = buildMime($message['copy'], $message['copyHtml'], $copyHeaders);
    $copy = $send($message['email'], $message['visitorSubject'], $copyMime['body'], $copyMime['headers']);
    return ['ok' => true, 'copyAccepted' => (bool) $copy, 'reference' => $message['reference']];
}

/** A locked, bounded private file. No message bodies or raw email/IP values are saved. */
function allowRequest(string $directory, string $secret, string $ip, string $email): bool
{
    if (!is_dir($directory) || !is_writable($directory) || strlen($secret) < 32) {
        throw new RuntimeException('Mail rate-limit storage is not configured.');
    }
    $resolved = realpath($directory);
    $publicRoot = realpath($_SERVER['DOCUMENT_ROOT'] ?? __DIR__ . '/..');
    if ($resolved === false || ($publicRoot && ($resolved === $publicRoot || str_starts_with($resolved, $publicRoot . DIRECTORY_SEPARATOR)))) {
        throw new RuntimeException('Rate-limit storage must be outside the document root.');
    }
    $file = fopen($resolved . '/mail-rate.json', 'c+');
    if (!$file || !flock($file, LOCK_EX)) throw new RuntimeException('Cannot lock rate-limit storage.');
    try {
        $raw = stream_get_contents($file);
        $entries = $raw === '' ? [] : json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
        if (!is_array($entries)) throw new RuntimeException('Invalid rate-limit storage.');
        $now = time();
        $entries = array_filter($entries, fn($entry) => $entry['until'] > $now);
        $keys = ['global', hash_hmac('sha256', 'ip:' . $ip, $secret), hash_hmac('sha256', 'email:' . strtolower($email), $secret)];
        $limits = [100, 5, 3];
        $allowed = true;
        foreach ($keys as $i => $key) {
            if (($entries[$key]['count'] ?? 0) >= $limits[$i]) $allowed = false;
        }
        if ($allowed) foreach ($keys as $key) {
            $entries[$key] = ['count' => ($entries[$key]['count'] ?? 0) + 1, 'until' => $entries[$key]['until'] ?? $now + 3600];
        }
        rewind($file);
        if (!ftruncate($file, 0) || fwrite($file, json_encode($entries, JSON_THROW_ON_ERROR)) === false || !fflush($file)) {
            throw new RuntimeException('Cannot save rate-limit storage.');
        }
        return $allowed;
    } finally {
        flock($file, LOCK_UN);
        fclose($file);
    }
}

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_THROW_ON_ERROR);
    exit;
}

if (!defined('HARNI_MAIL_TEST')) {
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
