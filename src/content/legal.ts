// The four legal pages (ADR-024). Written from what the site and its mail handler actually do, so each
// statement can be checked against the code: backend/src/message.php, src/features/forms/MailForm.tsx, src/game/storage.ts
// and src/content/site.ts. Every retention period and every decision below is also listed, with its
// reasoning, in docs/05-security/LEGAL-REVIEW.md. Outstanding owner facts are tracked there;
// public postal-address and ICO placeholders were removed at the owner’s request on 2 October 2026.
// These pages are carefully drafted but are not legal advice: the owner should have a UK solicitor
// read them before launch. Version date: 2026-10-17 (the mail handler records the same date as the
// version of the notice and consent wording a visitor agreed to; tests/unit/legal-records.test.ts
// keeps the two equal). 2026-10-17 added Cloudflare's Network Error Logging, seen on the live site.

import { amazonAuthorUrl } from '../data/books.ts';
import { band, emailLink, esc } from './layout.ts';
import type { PageDef } from './layout.ts';
import { site } from './site.ts';

const version = '2026-10-17';
const updated = '17 October 2026';
const subscription = `<!--email_off--><a href="mailto:${site.subscriptionEmail}">${site.subscriptionEmail}</a><!--/email_off-->`;

interface Section {
  readonly id: string;
  readonly heading: string;
  readonly html: string;
}

const legalPage = (title: string, description: string, summary: string, sections: readonly Section[]): PageDef => ({
  title: `${title} | Harni Muharami`,
  description,
  body: `${band('Your information & your rights', title)}
<section class="section"><div class="shell legal">
  <p class="note legal__meta">Version ${version}. Last updated ${updated}.</p>
  <div class="legal__summary"><h2 class="legal__summary-h">In short</h2>${summary}</div>
  <nav class="legal__toc" aria-label="On this page"><h2 class="legal__toc-h">On this page</h2><ol>${sections.map((s) => `<li><a href="#${s.id}">${esc(s.heading)}</a></li>`).join('')}</ol></nav>
  <div class="legal__sections">${sections.map((s) => `<section class="legal__section" aria-labelledby="${s.id}"><h2 id="${s.id}">${esc(s.heading)}</h2><div class="legal__body">${s.html}</div></section>`).join('\n')}</div>
</div></section>`,
});

// ---------------------------------------------------------------------------------------------
// Privacy notice
// ---------------------------------------------------------------------------------------------

