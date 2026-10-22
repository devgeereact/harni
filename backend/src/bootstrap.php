<?php

declare(strict_types=1);

// Loads the private mail code. Plain functions, no Composer: the endpoint has no dependencies.
require __DIR__ . '/render.php';
require __DIR__ . '/message.php';
require __DIR__ . '/delivery.php';
require __DIR__ . '/rate-limit.php';
require __DIR__ . '/endpoint.php';
