// Every page on the site. The generator (scripts/build-pages.ts), the Vite config and the
// sitemap all read this list, so a page is added in one place. This list is the single source
// for every page. ADR-014 set the first page set; later ADRs added the book pages, Pier Run
// and the legal pages.

import { books } from '../data/books.ts';

export interface Route {
  readonly path: string;
  readonly file: string;
  /** Unique key for Vite's multi-page `input` map. */
  readonly key: string;
  /** False for /play/ only: the page loop in scripts/build-pages.ts skips it and builds it from the game document. */
  readonly generated: boolean;
  /** False keeps the page out of sitemap.xml and adds noindex (BR-007). */
  readonly indexable: boolean;
  readonly priority: number;
}

const fileFor = (path: string): string => (path.endsWith('/') ? `${path.slice(1)}index.html` : path.slice(1));

const keyFor = (file: string): string => {
  const key = file
    .replace(/(^|\/)index\.html$/, '')
    .replace(/\.html$/, '')
    .replace(/\//g, '-');
  return key === '' ? 'home' : key;
};

const route = (path: string, priority: number, options: { generated?: boolean; indexable?: boolean } = {}): Route => {
  const file = fileFor(path);
  return {
    path,
    file,
    key: keyFor(file),
    generated: options.generated ?? true,
    indexable: options.indexable ?? true,
    priority,
  };
};

export const routes: readonly Route[] = [
  route('/', 1.0),
  route('/books/', 0.9),
  ...books.map((book) => route(`/books/${book.slug}/`, 0.8)),
  route('/about/', 0.6),
  route('/contact/', 0.5),
  route('/join/', 0.6),
  route('/events/', 0.4),
  route('/reviews/', 0.4),
  route('/play/', 0.3, { generated: false }),
  route('/privacy/', 0.2),
  route('/cookies/', 0.2),
  route('/terms/', 0.2),
  route('/delivery-and-refunds/', 0.2),
  route('/404.html', 0, { indexable: false }),
];
