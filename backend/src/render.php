<?php

declare(strict_types=1);

// Email layout shared by every message: one document, a text and an HTML rendering.

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
