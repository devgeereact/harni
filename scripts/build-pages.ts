// Writes generated HTML under .generated/pages from src/data and src/content, plus public/sitemap.xml.
//
//   npm run pages            (also runs automatically before `npm run dev` and `npm run build`)
//   npm run pages -- --list  (also lists every placeholder and owner check, page by page)
//
// Node runs this .ts file directly, so the imports below carry the .ts extension. The output
// is plain HTML that Vite then treats as ordinary multi-page input. It writes only to the
// project folder and to public/sitemap.xml. It never touches dist/ or the server.
//
// It also refuses to build (exit 1) when the data or the pages are wrong, so a mistake cannot
// reach dist/ quietly: duplicate slugs or titles, a missing or over-long description, a live
// book with no buy link or blurb, or a buy link that is not https.

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { books, getBook, getBuyOptions } from '../src/data/books.ts';
import { renderDocument } from '../src/content/layout.ts';
import type { PageDef } from '../src/content/layout.ts';
import * as legal from '../src/content/legal.ts';
import * as pages from '../src/content/pages.ts';
import { routes } from '../src/content/routes.ts';
import { site } from '../src/content/site.ts';
import { gameDocument } from '../src/features/game/GameDocument.tsx';
import { reactDocument } from './lib/react-document.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors: string[] = [];
const warnings: string[] = [];

const pageFor = (path: string): PageDef => {
  switch (path) {
    case '/':
      return pages.home();
    case '/books/':
      return pages.booksIndex();
    case '/about/':
      return pages.about();
    case '/contact/':
      return pages.contact();
    case '/join/':
      return pages.join();
    case '/thanks/':
      return pages.thanks();
    case '/events/':
      return pages.events();
    case '/reviews/':
      return pages.reviews();
    case '/privacy/':
      return legal.privacy();
    case '/cookies/':
      return legal.cookies();
    case '/terms/':
      return legal.terms();
    case '/delivery-and-refunds/':
      return legal.delivery();
    case '/404.html':
      return pages.notFound();
    default: {
      const slug = /^\/books\/([^/]+)\/$/.exec(path)?.[1];
      const book = slug ? getBook(slug) : undefined;
      if (!book) throw new Error(`No page is defined for ${path}`);
      return pages.bookPage(book);
    }
  }
};

const write = (file: string, content: string): void => {
  const target = join(root, file.startsWith('public/') ? file : join('.generated/pages', file));
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, 'utf8');
};

// --- Book data checks -----------------------------------------------------------------------

const slugs = new Set<string>();
for (const book of books) {
  if (slugs.has(book.slug)) errors.push(`Duplicate book slug: ${book.slug}`);
  slugs.add(book.slug);
  for (const size of [400, 800]) {
    if (!existsSync(join(root, 'public', 'images', 'books', `${book.cover}-${size}.jpg`))) {
      errors.push(`${book.slug}: missing cover file public/images/books/${book.cover}-${size}.jpg`);
    }
  }
  for (const url of [book.amazonUrl, book.paperbackUrl, book.ebookCheckoutUrl]) {
    if (url && !url.startsWith('https://')) errors.push(`${book.slug}: ${url} is not an https URL`);
  }
  if (book.status === 'live') {
    const { amazon, ebook } = getBuyOptions(book);
    if (!amazon && !ebook) errors.push(`${book.slug} is live but shows no buy button (check its links and inKdpSelect)`);
    if (book.blurb.length === 0) errors.push(`${book.slug} is live but has no blurb`);
  }
}

// --- Pages ----------------------------------------------------------------------------------

const titles = new Map<string, string>();
const flagged: { path: string; items: string[] }[] = [];
let written = 0;
let flagTotal = 0;

for (const route of routes) {
  if (!route.generated) continue;
  const page = pageFor(route.path);

  const duplicate = titles.get(page.title);
  if (duplicate) errors.push(`Duplicate title "${page.title}": ${duplicate} and ${route.path}`);
  titles.set(page.title, route.path);
  if (!page.description) errors.push(`${route.path}: missing description`);
  if (page.description.length > 160) errors.push(`${route.path}: description is ${page.description.length} characters (max 160)`);
  if (page.title.length > 70) warnings.push(`${route.path}: title is ${page.title.length} characters and may be cut in search results`);

  const { html, notes } = renderDocument(route.path, page);
  write(route.file, reactDocument(html));
  written += 1;

  const visible = [...html.matchAll(/\[(NEEDS|CHECK): ([^\]]+)\]/g)].map((m) => `${m[1] ?? ''}: ${m[2] ?? ''}`);
  const items = [...visible, ...notes];
  if (items.length > 0) {
    flagged.push({ path: route.path, items });
    flagTotal += items.length;
  }
}

write('play/index.html', reactDocument(gameDocument()));

// --- Sitemap --------------------------------------------------------------------------------

const indexable = routes.filter((route) => route.indexable);
const urls = indexable
  .map(
    (route) =>
      `  <url>\n    <loc>${site.origin}${route.path}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${route.priority.toFixed(1)}</priority>\n  </url>\n`,
  )
  .join('');
write('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}</urlset>\n`);

// --- Report ---------------------------------------------------------------------------------

for (const warning of warnings) console.warn(`warning: ${warning}`);
if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error}`);
  console.error(`pages: ${errors.length} error(s). Fix them and run npm run pages again.`);
  process.exit(1);
}

console.log(`pages: wrote ${written + 1} pages into .generated/pages and public/sitemap.xml (${indexable.length} URLs)`);
console.log(
  `owner items left: ${flagTotal + site.ownerChecks.length} (${flagTotal} [NEEDS] or [CHECK] flags on ${flagged.length} pages, plus ${site.ownerChecks.length} site-wide checks)`,
);
if (process.argv.includes('--list')) {
  for (const check of site.ownerChecks) console.log(`  site-wide  ${check}`);
  for (const { path, items } of flagged) {
    console.log(`  ${path}`);
    for (const item of items) console.log(`      ${item}`);
  }
}
