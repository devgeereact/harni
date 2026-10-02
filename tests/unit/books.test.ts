// BR-001 and BR-002 (docs/01-product/BUSINESS-RULES.md): which buy buttons a book may show, and the
// shape of the real catalogue (ADR-023).
// Run: npm test   (Node runs this .ts file directly, so there is no extra test dependency.)

import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';

import { amazonAuthorUrl, books, booksByGroup, formatDate, getBuyOptions, groups, relatedBooks } from '../../src/data/books.ts';
import type { Book } from '../../src/data/books.ts';

const AMAZON = 'https://www.amazon.co.uk/dp/EXAMPLE';
const PAPERBACK = 'https://www.amazon.co.uk/dp/EXAMPLEPB';
const CHECKOUT = 'https://checkout.example/ebook';

const make = (overrides: Partial<Book>): Book => ({
  slug: 'example',
  title: 'Example',
  subtitle: 'An example.',
  kdpTitle: 'EXAMPLE: An example.',
  hook: 'Example.',
  group: 'safe',
  status: 'live',
  inKdpSelect: false,
  kindleUnlimited: false,
  published: '2026-01-01',
  pages: 100,
  cover: 'example',
  blurb: ['Example.'],
  whoFor: 'Example.',
  ...overrides,
});

test('a book that is coming soon shows no buy button at all', () => {
  const book = make({ status: 'coming-soon', amazonUrl: AMAZON, paperbackUrl: PAPERBACK, ebookCheckoutUrl: CHECKOUT });
  assert.deepEqual(getBuyOptions(book), { amazon: null, paperback: null, ebook: null });
});

test('BR-001: a live book shows Amazon only when amazonUrl is set, and the paperback only when paperbackUrl is set', () => {
  assert.equal(getBuyOptions(make({ amazonUrl: AMAZON })).amazon, AMAZON);
  assert.equal(getBuyOptions(make({})).amazon, null);
  assert.equal(getBuyOptions(make({ amazonUrl: '' })).amazon, null);
  assert.equal(getBuyOptions(make({ paperbackUrl: PAPERBACK })).paperback, PAPERBACK);
  assert.equal(getBuyOptions(make({ paperbackUrl: '' })).paperback, null);
});

test('BR-002: the ebook button needs a checkout link and a book that is not in KDP Select', () => {
  assert.equal(getBuyOptions(make({ ebookCheckoutUrl: CHECKOUT, inKdpSelect: false })).ebook, CHECKOUT);
  assert.equal(getBuyOptions(make({ ebookCheckoutUrl: CHECKOUT, inKdpSelect: true })).ebook, null);
  assert.equal(getBuyOptions(make({ inKdpSelect: false })).ebook, null);
  assert.equal(getBuyOptions(make({ ebookCheckoutUrl: '', inKdpSelect: false })).ebook, null);
});

test('a book in KDP Select can still show Amazon but never the direct ebook button', () => {
  const book = make({ amazonUrl: AMAZON, paperbackUrl: PAPERBACK, ebookCheckoutUrl: CHECKOUT, inKdpSelect: true });
  assert.deepEqual(getBuyOptions(book), { amazon: AMAZON, paperback: PAPERBACK, ebook: null });
});

test('the catalogue: thirteen live books, unique slugs and ASINs, all in KDP Select, Amazon buttons only', () => {
  assert.equal(books.length, 13);
  assert.equal(new Set(books.map((b) => b.slug)).size, 13);
  const asins = books.flatMap((b) => [b.amazonUrl, b.paperbackUrl]);
  assert.equal(new Set(asins).size, 26);
  for (const book of books) {
    assert.equal(book.status, 'live', book.slug);
    assert.equal(book.inKdpSelect, true, book.slug);
    const buy = getBuyOptions(book);
    assert.ok(buy.amazon?.startsWith('https://www.amazon.co.uk/dp/'), book.slug);
    assert.ok(buy.paperback?.startsWith('https://www.amazon.co.uk/dp/'), book.slug);
    assert.equal(buy.ebook, null, book.slug);
    assert.ok(book.blurb.length > 0, book.slug);
  }
  assert.ok(amazonAuthorUrl.startsWith('https://www.amazon.co.uk/stores/author/'));
});

test('every book has both cover files on disk', () => {
  for (const book of books) {
    for (const size of [400, 800]) {
      assert.ok(existsSync(`public/images/books/${book.cover}-${size}.jpg`), `${book.slug} ${size}`);
    }
  }
});

test('the first book is the featured one and the other twelve fill three rows of four', () => {
  assert.equal(books.slice(1).length % 4, 0);
  assert.equal(books[0]?.slug, 'safe-by-design');
});

test('related books are four others, never the book itself, and wrap round the list', () => {
  for (const book of books) {
    const related = relatedBooks(book);
    assert.equal(related.length, 4, book.slug);
    assert.ok(related.every((r) => r.slug !== book.slug), book.slug);
  }
  const last = books[books.length - 1];
  assert.ok(last);
  assert.equal(relatedBooks(last)[0]?.slug, books[0]?.slug);
});

test('the four groups hold every book exactly once, in groups of 5, 2, 4 and 2', () => {
  assert.deepEqual(
    groups.map((g) => g.key),
    ['safe', 'career', 'wellbeing', 'life'],
  );
  assert.deepEqual(
    groups.map((g) => booksByGroup(g.key).length),
    [5, 2, 4, 2],
  );
  const grouped = groups.flatMap((g) => booksByGroup(g.key).map((b) => b.slug));
  assert.equal(new Set(grouped).size, books.length);
});

test('dates read in British style and do not depend on the machine', () => {
  assert.equal(formatDate('2026-02-05'), '5 February 2026');
  assert.equal(formatDate('2025-11-13'), '13 November 2025');
});
