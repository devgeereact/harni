// Events (docs/01-product/CATALOGUE.md, ADR-024). The list is empty on purpose: no public event has
// been confirmed, and the site never invents one. To announce an event, add an entry here and run
// `npm run pages`. The Events page then lists it with its date, place and booking link, sorted by date.
// Past events move to "Past events" by themselves once their end date has passed.
//
// Relative imports carry the `.ts` extension because scripts/build-pages.ts runs this file in Node.

export type EventFormat = 'in-person' | 'online' | 'hybrid';

export interface EventItem {
  readonly slug: string;
  readonly title: string;
  /** ISO date or date and time of the start, for example `2026-11-20` or `2026-11-20T18:30`. */
  readonly start: string;
  /** ISO date or date and time of the end. Defaults to the start. */
  readonly end?: string;
  readonly format: EventFormat;
  /** Venue and town for an in-person event, or the platform name for an online one. */
  readonly place?: string;
  readonly organiser?: string;
  /** The organiser's own booking or information page. The site takes no bookings itself. */
  readonly url?: string;
  readonly summary: string;
  readonly cancelled?: boolean;
}

export const events: readonly EventItem[] = [];

const finishOf = (event: EventItem): number => new Date(event.end ?? event.start).getTime();

/** Events that have not finished yet, soonest first. `now` is a parameter so tests do not depend on the clock. */
export const upcomingEvents = (list: readonly EventItem[], now: number): readonly EventItem[] =>
  list
    .filter((event) => !event.cancelled && finishOf(event) >= now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

/** Events that have finished, most recent first. */
export const pastEvents = (list: readonly EventItem[], now: number): readonly EventItem[] =>
  list
    .filter((event) => !event.cancelled && finishOf(event) < now)
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

export const formatEventDate = (event: EventItem): string => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' };
  const timed = event.start.includes('T');
  const start = new Date(event.start);
  const day = new Intl.DateTimeFormat('en-GB', options).format(start);
  if (!timed) {
    if (event.end && event.end !== event.start) return `${day} to ${new Intl.DateTimeFormat('en-GB', options).format(new Date(event.end))}`;
    return day;
  }
  const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }).format(start);
  return `${day}, ${time}`;
};
