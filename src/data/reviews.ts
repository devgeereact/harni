// Reader words shown on the Reviews page (ADR-024). The list is empty on purpose.
//
// A quote may appear here only when the reader gave written permission to publish it on harni.uk,
// for that wording and that name. Private feedback is never permission (see the Terms). Amazon
// reviews are not copied: the page links to them instead, and shows no star rating of its own.
// To add one, fill every field, run `npm run pages` and keep the permission record.
//
// Relative imports carry the `.ts` extension because scripts/build-pages.ts runs this file in Node.

export interface ReviewQuote {
  readonly id: string;
  /** The exact words, as the reader agreed. */
  readonly quote: string;
  /** How the reader asked to be shown, for example "A staff nurse" or "Priya, ward manager". */
  readonly attribution: string;
  /** Slug of the book the words are about. */
  readonly bookSlug: string;
  /** ISO date the reader gave written permission. */
  readonly permissionDate: string;
  /** Where the permission is kept, for the owner's records only. It is never shown. */
  readonly permissionRecord: string;
}

export const reviewQuotes: readonly ReviewQuote[] = [];

/** The Amazon page where a reader can see the reviews for a book (the Kindle listing). */
export const amazonReviewsUrl = (amazonUrl: string): string => `${amazonUrl}#customerReviews`;

/** The Amazon page where a signed-in reader can write a review. */
export const amazonWriteReviewUrl = (amazonUrl: string): string => {
  const asin = /\/dp\/([A-Z0-9]{10})/.exec(amazonUrl)?.[1];
  return asin ? `https://www.amazon.co.uk/review/create-review?ie=UTF8&asin=${asin}` : amazonUrl;
};
