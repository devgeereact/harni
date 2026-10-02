# Catalogue

Status: REAL, read from Amazon on 2026-10-01 (ADR-023). Runs on localhost only, not deployed. The data lives in `src/data/books.ts`, which is the working source for the site. Owner review of the covers, blurbs and group labels is NOT DONE.

Author page: https://www.amazon.co.uk/stores/author/B0G27S5PSV

## The 13 books on Amazon.co.uk

All 13 are live as a Kindle ebook and a paperback. All 13 show Kindle Unlimited, so they are enrolled in KDP Select and the ebook must not be sold on harni.uk (BR-002). The site links to Amazon only. No prices are shown (BR-003). Order is Amazon's own popularity order, and the first book is "Most popular". Titles are the tidied site titles. The exact Amazon strings, typos included, are in the `kdpTitle` field.

| # | Title | Group | Kindle ASIN | Paperback ASIN | Published | Pages |
|---|---|---|---|---|---|---|
| 1 | Safe by Design, Safe by Culture | Safe practice | B0GLPP6Q2Y | B0GLXNY8K2 | 5 Feb 2026 | 272 |
| 2 | The Honest Truth About Nurses | Wellbeing for nurses | B0G275LHR4 | B0G1Y6X6LW | 13 Nov 2025 | 321 |
| 3 | Start the Shift, Not the Catch-Up | Safe practice | B0GLPWPT2T | B0GLXCBMXN | 5 Feb 2026 | 268 |
| 4 | Your Next Step in Nursing | Career and voice | B0GLPP275X | B0GLXHQHFX | 5 Feb 2026 | 223 |
| 5 | Speaking Up Smart in the NHS | Career and voice | B0GLPCFRWV | B0GLXT755G | 5 Feb 2026 | 268 |
| 6 | The Triage Mindset | Safe practice | B0GKX58WRC | B0GKVSZMM5 | 1 Feb 2026 | 267 |
| 7 | Care Begins from Home | Safe practice | B0GKX55B9P | B0GKVTNF6S | 1 Feb 2026 | 255 |
| 8 | Hands That Care, Hearts That Hope | Wellbeing for nurses | B0GKWV13BY | B0GKVQ69JZ | 1 Feb 2026 | 210 |
| 9 | The NHS Healer's Handbook | Wellbeing for nurses | B0GJNJD942 | B0GJPLT363 | 24 Jan 2026 | 269 |
| 10 | Beyond the Ward: Joyful Recovery for Nurses | Wellbeing for nurses | B0GJ65NBLP | B0GJPPG848 | 24 Jan 2026 | 177 |
| 11 | From Cleanliness to Clinical Outcomes | Safe practice | B0GJ4724VG | B0GJPZHS1B | 24 Jan 2026 | 268 |
| 12 | Gratitude Reimagined | Everyday life | B0GFPLPNW4 | B0GFW4TCHD | 8 Jan 2026 | 149 |
| 13 | The 30-Day Relationship Reboot | Everyday life | B0G6CZZN8X | B0G62NBRN3 | 11 Dec 2025 | 173 |

Notes:

- Eleven books are NHS nursing and healthcare titles. Two (Gratitude Reimagined and The 30-Day Relationship Reboot) are life titles.
- One review exists on Amazon (5.0, one review, The Honest Truth About Nurses). The site shows no reviews (BR-006).
- Hands That Care, Hearts That Hope is written for NHS staff "who believe God heals". The Relationship Reboot suits Christian couples and includes prayers. The site reproduces the owner's own description text for both. See KNOWN-ISSUES.
- The Amazon listings have title and description glitches the owner should fix in KDP. See KNOWN-ISSUES.

### Four groups (ADR-023)

| Group | Count | Books |
|---|---|---|
| Safe practice | 5 | Safe by Design, Safe by Culture; Start the Shift, Not the Catch-Up; The Triage Mindset; Care Begins from Home; From Cleanliness to Clinical Outcomes |
| Career and voice | 2 | Your Next Step in Nursing; Speaking Up Smart in the NHS |
| Wellbeing for nurses | 4 | The Honest Truth About Nurses; Hands That Care, Hearts That Hope; The NHS Healer's Handbook; Beyond the Ward |
| Everyday life | 2 | Gratitude Reimagined; The 30-Day Relationship Reboot |

The groups sort the titles by topic and add no claims about the books. They replace the three themes of ADR-018.

---

# Historical material, not published

Everything below this line is the earlier planning material. None of it is on Amazon and none of it is on the site. It is kept as history only (ADR-015 and ADR-018 are superseded by ADR-023).

## Former launch ten (ADR-015, superseded by ADR-023, historical planning list, not published)

Chosen by the owner to match the author's background as an NHS nurse and clinical educator: leadership, communication, careers and wellbeing.

| # | Title | List number |
|---|---|---|
| 1 | Leadership Skills: Inspire & Motivate Your Team | 91 |
| 2 | The Art of Public Speaking | 7 |
| 3 | The Art of Negotiation | 49 |
| 4 | Master the Skill of Time Management | 78 |
| 5 | Overcoming Your Fear of Failure | 47 |
| 6 | How to Ace Your Job Interviews | 94 |
| 7 | Mastering the Art of Building a Resume | 73 |
| 8 | Overcome your Anxiety with These Simple Steps | 59 |
| 9 | Tips for Better Sleep | 50 |
| 10 | Mastering the Skill of Meditation | 21 |

- Status of every book: "Coming soon" until the owner says which are live. ASSUMPTION.
- Channel of every book: UNKNOWN. Owner to say Amazon, harni.uk or both (both only if not in KDP Select). See ADR-012.
- Amazon link, checkout link, cover, blurb and excerpt per book: UNKNOWN. Owner supplies. Blurbs and excerpts cannot be invented, so the owner sends a rough outline per book.
- Health titles (anxiety, sleep, meditation) carry a "general guidance, not medical advice" note.

