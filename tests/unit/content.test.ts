// Events, reviews and the Amazon links (ADR-024). The lists are empty on purpose, so the rules are
// tested with synthetic entries. Run: npm test

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { books } from '../../src/data/books.ts';
import { events, formatEventDate, pastEvents, upcomingEvents } from '../../src/data/events.ts';
import type { EventItem } from '../../src/data/events.ts';
import { amazonReviewsUrl, amazonWriteReviewUrl, reviewQuotes } from '../../src/data/reviews.ts';

const make = (overrides: Partial<EventItem>): EventItem => ({
  slug: 'example',
  title: 'Example',
  start: '2026-11-20T18:30',
  format: 'online',
  summary: 'Example.',
  ...overrides,
});

const NOW = new Date('2026-10-01T12:00:00Z').getTime();

test('no event or review is published until the owner confirms one', () => {
  assert.equal(events.length, 0);
  assert.equal(reviewQuotes.length, 0);
});

test('upcoming events are soonest first, past events most recent first, cancelled events never show', () => {
  const list = [
    make({ slug: 'b', start: '2026-12-01' }),
    make({ slug: 'a', start: '2026-11-01' }),
    make({ slug: 'old', start: '2026-09-01' }),
    make({ slug: 'older', start: '2026-08-01' }),
    make({ slug: 'cancelled', start: '2026-11-15', cancelled: true }),
  ];
  assert.deepEqual(upcomingEvents(list, NOW).map((e) => e.slug), ['a', 'b']);
  assert.deepEqual(pastEvents(list, NOW).map((e) => e.slug), ['old', 'older']);
});

test('an event is still upcoming until its end date has passed', () => {
  const running = make({ slug: 'running', start: '2026-09-30', end: '2026-10-02' });
  assert.deepEqual(upcomingEvents([running], NOW).map((e) => e.slug), ['running']);
  assert.deepEqual(pastEvents([running], NOW), []);
});

test('event dates read in British style, with the time only when there is one', () => {
  assert.equal(formatEventDate(make({ start: '2026-11-20' })), '20 November 2026');
  assert.equal(formatEventDate(make({ start: '2026-11-20', end: '2026-11-22' })), '20 November 2026 to 22 November 2026');
  assert.equal(formatEventDate(make({ start: '2026-11-20T18:30' })), '20 November 2026, 18:30');
});

test('every book has a read-reviews link and a write-a-review link on Amazon.co.uk', () => {
  for (const book of books) {
    assert.ok(book.amazonUrl, book.slug);
    assert.ok(amazonReviewsUrl(book.amazonUrl).endsWith('#customerReviews'), book.slug);
    const write = amazonWriteReviewUrl(book.amazonUrl);
    const asin = /\/dp\/([A-Z0-9]{10})/.exec(book.amazonUrl)?.[1];
    assert.ok(asin, book.slug);
    assert.equal(write, `https://www.amazon.co.uk/review/create-review?ie=UTF8&asin=${asin}`);
  }
});
