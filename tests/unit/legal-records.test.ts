// The mail handler records the wording and version a visitor agreed to (BR-016). These checks keep
// that record identical to what the pages show, so a wording or version change cannot drift.
// Run: npm test

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { joinForm } from '../../src/content/layout.ts';
import { cookies, privacy, terms } from '../../src/content/legal.ts';
import { contact } from '../../src/content/pages.ts';
import { site } from '../../src/content/site.ts';

const php = readFileSync(new URL('../../public/api/message.php', import.meta.url), 'utf8');
const constant = (name: string): string => {
  const match = php.match(new RegExp(`const ${name} = '([^']*)';`));
  assert.ok(match, `${name} is defined in message.php`);
  return match[1] ?? '';
};
const text = (html: string): string => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

test('the recorded notice version matches the version shown on every legal page', () => {
  const version = constant('HARNI_NOTICE_VERSION');
  for (const page of [privacy(), cookies(), terms()]) {
    assert.match(page.body, new RegExp(`Version ${version}\\.`), page.title);
  }
});

test('the recorded marketing consent wording is exactly the sign-up checkbox label', () => {
  assert.equal(constant('HARNI_CONSENT_WORDING'), site.consentLine);
  const label = joinForm('test').match(/<label for="consent-test">([\s\S]*?)<\/label>/);
  assert.ok(label);
  assert.ok(text(label[1] ?? '').startsWith(site.consentLine));
});

test('the recorded contact acknowledgement is exactly the contact checkbox label', () => {
  const label = contact().body.match(/<label for="contact-acknowledgement">([\s\S]*?)<\/label>/);
  assert.ok(label);
  assert.equal(text(label[1] ?? ''), constant('HARNI_ACK_WORDING'));
});

test('the privacy notice explains how to complain to me (Data Protection Act 2018, section 164A)', () => {
  const body = privacy().body;
  assert.match(body, /<h2 id="complaints">/);
  assert.match(body, /acknowledge your complaint within 30 days/);
  assert.match(body, /href="\/contact\/"/);
});

test('the privacy and cookies notices disclose Cloudflare Network Error Logging, seen on the live site', () => {
  assert.match(privacy().body, /Connection error reports/);
  assert.match(cookies().body, /Network Error Logging/);
});

test('both form checkboxes start unticked', () => {
  assert.doesNotMatch(joinForm('test'), /name="consent"[^>]*checked/);
  assert.doesNotMatch(contact().body, /name="acknowledgement"[^>]*checked/);
});
