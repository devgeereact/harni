<?php

declare(strict_types=1);

// The only public PHP file. The mail code lives in the private backend folder, outside the web
// root. On cPanel this file sits in ~/harni.uk/api/, so the private folder is found from its own
// place: ~/apps/harni/current. No pointer file is needed, so a deploy cannot delete one. Only
// PHP's local development server uses the repository layout instead, two levels up.
ini_set('display_errors', '0');

$base = dirname(__DIR__, 2);
$privateDir = PHP_SAPI === 'cli-server' ? $base : $base . '/apps/harni/current';

if (!is_file($privateDir . '/src/bootstrap.php')) {
    // Paths stay in the server log only. The visitor sees the same message as any outage.
    error_log('[harni mail] backend not installed');
    header_remove('X-Powered-By');
    http_response_code(503);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo '{"ok":false,"message":"Online sending is temporarily unavailable. Please email us directly."}';
    exit;
}

require $privateDir . '/src/bootstrap.php';
handleMessageRequest();