## Earlier launch set (not used)

An online-income set was proposed first and replaced by the owner. It stays here in case it is wanted later: How to Start a Side Hustle; How to Start a Blog; How to Start a Podcast; A Guide to Start a YouTube Channel; How to Build Passive Income Streams; The Beginners Guide to Digital Marketing; How to Use Canva to create Digital Products; How to Guide for Affiliate Marketing; Building an E-commerce Business; How to Build a Sales Funnel.

## Open points

- Numbers 65 and 66 were missing from the owner's list. ASSUMPTION: no titles were lost.
- Spellings to fix before any title goes live, so it matches its KDP listing exactly: "Buiding" (Building), "Sented" (Scented), "Stratigies" (Strategies), "Intermitted" (Intermittent), "Affimation" (Affirmation), "Printable's" (Printables), "in you Business" (in your Business), and "how to Start a Side Hustle" (capital H). None of these is in the launch ten.

## All titles as given (109 supplied, historical planning list, not published)

1. how to Start a Side Hustle
2. Parenting Survival Guide
3. A Guide to Sustainable Living
4. The Beginners Guide to Digital Marketing
5. How to Start a Podcast
6. Vegan Cooking for Beginners
7. The Art of Public Speaking
8. Mastering the Basics of Photoshop
9. Introduction to Investing in Stocks
10. How to Start a Blog
11. Photography for Beginners
12. A Guide to Start a YouTube Channel
13. The Art of Manifestation
14. Keto Diet for Beginners
15. How to Build a Sales Funnel
16. Travel Hack: How to Travel on a Budget
17. How to Build Passive Income Streams
18. Gardening for Beginners
19. How to Puppy Train
20. A Guide to Minimalistic Living
21. Mastering the Skill of Meditation
22. Living on a Budget Guide
23. How to Plan the Perfect Wedding
24. A Comprehensive Guide to SEO Keywords
25. Building Confidence in you Business
26. A Step-by-Step Intro to Crypto Currency
27. How to Shop Affordable Fashion
28. Dominating Your First Year in Real Estate
29. How to Utilize your Social Platform
30. Starting Yoga as a Beginner
31. How to Apply for an LLC
32. Guide to Mastering Amazon Sales
33. Healthy Living Tips & Tricks
34. How to Decorate Your Home: Boho Style
35. Best Guided Journal for Self Love
36. Intermitted Fasting for Beginners
37. Building a 6 Figure Lash Business
38. The Ultimate Booty Building Guide
39. How to Use Canva to create Digital Products
40. Buiding an E-commerce Business
41. My Top Hairstyle Looks for Summer
42. Step-by-Step to Start a Clothing Company
43. How to DJ 101
44. Make-up Hacks for Beginners
45. A Guide to Creative Writing
46. How to Write & Publish a Children's Book
47. Overcoming Your Fear of Failure
48. Guide to Making Sented Candles
49. The Art of Negotiation
50. Tips for Better Sleep
51. Digital Marketing Stratigies for Small Businesses
52. DIY Home Decor on a Budget
53. How to Move to Bali
54. Mastering your Business Brand
55. How to Guide for Affiliate Marketing
56. Hacks you Wish you Knew About Editing Videos
57. Become a Pro at Meal Prepping
58. How to Find your Target Audience
59. Overcome your Anxiety with These Simple Steps
60. Guide to Starting your Own AirBNB Business
61. The Art of Origami
62. The Top 10 Hacks to Pay off Debt Fast
63. How to Make Money on Pinterest.
64. Master the Skill of Attraction Marketing
67. Guide to Macro Counting for Beginners
68. How to Create Digital Printable's
69. Top 10 Tips to Avoid when Starting a Business
70. Mastering the Skill of Mixology
71. How to Manifest your Dream Man
72. Using TikTok as a beginner + Algorithm Tips!
73. Mastering the Art of Building a Resume
74. Feng Shui for Beginners
75. DIY Bridal Make-up
76. My Top 10 Hacks for Glowing Skin
77. How to Land Brand Deals & Collaborations
78. Master the Skill of Time Management
79. The Law of Attraction Guide
80. How to Buy your First Property
81. Make-up Contouring for Beginners
82. How to Manifest Money into your Life
83. Affimation for Self Confidence
84. A Beginner's Guide to Astronomy
85. Blended Families: Navigating & Challenges
86. Baking for Beginners: From Cookies to Cakes
87. Mobile App Development Start up Guide
88. How to Knit or Crochet: A Beginner's Guide
89. Declutter and Organize Your Life Hacks
90. The Art of Dating: Finding Your Perfect Match
91. Leadership Skills: Inspire & Motivate Your Team
92. Web Design Made Simple
93. Digital Nomad: Working & Traveling Full-Time
94. How to Ace Your Job Interviews
95. Solo Traveler's Guide
96. Love Languages: & Understanding Them
97. Artificial Intelligence Explained for Non-Techies
98. DIY Manicures and Nail Design Techniques
99. Finding Your Identity Beyond Motherhood
100. Climate Change Explained: What to Know
101. Professional Spray Tanning at Home Guide
102. Healthy Snacking and Nutrition for Kids
103. How to Save & Invest: Secure Financial Future
104. DIY Natural Beauty & Skin Hacks
105. Handmade Jewelry Crafting
106. Navigating Long-Distance Relationships
107. Healthy Hair: Tips for Strong & Shiny Locks
108. A Comprehensive Guide for Pet Owners
109. Rekindling Romance: Bringing Back Passion
110. Mastering Multiple Streams of Income
111. Financial Survival Guide for Single Moms
