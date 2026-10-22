// Shared page furniture: head, header, footer, consent banner and the small pieces that
// more than one page uses. Pure functions that return HTML strings, so scripts/build-pages.ts
// can run them in Node. No third-party requests, and every mailto link is wrapped in
// `email_off` so Cloudflare Email Obfuscation leaves it alone (commit 025e905).
// Look and feel: docs/03-design/DESIGN-SYSTEM.md (ADR-020, "Rausch on white").

import { navItems, site } from './site.ts';
import { amazonAuthorUrl, groups } from '../data/books.ts';
import type { Book } from '../data/books.ts';
import { socialImageFor } from './social.ts';

export interface PageDef {
  readonly title: string;
  readonly description: string;
  readonly body: string;
  /** Adds a noindex tag. The route list keeps the page out of sitemap.xml. */
  readonly noindex?: boolean;
}

export interface RenderedPage {
  readonly html: string;
  /** Owner notes found in `<!-- NEEDS: ... -->` or `<!-- CHECK: ... -->` comments. Not shipped. */
  readonly notes: readonly string[];
}

export const esc = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Highlights owner-facing placeholders so they are easy to spot in the preview. */
const flagify = (html: string): string =>
  html.replace(/\[(NEEDS|CHECK): ([^\]]+)\]/g, '<span class="flag">[$1: $2]</span>');

export const arrow =
  '<svg class="arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

/** A button-styled link. `kind` is empty for the filled button or `outline` for the quiet one. */
export const button = (label: string, href: string, kind: '' | 'outline' | 'small' = '', arrowed = true): string =>
  `<a class="btn${kind ? ` btn--${kind}` : ''}" href="${href}">${label}${arrowed ? arrow : ''}</a>`;

/** The shared editorial header for inner pages. `extra` is trusted HTML (lede, actions). */
export const band = (eyebrow: string, heading: string, extra = ''): string => `
<section class="band page-heading">
  <div class="shell band__inner">
    <p class="eyebrow">${esc(eyebrow)}</p>
    <h1>${esc(heading)}</h1>${extra}
  </div>
</section>`;

export const emailLink = (): string =>
  `<!--email_off--><a href="mailto:${site.email}">${site.email}</a><!--/email_off-->`;

export const emailButton = (): string =>
  `<!--email_off--><a class="btn" href="mailto:${site.email}">Email ${site.email}${arrow}</a><!--/email_off-->`;

export const needs = (text: string): string => `<p class="placeholder">[NEEDS: ${esc(text)}]</p>`;

export const statusLabel = (book: Book): string => (book.status === 'live' ? 'Available' : 'Coming soon');

/** Without JavaScript the form is hidden by CSS, so an address can never leak into the URL. */
export const joinForm = (id: string): string => `
<noscript><p class="note">To request book updates without JavaScript, email <a href="mailto:${site.subscriptionEmail}">${site.subscriptionEmail}</a>.</p></noscript>
<form class="form" data-join-form action="${site.formEndpoint}" method="post" novalidate>
  <div class="form-trap" aria-hidden="true"><label for="website-${id}">Leave empty</label><input id="website-${id}" name="website" tabindex="-1" autocomplete="off" /></div>
  <div class="field">
    <label for="email-${id}">Email address</label>
    <input id="email-${id}" name="email" type="email" autocomplete="email" inputmode="email" maxlength="254" required aria-describedby="email-${id}-error" />
    <p class="field__error" id="email-${id}-error" data-error-email hidden></p>
  </div>
  <div class="check">
    <input id="consent-${id}" name="consent" type="checkbox" required aria-describedby="consent-${id}-error" />
    <label for="consent-${id}">${esc(site.consentLine)} Read the <a href="/privacy/">privacy notice</a>.</label>
  </div>
  <p class="field__error" id="consent-${id}-error" data-error-consent hidden></p>
  <button class="btn" type="submit">Join the list${arrow}</button>
  <p class="form__status" role="status" data-form-status></p>
  <p class="form__note">You'll receive a copy of your sign-up by email, with how to unsubscribe.</p>
</form>`;

