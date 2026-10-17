<?php

declare(strict_types=1);

// Validates a form submission and builds the owner email and the visitor copy.
// The wording and version below must match the pages (tests/unit/legal-records.test.ts).

const HARNI_NOTICE_VERSION = '2026-10-17';
const HARNI_CONSENT_WORDING = 'I agree to receive emails from Harni Muharami. I can unsubscribe at any time.';
const HARNI_ACK_WORDING = 'I have read the Privacy Notice and agree to the Website Terms.';

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
                    'The sender has been sent a short receipt with the reference, without their name, subject or message, and a note that you aim to reply within five working days.',
                    'If the message contains patient or health information, do not forward it. Delete it, and tell the sender not to send such details.',
                    'Delete this enquiry once it is dealt with, following the retention period in the privacy notice.',
                ]],
            ],
            'footer' => ['Automatic message from the harni.uk contact form. Reference ' . $reference . '.'],
        ];
        // The copy goes to whatever address was typed, so it carries no sender-written text
        // (name, subject or message). Otherwise the form could relay any text to any inbox (ADR-028).
        $copyDoc = [
            'title' => 'Your message to Harni Muharami was received',
            'greeting' => 'Hello,',
            'intro' => [
                'Thank you for getting in touch. Your message from the harni.uk contact form was received. This is an automatic acknowledgement, not a personal reply. For privacy it does not repeat what you wrote.',
            ],
            'sections' => [
                ['heading' => 'Your receipt', 'rows' => ['Reference' => $reference, 'Sent' => $when, 'Your email' => $email]],
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
        $visitorSubject = 'We received your message [' . $reference . ']';
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