export const privacy = (): PageDef =>
  legalPage(
    'Privacy notice',
    'How harni.uk handles your enquiries, mailing-list sign-ups and website data, how long it keeps them, and how to use your rights.',
    `<ul>
<li>I only collect what you choose to send: a contact message, or your email address for book updates.</li>
<li>You get an emailed copy of whatever you send, for your own records.</li>
<li>I do not sell your information, use advertising trackers, or run analytics on this site.</li>
<li>You can unsubscribe, or ask me to delete your information, at any time.</li>
<li>Please never send patient information. This is not a clinical service.</li>
</ul>`,
    [
      {
        id: 'who',
        heading: 'Who I am and how to reach me',
        html: `<p>I am Harni Muharami, an author based in London. I run harni.uk personally and I am the controller of the personal information described here (the person who decides how and why it is used).</p>
<ul>
<li>General enquiries and privacy requests: ${emailLink()}</li>
<li>Book-update sign-ups and unsubscribe requests: ${subscription}</li>
</ul>
<p>Amazon, Instagram, TikTok and the other services linked from this site are separate organisations. They decide for themselves how they use your information and explain it in their own privacy notices.</p>`,
      },
      {
        id: 'collect',
        heading: 'What I collect, why, and how long I keep it',
        html: `<div class="legal-table-wrap"><table class="legal-table"><caption class="visually-hidden">Information collected, the reason, the lawful basis and the retention period</caption>
<thead><tr><th scope="col">What</th><th scope="col">Why I use it</th><th scope="col">Lawful basis</th><th scope="col">How long I keep it</th></tr></thead>
<tbody>
<tr><th scope="row">Contact message: name, email address, optional subject, your message, your acknowledgement of this notice and the Terms (with the version and time)</th><td>To read and answer your message, keep a record of what was said, and show that you were told how your information is used.</td><td>Legitimate interests: handling correspondence you started.</td><td>12 months after the last message in the conversation, then deleted. Longer only if needed to deal with a complaint or legal claim, and then no longer than six years.</td></tr>
<tr><th scope="row">The emailed copy of your message (sent to the address you gave)</th><td>So you have a reference of exactly what you sent.</td><td>Legitimate interests, and good practice for your benefit.</td><td>It sits in your own inbox, so you control it. My sent copy follows the period above.</td></tr>
<tr><th scope="row">Book-update sign-up: email address, your consent, the wording you agreed to and its version, the date and time, and a reference</th><td>To email you when a new book comes out, and to prove that you asked.</td><td>Your consent (UK GDPR and the Privacy and Electronic Communications Regulations). You can withdraw it at any time.</td><td>While you stay subscribed. After you unsubscribe I delete the sign-up record within 12 months.</td></tr>
<tr><th scope="row">Do-not-email record: your email address only, after you unsubscribe</th><td>To make sure I never email you by mistake.</td><td>Legitimate interests: respecting your choice. You can object and ask me to delete it, but then I cannot promise to stop an accidental re-sign-up.</td><td>Until you ask me to delete it, or I stop running a mailing list.</td></tr>
<tr><th scope="row">Technical data when you visit: IP address, pages requested, time, browser type</th><td>To deliver the site, keep it secure and block abuse.</td><td>Legitimate interests: running a safe website.</td><td>Held by my web host and Cloudflare under their own schedules. I do not keep my own copy.</td></tr>
<tr><th scope="row">Connection error reports: if your browser fails to reach harni.uk, it may send Cloudflare a short report with the page address, the type of error, the time and your IP address</th><td>To let Cloudflare detect and fix network problems that stop the site loading.</td><td>Legitimate interests: keeping the site reachable.</td><td>Held by Cloudflare under its own schedule. Your browser keeps the instruction to send these reports for up to 7 days after a visit.</td></tr>
<tr><th scope="row">Form protection counters: a one-way keyed hash of your IP address and of your email address, with a count</th><td>To stop someone using the forms to flood inboxes. No readable address or message is stored.</td><td>Legitimate interests: preventing abuse.</td><td>Each counter expires one hour after it starts and is deleted the next time anyone uses a form.</td></tr>
<tr><th scope="row">Pier Run best score, only if you tick the box</th><td>To remember your best score on that device.</td><td>Your consent: nothing is saved unless you choose it.</td><td>Until you untick the box, press Delete saved score, or clear your browser data. It never leaves your device.</td></tr>
</tbody></table></div>
<p>This site has no accounts, no checkout, no comments and no advertising or analytics code. Fonts, book covers and the map data for the contact page globe are all served from harni.uk itself, so your browser does not contact other companies when you read the pages.</p>`,
      },
      {
        id: 'forms',
        heading: 'How the contact and sign-up forms work',
        html: `<p><strong>Contact form.</strong> When you send a message, the site passes it to my mail server, which delivers it to ${emailLink()} and sends a separate copy to the address you typed. That copy has a reference number, the date and time, your name, subject and full message, and a note of what you agreed to. Please type your own address carefully: the copy goes there. A contact message never signs you up to the mailing list.</p>
<p><strong>Sign-up form.</strong> When you tick the consent box and submit your email address, the site delivers a notice to ${subscription} and sends a copy of your sign-up to you, with the exact consent wording, the date and time, a reference and how to unsubscribe. I manage the list by hand from that mailbox. There is no automatic mailing service and no subscriber database on this website. Your consent is recorded in that email.</p>
<p><strong>What the page tells you.</strong> The form tells you when the mail service has accepted your message, but that does not guarantee it reaches an inbox. If your copy does not arrive, check your spam folder. If the form says sending is unavailable, nothing was sent and you can email me directly.</p>
<p><strong>Not a clinical service.</strong> Please do not send patient details, health records, passwords, payment-card details or confidential information about other people. If something sensitive reaches me by mistake I will delete it and, where needed, tell you.</p>`,
      },
      {
        id: 'marketing',
        heading: 'Book-update emails',
        html: `<p>I will only email you about new books, as you asked. I will not pass your address to anyone to market their own products. Each email will say who it is from and how to leave.</p>
<p>To unsubscribe at any time, reply to any of my emails with the word <em>Unsubscribe</em>, or email ${subscription}. I will remove you before the next mailing. Withdrawing consent does not affect anything I did lawfully before.</p>`,
      },
      {
        id: 'recipients',
        heading: 'Who receives your information',
        html: `<ul>
<li><strong>My web host and Cloudflare</strong>, who deliver and protect harni.uk and so see the technical data in the table above.</li>
<li><strong>My email providers</strong>, who carry and store the messages and sign-up notices in the harni.uk mailboxes, and your own email provider, which receives your copy.</li>
<li><strong>Professional advisers</strong> (for example a solicitor or accountant) and <strong>public authorities</strong>, only where necessary to deal with a legal matter or to meet a legal duty.</li>
</ul>
<p>These providers act on my instructions as processors, or in some cases as separate controllers under their own terms. I do not sell your information. I do not use it for advertising profiles, and I make no decisions about you by automated means that have legal or similarly significant effects.</p>
<p>Following a link to Amazon, Instagram or TikTok takes you to that company. Book purchases are made with Amazon: harni.uk does not see your order, your payment details or your Amazon account. I cannot access your Amazon account or see who has bought a book.</p>`,
      },
      {
        id: 'transfers',
        heading: 'Sending information outside the UK',
        html: `<p>Some providers, including Cloudflare and email services, may handle information on servers outside the UK. Where that happens, UK law requires a safeguard, such as an adequacy decision, the UK addendum to approved contractual clauses, or the UK extension to the EU-US Data Privacy Framework. If you would like to know which safeguard applies to your information, email ${emailLink()}.</p>`,
      },
      {
        id: 'security',
        heading: 'Keeping information safe',
        html: `<p>The site is delivered over an encrypted (HTTPS) connection. The forms accept requests only from harni.uk, the recipients are fixed on the server so a form cannot be used to email anyone else, hidden fields and rate limits block automated abuse, and only I read the harni.uk mailboxes. No system is perfectly secure, so please send only what is needed.</p>
<p>If a security incident is likely to put your rights at risk, I will tell the Information Commissioner's Office within 72 hours of becoming aware, and I will tell you without undue delay where the law requires it.</p>`,
      },
      {
        id: 'rights',
        heading: 'Your rights',
        html: `<p>You have the right to ask me for a copy of your information, to have it corrected or deleted, to restrict how I use it, to object to uses based on legitimate interests, and, where it applies, to receive it in a portable form. You can object to direct marketing at any time, and you can withdraw consent at any time. These rights are not absolute and some have exceptions.</p>
<p>To use a right, email ${emailLink()}. I may ask for proportionate proof of identity. I will reply within one month and tell you if I need longer and why. There is normally no charge.</p>
<p>If you are unhappy with how I have handled your information you can complain to the UK Information Commissioner's Office at <a href="https://ico.org.uk/make-a-complaint/">ico.org.uk/make-a-complaint</a>. You are welcome to complain to me first (see below), but you do not have to.</p>`,
      },
      {
        id: 'complaints',
        heading: 'Complaints about your information',
        html: `<p>If you think I have not handled your personal information properly, you can complain to me. Use the <a href="/contact/">contact form</a> with the subject &ldquo;Data protection complaint&rdquo;, or email ${emailLink()} with that subject. Tell me what happened and what you would like me to do. You do not need to use any particular words.</p>
<p>I will acknowledge your complaint within 30 days of receiving it, look into it without undue delay, keep you updated, and tell you the outcome. Making a complaint to me does not stop you complaining to the Information Commissioner's Office at any time.</p>`,
      },
      {
        id: 'children',
        heading: 'Children',
        html: `<p>My books and this website are for adults. Please do not submit information about, or on behalf of, a child. If you think a child has sent me their details, email me and I will delete them.</p>`,
      },
      {
        id: 'storage',
        heading: 'Cookies and similar storage',
        html: `<p>This site sets no cookies of its own and stores nothing in your browser unless you choose to save a Pier Run score. The <a href="/cookies/">cookies and local storage notice</a> lists each item.</p>`,
      },
      {
        id: 'changes',
        heading: 'Changes to this notice',
        html: `<p>If the site changes in a way that affects your information, I will update this page before the change takes effect and change the version date at the top. Older versions that you agreed to are recorded in the emails sent to you at the time.</p>`,
      },
    ],
  );