const iconInstagram =
  '<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';

const iconTikTok =
  '<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 4c.4 2.3 2 4 4.5 4.2"/></svg>';

const iconAmazon = '<svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" focusable="false"><path d="M8 13V8a4 4 0 0 1 8 0v5M8 10h8M4 17c5 4 11 4 16-1M16 16h4v4"/></svg>';

const newTab = '<span class="visually-hidden"> (opens in a new tab)</span>';

/** Plain links with inline icons. No embeds and no third-party scripts (ADR-011). */
export const socialItems = (): string => `
<li><a href="${amazonAuthorUrl}" target="_blank" rel="noopener noreferrer">${iconAmazon}<span>Amazon author page${newTab}</span></a></li>
<li><a href="${site.instagram.url}" target="_blank" rel="noopener noreferrer">${iconInstagram}<span>Instagram ${site.instagram.handle}${newTab}</span></a></li>
<li><a href="${site.tiktok.url}" target="_blank" rel="noopener noreferrer">${iconTikTok}<span>TikTok ${site.tiktok.handle}${newTab}</span></a></li>`;

const header = (path: string): string => {
  const isCurrent = (href: string): boolean => (href === '/' ? path === '/' : path.startsWith(href));
  const items = navItems
    .map(({ href, label }) => `<li><a class="nav-link" href="${href}"${isCurrent(href) ? ' aria-current="page"' : ''}>${label}</a></li>`)
    .join('');
  const joinCurrent = path === '/join/' ? ' aria-current="page"' : '';
  return `
<header class="site-head" data-head>
  <div class="shell site-head__inner">
    <a class="brand" href="/"><span class="brand__mark" aria-hidden="true">HM</span><span class="brand__name">${site.name}</span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
      <span class="nav-toggle__bars" aria-hidden="true"></span><span>Menu</span>
    </button>
    <nav id="site-nav" class="site-nav" aria-label="Primary" data-nav>
      <ul role="list">${items}<li><a class="btn btn--small" href="/join/"${joinCurrent}>Join the list</a></li></ul>
    </nav>
  </div>
</header>`;
};

/** The reopen link exists only while a statistics tool is switched on (ADR-017). */
const cookieChoices = (): string =>
  site.statisticsEnabled
    ? '\n        <li><button class="linklike" type="button" data-consent-open>Cookie choices</button></li>'
    : '';

/** Icon-only social links for the footer. Each carries a text label for screen readers (ADR-011). */
const footerSocial = (): string => `
<ul class="foot-social" role="list" aria-label="Follow Harni">
  <li><a href="${amazonAuthorUrl}" target="_blank" rel="noopener noreferrer" aria-label="Amazon author page (opens in a new tab)">${iconAmazon}</a></li>
  <li><a href="${site.instagram.url}" target="_blank" rel="noopener noreferrer" aria-label="Instagram ${site.instagram.handle} (opens in a new tab)">${iconInstagram}</a></li>
  <li><a href="${site.tiktok.url}" target="_blank" rel="noopener noreferrer" aria-label="TikTok ${site.tiktok.handle} (opens in a new tab)">${iconTikTok}</a></li>
</ul>`;

/**
 * Footer layout follows the 21st.dev "footer-7" block: brand, one line and social icons on the left,
 * three link columns on the right, then a rule with the copyright and the legal links. The look is
 * this site's own (docs/03-design/DESIGN-SYSTEM.md). Plain HTML, no framework.
 */
