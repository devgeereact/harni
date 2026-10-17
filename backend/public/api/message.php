<?php

declare(strict_types=1);

// The only public PHP file. The mail code lives in the private backend folder, outside the web
// root. On the server, backend-path.php next to this file returns that folder's absolute path
// (see backend/README.md). In the repository the folder is two levels up.
ini_set('display_errors', '0');

$pathFile = __DIR__ . '/backend-path.php';
$privateDir = is_file($pathFile) ? require $pathFile : dirname(__DIR__, 2);

if (!is_string($privateDir) || !is_file($privateDir . '/src/bootstrap.php')) {
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