// ---------------------------------------------------------------------------------------------
// Cookies and local storage
// ---------------------------------------------------------------------------------------------

export const cookies = (): PageDef =>
  legalPage(
    'Cookies & local storage',
    'harni.uk sets no cookies and loads no trackers. The only item it can store on your device is an optional Pier Run best score.',
    `<ul>
<li>This site sets no cookies and has no analytics, advertising or social media trackers.</li>
<li>The only thing it can remember on your device is your best Pier Run score, and only if you tick a box.</li>
<li>You can delete that score at any time from the game page, or by clearing your browser data.</li>
</ul>`,
    [
      {
        id: 'what',
        heading: 'What these technologies are',
        html: `<p>Cookies are small files that a website asks your browser to keep. Local storage does a similar job inside your browser. UK rules (the Privacy and Electronic Communications Regulations) apply to both. They require your consent before a site stores something on your device, unless it is strictly necessary for a service you asked for. This notice covers both.</p>`,
      },
      {
        id: 'used',
        heading: 'What harni.uk stores on your device',
        html: `<div class="legal-table-wrap"><table class="legal-table"><caption class="visually-hidden">Items this website can store on your device</caption>
<thead><tr><th scope="col">Item</th><th scope="col">What it is</th><th scope="col">Purpose</th><th scope="col">How long</th><th scope="col">Consent</th></tr></thead>
<tbody>
<tr><th scope="row">Cookies set by this site</th><td>None.</td><td>Not applicable.</td><td>Not applicable.</td><td>Not applicable.</td></tr>
<tr><th scope="row"><code>harni.pier-run.best</code></th><td>Local storage on the game page.</td><td>Remembers your best Pier Run score on this device.</td><td>Until you delete it or clear your browser data.</td><td>Yes. It is saved only after you tick &ldquo;Remember my best score on this device&rdquo;. The box is unticked on every visit.</td></tr>
</tbody></table></div>
<p>The score is never sent to me or to anyone else. If you untick the box, or press &ldquo;Delete saved score&rdquo;, the stored score is removed. If your browser blocks storage the page says so instead of pretending it worked.</p>`,
      },
      {
        id: 'none',
        heading: 'What the site does not use',
        html: `<p>The pages load no analytics, advertising or tracking code, no embedded social media feeds, no third-party video players and no external fonts, images or map services. Links to Amazon, Instagram and TikTok are ordinary links: those companies only see you after you follow them, and their own cookie notices then apply.</p>`,
      },
      {
        id: 'infrastructure',
        heading: 'Hosting and security',
        html: `<p>The live site is delivered by a web host and through Cloudflare. To keep the site fast and secure, and to stop abusive traffic, those services may set or read essential security items, for example when they check that a visitor is not a robot. These are strictly necessary for security, they are not used for advertising, and they depend on the live configuration, which can change. They are separate from the Pier Run score above.</p>
<p>Cloudflare also uses Network Error Logging. Each page response asks your browser to remember, for up to 7 days, to send Cloudflare a short report if a later visit fails to connect. The report holds the page address, the type of error, the time and your IP address. It is not a cookie, it is not used for advertising, and your browser handles it outside the page. The <a href="/privacy/#collect">privacy notice</a> explains how this information is used.</p>`,
      },
      {
        id: 'manage',
        heading: 'Managing storage',
        html: `<p>You can see, block or delete cookies and local storage in your browser's settings. Blocking them will not stop you reading the site or playing the game; your score just will not be remembered.</p>`,
      },
      {
        id: 'future',
        heading: 'If this changes',
        html: `<p>If I ever add analytics or another tool that stores or reads information on your device, I will ask for your consent first, with equally easy Accept and Reject choices, and update this notice and the <a href="/privacy/">privacy notice</a> before it starts. Questions: ${emailLink()}.</p>`,
      },
    ],
  );

