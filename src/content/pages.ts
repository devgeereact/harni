// Page words and structure for the non-legal pages. The book words come from the owner's own Amazon
// listings (src/data/books.ts, ADR-023). The About words are her Amazon author bio, turned into the
// first person. Missing facts are shown as [NEEDS: ...] boxes, never invented. No prices appear
// anywhere (BR-003).
// Look and feel: ADR-020. The labels added for the design (the reader paths, the credential strip)
// only sort or restate facts the owner supplied.

import { amazonAuthorUrl, books, booksByGroup, formatDate, getBuyOptions, groupName, groups, relatedBooks } from '../data/books.ts';
import type { Book, Group } from '../data/books.ts';
import { cover, coverAlt } from './covers.ts';
import { amazonReviewsUrl, amazonWriteReviewUrl, reviewQuotes } from '../data/reviews.ts';
import { events as eventList, formatEventDate, pastEvents, upcomingEvents } from '../data/events.ts';
import type { EventItem } from '../data/events.ts';
import { arrow, band, button, esc, joinForm, needs, socialItems, statusLabel } from './layout.ts';
import type { PageDef } from './layout.ts';
import { site } from './site.ts';

const newTabNote = '<span class="visually-hidden"> (opens in a new tab)</span>';

/** A button-styled link to Amazon. Opens in a new tab so the visitor keeps this site open. */
const amazonButton = (label: string, href: string, kind: '' | 'outline' = ''): string =>
  `<a class="btn${kind ? ` btn--${kind}` : ''}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label}${newTabNote}${arrow}</a>`;

const bookCard = (book: Book): string => `
<article class="card" data-group="${book.group}" data-reveal>
  ${cover(book)}
  <p class="card__meta"><span class="tag">${esc(book.status === 'live' ? groupName(book.group) : statusLabel(book))}</span></p>
  <h3 class="card__title"><a class="card__link" href="/books/${book.slug}/">${esc(book.title)}</a></h3>
  <p class="card__hook">${esc(book.hook)}</p>
  <p class="card__cta" aria-hidden="true">View book ${arrow}</p>
</article>`;

const cardGrid = (list: readonly Book[]): string => `<div class="grid">${list.map(bookCard).join('')}</div>`;

/** The "These books are for you if you want to" list, grouped under the reader paths. */
const wants: Readonly<Record<Group, readonly string[]>> = {
  safe: ['reduce incivility and violence on the ward', 'start every shift with control', 'prioritise when the NHS is stretched', 'plan a safe discharge'],
  career: ['plan your next step across NHS bands', 'speak up with confidence', 'raise concerns professionally'],
  wellbeing: ['understand emotional labour', 'recover after a shift', 'face moral distress', 'read an honest account of nursing'],
  life: ['practise gratitude over 21 days', 'reconnect with your partner over 30 days'],
};

