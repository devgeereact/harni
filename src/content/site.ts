// Site-wide facts. Everything here comes from the owner (docs/00-foundation/PROJECT-CONTEXT.md).
// Mail uses the PHP endpoint, disabled server-side until configured. Statistics remain off.

export const site = {
  name: 'Harni Muharami',
  origin: 'https://harni.uk',
  email: 'info@harni.uk',
  subscriptionEmail: 'subscribe@harni.uk',
  formEndpoint: '/api/message.php',
  instagram: { handle: '@lulu_harni', url: 'https://www.instagram.com/lulu_harni/' },
  tiktok: { handle: '@harni_m', url: 'https://www.tiktok.com/@harni_m' },
  personalCapacity: 'I write in a personal capacity. These are my views, not those of my employer.',
  healthNote: 'My books give general guidance, not medical advice.',
  oneLiner: 'NHS nurse, clinical educator and author, based in London.',
  shortBio:
    'Harni Muharami is an NHS nurse and clinical educator in London. She leads a health training hub and holds an MSc in Management and Leadership in Health. She is currently doing a PhD.',
  joinPromise: "I'll email you when a new book comes out.",
  joinLine: "Join the list and I'll email you when a new book comes out.",
  consentLine: 'I agree to receive emails from Harni Muharami. I can unsubscribe at any time.',
  adviceNote: 'This book gives general guidance. It is not medical or legal advice, and it is not NHS guidance.',
  // Subscription requests are confirmed by reply and managed in the subscription mailbox.
  /**
   * Off until a statistics tool is chosen (ADR-017). While it is off there is no consent banner,
   * no "Cookie choices" link, and the legal pages say that no statistics tool is used.
   */
  statisticsEnabled: false,
  /** Checks only the owner can make. The generator lists them under `npm run pages -- --list`. */
  ownerChecks: [
    'CHECK: employer policy on the personal-capacity wording across the site',
    'CHECK: info@harni.uk and subscribe@harni.uk receive mail and support authenticated sending',
    'CHECK: Instagram @lulu_harni and TikTok @harni_m are live and public',
  ],
} as const;

export const navItems = [
  { href: '/', label: 'Home' },
  { href: '/books/', label: 'Books' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
] as const;