// ---------------------------------------------------------------------------------------------
// Website terms
// ---------------------------------------------------------------------------------------------

export const terms = (): PageDef =>
  legalPage(
    'Website terms',
    'The terms for using harni.uk: what the site and books are, what they are not, your messages, copyright, the limits of my responsibility and your legal rights.',
    `<ul>
<li>harni.uk is an author website. It does not sell books: Amazon does.</li>
<li>The books and site give general guidance. They are not medical or legal advice and not official NHS guidance.</li>
<li>I write in a personal capacity. These are my views, not those of my employer or the NHS.</li>
<li>Nothing here limits legal rights that cannot be limited.</li>
</ul>`,
    [
      {
        id: 'about',
        heading: 'About these terms',
        html: `<p>harni.uk is the author website of Harni Muharami (&ldquo;I&rdquo;, &ldquo;me&rdquo;). By using it you agree to these terms. If you do not agree, please do not use the site. They sit alongside the <a href="/privacy/">privacy notice</a> and the <a href="/cookies/">cookies notice</a>, and they do not take away any right you have under the law that cannot be excluded. Contact: ${emailLink()}.</p>`,
      },
      {
        id: 'books',
        heading: 'Books, Amazon and purchases',
        html: `<p>This site introduces my books and gives ways to contact me. It does not take orders, collect payments or provide a checkout. Each buy link opens the book's page on <a href="${esc(amazonAuthorUrl)}">Amazon.co.uk</a>, where Amazon is the seller and its own terms apply to the sale, delivery, returns and refunds. Check the edition, format, price, availability and seller on Amazon before you buy. Kindle Unlimited access depends on Amazon's current offer and your eligibility.</p>
<p>Book information on this site, such as titles, descriptions, publication dates, page counts and formats, is taken from the Amazon listings and may lag behind a change there. Where they differ, the Amazon listing for the edition you are buying is correct. My Amazon links contain no affiliate tag. See <a href="/delivery-and-refunds/">delivery and refunds</a> for where to get help with an order.</p>`,
      },
      {
        id: 'advice',
        heading: 'General guidance, not advice',
        html: `<p>The books and this website offer general education, information and reflection for healthcare professionals and other readers. They are <strong>not</strong> medical, clinical, nursing, legal, employment, financial or psychological advice, they are not a diagnosis or treatment, and they are not official NHS, regulatory or professional-body guidance. They do not replace your own professional judgement, your registration obligations, your employer's policies or the advice of a suitably qualified person who knows your situation.</p>
<p>Healthcare practice, law and guidance change. Check current, authoritative sources and local policy before relying on anything in a book, and never use a book or this site to make an urgent decision about a patient or yourself. If you or someone else is in danger or seriously unwell, contact the emergency services or a clinician straight away.</p>
<p>I make no promise about any particular result, outcome, career step or level of wellbeing. Where a book describes an approach that worked for others, it may not work for you.</p>`,
      },
      {
        id: 'capacity',
        heading: 'Personal capacity and no endorsement',
        html: `<p>${esc(site.personalCapacity)} I am an NHS nurse and clinical educator, but this website and my books are my own work. They are not produced, reviewed, approved or endorsed by the NHS, any NHS organisation or any employer, and nothing here is an official statement by them. NHS and other organisation names are used only to describe my background and who my books are for.</p>
<p>Case examples in books and on this site are general illustrations. They are not intended to identify any real patient, colleague or workplace, and they must not be used to identify one.</p>`,
      },
      {
        id: 'messages',
        heading: 'Messages and sign-ups you send me',
        html: `<p>You are responsible for what you send. Only send material you have the right to share, and do not send anything unlawful, abusive, defamatory or confidential, or any patient or workplace information. Sending a message creates no professional, clinical, advisory or client relationship between us, and I cannot give personal medical, clinical or legal advice.</p>
<p>By sending a message you give me permission to read it, store it and reply to it as described in the privacy notice. It does not give me permission to publish it. I will not quote your words or name you on this site unless you agree in writing first. An automatic reference copy is an acknowledgement, not a promise of a reply by a set date.</p>
<p>Book-update emails are sent only to people who ticked the consent box. You can unsubscribe at any time.</p>`,
      },
      {
        id: 'events',
        heading: 'Events and enquiries',
        html: `<p>An enquiry about an event does not reserve a date or agree a fee, attendance or content. Any arrangement has to be agreed directly and in writing. Where an event is run by an organiser, their booking terms apply to you, and I am not responsible for what they do.</p>`,
      },
      {
        id: 'copyright',
        heading: 'Copyright and trade marks',
        html: `<p>The books, the text, images, designs and other material on this site belong to me or to the rights holder named, and are protected by copyright. You may read the site, share links to it and quote short extracts for criticism, review, quotation or other uses the law allows (known as fair dealing), with a clear credit to Harni Muharami and the title. Beyond that, please ask in writing before you copy, republish, translate, adapt or sell any part of it. Buying or borrowing a book gives you the right to read that copy and does not transfer any copyright.</p>
<p>Amazon, Kindle, Kindle Unlimited, Instagram, TikTok, Cloudflare and NHS are names or trade marks of their owners. I have no connection with them beyond using their services or describing my work, and their use here is not an endorsement.</p>`,
      },
      {
        id: 'use',
        heading: 'Using the site properly',
        html: `<p>Please do not misuse the site. In particular, do not impersonate anyone, submit another person's details without their permission, send spam, try to gain unauthorised access, introduce malicious code, overload the forms, scrape the site in a way that disrupts it, or use the forms to email people who have not asked to hear from you. I may block access or report abuse where the law allows.</p>
<p><strong>Pier Run</strong> is a free game for a short break. It has no prizes, no paid entry and no online leaderboard, and scores stay on your device. Take regular breaks, and stop playing if the movement or flashing bothers you.</p>`,
      },
      {
        id: 'links',
        heading: 'Links, availability and accuracy',
        html: `<p>Other websites and services are independent. A link is not a recommendation, and I am not responsible for their content, availability or privacy practices. I take care to keep this site accurate and running, but I cannot promise it will always be available, error-free or up to date, and I may change, pause or remove any part of it. If you spot a mistake, please tell me through the <a href="/contact/">contact page</a>.</p>`,
      },
      {
        id: 'liability',
        heading: 'My responsibility to you',
        html: `<p>Nothing in these terms limits or excludes my liability for death or personal injury caused by negligence, for fraud or fraudulent misrepresentation, or for anything else that cannot lawfully be limited or excluded. If you are a consumer, your statutory rights, including those under the Consumer Rights Act 2015, are not affected.</p>
<p>Subject to that, and because this site and its content are provided free and for general information: (a) they are provided &ldquo;as is&rdquo;, without any promise that they are complete, current or suitable for your purposes; (b) I am not responsible for losses that come from relying on general information here instead of professional advice, from decisions you make about patient care, your work or your health, or from the actions of third parties such as Amazon or other linked services; and (c) I am not responsible for loss of profit, business, revenue or opportunity, or for any loss I could not reasonably have foreseen. My total responsibility for any claim connected with the free use of this site is limited to the extent the law allows.</p>`,
      },
      {
        id: 'general',
        heading: 'Changes, law and disputes',
        html: `<p>I may update these terms when the site or the law changes. The version date at the top shows which version applies. Changes do not take away rights you already have, and they apply to your use of the site after the change. If any part of these terms is found not to be enforceable, the rest stays in force. These terms and the free use of this site are governed by the law of England and Wales, and the courts of England and Wales can hear disputes, but if you are a consumer living elsewhere in the UK you keep any right to bring a claim in your local courts. Please contact me first at ${emailLink()} if you have a concern, and I will try to put it right. You may also contact a regulator or use any complaints process that applies.</p>`,
      },
    ],
  );