const pathCards = (): string =>
  `<div class="paths">${groups
    .map((g) => {
      const count = booksByGroup(g.key).length;
      return `
  <a class="path" href="/books/#${g.key}" data-reveal>
    <span class="path__no">${g.number}</span>
    <span class="path__name">${esc(g.name)}</span>
    <ul class="path__list" role="list">${wants[g.key].map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
    <span class="path__go">${count} ${count === 1 ? 'book' : 'books'} ${arrow}</span>
  </a>`;
    })
    .join('')}</div>`;

const joinButton = (label = 'Join the list'): string => `<p class="actions">${button(label, '/join/')}</p>`;

const bySlug = (slug: string): Book | undefined => books.find((b) => b.slug === slug);

export const home = (): PageDef => {
  const featured = books.slice(0, 4);
  const left = bySlug('honest-truth-about-nurses');
  const centre = bySlug('safe-by-design');
  const right = bySlug('your-next-step-in-nursing');
  const fan =
    left && centre && right
      ? `${cover(left, { extra: 'cover--fan cover--fan-l', eager: true, sizes: '12rem' })}${cover(right, { extra: 'cover--fan cover--fan-r', eager: true, sizes: '12rem' })}${cover(centre, { extra: 'cover--fan cover--fan-c', eager: true, sizes: '14rem' })}`
      : '';
  return {
    title: 'Harni Muharami | Books for NHS nurses and healthcare professionals',
    description:
      'Practical, evidence-based books by Harni Muharami, an NHS nurse and clinical educator in London, on safe practice, careers, speaking up and wellbeing.',
    body: `
<section class="hero page-heading page-heading--split">
  <div class="shell hero__inner">
    <div class="hero__text">
      <p class="eyebrow">${esc(site.oneLiner)}</p>
      <h1 class="hero__title">Books for the<br />people who care.</h1>
      <p class="lede">${books.length} practical, evidence-based books for NHS nurses and healthcare professionals, covering safe practice, careers, speaking up and wellbeing.</p>
      <p class="actions">${button('See the books', '/books/')}</p>
    </div>
    <div class="hero__art" aria-hidden="true">${fan}</div>
  </div>
</section>

<section class="creds" aria-label="About the author in brief">
  <div class="shell">
    <dl class="creds__list">
      <div><dt>NHS</dt><dd>Nurse and clinical educator</dd></div>
      <div><dt>Leads</dt><dd>A health training hub</dd></div>
      <div><dt>Qualified</dt><dd>BSc and MSc in Management and Leadership in Health</dd></div>
      <div><dt>Studying</dt><dd>A PhD, currently under way</dd></div>
    </dl>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="head" data-reveal>
      <p class="eyebrow eyebrow--paper">Four ways in</p>
      <h2>These books are for you if you want to</h2>
    </div>
    ${pathCards()}
  </div>
</section>

<section class="section section--alt">
  <div class="shell">
    <div class="head" data-reveal>
      <p class="eyebrow eyebrow--paper">Most popular</p>
      <h2>Featured books</h2>
    </div>
    ${cardGrid(featured)}
    <p class="actions">${button('See all the books', '/books/', 'outline')}</p>
  </div>
</section>

<section class="section">
  <div class="shell split">
    <div class="prose" data-reveal>
      <p class="eyebrow eyebrow--paper">The author</p>
      <h2>About Harni</h2>
      <p>I'm an NHS nurse and clinical educator in London. I've worked in non-clinical roles, ward nursing and the emergency department. I lead a health training hub and mentor fellow nurses. I believe wellbeing and speaking up are professional skills anyone can learn.</p>
      <p>${button('More about Harni', '/about/', 'outline')}</p>
    </div>
    <figure class="author-photo" data-reveal><img src="/images/author/harni-600.jpg" width="600" height="600" alt="Harni Muharami" loading="lazy" decoding="async" /></figure>
  </div>
</section>

<section class="section section--alt">
  <div class="shell">
    <div class="join-card" data-reveal>
      <div>
        <p class="eyebrow">Newsletter</p>
        <h2>Join the list</h2>
        <p class="lede">${esc(site.joinPromise)}</p>
      </div>
      <div>${joinForm('home')}</div>
    </div>
  </div>
</section>`,
  };
};

/** The large "Most popular" row at the top of the Books page. */
const featureRow = (book: Book): string => {
  return `
<article class="feature" data-group="${book.group}" data-reveal>
  <a class="feature__cover" href="/books/${book.slug}/" tabindex="-1" aria-hidden="true">${cover(book, { sizes: '(min-width: 48rem) 18rem, 70vw', eager: true })}</a>
  <div class="feature__text">
    <p class="eyebrow">Most popular on Amazon</p>
    <h2><a href="/books/${book.slug}/">${esc(book.title)}</a></h2>
    <p class="feature__sub">${esc(book.subtitle)}</p>
    <p>${esc(book.blurb[1] ?? book.hook)}</p>
    <p class="actions">${button(`Read more<span class="visually-hidden"> about ${esc(book.title)}</span>`, `/books/${book.slug}/`, 'outline')}</p>
  </div>
</article>`;
};

export const booksIndex = (): PageDef => {
  const [first, ...rest] = books;
  return {
    title: 'Books by Harni Muharami',
    // Follows the data, so the snippet stays true when a book is added.
    description: books.every((b) => b.status === 'live')
      ? `${books.length} practical books by Harni Muharami for NHS nurses and healthcare professionals. Read more and choose where to buy.`
      : `Practical books by Harni Muharami for NHS nurses and healthcare professionals. Some are coming soon. Join the list to hear first.`,
    body: `
${band(
  'The books',
  'Books',
  `
    <p class="lede">Practical, evidence-based books for NHS nurses and healthcare professionals, and two for everyday life.</p>
    <p class="small">Every book is on Amazon as a Kindle ebook and a paperback. ${esc(site.healthNote)}</p>
    <p class="actions"><a href="${amazonAuthorUrl}" target="_blank" rel="noopener noreferrer">Find the collection on Amazon${newTabNote}</a></p>`,
)}
<section class="section">
  <div class="shell">
    <div class="chips" role="group" aria-label="Show one group of books">
      ${groups.map((g) => `<button type="button" class="chip" id="${g.key}" data-group="${g.key}" data-blurb="${esc(g.blurb)}" aria-pressed="false"><span>${g.number}</span> ${esc(g.name)}</button>`).join('')}
    </div>
    <p class="chips__note" role="status" data-chips-note>${esc(`All ${books.length} books are shown.`)}</p>
    ${first ? featureRow(first) : ''}
    <h2 class="visually-hidden">More books</h2>
    ${cardGrid(rest)}
    <p class="closing">Pick a book above to read more.</p>
  </div>
</section>`,
  };
};

const buyBlock = (book: Book): string => {
  if (book.status !== 'live') {
    return `<p>This book is coming soon. Join the list and I'll email you when it is out.</p>${joinButton()}`;
  }
  const { amazon, paperback, ebook } = getBuyOptions(book);
  const buttons = [
    amazon ? amazonButton('Buy on Amazon', amazon) : '',
    paperback ? amazonButton('Get the paperback', paperback, 'outline') : '',
    ebook ? `<a class="btn btn--outline" href="${esc(ebook)}" rel="noopener">Buy ebook here${arrow}</a>` : '',
  ].join('');
  return buttons ? `<p class="actions">${buttons}</p>` : needs('Amazon link or checkout link for this live book');
};

export const bookPage = (book: Book): PageDef => {
  const related = relatedBooks(book);
  const { amazon } = getBuyOptions(book);
  return {
    title: `${book.title} | ${site.name}`,
    description:
      book.status === 'live'
        ? `${book.title} by ${site.name}. ${book.hook} Read more and choose where to buy.`
        : `${book.title} by ${site.name}. Coming soon. Join the list to hear when it is out.`,
    body: `
<section class="band band--book page-heading page-heading--book">
  <div class="shell book-head">
    <div class="book-head__cover">${cover(book, { extra: 'cover--hero', alt: coverAlt(book), sizes: '(min-width: 48rem) 15rem, 13rem', eager: true })}</div>
    <div class="book-head__text">
      <p class="eyebrow">${esc(groupName(book.group))}</p>
      <h1>${esc(book.title)}</h1>
      <p class="lede book-head__sub">${esc(book.subtitle)}</p>
      <p class="byline">by ${site.name}</p>
      <p class="book-head__meta">${book.status === 'live' ? `<span class="tag">Published ${formatDate(book.published)}</span>` : `<span class="tag">${statusLabel(book)}</span>`}${book.kindleUnlimited ? '<span class="tag">Kindle Unlimited</span>' : ''}<span class="tag">${book.pages} pages</span></p>
      ${buyBlock(book)}
    </div>
  </div>
</section>

<section class="section">
  <div class="shell book-body">
    <div class="prose">
      <h2>About this book</h2>
      ${book.blurb.map((p) => `<p>${esc(p)}</p>`).join('\n      ')}
      <h2>Who it's for</h2>
      <p>${esc(book.whoFor)}</p>
      ${amazon ? `<p>The full description and the contents list are on <a href="${esc(amazon)}" target="_blank" rel="noopener noreferrer">the Amazon page${newTabNote}</a>.</p>` : ''}
      <p class="note">${esc(site.adviceNote)}</p>
    </div>
    <aside class="author-box" aria-labelledby="author-box-title">
      <p class="eyebrow eyebrow--paper">The author</p>
      <h2 id="author-box-title">About the author</h2>
      <p>${esc(site.shortBio)}</p>
      <p><a href="/about/">More about Harni</a></p>
    </aside>
  </div>
</section>

<section class="section section--alt">
  <div class="shell">
    <div class="head" data-reveal>
      <p class="eyebrow eyebrow--paper">Keep reading</p>
      <h2>More books</h2>
    </div>
    ${cardGrid(related)}
    <p class="actions"><a href="/books/">Back to all books</a></p>
  </div>
</section>`,
  };
};

const faqs: readonly (readonly [string, string])[] = [
  ['Where can I buy the books?', `On Amazon.co.uk, as a Kindle ebook or a paperback. harni.uk does not sell books or take payment: every buy button opens the book’s Amazon page in a new tab. All ${books.length} books are also in Kindle Unlimited, subject to Amazon’s terms.`],
  ['Who are the books written for?', 'Most are written for NHS nurses and other UK healthcare professionals, from students and newly qualified nurses to ward leaders. Two books, Gratitude Reimagined and The 30-Day Relationship Reboot, are for anyone. Each book page has a “Who it’s for” section.'],
  ['Are the books medical advice?', 'No. They offer general guidance and reflection, not individual clinical, medical or legal advice, and they are not official NHS guidance. Always use current authoritative guidance, your local policies and your own professional judgement.'],
  ['Do you speak at events or run sessions?', 'Event details are listed on the Events page when they are confirmed. If you are planning a book discussion, a nursing community event or an education session, you are welcome to send an outline through the contact page. An enquiry is not a booking.'],
  ['How can I hear about new books?', 'Join the list and I’ll email you when a new book comes out. You will get a copy of your sign-up, and you can unsubscribe at any time.'],
  ['How do I reach you?', 'Use the contact page. You will receive a copy of your message by email for your records. For an Amazon order, please contact Amazon.'],
  ['Do you write on behalf of the NHS or your employer?', `No. ${site.personalCapacity} The NHS name is used only to describe where I work and who my books are for.`],
];

export const about = (): PageDef => ({
  title: 'About Harni Muharami | NHS Nurse, Educator and Author',
  description: 'Meet Harni Muharami, a London-based NHS nurse, clinical educator and author. Her background, her books, who they are for, FAQs and press bio.',
  body: `
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: `${site.origin}/about/`,
    image: `${site.origin}/images/author/harni-600.jpg`,
    jobTitle: 'NHS nurse, clinical educator and author',
    description: site.shortBio,
    address: { '@type': 'PostalAddress', addressLocality: 'London', addressCountry: 'GB' },
    sameAs: [amazonAuthorUrl, site.instagram.url, site.tiktok.url],
  }).replace(/</g, '\\u003c')}</script>
<div class="author-page">
  <section class="shell author-hero page-heading page-heading--split" aria-labelledby="about-title">
    <div class="author-hero__copy"><p class="eyebrow">Meet the author</p><h1 id="about-title">Harni<br />Muharami</h1><p class="author-role">NHS nurse · Clinical educator · Author</p><p class="author-lead">Care is at the heart of my work.<br />And at the heart of my writing.</p><p>Based in London, I write about nursing, professional growth and the everyday work of caring for ourselves and others.</p><a class="author-link" href="#background">Discover my story <span aria-hidden="true">↓</span></a></div>
    <figure class="author-portrait"><img src="/images/author/harni-600.jpg" width="600" height="600" alt="Harni Muharami" loading="eager" fetchpriority="high" decoding="async" /><figcaption>Practice. Education. Words that help.</figcaption></figure>
  </section>
  <section class="author-background" id="background" aria-labelledby="background-title"><div class="shell author-background__grid">
    <header><p class="eyebrow">My professional background</p><h2 id="background-title">Experience that<br />informs every page.</h2></header>
    <div class="author-story"><p class="author-lead">My career has taken me from non-clinical roles to ward nursing, the emergency department and clinical education.</p><p>Working across these settings has shaped how I understand care: the decisions made under pressure, the relationships within a team and the support people need to do their work well.</p><p>Today, I lead a health training hub, supporting workforce education and practice improvement. Mentoring nurses and helping colleagues develop their careers remain central to my work.</p><dl class="author-credentials"><div><dt>Education</dt><dd>Bachelor of Science<br />MSc in Management and Leadership in Health</dd></div><div><dt>Continuing development</dt><dd>Currently undertaking PhD studies</dd></div></dl></div>
  </div></section>
  <section class="shell author-writing" aria-labelledby="writing-title"><header><p class="eyebrow">Why I write</p><h2 id="writing-title">Practical insight.<br />A human perspective.</h2></header><div class="author-writing__body"><p>My books make space for both the practical and personal sides of nursing. They explore safe care, speaking up, career development and the emotional demands of working in healthcare.</p><p>I write for students finding their feet, nurses building confidence and colleagues supporting others. Beyond healthcare, my books on gratitude and relationships invite readers to reflect on their own everyday lives.</p><p>Each book has a clear audience and focus, so you can choose the one that fits your interests and stage of life.</p></div>
    <div class="author-shelf">${books.slice(0, 3).map(book => `<a href="/books/${book.slug}/" class="author-book">${cover(book, { sizes: '(min-width: 48rem) 180px, 26vw' })}<span>${esc(book.title)}</span></a>`).join('')}</div>
    <p class="author-catalogue">${books.length} books on nursing, wellbeing and personal growth. <a href="/books/">Explore the collection ${arrow}</a></p>
  </section>
  <section class="author-questions" aria-labelledby="questions-title"><div class="shell"><header><p class="eyebrow">A little more information</p><h2 id="questions-title">Before you turn the page.</h2></header><div class="faq">${faqs.slice(0, 4).map(([question, answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join('')}</div></div></section>
  <section class="shell author-contact" aria-labelledby="author-contact-title"><div><p class="eyebrow">Readers & organisers</p><h2 id="author-contact-title">Let’s start a conversation.</h2><p>For book enquiries, reader feedback or an invitation to discuss an event, I’d be pleased to hear from you.</p><details class="author-bio"><summary>Author biography for organisers and press</summary><p>${esc(site.shortBio)}</p></details></div>${button('Contact Harni', '/contact/')}</section>
  <div class="shell author-disclaimer"><p>${esc(site.personalCapacity)} My books offer general educational guidance. They do not replace professional judgement, current clinical guidance or local policies.</p></div>
</div>`,
});

const iconMail =
  '<svg class="icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';

/**
 * The contact section follows the 21st.dev "contact-with-globe" block exactly: two columns, contact
 * links and a globe on the left, a "Send a message" card on the right. Only the page header above it
 * is this site's own band. The original static content is rendered and hydrated by React (ADR-026).
 */
const messageForm = (): string => `
<div class="contact-card" data-contact data-reveal style="--reveal-delay:150ms">
  <div class="contact-card__head">
    <h2>Send a message</h2>
    <p>I'd love to hear from you. You'll receive a copy of your message by email.</p>
  </div>
  <div class="dots" aria-hidden="true"></div>
  <form class="contact-form" data-contact-form action="${site.formEndpoint}" method="post" novalidate>
    <div class="form-trap" aria-hidden="true"><label for="contact-website">Leave empty</label><input id="contact-website" name="website" tabindex="-1" autocomplete="off" /></div>
    <div class="contact-fields">
      <div class="field">
        <label for="contact-name">Full name</label>
        <input id="contact-name" name="name" maxlength="120" type="text" autocomplete="name" placeholder="Your name" required aria-describedby="contact-name-error" />
        <p class="field__error" id="contact-name-error" data-error-name hidden></p>
      </div>
      <div class="field">
        <label for="contact-subject">Subject</label>
        <input id="contact-subject" name="subject" maxlength="180" type="text" placeholder="A question about a book" />
      </div>
    </div>
    <div class="field">
      <label for="contact-email">Email address</label>
      <input id="contact-email" name="email" maxlength="254" required type="email" autocomplete="email" inputmode="email" placeholder="you@example.com" aria-describedby="contact-email-error" />
      <p class="field__error" id="contact-email-error" data-error-email hidden></p>
    </div>
    <div class="field">
      <label for="contact-message">Message</label>
      <textarea id="contact-message" name="message" maxlength="10000" rows="6" placeholder="Type your message here" required aria-describedby="contact-message-error"></textarea>
      <p class="field__error" id="contact-message-error" data-error-message hidden></p>
    </div>
    <div class="check">
      <input id="contact-acknowledgement" name="acknowledgement" type="checkbox" required />
      <label for="contact-acknowledgement">I have read the <a href="/privacy/">Privacy Notice</a> and agree to the <a href="/terms/">Website Terms</a>.</label>
    </div>
    <button class="btn btn--form" type="submit">Send message${arrow}</button>
    <p class="form__status" role="status" data-form-status></p>
    <p class="form__note">Please leave out patient details and confidential information. This form does not subscribe you to the mailing list.</p>
  </form>
</div>`;

export const contact = (): PageDef => ({
  title: 'Contact Harni Muharami',
  // No address in the description: Cloudflare Email Obfuscation may rewrite plain addresses in meta text.
  description: 'Email Harni Muharami. For book questions, speaking enquiries and reader feedback, write to me here. For Amazon orders, please contact Amazon.',
  body: `
${band('Say hello', 'Contact', '\n    <p class="lede">Questions, or a note about the books? Write to me.</p>')}
<section class="section section--alt contact-section">
  <div class="shell contact-grid">
    <div class="contact-info" data-reveal>
      <div class="contact-info__head">
        <h2>Get in touch</h2>
        <p>For book questions, speaking enquiries and reader feedback, write to me here. For Amazon orders, please contact Amazon.</p>
      </div>
      <!-- NEEDS: confirm both accounts are live, and that ${site.email} receives mail -->
      <ul class="rows" role="list">
        <li data-contact-address><!--email_off--><a href="mailto:${site.email}">${iconMail}<span>${site.email}</span></a><!--/email_off--></li>
        ${socialItems()}
      </ul>
      <div class="globe" aria-hidden="true" data-globe>
        <div class="globe__stage" data-globe-stage></div>
        <div class="globe__fade"></div>
      </div>
    </div>
    ${messageForm()}
  </div>
</section>`,
});

export const join = (): PageDef => ({
  title: 'Join the list | Harni Muharami',
  description: "Join the list and I'll email you when a new Harni Muharami book comes out. Unsubscribe at any time.",
  body: `
${band('Newsletter', 'Join the list', `\n    <p class="lede">${esc(site.joinPromise)}</p>`)}
<section class="section">
  <div class="shell">
    <div class="join-card join-card--page">${joinForm('join')}</div>
  </div>
</section>`,
});

export const thanks = (): PageDef => ({
  title: 'Thank you for joining | Harni Muharami',
  description: 'Thank you for joining Harni Muharami’s mailing list.',
  noindex: true,
  body: `${band('Book updates', 'Thank you for joining my mailing list!')}
<section class="section"><div class="shell prose"><p>I'll email you when a new book comes out.</p>
<p class="actions">${button('Browse the books', '/books/')}${button('Home', '/', 'outline')}</p></div></section>`,
});

const iconCalendar =
  '<svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>';

const formatLabel: Readonly<Record<EventItem['format'], string>> = { 'in-person': 'In person', online: 'Online', hybrid: 'In person and online' };

const eventCard = (event: EventItem): string => `
<article class="event-card">
  <p class="event-card__date"><time datetime="${esc(event.start)}">${esc(formatEventDate(event))}</time></p>
  <h3>${esc(event.title)}</h3>
  <p class="event-card__meta"><span class="tag">${formatLabel[event.format]}</span>${event.place ? ` <span>${esc(event.place)}</span>` : ''}${event.organiser ? ` <span>Organised by ${esc(event.organiser)}</span>` : ''}</p>
  <p>${esc(event.summary)}</p>
  ${event.url ? `<p><a href="${esc(event.url)}" target="_blank" rel="noopener noreferrer">Booking and details on the organiser’s page${newTabNote}</a></p>` : ''}
</article>`;

export const events_ = (now: number = Date.now()): PageDef => {
  const upcoming = upcomingEvents(eventList, now);
  const past = pastEvents(eventList, now);
  return {
    title: 'Events and speaking enquiries | Harni Muharami',
    description: upcoming.length > 0
      ? 'Upcoming events with Harni Muharami, NHS nurse, clinical educator and author, and how to make an event enquiry.'
      : 'Event announcements and enquiries for Harni Muharami, NHS nurse, clinical educator and author. No public events are confirmed yet.',
    body: `<div class="events-page">
<section class="shell events-intro page-heading" aria-labelledby="events-title"><p class="eyebrow">Meet & connect</p><h1 id="events-title">Events &<br />conversations.</h1><p class="events-lead">Space to share ideas, reflect on practice<br class="events-desktop-break" /> and connect through books.</p></section>
<section class="events-programme" aria-labelledby="upcoming-title"><div class="shell">
  <div class="events-section-head"><p class="eyebrow">The diary</p><h2 id="upcoming-title">Upcoming events</h2></div>
  ${upcoming.length > 0
    ? `<div class="event-list">${upcoming.map(eventCard).join('')}</div>`
    : `<div class="events-notice"><span class="events-notice__icon" aria-hidden="true">${iconCalendar}</span><div><h3>No dates announced yet.</h3><p>Confirmed events will appear here with the date, venue or online format, and booking details. Please check back for updates.</p></div></div>`}
  ${past.length > 0 ? `<div class="events-past"><h2>Past events</h2><div class="event-list event-list--past">${past.map(eventCard).join('')}</div></div>` : ''}
</div></section>
<section class="shell events-invitation" aria-labelledby="invitation-title">
  <header><p class="eyebrow">For organisers</p><h2 id="invitation-title">A thoughtful conversation<br />starts with an idea.</h2><p>Planning a book discussion, nursing community event or education session? Send me an outline of what you have in mind.</p>${button('Make an event enquiry', '/contact/')}</header>
  <div class="events-brief"><h3>A useful starting point</h3><dl><div><dt>The occasion</dt><dd>Your organisation, proposed date and venue or online platform.</dd></div><div><dt>The conversation</dt><dd>Your audience, approximate group size, topic and session length.</dd></div><div><dt>The practical details</dt><dd>Accessibility requirements, budget and the best way to contact you.</dd></div></dl><p class="events-small">You’ll receive an email copy of your enquiry for your records. Arrangements, availability and any fees are confirmed separately in writing.</p></div>
</section>
<section class="events-reading"><div class="shell events-reading__layout"><div><p class="eyebrow">Reading together</p><h2>A book can begin the conversation.</h2><p>Explore nursing practice, career development, wellbeing or everyday life. Choose a title that fits the questions your group wants to discuss.</p></div><a href="/books/">Find a book for your group ${arrow}</a></div></section>
<p class="shell events-footnote">For listed events, check the organiser’s latest information before booking or travelling. Sending an enquiry does not confirm a booking.</p>
</div>`,
  };
};

export const events = (): PageDef => events_();

const reviewItem = (book: Book): string => {
  const read = amazonReviewsUrl(book.amazonUrl ?? amazonAuthorUrl);
  const write = amazonWriteReviewUrl(book.amazonUrl ?? amazonAuthorUrl);
  return `<article class="review-item">
  <a class="review-item__cover" href="/books/${book.slug}/" tabindex="-1" aria-hidden="true">${cover(book, { sizes: '84px' })}</a>
  <div class="review-item__body">
    <h3><a href="/books/${book.slug}/">${esc(book.title)}</a></h3>
    <p>${esc(book.hook)}</p>
    <p class="review-item__links"><a href="${esc(read)}" target="_blank" rel="noopener noreferrer">Read reviews<span class="visually-hidden"> for ${esc(book.title)}</span>${newTabNote}</a><a href="${esc(write)}" target="_blank" rel="noopener noreferrer">Write a review<span class="visually-hidden"> for ${esc(book.title)}</span>${newTabNote}</a></p>
  </div>
</article>`;
};

export const reviews = (): PageDef => ({
  title: 'Reader reviews and feedback | Harni Muharami',
  description: 'Find reader reviews on Amazon, choose a book and share honest feedback with Harni Muharami.',
  body: `${band('From the reader', 'Reviews & reflections', '<p class="lede">A useful review helps the next reader decide whether a book is right for them.</p>')}
${reviewQuotes.length > 0 ? `<section class="section"><div class="shell"><p class="eyebrow">Kind words</p><h2>What readers have said</h2><div class="quote-list">${reviewQuotes.map((item) => `<figure class="quote-card"><blockquote><p>${esc(item.quote)}</p></blockquote><figcaption>${esc(item.attribution)}, on <a href="/books/${esc(item.bookSlug)}/">${esc(books.find((b) => b.slug === item.bookSlug)?.title ?? 'a book')}</a></figcaption></figure>`).join('')}</div><p class="small">Shown with the reader’s written permission.</p></div></section>` : ''}
<section class="section"><div class="shell about-grid about-grid--wide"><div class="prose"><h2>Read what readers think</h2>
<p>Reader reviews are hosted on Amazon alongside each book. This site does not copy Amazon reviews or show a combined star rating of its own: the listing for the edition you are interested in shows the reviews available there.</p>
<p class="actions">${amazonButton('Visit my Amazon author page', amazonAuthorUrl)}</p>
<h2>Share an honest review</h2><p>If you have read a book, you can leave your own review on its Amazon page, subject to Amazon’s review rules and a signed-in Amazon account. Positive, mixed and critical responses can all help other readers.</p><p>You might mention who you think the book is for, which topics were useful, and what you would have liked it to explore further. Please avoid patient information, identifiable workplace stories or other people’s personal details.</p>
</div><aside class="panel"><p class="eyebrow">Write to the author</p><h2>A correction or a private note?</h2><p>For a factual correction, tell me the book title, format, chapter or page and the passage concerned. Please include a source where relevant.</p><p>Private feedback is not permission to publish a testimonial. I will ask separately, in writing, before quoting your words or identifying you on this site.</p><p>${button('Send feedback', '/contact/', 'outline')}</p></aside></div></section>
<section class="section section--alt"><div class="shell"><p class="eyebrow">Find your book</p><h2>Go to the right listing</h2><div class="review-list">${books.map(reviewItem).join('')}</div></div></section>`,
});

export const notFound = (): PageDef => ({
  title: 'Page not found | Harni Muharami',
  description: 'That page is not here. Try Home or Books.',
  noindex: true,
  body: `
${band(
  'Error 404',
  'Page not found',
  `
    <p class="lede">That page is not here.</p>
    <p class="actions">${button('Home', '/')}${button('Books', '/books/', 'outline')}</p>`,
)}`,
});
