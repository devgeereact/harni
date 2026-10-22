// The image a link preview shows when a page is shared (Open Graph and Twitter cards).
// Book pages show that book's 800 pixel cover. Every other page shows the author photo, which the
// About page and the home page structured data already use. All files are on harni.uk, so a share
// card never loads anything from another site. tests/unit/social.test.ts checks the sizes below
// against the real files.

import { getBook } from '../data/books.ts';
import { site } from './site.ts';

export interface SocialImage {
  /** Absolute https URL on harni.uk. */
  readonly url: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

/** Most covers are 800 by 1276. List any cover with a different height here. */
const coverHeights: Readonly<Record<string, number>> = { 'honest-truth': 1070 };
const coverWidth = 800;
const defaultCoverHeight = 1276;

export const coverSocialImage = (cover: string, title: string): SocialImage => ({
  url: `${site.origin}/images/books/${cover}-800.jpg`,
  width: coverWidth,
  height: coverHeights[cover] ?? defaultCoverHeight,
  alt: `Cover of ${title} by ${site.name}`,
});

export const siteSocialImage: SocialImage = {
  url: `${site.origin}/images/author/harni-600.jpg`,
  width: 600,
  height: 600,
  alt: site.name,
};

/** The share image for a route path, for example `/books/the-triage-mindset/`. */
export const socialImageFor = (path: string): SocialImage => {
  const slug = /^\/books\/([^/]+)\/$/.exec(path)?.[1];
  const book = slug ? getBook(slug) : undefined;
  return book ? coverSocialImage(book.cover, book.title) : siteSocialImage;
};
