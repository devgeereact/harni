# User Roles

Status: built on localhost, not deployed. See ADR-011 to ADR-016 and ADR-023.

| Role | Purpose | May view | May create or change | May approve or delete | Enforcement |
|---|---|---|---|---|---|
| Visitor (anonymous) | Reads the site, buys on Amazon, joins the mailing list | Every public page | Submits the mailing list form and their cookie choice | Nothing | No accounts exist, so nothing is enforced on a server |
| Owner (Harni Muharami) | Maintains the site | Everything in the repository | Edits the book data file and page words, with AI help, and previews on localhost | Approves any push or deploy | Process rule: nothing is pushed or deployed until the owner says (ADR-016) |
| Mailing list service (external) | Stores subscribers and sends confirmation emails | Subscriber emails | Subscriber records | Unsubscribes | Provider settings, not the site. Provider UNKNOWN |
| Checkout provider (external) | Not used. No ebook is sold on harni.uk while all 13 books are in KDP Select (ADR-023, BR-002) | Not applicable | Not applicable | Not applicable | Not applicable. Revisit only if a book leaves KDP Select |
| Amazon (external) | Sells and delivers the Kindle and paperback copies of all 13 books, and handles refunds | Orders placed on Amazon | Not applicable | Not applicable | Amazon's own terms |

Include administrators, operators, anonymous users, service identities and external parties. Denial behaviour must be explicit and tested.
