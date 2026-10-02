// The thirteen books on Harni Muharami's Amazon author page (docs/01-product/CATALOGUE.md, ADR-023),
// read from that page and each book's Amazon listing on 2026-10-01. This replaces the "launch ten"
// of ADR-015, which came from a list of planned titles and did not match what is published.
//
// All thirteen are live on Amazon.co.uk as Kindle books and paperbacks, and all are in Kindle
// Unlimited, so they are enrolled in KDP Select. That means the ebook must not be sold on harni.uk
// (BR-002, ADR-012). The site is a shop window: each book links to Amazon.
//
// `kdpTitle` is the title exactly as Amazon shows it, typos included. `title` and `subtitle` are the
// same words with the capitals and stray punctuation tidied. Fix the typos in KDP and the two match
// (KNOWN-ISSUES). Blurbs are the owner's Amazon descriptions, lightly edited for punctuation, with
// the "Inside you'll learn" lists left on Amazon.
//
// Relative imports carry the `.ts` extension because scripts/build-pages.ts runs this file in Node.

export type BookStatus = 'coming-soon' | 'live';

/** Four groups that sort the thirteen titles by topic (ADR-023). They add no claims about the books. */
export type Group = 'safe' | 'career' | 'wellbeing' | 'life';

export interface Book {
  readonly slug: string;
  /** Short title as shown on the site. */
  readonly title: string;
  readonly subtitle: string;
  /** The title exactly as it appears on Amazon. */
  readonly kdpTitle: string;
  /** One line for the cards. Taken from the book's own description. */
  readonly hook: string;
  readonly group: Group;
  readonly status: BookStatus;
  /** True while the ebook is enrolled in KDP Select, so it must not be sold on harni.uk. */
  readonly inKdpSelect: boolean;
  /** Shown as a tag. Amazon showed "Kindle Unlimited" on every listing on 2026-10-01. */
  readonly kindleUnlimited: boolean;
  /** The Kindle listing. Amazon shows the paperback on the same page. */
  readonly amazonUrl?: string;
  readonly paperbackUrl?: string;
  readonly ebookCheckoutUrl?: string;
  /** ISO date of publication on Amazon. */
  readonly published: string;
  readonly pages: number;
  /** File stem in public/images/books, for example `safe-by-design-400.jpg`. */
  readonly cover: string;
  readonly blurb: readonly string[];
  readonly whoFor: string;
}

export interface GroupInfo {
  readonly key: Group;
  readonly number: string;
  readonly name: string;
  /** Describes the titles in the group, nothing more. */
  readonly blurb: string;
}

export const groups: readonly GroupInfo[] = [
  { key: 'safe', number: '01', name: 'Safe practice', blurb: 'Safety, handovers, triage, discharge and hygiene on the ward.' },
  { key: 'career', number: '02', name: 'Career and voice', blurb: 'Career pathways across NHS bands, and speaking up with confidence.' },
  {
    key: 'wellbeing',
    number: '03',
    name: 'Wellbeing for nurses',
    blurb: 'Emotional labour, moral distress, recovery and the honest reality of nursing.',
  },
  { key: 'life', number: '04', name: 'Everyday life', blurb: 'Gratitude, and habits for couples.' },
];

/** The author page that lists every book. */
export const amazonAuthorUrl = 'https://www.amazon.co.uk/stores/author/B0G27S5PSV';

const dp = (asin: string): string => `https://www.amazon.co.uk/dp/${asin}`;

