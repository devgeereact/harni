// public/llms.txt (https://llmstxt.org): a short plain-text guide to the site for language-model
// tools. Built from src/data and src/content by scripts/build-pages.ts, like sitemap.xml, so it
// never drifts from the pages. It adds no facts that the pages do not already state.

import { books, groups } from '../data/books.ts';
import { site } from './site.ts';

const pageLinks: readonly { path: string; label: string; note: string }[] = [
  { path: '/', label: 'Home', note: 'Introduction and featured books' },
  { path: '/books/', label: 'Books', note: `All ${books.length} books, sorted into ${groups.length} groups` },
  { path: '/about/', label: 'About', note: 'Background, FAQs and press bio' },
  { path: '/contact/', label: 'Contact', note: 'Book questions, speaking enquiries and reader feedback' },
  { path: '/join/', label: 'Join the list', note: 'Email when a new book comes out' },
  { path: '/events/', label: 'Events', note: 'Event announcements and speaking enquiries' },
  { path: '/reviews/', label: 'Reviews', note: 'Where to read and leave reader reviews' },
  { path: '/delivery-and-refunds/', label: 'Delivery and refunds', note: 'Help with Amazon orders' },
  { path: '/privacy/', label: 'Privacy notice', note: 'How the site handles personal data' },
];

export const llmsText = (): string => {
  const lines: string[] = [
    `# ${site.name}`,
    '',
    `> ${site.oneLiner} This is her author site. It lists her ${books.length} books, each with a link to buy it on Amazon. harni.uk does not sell books itself.`,
    '',
    site.shortBio,
    '',
    site.healthNote,
    site.personalCapacity,
    '',
    '## Pages',
    '',
    ...pageLinks.map(({ path, label, note }) => `- [${label}](${site.origin}${path}): ${note}`),
    '',
    '## Books',
    '',
  ];
  for (const group of groups) {
    const inGroup = books.filter((book) => book.group === group.key);
    if (inGroup.length === 0) continue;
    lines.push(`### ${group.name}`, '');
    for (const book of inGroup) {
      lines.push(`- [${book.title}](${site.origin}/books/${book.slug}/): ${book.subtitle}`);
    }
    lines.push('');
  }
  lines.push('## Optional', '', `- [Sitemap](${site.origin}/sitemap.xml)`, `- [Email](mailto:${site.email})`, '');
  return lines.join('\n');
};
