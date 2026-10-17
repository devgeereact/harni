<?php

declare(strict_types=1);

/** A locked, bounded private file. No message bodies or raw email/IP values are saved. */
function allowRequest(string $directory, string $secret, string $ip, string $email): bool
{
    if (!is_dir($directory) || !is_writable($directory) || strlen($secret) < 32) {
        throw new RuntimeException('Mail rate-limit storage is not configured.');
    }
    $resolved = realpath($directory);
    // Without a web server (tests, CLI) the repository's public folder stands in for the web root.
    // The storage may sit neither in the web root nor in the backend code folder.
    $publicRoot = realpath(($_SERVER['DOCUMENT_ROOT'] ?? '') ?: dirname(__DIR__) . '/public');
    $codeRoot = realpath(__DIR__);
    if ($resolved === false || $publicRoot === false || $codeRoot === false) {
        throw new RuntimeException('Rate-limit storage or web root cannot be resolved.');
    }
    foreach ([$publicRoot, $codeRoot] as $forbidden) {
        if ($resolved === $forbidden || str_starts_with($resolved, $forbidden . DIRECTORY_SEPARATOR)) {
            throw new RuntimeException('Rate-limit storage must be outside the web root and the code folder.');
        }
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