/** Amazon's own order on the author page ("Most popular" first, then by popularity). */
export const books: readonly Book[] = [
  {
    slug: 'safe-by-design',
    title: 'Safe by Design, Safe by Culture',
    subtitle:
      'A Practical, Evidence-Based Guide to Reducing Incivility, Violence and Psychological Unsafety in NHS Wards, A&E and Mental Health Services',
    kdpTitle:
      'SAFE BY DESIGN, SAFE BY CULTURE: A Practical, Evidence-Based Guide To Reducing Incivility, Violence, And Psychological Unsafety In NHS Wards, A&E, And Mental Health Services',
    hook: 'Reducing incivility, violence and psychological unsafety on NHS wards.',
    group: 'safe',
    status: 'live',
    inKdpSelect: true,
    kindleUnlimited: true,
    amazonUrl: dp('B0GLPP6Q2Y'),
    paperbackUrl: dp('B0GLXNY8K2'),
    published: '2026-02-05',
    pages: 272,
    cover: 'safe-by-design',
    blurb: [
      'Reduce aggression. Prevent harm. Build psychologically safer NHS teams without guesswork.',
      'Safe by Design, Safe by Culture is a practical, evidence-based guide for NHS wards, A&E and mental health services. Written for the real pressures of modern practice (crowding, distress, trauma, staffing gaps and high emotion), it brings together the psychology of aggression, environmental safety, de-escalation skills and culture change to reduce incivility, violence and psychological unsafety.',
      'Whether you work on a busy medical ward, in A&E/ED, PICU or community-facing mental health services, this guide supports you to protect patients and staff, and to create a culture where safety and respect are standard practice.',
    ],
    whoFor:
      'NHS nurses and nursing associates, paramedics, HCAs, allied health professionals and doctors, ward managers, matrons, clinical leaders and educators, nursing students and newly qualified staff.',
  },
  {
    slug: 'honest-truth-about-nurses',
    title: 'The Honest Truth About Nurses',
    subtitle: 'Inside the Heart, Struggles, and Strength of Everyday Health Heroes',
    kdpTitle: 'The Honest Truth About Nurses.: Inside the Heart, Struggles, and Strength of Everyday Health Heroes',
    hook: 'An honest look at the heart, struggles and strength of nursing.',
    group: 'wellbeing',
    status: 'live',
    inKdpSelect: true,
    kindleUnlimited: true,
    amazonUrl: dp('B0G275LHR4'),
    paperbackUrl: dp('B0G1Y6X6LW'),
    published: '2025-11-13',
    pages: 321,
    cover: 'honest-truth',
    blurb: [
      'The Honest Truth About Nurses provides a heartfelt look into the world of those dedicated to caring for others. Through sincere reflections, Harni Muharami reveals the often-overlooked aspects of nursing: the quiet acts of bravery, the laughter that eases exhaustion, the hidden heartbreak behind comforting smiles, and the profound beauty found even during difficult days.',
      'The book captures the emotional core of nursing, emphasising the delicate balance between hope and grief, strength and vulnerability, humanity and obligation. Drawing on years of experience across various healthcare roles, from non-clinical work and ward nursing to the fast-paced emergency department, and now as a clinical educator leading a health training hub, Harni offers genuine insights filled with wisdom and compassion.',
      'More than just a book about nursing, this is a tribute to the resilience of every nurse who stands steadfast amidst chaos, to caregivers who show up in the quiet hours, and to hearts that repeatedly choose kindness. It reminds us that compassion is not a sign of weakness but the truest form of strength.',
    ],
    whoFor: 'Nurses, students, and anyone whose life has been touched by a nurse.',
  },
  {
    slug: 'start-the-shift',
    title: 'Start the Shift, Not the Catch-Up',
    subtitle: 'A Practical Guide for NHS Nurses to Reduce Backlogs, Improve Patient Flow and Protect Safety',
    kdpTitle:
      'START THE SHIFT, NOT THE CATCH-UP: A Practical Guide For NHS Nurses To Reduce Backlogs, Improve Patient Flow, And Protect Safety',
    hook: 'Reduce backlogs, improve patient flow and protect safety.',
    group: 'safe',
    status: 'live',
    inKdpSelect: true,
    kindleUnlimited: true,
    amazonUrl: dp('B0GLPWPT2T'),
    paperbackUrl: dp('B0GLXCBMXN'),
    published: '2026-02-05',
    pages: 268,
    cover: 'start-the-shift',
    blurb: [
      'Start the shift with control, not chaos.',
      'Start the Shift, Not the Catch-Up is a practical, ward-tested guide for NHS nurses and UK healthcare professionals who are tired of beginning every shift behind: incomplete handovers, missing tasks, delayed discharges, constant interruptions and avoidable risk.',
      'Built around real NHS pressures (high acuity, tight staffing and rapid turnover), this book shows you how to close handover gaps, protect patient safety and improve patient flow without relying on perfection or heroic overtime.',
    ],
    whoFor:
      'NHS band 5 to 7 nurses, charge nurses and ward leaders, newly qualified nurses, nursing students on placement, and healthcare assistants and wider UK healthcare teams who support handover and flow.',
  },
  {
    slug: 'your-next-step-in-nursing',
    title: 'Your Next Step in Nursing',
    subtitle: 'A Motivational, Practical Guide to Clinical, Academic and Leadership Pathways Across NHS Bands',
    kdpTitle:
      'YOUR NEXT STEP IN NURSING: A Motivational, Practical Guide To Clinical, Academic, And Leadership Pathways Across NHS Bands',
    hook: 'Clinical, academic and leadership pathways across NHS bands.',
    group: 'career',
    status: 'live',
    inKdpSelect: true,
    kindleUnlimited: true,
    amazonUrl: dp('B0GLPP275X'),
    paperbackUrl: dp('B0GLXHQHFX'),
    published: '2026-02-05',
    pages: 223,
    cover: 'your-next-step',
    blurb: [
      'Your Next Step in Nursing is a motivational, practical career guide for UK nurses who want clarity, confidence and a realistic plan to progress across NHS Agenda for Change (AfC) bands. Whether you are newly qualified, an experienced staff nurse, or considering a move into education, research, specialist practice or leadership, this book helps you explore your options and move forward step by step.',
      'Grounded in the realities of modern NHS nursing, it blends encouragement with concrete tools so you can identify your strengths, gather the right evidence, and approach applications and interviews with confidence.',
    ],
    whoFor:
      'NHS nurses (Band 3 to 7 and above) planning their next move, newly qualified and preceptorship nurses, nursing students preparing for early career decisions, and healthcare professionals exploring progression routes.',
  },
  {
    slug: 'speaking-up-smart-in-the-nhs',
    title: 'Speaking Up Smart in the NHS',
    subtitle: 'Practical Tools for Challenging Misinformation, Using Evidence and Raising Concerns with Confidence and Professionalism',
    kdpTitle:
      'SPEAKING UP SMART IN THE NHS: Practical Tools For Challenging Misinformation, Using Evidence, And Raising Concerns With Confidence And Professionalism',
    hook: 'Raise concerns with confidence and professionalism.',
    group: 'career',
    status: 'live',
    inKdpSelect: true,
    kindleUnlimited: true,
    amazonUrl: dp('B0GLPCFRWV'),
    paperbackUrl: dp('B0GLXT755G'),
    published: '2026-02-05',
    pages: 268,
    cover: 'speaking-up-smart',
    blurb: [
      'Speak up with clarity, confidence and professionalism, without burning bridges.',
      'Speaking Up Smart in the NHS is a practical, UK-focused guide for nurses, nursing students and healthcare professionals who want to challenge misinformation, use evidence effectively and raise concerns in ways that protect patients and strengthen teams.',
      'When you are facing “we’ve always done it this way”, poor practice, unsafe systems or misleading claims on the ward, this book gives you tools to speak up assertively, document wisely and navigate hierarchy while staying true to NHS values and the Duty of Candour.',
    ],
    whoFor:
      'NHS nurses and newly qualified nurses, nursing students on placement, allied health professionals and UK healthcare staff, and anyone who wants to raise concerns with confidence, evidence and integrity.',
  },
  {
    slug: 'the-triage-mindset',
    title: 'The Triage Mindset',
    subtitle: 'Evidence-Based Prioritisation and Ethical Care When Time, Beds and Staff Are Stretched Across the NHS',
    kdpTitle:
      'THE TRIAGE MINDSET: Evidence-Based Prioritisation and Ethical Care When Time, Beds, and Staff Are Stretched Across the NHS Paperback',
    hook: 'Prioritisation and ethical care when the NHS is stretched.',
    group: 'safe',
    status: 'live',
    inKdpSelect: true,
    kindleUnlimited: true,
    amazonUrl: dp('B0GKX58WRC'),
    paperbackUrl: dp('B0GKVSZMM5'),
    published: '2026-02-01',
    pages: 267,
    cover: 'triage-mindset',
    blurb: [
      'The Triage Mindset is a practical, evidence-based guide to prioritisation, safe decision-making and ethical care when the NHS is under pressure: when time is short, beds are full and staffing is stretched.',
      'Written for NHS nurses, healthcare professionals and nursing students, this book translates triage principles into real-world ward and community practice: how to assess quickly, escalate effectively, document defensibly and care compassionately, without burning out.',
    ],
    whoFor:
      'NHS ward and community nurses (Band 5 to 7), ED, acute and medical-surgical staff, allied health professionals in pressured pathways, student nurses, and clinical leaders who need practical frameworks for safer care.',
  },
  {
    slug: 'care-begins-from-home',
    title: 'Care Begins from Home',
    subtitle: 'Evidence-Based Home Care, Carer Support and Safe Discharge Planning for NHS Nurses',
    kdpTitle: 'CARE BEGINS FROM HOME: Evidence-Based Home Care, Carer Support, And Safe Discharge Planning For NHS Nurses',
    hook: 'Home care, carer support and safe discharge planning.',
    group: 'safe',
    status: 'live',
    inKdpSelect: true,
    kindleUnlimited: true,
    amazonUrl: dp('B0GKX55B9P'),
    paperbackUrl: dp('B0GKVTNF6S'),
    published: '2026-02-01',
    pages: 255,
    cover: 'care-begins-from-home',
    blurb: [
      'Care Begins from Home is a practical, evidence-based guide for NHS nurses and UK healthcare professionals delivering safe, person-centred care beyond the ward. Whether you coordinate discharge, support families, or work in integrated community teams, this book helps you reduce readmissions, improve continuity of care and strengthen carer support while staying aligned with UK practice and safeguarding responsibilities.',
      'Care begins from home, because safe discharge is not an event, it is a process.',
    ],
    whoFor:
      'NHS nurses (acute, community, discharge, virtual ward and integrated care), nursing students and newly qualified nurses, allied health professionals and multidisciplinary teams, and UK healthcare workers involved in discharge planning and home care.',
  },
  {
    slug: 'hands-that-care-hearts-that-hope',
    title: 'Hands That Care, Hearts That Hope',
    subtitle: 'A Practical, Evidence-Based Guide to Wellbeing, Moral Distress and Meaningful Nursing for NHS Staff Who Believe God Heals',
    kdpTitle:
      'HANDS THAT CARE, HEARTS THAT HOPE: A Practical, Evidence-Based Guide To Wellbeing, Moral Distress, And Meaningful Nursing For NHS Staff Who Believe God Heals',
    hook: 'Wellbeing, moral distress and meaningful nursing.',
    group: 'wellbeing',
    status: 'live',
    inKdpSelect: true,
    kindleUnlimited: true,
    amazonUrl: dp('B0GKWV13BY'),
    paperbackUrl: dp('B0GKVQ69JZ'),
    published: '2026-02-01',
    pages: 210,
    cover: 'hands-that-care',
    blurb: [
      'Hands That Care, Hearts That Hope is a practical, evidence-based guide to wellbeing, moral distress and meaningful nursing for NHS staff and UK healthcare professionals who believe God heals, while facing the relentless realities of modern care.',
      'Blending clinical research with Christian theology of care, this compassionate handbook helps you navigate burnout, moral injury, grief and the quiet spiritual weight of bedside work, without platitudes, guilt or denial.',
      'If you are called to care but carrying too much, this book offers tools, language and hope for the work you do every day.',
    ],
    whoFor:
      'NHS nurses, nursing students, HCAs, midwives, AHPs, chaplains and Christian healthcare workers seeking practical wellbeing strategies, spiritual grounding and renewed purpose.',
  },
  {
    slug: 'nhs-healers-handbook',
    title: 'The NHS Healer’s Handbook',
    subtitle: 'Surviving Emotional Labour with Evidence-Based Tools to Restore Wellbeing for Nurses and Healthcare Professionals',
    kdpTitle:
      'THE NHS HEALER’S HANDBOOK: Surviving Emotional Labour With Evidence-Based Tools To Restore Wellbeing For Nurses And Healthcare Professionals',
    hook: 'Surviving emotional labour with evidence-based tools.',
    group: 'wellbeing',
    status: 'live',
    inKdpSelect: true,
    kindleUnlimited: true,
    amazonUrl: dp('B0GJNJD942'),
    paperbackUrl: dp('B0GJPLT363'),
    published: '2026-01-24',
    pages: 269,
    cover: 'healers-handbook',
    blurb: [
      'The NHS Healer’s Handbook is a practical, evidence-based guide for nurses and healthcare professionals carrying the hidden load of emotional labour. If you are feeling stretched by relentless pressure, compassion fatigue, rota exhaustion or the moral weight of care, this handbook helps you protect your wellbeing without losing your empathy.',
      'Written for the realities of UK healthcare, it translates psychology, neurobiology and trauma-informed approaches into tools you can use on shift, between patients and after a hard day.',
      'If you care for everyone else, this book helps you care for yourself, so you can keep showing up with strength, clarity and compassion.',
    ],
    whoFor:
      'NHS nurses and midwives, allied health professionals and healthcare assistants, junior doctors and clinical trainees, nursing students, and UK healthcare workers seeking practical wellbeing tools.',
  },
  {
    slug: 'beyond-the-ward',
    title: 'Beyond the Ward: Joyful Recovery for Nurses',
    subtitle: 'Practical Hobbies, Micro-Adventures and Self-Care Routines to Keep Your Mind and Soul Refreshed',
    kdpTitle:
      'BEYOND THE WARD:JOYFUL RECOVERY FOR NURSES: Practical Hobbies, Micro-Adventures, And Self-Care Routines To Keep Your Mind And Soul Refreshed',
    hook: 'Hobbies, micro-adventures and self-care routines for nurses.',
    group: 'wellbeing',
    status: 'live',
    inKdpSelect: true,
    kindleUnlimited: true,
    amazonUrl: dp('B0GJ65NBLP'),
    paperbackUrl: dp('B0GJPPG848'),
    published: '2026-01-24',
    pages: 177,
    cover: 'beyond-the-ward',
    blurb: [
      'Shift work, emotional labour, busy rotas and constant responsibility can drain even the most dedicated nurse. Beyond the Ward is a practical, UK-focused recovery guide for NHS nurses, healthcare professionals and nursing students who want realistic ways to reset after work, without expensive retreats, complicated routines or guilt.',
      'This book helps you build a sustainable “off-duty” life through small, repeatable practices that restore your mind and soul, so you can show up with more calm, energy and clarity.',
    ],
    whoFor:
      'NHS nurses and UK healthcare staff looking for practical self-care, nursing students managing placements, study stress and exhaustion, and anyone in caring roles who needs burnout prevention tools that fit real schedules.',
  },
  {
    slug: 'from-cleanliness-to-clinical-outcomes',
    title: 'From Cleanliness to Clinical Outcomes',
    subtitle: 'A Practical NHS Handbook on Environmental Hygiene, Patient Safety and Reduced Length of Stay',
    kdpTitle:
      'FROM CLEANLINESS TO CLINICAL OUTCOMES: A Practical NHS Handbook On Environmental Hygiene, Patient Safety, And Reduced Length Of Stay',
    hook: 'Environmental hygiene, patient safety and length of stay.',
    group: 'safe',
    status: 'live',
    inKdpSelect: true,
    kindleUnlimited: true,
    amazonUrl: dp('B0GJ4724VG'),
    paperbackUrl: dp('B0GJPZHS1B'),
    published: '2026-01-24',
    pages: 268,
    cover: 'cleanliness-to-outcomes',
    blurb: [
      'Turn everyday ward cleanliness into measurable clinical outcomes.',
      'From Cleanliness to Clinical Outcomes is a practical NHS-focused handbook that connects environmental hygiene, infection prevention and control (IPC) and patient safety to what matters on the ward: fewer avoidable infections, smoother patient flow and a reduced length of stay.',
      'Written for busy NHS nurses and frontline healthcare professionals, this guide translates best-practice hygiene principles into clear actions you can apply during real shifts, across patient areas, shared equipment, isolation rooms and device care, while supporting dignity, teamwork and a culture of safety.',
    ],
    whoFor:
      'NHS nurses (all bands) and ward leaders, healthcare assistants and allied health professionals, infection prevention and patient safety roles, and student nurses and UK healthcare learners.',
  },
  {
    slug: 'gratitude-reimagined',
    title: 'Gratitude Reimagined',
    subtitle: 'A 21-Day Guided Path to a Steadier Mind',
    kdpTitle: 'Gratitude Reimagined: A 21-Day Guided PathTo a Steadier Mind',
    hook: 'A 21-day guided path to a steadier mind.',
    group: 'life',
    status: 'live',
    inKdpSelect: true,
    kindleUnlimited: true,
    amazonUrl: dp('B0GFPLPNW4'),
    paperbackUrl: dp('B0GFW4TCHD'),
    published: '2026-01-08',
    pages: 149,
    cover: 'gratitude-reimagined',
    blurb: [
      'Gratitude Reimagined is a 21-day, scene-led book that helps you shift your attention from strain to steadier ground. Written in clear, novel-like prose by a registered nurse and Lead Clinical Educator, it pairs short real-life moments with plain-language reflections and a single brief prompt. No worksheets, no jargon, just small moves you can use in ordinary time.',
      'Across three parts, you will begin by noticing what helps in everyday rooms, then move inward to the body, breath and worry, and finally build a light, repeatable habit that holds under pressure. Each chapter can be read in under ten minutes and practised without adding hours to your day.',
    ],
    whoFor: 'Busy professionals, parents, carers, and anyone who wants a grounded path to attention, care and ease.',
  },
  {
    slug: '30-day-relationship-reboot',
    title: 'The 30-Day Relationship Reboot',
    subtitle: 'Simple Daily Habits to Reconnect, Communicate and Rekindle',
    kdpTitle: 'The 30-Day Relationship Reboot: Simple Daily Habits to Reconnect, Communicate, and Rekindle.',
    hook: 'Simple daily habits to reconnect and communicate.',
    group: 'life',
    status: 'live',
    inKdpSelect: true,
    kindleUnlimited: true,
    amazonUrl: dp('B0G6CZZN8X'),
    paperbackUrl: dp('B0G62NBRN3'),
    published: '2025-12-11',
    pages: 173,
    cover: 'relationship-reboot',
    blurb: [
      'The 30-Day Relationship Reboot is a clear, practical programme for couples who want closeness without long counselling sessions or complicated plans. In 10 to 20 minutes a day, you will build steady habits that make attention, calm and intimacy easier.',
      'Each day gives you a goal, step-by-step guidance, short scripts, a prayer or intention, and a brief reflection note. You will find long-distance options, safety guidance and a follow-on plan for the next 90 days.',
      'It suits Christian couples and any couple who wants kind, repeatable habits that work in real life.',
    ],
    whoFor: 'Couples who want closeness without long counselling sessions or complicated plans, including Christian couples.',
  },
];

