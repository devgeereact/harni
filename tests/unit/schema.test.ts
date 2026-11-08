// Structured data (JSON-LD) for search engines and AI answers. Only facts already shown on the
// page: no ISBNs (not supplied), no prices (BR-003), no ratings or reviews (none are shown). Run: npm test

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { books } from '../../src/data/books.ts';
import { about, bookPage, home } from '../../src/content/pages.ts';
import { site } from '../../src/content/site.ts';

const personId = `${site.origin}/about/#person`;

/** Every JSON-LD block in a page body, parsed. */
const jsonLd = (body: string): Record<string, unknown>[] =>
  [...body.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1] ?? ''));

const ofType = (blocks: Record<string, unknown>[], type: string): Record<string, unknown> | undefined =>
  blocks.find((b) => b['@type'] === type);

test('every book page carries a Book entity built from the page facts', () => {
  for (const book of books) {
    const node = ofType(jsonLd(bookPage(book).body), 'Book');
    assert.ok(node, book.slug);
    assert.equal(node['@context'], 'https://schema.org');
    assert.equal(node['@id'], `${site.origin}/books/${book.slug}/#book`);
    assert.equal(node.name, book.title);
    assert.equal(node.alternativeHeadline, book.subtitle);
    assert.equal(node.url, `${site.origin}/books/${book.slug}/`);
    assert.equal(node.image, `${site.origin}/images/books/${book.cover}-800.jpg`);
    assert.equal(node.numberOfPages, book.pages);
    assert.equal(node.datePublished, book.published);
    assert.equal(node.inLanguage, 'en-GB');
    assert.deepEqual(node.author, { '@id': personId });
  }
});

test('book editions link to Amazon and carry no invented ISBN, price or rating', () => {
  for (const book of books) {
    const node = ofType(jsonLd(bookPage(book).body), 'Book');
    assert.ok(node);
    const editions = node.workExample as Record<string, unknown>[];
    const formats = editions.map((e) => e.bookFormat);
    if (book.amazonUrl) assert.ok(formats.includes('https://schema.org/EBook'), book.slug);
    if (book.paperbackUrl) assert.ok(formats.includes('https://schema.org/Paperback'), book.slug);
    const text = JSON.stringify(node);
    for (const banned of ['isbn', 'offers', 'price', 'aggregateRating', 'review']) assert.ok(!text.includes(`"${banned}`), `${book.slug}: ${banned}`);
  }
});

test('book pages carry a breadcrumb: Home, Books, the book', () => {
  const book = books[0];
  assert.ok(book);
  const crumbs = ofType(jsonLd(bookPage(book).body), 'BreadcrumbList');
  assert.ok(crumbs);
  const items = crumbs.itemListElement as { position: number; name: string; item: string }[];
  assert.deepEqual(items.map((i) => [i.position, i.name, i.item]), [
    [1, 'Home', `${site.origin}/`],
    [2, 'Books', `${site.origin}/books/`],
    [3, book.title, `${site.origin}/books/${book.slug}/`],
  ]);
});

test('the home page names the site and points to the author', () => {
  const node = ofType(jsonLd(home().body), 'WebSite');
  assert.ok(node);
  assert.equal(node.url, `${site.origin}/`);
  assert.equal(node.name, site.name);
  assert.equal(node.inLanguage, 'en-GB');
  assert.deepEqual(node.publisher, { '@id': personId });
});

test('the About page is a ProfilePage whose main entity is the author with a stable id', () => {
  const node = ofType(jsonLd(about().body), 'ProfilePage');
  assert.ok(node);
  const person = node.mainEntity as Record<string, unknown>;
  assert.equal(person['@type'], 'Person');
  assert.equal(person['@id'], personId);
  assert.equal(person.name, site.name);
  assert.ok((person.sameAs as string[]).length >= 1);
});
