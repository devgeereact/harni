// Book cover images (ADR-023). These are the owner's real covers, saved from her Amazon listings
// into public/images/books at two sizes (400 and 800 pixels wide), so the site never loads an image
// from another site. They replace the designed stand-in covers of ADR-018.

import { esc } from './layout.ts';
import type { Book } from '../data/books.ts';

interface CoverOptions {
  /** Extra classes on the wrapper, for example `cover--hero`. */
  readonly extra?: string;
  /** Describe the cover. Leave empty when the page already shows the title beside it. */
  readonly alt?: string;
  /** The `sizes` hint, so the browser picks the 400 or the 800 pixel file. */
  readonly sizes?: string;
  /** True for a cover that is in the first screen, so it loads at once. */
  readonly eager?: boolean;
}

const defaultSizes = '(min-width: 48rem) 18vw, 44vw';

/** A cover with its spine and sheen drawn by CSS over the image. The files are about 5 by 8. */
export const cover = (book: Book, options: CoverOptions = {}): string => {
  const { extra = '', alt = '', sizes = defaultSizes, eager = false } = options;
  const base = `/images/books/${book.cover}`;
  const loading = eager ? 'eager' : 'lazy';
  const priority = eager ? ' fetchpriority="high"' : '';
  return `<span class="cover${extra ? ` ${extra}` : ''}"><img src="${base}-400.jpg" srcset="${base}-400.jpg 400w, ${base}-800.jpg 800w" sizes="${sizes}" width="400" height="640" alt="${esc(alt)}" loading="${loading}" decoding="async"${priority} /></span>`;
};

/** The text a page can use as the cover's alt text. */
export const coverAlt = (book: Book): string => `Cover of ${book.title} by Harni Muharami`;