export interface BuyOptions {
  /** The Kindle listing on Amazon. */
  readonly amazon: string | null;
  /** The paperback listing on Amazon. */
  readonly paperback: string | null;
  /** Direct ebook checkout on harni.uk. */
  readonly ebook: string | null;
}

/**
 * Which buy buttons a book may show.
 * - Nothing until the book is live.
 * - BR-001: "Buy on Amazon" only when `amazonUrl` is set. The paperback button needs `paperbackUrl`.
 * - BR-002: "Buy ebook here" only when `ebookCheckoutUrl` is set and the ebook is not in KDP Select.
 * An empty string counts as unset.
 */
export const getBuyOptions = (book: Book): BuyOptions => {
  if (book.status !== 'live') return { amazon: null, paperback: null, ebook: null };
  const amazon = book.amazonUrl ? book.amazonUrl : null;
  const paperback = book.paperbackUrl ? book.paperbackUrl : null;
  const ebook = !book.inKdpSelect && book.ebookCheckoutUrl ? book.ebookCheckoutUrl : null;
  return { amazon, paperback, ebook };
};

export const getBook = (slug: string): Book | undefined => books.find((b) => b.slug === slug);

export const booksByGroup = (key: Group): readonly Book[] => books.filter((b) => b.group === key);

export const groupName = (key: Group): string => groups.find((g) => g.key === key)?.name ?? '';

/** The next books in the list, wrapping round, never the book itself. */
export const relatedBooks = (book: Book, count = 4): readonly Book[] => {
  const index = books.findIndex((b) => b.slug === book.slug);
  if (index < 0) return [];
  const related: Book[] = [];
  for (let step = 1; related.length < count && step < books.length; step += 1) {
    const next = books[(index + step) % books.length];
    if (next) related.push(next);
  }
  return related;
};

/** "5 February 2026". Fixed to UTC so the page does not change with the machine that builds it. */
export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso));
