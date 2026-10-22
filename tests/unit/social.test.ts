// Share-card images and llms.txt (KNOWN-ISSUES rows 11 and 26). Run: npm test

import assert from 'node:assert/strict';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import { books } from '../../src/data/books.ts';
import { renderDocument } from '../../src/content/layout.ts';
import { llmsText } from '../../src/content/llms.ts';
import { routes } from '../../src/content/routes.ts';
import { site } from '../../src/content/site.ts';
import { siteSocialImage, socialImageFor } from '../../src/content/social.ts';

const root = fileURLToPath(new URL('../../', import.meta.url));

test('every share image is on harni.uk and its stated size matches the real file', async () => {
  const images = [siteSocialImage, ...books.map((book) => socialImageFor(`/books/${book.slug}/`))];
  for (const image of images) {
    assert.ok(image.url.startsWith(`${site.origin}/`), image.url);
    const meta = await sharp(join(root, 'public', image.url.slice(site.origin.length))).metadata();
    assert.equal(meta.width, image.width, image.url);
    assert.equal(meta.height, image.height, image.url);
  }
});

test('book pages use their own cover and other pages use the site image', () => {
  for (const book of books) assert.match(socialImageFor(`/books/${book.slug}/`).url, new RegExp(`/images/books/${book.cover}-800\\.jpg$`));
  assert.equal(socialImageFor('/books/').url, siteSocialImage.url);
  assert.equal(socialImageFor('/').url, siteSocialImage.url);
});

test('rendered head carries og:image, og:url equal to canonical and Twitter tags', () => {
  const html = renderDocument('/books/the-triage-mindset/', { title: 'T', description: 'D', body: '<h1>T</h1>' }).html;
  assert.match(html, /<link rel="canonical" href="https:\/\/harni\.uk\/books\/the-triage-mindset\/" \/>/);
  assert.match(html, /<meta property="og:url" content="https:\/\/harni\.uk\/books\/the-triage-mindset\/" \/>/);
  assert.match(html, /<meta property="og:image" content="https:\/\/harni\.uk\/images\/books\/triage-mindset-800\.jpg" \/>/);
  assert.match(html, /<meta property="og:image:alt" content="Cover of The Triage Mindset by Harni Muharami" \/>/);
  assert.match(html, /<meta name="twitter:image" content="https:\/\/harni\.uk\//);
  assert.doesNotMatch(html, /https?:\/\/(?!harni\.uk)[^"]+\.(?:jpg|png|webp|js)/);
});

test('llms.txt links every indexable page it names and all 13 books, with no off-site links', () => {
  const text = llmsText();
  assert.match(text, /^# Harni Muharami\n/);
  for (const book of books) assert.ok(text.includes(`(${site.origin}/books/${book.slug}/)`), book.slug);
  const indexable = new Set(routes.filter((route) => route.indexable).map((route) => `${site.origin}${route.path}`));
  for (const [, url] of text.matchAll(/\]\((https:[^)]+)\)/g)) {
    assert.ok(url === `${site.origin}/sitemap.xml` || indexable.has(url ?? ''), `${url} is not an indexable page`);
  }
});
