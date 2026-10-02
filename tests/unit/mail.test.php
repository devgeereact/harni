<?php
declare(strict_types=1);
define('HARNI_MAIL_TEST', true);
require __DIR__ . '/../../public/api/message.php';
function check(bool $condition, string $label): void {
    if (!$condition) throw new RuntimeException('FAIL: ' . $label);
    echo "PASS: $label\n";
}
$contact = ['kind' => 'contact', 'acknowledgement' => true, 'name' => 'Reader Example', 'email' => 'reader@example.org', 'subject' => 'Book question', 'message' => "Hello Harni,\nA question about chapter 2."];
$prepared = prepareMessage($contact);
check($prepared['to'] === 'info@harni.uk', 'contact recipient');
check(str_contains($prepared['copy'], $contact['message']) && str_contains($prepared['copy'], $prepared['reference']), 'copy contains full message and reference');
check(str_contains($prepared['owner'], 'Name: Reader Example') && str_contains($prepared['owner'], 'Received: ') && str_contains($prepared['owner'], 'UTC') && str_contains($prepared['owner'], 'Email: reader@example.org') && str_contains($prepared['owner'], 'Subject: Book question'), 'owner email contains who, when and what');
check(str_contains($prepared['copy'], 'Hello Reader Example,') && str_contains($prepared['copy'], 'Your email: reader@example.org') && str_contains($prepared['copy'], 'Subject: Book question') && str_contains($prepared['copy'], 'five working days') && str_contains($prepared['copy'], 'did not sign you up'), 'contact copy is a detailed reference copy');
check(str_contains($prepared['ownerHtml'], '<h1') && str_contains($prepared['copyHtml'], 'Hello Reader Example,') && str_contains($prepared['copyHtml'], 'A question about chapter 2.'), 'html versions exist');
$evil = prepareMessage(array_replace($contact, ['name' => 'A <b>B</b>', 'message' => '<script>alert(1)</script>']));
check(!str_contains($evil['ownerHtml'], '<script>') && !str_contains($evil['copyHtml'], '<script>') && str_contains($evil['copyHtml'], '&lt;script&gt;'), 'visitor text is escaped in html');
$subscription = prepareMessage(['kind' => 'subscribe', 'email' => 'reader@example.org', 'consent' => true]);
check($subscription['to'] === 'subscribe@harni.uk' && str_starts_with($subscription['visitorSubject'], 'You joined the mailing list: your copy [HM-') && str_contains($subscription['copy'], 'Thank you for joining my mailing list!') && !str_contains($subscription['copy'], 'CONFIRM'), 'subscription recipient and welcome');
check(str_contains($subscription['copy'], 'Reference: ' . $subscription['reference']) && str_contains($subscription['copy'], 'Your email: reader@example.org') && str_contains($subscription['copy'], 'I agree to receive emails from Harni Muharami. I can unsubscribe at any time.') && str_contains($subscription['copy'], 'Unsubscribe') && str_contains($subscription['copy'], 'subscribe@harni.uk'), 'subscriber gets a copy of what they signed up to, with how to leave');
check(str_contains($subscription['owner'], 'Consent given on sign-up') && str_contains($subscription['owner'], 'Email: reader@example.org') && str_contains($subscription['owner'], 'Wording version'), 'owner receives the consent record without a confirmation step');
foreach ([['email' => "a@example.org\r\nBcc: victim@example.org"], ['name' => "Name\nInjected"], ['subject' => "Subject\rInjected"], ['website' => 'spam'], ['message' => ''], ['email' => ['invalid']], ['message' => str_repeat('x', 40001)], ['kind' => 'other']] as $bad) {
    try { prepareMessage(array_replace($contact, $bad)); throw new RuntimeException('Invalid input accepted'); }
    catch (InvalidArgumentException $e) { /* Expected. */ }
}
check(true, 'invalid inputs, header injection, honeypot and limits rejected');
try { prepareMessage(['kind' => 'subscribe', 'email' => 'reader@example.org', 'consent' => false]); throw new RuntimeException('Consent bypass'); }
catch (InvalidArgumentException $e) { check(true, 'subscription consent enforced'); }
foreach ([null, false, 'true', 1] as $value) {
    $unchecked = $contact;
    if ($value === null) unset($unchecked['acknowledgement']);
    else $unchecked['acknowledgement'] = $value;
    try { prepareMessage($unchecked); throw new RuntimeException('Acknowledgement bypass'); }
    catch (InvalidArgumentException $e) { /* Expected. */ }
}
check(true, 'contact acknowledgement required as explicit boolean true');
check(str_contains($prepared['owner'], 'Notice and terms version: 2026-10-01'), 'contact acknowledgement version recorded');
function mimePart(string $body, string $type): string {
    preg_match('/Content-Type: ' . preg_quote($type, '/') . '; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n([A-Za-z0-9+\/=\r\n]+)/', $body, $m);
    return base64_decode($m[1] ?? '', true) ?: '';
}
$calls = [];
$result = deliverMessage($prepared, function(...$args) use (&$calls) { $calls[] = $args; return true; });
check($result['ok'] && $result['copyAccepted'] && count($calls) === 2, 'owner and copy accepted');
check($calls[0][0] === 'info@harni.uk' && $calls[1][0] === 'reader@example.org', 'separate private messages');
check($calls[0][3]['Reply-To'] === 'reader@example.org' && $calls[1][3]['Reply-To'] === 'info@harni.uk', 'correct reply destinations');
check(mimePart($calls[1][2], 'text/plain') === $prepared['copy'] && mimePart($calls[1][2], 'text/html') === $prepared['copyHtml'], 'text and html bodies survive transport encoding');
check(str_starts_with($calls[1][3]['Content-Type'], 'multipart/alternative; boundary=') && !str_contains(implode("\n", array_values($calls[1][3])), 'Book question'), 'multipart headers carry no visitor text');
$sub = prepareMessage(['kind' => 'subscribe', 'email' => 'reader@example.org', 'consent' => true]);
$subCalls = [];
deliverMessage($sub, function(...$args) use (&$subCalls) { $subCalls[] = $args; return true; });
check(!isset($subCalls[0][3]['List-Unsubscribe']) && ($subCalls[1][3]['List-Unsubscribe'] ?? '') === '<mailto:subscribe@harni.uk?subject=Unsubscribe>', 'visitor copy of a sign-up carries List-Unsubscribe');
$count = 0;
$result = deliverMessage($prepared, function() use (&$count) { return ++$count === 1; });
check($result['ok'] && !$result['copyAccepted'], 'copy failure preserves accepted owner status');
$count = 0;
$result = deliverMessage($prepared, function() use (&$count) { $count++; return false; });
check(!$result['ok'] && $count === 1, 'owner failure never sends misleading receipt');
$dir = sys_get_temp_dir() . '/harni-mail-test-' . bin2hex(random_bytes(5));
mkdir($dir, 0700);
try {
    $key = str_repeat('test-only-', 4);
    for ($i = 0; $i < 3; $i++) check(allowRequest($dir, $key, '127.0.0.1', 'reader@example.org'), 'allowed request ' . ($i + 1));
    check(!allowRequest($dir, $key, '127.0.0.2', 'reader@example.org'), 'recipient rate limit across IPs');
    $state = file_get_contents($dir . '/mail-rate.json');
    check(!str_contains($state, 'reader@example.org') && !str_contains($state, '127.0.0.1'), 'no raw identifiers persisted');
    $entries = json_decode($state, true);
    foreach ($entries as &$entry) $entry['until'] = time() - 1;
    unset($entry);
    file_put_contents($dir . '/mail-rate.json', json_encode($entries));
    check(allowRequest($dir, $key, '127.0.0.1', 'reader@example.org'), 'expired limits pruned');
} finally { unlink($dir . '/mail-rate.json'); rmdir($dir); }
