// Structured data (JSON-LD) for search engines and AI answers. It restates facts already on the
// page and adds no new claims: no ISBNs (not supplied by the owner), no prices (BR-003), and no
// ratings or reviews (none are shown, ADR-023). The author has one stable id so every page points
// at the same person.

import type { Book } from '../data/books.ts';
import { amazonAuthorUrl } from '../data/books.ts';
import { site } from './site.ts';

const context = 'https://schema.org';
export const personId = `${site.origin}/about/#person`;
const author = { '@id': personId } as const;

/** One JSON-LD script element. `<` is escaped so page text can never close the element. */
export const jsonLdScript = (data: object): string =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

export const personSchema = () => ({
  '@type': 'Person',
  '@id': personId,
  name: site.name,
  url: `${site.origin}/about/`,
  image: `${site.origin}/images/author/harni-600.jpg`,
  jobTitle: 'NHS nurse, clinical educator and author',
  description: site.shortBio,
  address: { '@type': 'PostalAddress', addressLocality: 'London', addressCountry: 'GB' },
  sameAs: [amazonAuthorUrl, site.instagram.url, site.tiktok.url],
});

export const profilePageSchema = () => ({
  '@context': context,
  '@type': 'ProfilePage',
  url: `${site.origin}/about/`,
  mainEntity: personSchema(),
});

export const websiteSchema = () => ({
  '@context': context,
  '@type': 'WebSite',
  '@id': `${site.origin}/#website`,
  url: `${site.origin}/`,
  name: site.name,
  inLanguage: 'en-GB',
  publisher: author,
});

export const bookSchema = (book: Book) => {
  const url = `${site.origin}/books/${book.slug}/`;
  const editions = [
    book.amazonUrl ? { '@type': 'Book', bookFormat: 'https://schema.org/EBook', url: book.amazonUrl } : null,
    book.paperbackUrl ? { '@type': 'Book', bookFormat: 'https://schema.org/Paperback', url: book.paperbackUrl } : null,
  ].filter((edition) => edition !== null);
  return {
    '@context': context,
    '@type': 'Book',
    '@id': `${url}#book`,
    name: book.title,
    alternativeHeadline: book.subtitle,
    url,
    image: `${site.origin}/images/books/${book.cover}-800.jpg`,
    description: book.hook,
    author,
    inLanguage: 'en-GB',
    numberOfPages: book.pages,
    datePublished: book.published,
    workExample: editions,
  };
};

export const bookBreadcrumbSchema = (book: Book) => ({
  '@context': context,
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` },
    { '@type': 'ListItem', position: 2, name: 'Books', item: `${site.origin}/books/` },
    { '@type': 'ListItem', position: 3, name: book.title, item: `${site.origin}/books/${book.slug}/` },
  ],
});