// ---------------------------------------------------------------------------------------------
// Delivery and refunds
// ---------------------------------------------------------------------------------------------

export const delivery = (): PageDef =>
  legalPage(
    'Delivery & refunds',
    'harni.uk does not sell books: Amazon does. Where to get help with an order, Kindle delivery, a paperback return or a problem with a book.',
    `<ul>
<li>harni.uk takes no orders and no payments. Amazon sells and delivers my books.</li>
<li>For delivery, returns or refunds, use your Amazon account and Amazon's help.</li>
<li>If something is wrong with the book itself, email me and I will look into it.</li>
</ul>`,
    [
      {
        id: 'who',
        heading: 'Who sells the books',
        html: `<p>harni.uk is an author website and catalogue. It does not sell or deliver books and it does not take payment. Every purchase button opens the book's page on Amazon.co.uk, where the listing shows the seller, the formats, the price and the purchase terms. Your contract for a purchase is with the seller named by Amazon.</p>`,
      },
      {
        id: 'paperbacks',
        heading: 'Paperbacks',
        html: `<p>Check the delivery estimate and the seller on Amazon before you order. For a late, missing, damaged or wrong item, start from the order in your Amazon account and follow the seller's support and returns process. Time limits and who pays for a return depend on the terms that apply to your order and on your legal rights.</p>`,
      },
      {
        id: 'kindle',
        heading: 'Kindle ebooks and Kindle Unlimited',
        html: `<p>Amazon handles Kindle purchases, downloads and account access. Check that your device or app is compatible and that you have the right edition before you buy. For a download problem or a refund request, use Amazon's Kindle or order support. Kindle Unlimited borrowing is governed by Amazon's terms.</p>`,
      },
      {
        id: 'rights',
        heading: 'Your rights',
        html: `<p>This page does not set a separate return window or refund policy, because I do not sell the books. Use the terms that apply to your order, and the rights the law gives you, including your rights as a consumer. Nothing on this site reduces them. I cannot see your Amazon account, process a refund for Amazon, or cancel an Amazon order.</p>`,
      },
      {
        id: 'content',
        heading: 'A problem with the book itself',
        html: `<p>If you find a typo, a factual concern or a formatting or printing fault, email ${emailLink()} or use the <a href="/contact/">contact page</a>, and tell me the title, the format, the chapter or page, and what is wrong. For physical damage or a printing fault, also contact the seller through Amazon so they can deal with the order. Please do not send card details, passwords or unnecessary personal information. You can also visit <a href="https://www.amazon.co.uk/gp/help/customer/display.html">Amazon Customer Service</a>.</p>`,
      },
    ],
  );
