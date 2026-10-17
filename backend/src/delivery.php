<?php

declare(strict_types=1);

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