const footer = (): string => `
<footer class="site-foot">
  <div class="shell">
    <div class="foot-main">
      <div class="foot-brand">
        <a class="brand" href="/"><span class="brand__mark" aria-hidden="true">HM</span><span class="brand__name">${site.name}</span></a>
        <p class="foot-line">${esc(site.oneLiner)} ${esc(site.personalCapacity)} ${esc(site.healthNote)}</p>
${footerSocial()}
        <p class="actions">${button('Join the list', '/join/', 'small')}</p>
      </div>
      <div class="foot-cols">
        <nav aria-label="Books">
          <h2 class="foot-h">Books</h2>
          <ul role="list">
            <li><a href="/books/">All books</a></li>
            ${groups.map((g) => `<li><a href="/books/#${g.key}">${esc(g.name)}</a></li>`).join('\n            ')}
          </ul>
        </nav>
        <nav aria-label="Explore">
          <h2 class="foot-h">Explore</h2>
          <ul role="list">
            <li><a href="/about/">About</a></li>
            <li><a href="/events/">Events</a></li>
            <li><a href="/reviews/">Reviews</a></li>
            <li><a href="/play/">Pier Run</a></li>
          </ul>
        </nav>
        <nav aria-label="Help">
          <h2 class="foot-h">Help</h2>
          <ul role="list">
            <li><a href="/contact/">Contact</a></li>
            <li><a href="/delivery-and-refunds/">Delivery and refunds</a></li>
            <li class="foot-mail">${emailLink()}</li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="foot-base">
      <div class="foot-legal">
        <p>&copy; <span data-year>2026</span> ${site.name}</p>
        <ul role="list" aria-label="Legal">
          <li><a href="/privacy/">Privacy</a></li>
          <li><a href="/cookies/">Cookies</a></li>
          <li><a href="/terms/">Terms</a></li>${cookieChoices()}
        </ul>
      </div>
    </div>
  </div>
</footer>`;

/**
 * Consent banner (ADR-011, ADR-017). Rendered only while a statistics tool is switched on in
 * src/content/site.ts. Accept and Reject are the same size and style, so neither is favoured.
 */
const consent = (): string =>
  site.statisticsEnabled
    ? `
<div class="consent" data-consent role="region" aria-label="Cookie choices" hidden>
  <div class="shell consent__inner">
    <p class="consent__text">I would like to use a statistics tool to see which pages help. It loads only if you accept. <a href="/cookies/">Read about cookies</a>.</p>
    <div class="actions">
      <button class="btn btn--outline" type="button" data-consent-accept>Accept</button>
      <button class="btn btn--outline" type="button" data-consent-reject>Reject</button>
    </div>
  </div>
</div>`
    : '';

const noteComments = /<!--\s*(NEEDS|CHECK):\s*([\s\S]*?)\s*-->/g;

export const renderDocument = (path: string, page: PageDef): RenderedPage => {
  const url = `${site.origin}${path}`;
  const is404 = path === '/404.html';
  const title = esc(page.title);
  const description = esc(page.description);
  const image = socialImageFor(path);
  const ogType = path.startsWith('/books/') && path !== '/books/' ? 'book' : 'website';
  const robots = page.noindex ? '\n    <meta name="robots" content="noindex" />' : '';
  const canonical = is404
    ? ''
    : `\n    <link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />`;

  // Owner notes live in HTML comments in the page words. They are collected for the report and
  // removed here, so they never ship in the page source.
  const notes = [...page.body.matchAll(noteComments)].map((m) => `${m[1] ?? ''}: ${m[2] ?? ''}`);
  const body = flagify(page.body.replace(noteComments, ''));

  const html = `<!doctype html>
<html lang="en-GB">
  <head>
    <!-- Generated by scripts/build-pages.ts. Edit src/content or src/data, then run: npm run pages -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="theme-color" content="#FFFFFF" />${robots}
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />${canonical}
    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="${site.name}" />
    <meta property="og:locale" content="en_GB" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image.url}" />
    <meta property="og:image:width" content="${image.width}" />
    <meta property="og:image:height" content="${image.height}" />
    <meta property="og:image:alt" content="${esc(image.alt)}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image.url}" />
    <meta name="twitter:image:alt" content="${esc(image.alt)}" />
    <script>document.documentElement.classList.add('js');</script>
    <script type="module" src="/src/app/main.tsx"></script>
  </head>
  <body data-stats="${site.statisticsEnabled ? 'on' : 'off'}">
    <a class="skip-link" href="#main">Skip to content</a>
${header(path)}
    <main id="main">
${body}
    </main>
${footer()}${consent()}
  </body>
</html>
`;
  return { html, notes };
};
