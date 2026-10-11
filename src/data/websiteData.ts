// Website Data Configurations for Beyond Book Publishing (BeyondBookpublishing.com)
import {
  TestimonialItem,
  AuthorItem,
  TeamMemberItem,
  PortfolioBookItem,
  PricingPackageItem,
  BlogPostItem
} from "../types";

export type { TestimonialItem, AuthorItem, TeamMemberItem, PortfolioBookItem, PricingPackageItem, BlogPostItem };

export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: "Working with Beyond Book Publishing was a transformative experience. They brought my story to life with an elegance and precision I couldn't have achieved on my own. Retaining 100% of my royalties made all the difference.",
    name: "Sarah Johnson",
    title: "Bestselling Memoir Author",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    quote: "The ghostwriting team at Beyond Book Publishing was extraordinarily professional and captured my authentic leadership voice. My business strategy book hit the Amazon Top 10 Bestseller list within three weeks of launch.",
    name: "Michael Rodriguez",
    title: "CEO & Bestselling Author",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    quote: "From initial concept outline to global distribution across IngramSpark and Amazon KDP, every phase was transparent and stress-free. Beyond Book Publishing is the benchmark for modern author-first publishing.",
    name: "Jennifer Lee",
    title: "Fiction & Sci-Fi Novelist",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150"
  }
];

export const FEATURED_AUTHORS: AuthorItem[] = [
  { name: "James Carter", genre: "Thriller & Suspense", img: "/author-1.png" },
  { name: "Amara Williams", genre: "Contemporary Romance", img: "/author-2.png" },
  { name: "David Chen", genre: "Hard Sci-Fi & Speculative", img: "/author-3.png" },
  { name: "Linda Foster", genre: "Memoir & Biography", img: "/author-4.png" },
  { name: "Carlos Rivera", genre: "Business & Leadership", img: "/author-5.png" },
  { name: "Yuki Tanaka", genre: "Literary Fiction", img: "/author-6.png" }
];

export const TEAM_MEMBERS: TeamMemberItem[] = [
  {
    name: "Jonathan M. Blake",
    role: "Founder & Executive Director",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "20+ years steering publishing operations across Manhattan houses and modern author-first imprints. Champion of 100% author royalties."
  },
  {
    name: "Sarah E. Collins",
    role: "Head of Ghostwriting Guild",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "NYT bestselling ghostwriter with 80+ commercially published fiction and non-fiction titles under NDA."
  },
  {
    name: "Marcus D. Wright",
    role: "Senior Editorial Director",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Former senior acquisitions editor guiding manuscripts from developmental structuring to pristine line precision."
  },
  {
    name: "Amanda R. Foster",
    role: "Global Distribution Strategist",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Architect of worldwide print, digital, and library catalogue distribution networks spanning 40,000+ retail outlets."
  },
  {
    name: "Daniel H. Torres",
    role: "Creative Director & Cover Lead",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Award-winning book cover art director featured in Publishers Weekly, Shelf Awareness, and Book Riot."
  },
  {
    name: "Lisa C. Nguyen",
    role: "Author Success Manager",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Dedicated concierge ensuring seamless chapter delivery milestones, transparent revisions, and stress-free launch execution."
  }
];

export const PORTFOLIO_BOOKS: PortfolioBookItem[] = [
  { img: "/book-cover-1.webp", title: "The Silent Witness", author: "Eleanor Vance", genre: "True Crime", rating: "4.9", year: "2024" },
  { img: "/book-cover-2.webp", title: "Golden Hour", author: "Amelia Rose", genre: "Romance", rating: "4.8", year: "2024" },
  { img: "/book-cover-3.webp", title: "The Dragon's Blade", author: "Lara Vance", genre: "Fantasy", rating: "4.9", year: "2023" },
  { img: "/book-cover-4.webp", title: "The Sundered Dawn", author: "Ava Reid", genre: "Biblical", rating: "4.7", year: "2023" },
  { img: "/book-cover-5.webp", title: "Rising Sun", author: "Kaizen Moore", genre: "Human Resources", rating: "4.8", year: "2024" },
  { img: "/book-cover-6.webp", title: "The Final Act", author: "Elara Stone", genre: "Illustration", rating: "4.9", year: "2023" },
  { img: "/book-cover-7.webp", title: "Shadow Protocol", author: "J.R. Black", genre: "Real Estate", rating: "4.8", year: "2024" },
  { img: "/book-cover-8.webp", title: "Nightfall Manor", author: "D. Thorne", genre: "Fantasy", rating: "4.7", year: "2023" },
  { img: "/book-cover-1.webp", title: "Crown of Embers", author: "M.K. Davis", genre: "Fantasy", rating: "4.9", year: "2024" },
  { img: "/book-cover-2.webp", title: "Midnight in Manhattan", author: "Clara Bell", genre: "Romance", rating: "4.8", year: "2024" },
  { img: "/book-cover-3.webp", title: "Dust & Thunder", author: "Tom Rider", genre: "Illustration", rating: "4.7", year: "2023" },
  { img: "/book-cover-4.webp", title: "The Evidence Board", author: "Sara Hill", genre: "True Crime", rating: "4.8", year: "2024" },
  { img: "/book-cover-5.webp", title: "Sunrise Over America", author: "L. Foster", genre: "Memoir", rating: "4.9", year: "2024" },
  { img: "/book-cover-6.webp", title: "Beyond the Rings", author: "A. Turing", genre: "Biblical", rating: "4.8", year: "2023" },
  { img: "/book-cover-7.webp", title: "Storm Caller", author: "Y. Tanaka", genre: "Fantasy", rating: "4.7", year: "2023" },
  { img: "/book-cover-8.webp", title: "The Last Grave", author: "C. Rivera", genre: "True Crime", rating: "4.8", year: "2024" },
  { img: "/book-cover-1.webp", title: "Dead Reckoning", author: "P. Stone", genre: "Human Resources", rating: "4.9", year: "2024" },
  { img: "/book-cover-3.webp", title: "Ember & Ash", author: "W. James", genre: "Fantasy", rating: "4.8", year: "2023" }
];

export const PORTFOLIO_FILTERS: string[] = ["All", "Real Estate", "Fantasy", "Romance", "Biblical", "Human Resources", "Illustration", "True Crime", "Memoir"];

export const PRICING_PACKAGES: Record<string, PricingPackageItem[]> = {
  Writing: [
    { name: "Starter", price: "$999", period: "one-time", features: ["Up to 5,000 words", "1 professional ghostwriter", "2 revision rounds", "Proofreading included", "Manuscript in Word format", "100% copyright ownership"], cta: "Get Started" },
    { name: "Professional", price: "$2,499", period: "one-time", badge: "Most Popular", features: ["Up to 20,000 words", "Dedicated senior ghostwriter", "Unlimited revisions", "Proofreading + line editing", "Chapter-by-chapter delivery", "Bi-weekly consultation calls", "100% royalty rights"], cta: "Get Started" },
    { name: "Premium", price: "$5,999", period: "one-time", features: ["Full-length book (up to 80,000 words)", "Elite bestselling ghostwriter", "Unlimited revisions", "Complete developmental package", "Dedicated project manager", "Publishing strategy included", "Author rights preserved"], cta: "Get Started" }
  ],
  Editing: [
    { name: "Proofreading", price: "$299", period: "one-time", features: ["Grammar & spelling corrections", "Punctuation & typo fixes", "Consistency & syntax check", "3-5 business day turnaround", "Track Changes delivery"], cta: "Get Started" },
    { name: "Copy Editing", price: "$599", period: "one-time", badge: "Most Popular", features: ["Everything in Proofreading", "Sentence clarity & tone polish", "Chicago Manual style compliance", "Author feedback reconciliation", "7-day turnaround"], cta: "Get Started" },
    { name: "Developmental", price: "$1,299", period: "one-time", features: ["Comprehensive structural analysis", "Plot, pacing & tension evaluation", "Character arc development", "Multi-page editorial diagnostic memo", "60-min strategy consultation call", "Follow-up revision check"], cta: "Get Started" }
  ],
  Publishing: [
    { name: "Basic", price: "$499", period: "one-time", features: ["Amazon KDP setup & formatting", "eBook formatting (Mobi & ePub)", "Custom ISBN registration", "Keyword & category research", "Author Central verification"], cta: "Get Started" },
    { name: "Standard", price: "$999", period: "one-time", badge: "Most Popular", features: ["Everything in Basic", "Paperback & Hardcover print setup", "IngramSpark global distribution", "Barnes & Noble catalogue listing", "A+ Enhanced Brand Content", "Barcode & copyright registration"], cta: "Get Started" },
    { name: "Complete", price: "$1,999", period: "one-time", features: ["Everything in Standard", "Distribution to 40,000+ bookstores & libraries", "Audiobook publishing on ACX", "Custom author website setup", "National press release distribution", "Dedicated publishing concierge"], cta: "Get Started" }
  ],
  Marketing: [
    { name: "Launch", price: "$799", period: "one-time", features: ["Social media media launch kit", "5 custom promotional book banners", "Amazon listing copy optimization", "Email announcement sequence", "Step-by-step launch roadmap"], cta: "Get Started" },
    { name: "Growth", price: "$1,799", period: "monthly", badge: "Most Popular", features: ["Everything in Launch", "30-day managed social campaign", "Amazon AMS advertising setup & management", "Goodreads author page optimization", "2 custom author articles monthly", "Monthly analytics & ROI reports"], cta: "Get Started" },
    { name: "Authority", price: "$3,499", period: "monthly", features: ["Everything in Growth", "Comprehensive public relations blitz", "Podcast booking outreach (10+ shows)", "Influencer reviewer distribution", "Cinematic book trailer production", "Dedicated senior marketing manager"], cta: "Get Started" }
  ],
  Combo: [
    { name: "Elite Author", price: "$4,999", period: "one-time", badge: "Greatest Value", features: ["Up to 40,000 words ghostwritten", "Full editorial suite (developmental + copy editing)", "Amazon Print & eBook publishing setup", "Custom premium cover design (print & digital)", "30-day growth marketing campaign", "100% royalty ownership guarantee"], cta: "Get Started" },
    { name: "Bestseller Combo", price: "$8,999", period: "one-time", badge: "Elite Choice", features: ["Full-length book (up to 80,000 words) ghostwritten", "Deluxe interior formatting & foil cover layout", "Global 40,000+ retailer distribution network", "Studio audiobook narration & release", "90-day comprehensive authority PR campaign", "Lifetime VIP priority publishing advisory"], cta: "Get Started" }
  ]
};

export const PRICING_CATEGORIES: string[] = ["Writing", "Editing", "Publishing", "Marketing", "Combo"];

// 10 UNIQUE, ORIGINAL, COMPREHENSIVE BLOG POSTS (NO PREVIOUS DUPLICATES, NO COPYRIGHT ISSUES)
export const BLOG_POSTS: BlogPostItem[] = [
  {
    id: "blog-1",
    slug: "ultimate-blueprint-self-publishing-2026",
    category: "Self-Publishing",
    title: "The Ultimate Blueprint to Self-Publishing in 2026: From Raw Manuscript to Global Bestseller",
    excerpt: "Master every critical stage of modern independent book publishing. Learn how author-first publishing lets you retain 100% royalties while outperforming traditional presses.",
    author: "Beyond Book Editorial Team",
    authorRole: "Senior Publishing Strategists",
    date: "February 12, 2026",
    readTime: "9 min read",
    img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800&h=500",
    tags: ["Self-Publishing", "Amazon KDP", "Royalties", "IngramSpark"],
    content: `## The Modern Publishing Paradigm: You Own the Stage

In traditional publishing, authors surrendered up to 88% of their royalties and spent 18 to 36 months waiting for gatekeepers to greenlight their manuscripts. In 2026, the author-first model pioneered by **Beyond Book Publishing** has completely overturned this archaic status quo. Today, self-published authors earn up to 70% royalties on digital sales and up to 55% on print distribution, all while maintaining absolute intellectual property ownership.

### Step 1: Manuscript Polishing & Structural Integrity
Before you invest in layout or marketing, your manuscript must achieve competitive commercial standards:
- **Structural Blueprinting:** Ensure narrative tension, logical chapter transitions, and compelling value delivery.
- **Copy Editing:** Align spelling, syntax, and punctuation with the Chicago Manual of Style.
- **Format Verification:** Verify front matter (title page, copyright, dedication) and back matter (call to action, author bio, newsletter link).

### Step 2: The Visual Anchor: Cover & Interior Typesetting
Readers process visual covers within 1.2 seconds. A successful self-published title requires:
- Thumbnail legibility optimized for mobile search results.
- Custom spine width calculation matching printer paper stock (white vs. cream).
- Flawless interior typography with proportional margins, running headers, and drop caps.

### Step 3: Strategic Dual-Channel Distribution
Do not restrict your book to a single retailer. At Beyond Book Publishing, we recommend pairing Amazon KDP for maximum digital visibility with IngramSpark for bookstore, library, and international academic catalogue penetration.

**Key Takeaway:** Retaining 100% of your rights and royalties is not a luxury—it is the modern standard for forward-thinking authors.`
  },
  {
    id: "blog-2",
    slug: "how-to-hire-elite-ghostwriter-framework",
    category: "Ghostwriting",
    title: "How to Hire an Elite Ghostwriter: The Non-Negotiable Vetting Framework for Authors",
    excerpt: "Avoid ghostwriting scams, uncredited copy-paste mills, and voice mismatches. Here is the exact 5-point evaluation framework used by high-profile leaders.",
    author: "Julian Vance",
    authorRole: "Head of Ghostwriting Guild",
    date: "February 4, 2026",
    readTime: "11 min read",
    img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800&h=500",
    tags: ["Ghostwriting", "Author Strategy", "Voice Matching", "NDA"],
    content: `## Why Great Ideas Fail Without the Right Collaborative Partner

Every year, thousands of visionary executives, physicians, memoirs, and fiction creators seek ghostwriting assistance. Yet nearly 40% experience buyer remorse due to poor voice capture, missed deadlines, or undisclosed AI-generated content.

### 1. Evaluate Bestseller Credit History & Commercial Track Record
Never hire a ghostwriter who cannot provide verified references of books published through recognized imprints or Amazon bestsellers. Ask for:
- Detailed narrative samples spanning multiple tones and styles.
- Verifiable proof of end-to-end completion of 50,000+ word manuscripts.
- Clear references from past author clients.

### 2. Insist on Real Voice-Matching Auditions
A genuine master ghostwriter does not write in their own voice; they become your literary chameleon. Before signing a full contract:
- Conduct a 45-minute recorded discovery interview.
- Request a 1,500-word paid sample chapter based on your interview notes.
- Evaluate whether the vocabulary, cadence, and storytelling rhythm mirror your authentic personality.

### 3. Absolute Copyright Ownership & Ironclad NDAs
Your ghostwriter must sign an all-inclusive Non-Disclosure Agreement (NDA) and Work-for-Hire agreement. At **Beyond Book Publishing**, all intellectual property, copyright filings, and future adaptation rights remain 100% in your name.

### 4. Milestone-Based Chapter Deliveries
Never agree to pay 100% upfront without milestones. A healthy publishing schedule releases funding in structured phases: outline approval, first three chapters, midpoint draft, and final revised manuscript.`
  },
  {
    id: "blog-3",
    slug: "anatomy-of-a-bestselling-book-cover",
    category: "Cover Design",
    title: "The Anatomy of a Bestselling Book Cover: Visual Psychology & Conversion Secrets",
    excerpt: "Your cover has 1.2 seconds to capture browsing shoppers. Discover the typography rules, contrast ratios, and genre visual codes that drive real purchases.",
    author: "Daniel H. Torres",
    authorRole: "Creative Director",
    date: "January 28, 2026",
    readTime: "8 min read",
    img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800&h=500",
    tags: ["Book Cover", "Design", "Typography", "Conversion"],
    content: `## The 1.2-Second Impulse Window

The adage "don't judge a book by its cover" is completely ignored by online book shoppers. On Amazon and Apple Books, your cover appears as a 120-pixel thumbnail alongside dozen competitors. If your visual hierarchy fails, your manuscript will never be opened.

### The Three Visual Pillars of Commercial Book Covers:
1. **The Single Focal Anchor:** Novice designers clutter the canvas with multiple elements. Bestselling covers select ONE dominant visual hero: a high-contrast figure, a bespoke emblem, or a bold typographic treatment.
2. **Genre Code Compliance:** Every genre has subconscious visual conventions. Thrillers utilize high-contrast blacks and neon reds; memoirs rely on intimate portraits with elegant serif titles; romance demands emotional palettes with dynamic script accents.
3. **Typography Legibility at 10% Scale:** Can a smartphone user instantly decipher the title while scrolling at full speed? If the subtitle blends into the background, conversion drops by over 30%.

### Print Wrap Specifications Matter
Beyond Book Publishing ensures that your jacket wrap includes calculated spine widths based on page count, 0.125-inch printer bleed, and barcode placement that complies with global IngramSpark and Amazon KDP guidelines.`
  },
  {
    id: "blog-4",
    slug: "developmental-editing-vs-copy-editing-proofreading",
    category: "Book Editing",
    title: "Developmental Editing vs. Copy Editing vs. Proofreading: What Your Manuscript Truly Needs",
    excerpt: "Never pay for proofreading when your story foundation needs resuscitation. Clarify the 3 essential editing stages to protect both your book and your budget.",
    author: "Marcus D. Wright",
    authorRole: "Editorial Director",
    date: "January 20, 2026",
    readTime: "10 min read",
    img: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800&h=500",
    tags: ["Editing", "Developmental Editing", "Proofreading", "Manuscript"],
    content: `## Why Submitting an Unedited Manuscript Is Author Career Suicide

Editing is not a single generic broom that sweeps away typos. It is a three-tiered architectural renovation. Investing in the wrong stage out of sequence is the fastest way to waste thousands of dollars.

### Tier 1: Developmental Editing (The Architectural Phase)
- **Focus:** Narrative architecture, pacing, character motivations, plot holes, and thematic clarity.
- **Deliverable:** A comprehensive multi-page editorial letter analyzing every chapter, accompanied by inline margin notes.
- **When You Need It:** When your draft is complete, but you are unsure if the story arc sustains reader fascination.

### Tier 2: Line & Copy Editing (The Craftsmanship Phase)
- **Focus:** Sentence rhythm, word choice, passive voice elimination, tonal consistency, and syntax.
- **Deliverable:** Track Changes with line-by-line recommendations and stylistic enhancements.
- **When You Need It:** Once your storyline and chapter sequences are firmly locked in place.

### Tier 3: Proofreading (The Quality Assurance Phase)
- **Focus:** Catching stray typos, misplaced commas, formatting anomalies, widow/orphan lines, and hyphenation consistency.
- **When You Need It:** Immediately before final print file export.`
  },
  {
    id: "blog-5",
    slug: "amazon-kdp-vs-ingramspark-hybrid-guide",
    category: "Distribution",
    title: "Amazon KDP vs. IngramSpark in 2026: The Strategic Hybrid Distribution Guide",
    excerpt: "Why choosing between KDP and IngramSpark is a false choice. Learn how Beyond Book Publishing coordinates simultaneous global print and digital rollout.",
    author: "Amanda R. Foster",
    authorRole: "Publishing Strategist",
    date: "January 14, 2026",
    readTime: "9 min read",
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800&h=500",
    tags: ["Distribution", "Amazon KDP", "IngramSpark", "Bookstores"],
    content: `## The False Dilemma of Indie Distribution

Many independent authors mistakenly believe they must pledge exclusive allegiance to either Amazon KDP or IngramSpark. The most successful authors in 2026 employ the **Hybrid Distribution Strategy**.

### Amazon KDP Strengths:
- Direct access to 80%+ of the digital eBook market.
- Prime 2-day delivery printing for paperback orders on Amazon.
- Frictionless Amazon Advertising (AMS) integration.

### IngramSpark Strengths:
- Ordering access for 40,000+ brick-and-mortar independent bookstores and national chains like Barnes & Noble.
- Distribution to municipal, university, and public library systems via the Baker & Taylor and Ingram catalogues.
- Superior hardcover printing with custom linen cases and embossed foil dust jackets.

### The Winning Hybrid Setup:
1. Publish your eBook and Amazon paperback directly through KDP to maximize Amazon royalty payouts (avoiding wholesale intermediary fees).
2. Publish your hardcover and expanded international paperback through IngramSpark with "Expanded Distribution" enabled.
3. Use custom universal ISBNs owned directly by you rather than free platform-locked identifiers.`
  },
  {
    id: "blog-6",
    slug: "writing-a-captivating-memoir-guide",
    category: "Memoir Writing",
    title: "Writing a Captivating Memoir: How to Tell Your True Story Without Fear or Compromise",
    excerpt: "Transform personal memories into universal emotional journeys. Techniques for handling sensitive disclosures, narrative pacing, and authentic dialogue.",
    author: "Elena Rostova",
    authorRole: "Senior Memoir Consultant",
    date: "January 07, 2026",
    readTime: "12 min read",
    img: "https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?auto=format&fit=crop&q=80&w=800&h=500",
    tags: ["Memoir", "Storytelling", "Writing Tips", "Biography"],
    content: `## The Difference Between an Autobiography and a Memoir

An autobiography documents a life chronicle from birth to present day. A **memoir**, by contrast, explores a specific thematic crucible: surviving an illness, launching an industry-defining venture, conquering personal trauma, or rediscovering faith.

### The 4 Pillars of Unputdownable Memoirs:
1. **The Thematic Premise:** Ask yourself: What is the emotional thesis of my story? If you cannot articulate your core transformation in one sentence, readers will feel untethered.
2. **Honesty Over Vanity:** Readers do not connect with flawless protagonists. They empathize with vulnerability, self-doubt, and hard-earned wisdom.
3. **Scene-Building vs. Exposition:** Show the reader the frozen steering wheel, the smell of hospital floor wax, or the tension in the boardroom. Don't merely report what occurred—recreate the sensorial landscape.
4. **Navigating Legal and Family Boundaries:** Balance emotional authenticity with defamation safeguards. When appropriate, use composite characters or alter identifying specifics without sacrificing emotional truth.

At **Beyond Book Publishing**, our memoir ghostwriters have shepherded hundreds of authors through these sensitive waters with absolute discretion and artistic fidelity.`
  },
  {
    id: "blog-7",
    slug: "book-marketing-that-generates-real-royalties",
    category: "Book Marketing",
    title: "Book Marketing That Actually Generates Royalties: Beyond the Free Social Media Myth",
    excerpt: "Tired of shouting into the social media void? Uncover algorithmic Amazon AMS ad strategies, newsletter swaps, and targeted media outreach that produce sustained ROI.",
    author: "Rachel Stern",
    authorRole: "Amazon Ads Specialist",
    date: "December 29, 2025",
    readTime: "10 min read",
    img: "https://images.unsplash.com/photo-1560523136-4078a946ad4e?auto=format&fit=crop&q=80&w=800&h=500",
    tags: ["Book Marketing", "Amazon Ads", "Newsletter Swaps", "Book Sales"],
    content: `## The Social Media Trap Most Indie Authors Fall Into

Posting daily excerpts on X or Instagram rarely moves the needle for book sales. Readers browse social platforms for short dopamine hits—not to purchase $18 paperbacks. Profitable book marketing requires building direct, predictable reader discovery funnels.

### Funnel Component 1: Amazon Sponsored Product Ads (AMS)
Target your ads at specific comp titles and category keywords where buyers are already holding credit cards in hand:
- Target readers of similar bestselling authors in your subgenre.
- Optimize cost-per-click (CPC) bids based on book royalty profit margins.
- Continuously refine search term negative keywords to eliminate non-converting queries.

### Funnel Component 2: The Reader Magnet & Direct Email List
Your back matter must include a dedicated QR code or link offering an exclusive bonus chapter, workbook, or audiobook prologue in exchange for an email address:
- Build an audience you directly own, immune to social media algorithm changes.
- Launch your next book directly to hundreds of eagerly waiting superfans.

### Funnel Component 3: Editorial Reviews & Social Proof
Prior to public launch, distribute Advance Review Copies (ARCs) through vetted reviewer networks to secure 20+ verified customer reviews within the initial 48 hours of release.`
  },
  {
    id: "blog-8",
    slug: "the-authority-author-business-book-strategy",
    category: "Author Branding",
    title: "The Authority Author: How Founders & Executives Scale Their Business With a Book",
    excerpt: "A published book is the ultimate high-ticket business card. Discover how CEOs, coaches, and consultants use non-fiction books to 10x speaking fees and close enterprise clients.",
    author: "Jonathan M. Blake",
    authorRole: "Executive Director",
    date: "December 20, 2025",
    readTime: "9 min read",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800&h=500",
    tags: ["Business Books", "Thought Leadership", "Speaking Fees", "Consulting"],
    content: `## Why the Smartest Founders Never Rely on Business Cards

In the modern enterprise landscape, declaring yourself an "expert" on LinkedIn carries little weight. Authoring a definitive, beautifully produced hardcover book on your methodology instantly elevates you into the top 1% of your sector.

### The Real ROI of an Executive Book:
- **10x Keynote Speaking Fees:** Conference organizers consistently choose published authors over non-published speakers.
- **High-Ticket Client Acquisition:** Mailing a personalized signed copy of your book to target Fortune 500 decision-makers bypasses gatekeepers and closes deals faster than any cold email sequence.
- **Media Inquiries:** Producers at Forbes, Bloomberg, and CNBC source commentary from published authors who have codified their frameworks into print.

### The Fast-Track Collaborative Solution
Most business leaders lack 500 hours of free time to sit at a keyboard. Through **Beyond Book Publishing's Executive Ghostwriting Guild**, you simply participate in structured 60-minute weekly interviews. Our senior writers codify your philosophies into an authoritative book ready for global launch.`
  },
  {
    id: "blog-9",
    slug: "audiobook-production-acx-findaway-guide",
    category: "Audiobooks",
    title: "Audiobook Production on ACX & Findaway Voices: Monetizing the Fastest-Growing Format",
    excerpt: "Audiobook consumption is expanding at over 20% year-over-year. Learn voice actor casting, studio mastering specifications, and global digital distribution secrets.",
    author: "David Miller",
    authorRole: "Audiobook Producer",
    date: "December 14, 2025",
    readTime: "8 min read",
    img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800&h=500",
    tags: ["Audiobooks", "ACX", "Audible", "Findaway Voices"],
    content: `## The Boom in Commuter & Multitasking Listening

Audiobooks are no longer an afterthought; for millions of readers, they are the primary medium of literary consumption. If your catalog only exists in print and eBook formats, you are leaving up to 35% of potential royalties uncollected.

### Step-by-Step Production Roadmap:
1. **Auditioning the Perfect Voice Talent:** Never narrate yourself unless your book is an intensely personal memoir and you have professional vocal coaching. Audition 5 to 10 SAG-AFTRA or professional narrators using a 3-minute manuscript excerpt.
2. **Audio Engineering Compliance:** ACX and Audible enforce strict technical audio benchmarks:
   - Consistent Room Tone (-60dB noise floor).
   - Peak levels not exceeding -3dB.
   - RMS energy maintained between -23dB and -18dB.
   - 192kbps CBR MP3 exports with standardized chapter headings.
3. **Distribution Decision: ACX Exclusive vs. Wide Distribution:**
   - **ACX Exclusive:** 40% royalty on Audible/Amazon/iTunes, but locked out of Spotify, Scribd, and public libraries.
   - **Wide Distribution via Findaway Voices:** 80% net royalty across 40+ platforms, including library systems like Hoopla and OverDrive.`
  },
  {
    id: "blog-10",
    slug: "childrens-book-publishing-playbook",
    category: "Children's Books",
    title: "The Children's Book Publishing Playbook: Bleed Margins, Illustrations & Age Tiers",
    excerpt: "A step-by-step masterclass on trim sizes, standard 32-page structures, vocabulary age tiers, and visual synergy for aspiring picture book creators.",
    author: "Sarah E. Collins",
    authorRole: "Head of Children's Imprint",
    date: "December 05, 2025",
    readTime: "11 min read",
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800&h=500",
    tags: ["Children's Books", "Illustrations", "Picture Books", "Publishing"],
    content: `## The Art of the 32-Page Children's Picture Book

Writing for children is not simply writing "shorter stories." It is an exacting craft where every word must carry rhythmic melody, emotional clarity, and visual resonance for the illustrator.

### Understanding Industry Age Tiers:
- **Board Books (Ages 0–3):** 50–100 words, durable cardboard stock, high-contrast primary colors.
- **Picture Books (Ages 4–8):** 500–800 words, standardized 32-page count, balance of whimsical text and captivating full-spread artwork.
- **Early Readers (Ages 6–9):** 1,000–2,500 words, segmented short chapters, repetitive vocabulary structures.
- **Middle Grade (Ages 8–12):** 20,000–45,000 words, rich narrative voice, illustrated spot headers.

### The 32-Page Layout Architecture
In picture book production, pages are bound in multiples of eight. A standard 32-page book allocates:
- Pages 1–4: Endpapers, Title Page, Copyright & Dedication.
- Pages 5–30: The core narrative delivered across 12–14 double-page spreads.
- Pages 31–32: Back matter, author notes, and back endpapers.

### Illustration Synchronization
At **Beyond Book Publishing**, we pair children's authors with elite illustrators who design with 0.125-inch full bleed margins, CMYK color gamut calibration, and careful text-safe zones so children and parents enjoy a seamless reading experience.`
  }
];

export const DEFAULT_HERO = {
  eyebrow: "Become A Self-Published Author:",
  headline: "Control Your Work, Share Your Voice, And Keep 100% Of Your Royalties",
  subText: 'Beyond Book Publishing (BeyondBookpublishing.com) pairs authors with a master guild of bestselling ghostwriters, veteran editors, and global distribution specialists. Keep 100% of your earnings, copyright, and creative freedom.',
  bullets: [
    "Ready to transform your vision into a commercially polished book?",
    "Frustrated with waiting 3 years for legacy publishing approvals?",
    "Want global bookstore distribution while keeping all your royalties?"
  ],
  phone: "+1 (800) 555-0199",
  ratingText: "Rated 9.1 out of 10",
  ratingCount: "3,428"
};

export const WHY_CHOOSE_US_STATS = [
  { title: "Author-First Philosophy", desc: "You keep 100% of your royalties and creative control — always." },
  { title: "Uncompromising Quality", desc: "Every manuscript is reviewed by senior editors and proofreaders before delivery." },
  { title: "Elite American Guild", desc: "All writers, editors, and designers are vetted literary professionals with bestselling credits." },
  { title: "Proven Track Record", desc: "3,400+ satisfied authors and hundreds of bestselling titles published worldwide." }
];

export const NAV_LINKS = [
  { label: "About Us", href: "/about" },
  {
    label: "Services",
    dropdown: [
      {
        heading: "Book Writing",
        items: [
          { label: "Ghost Writing", href: "/services/ghost-writing" },
          { label: "Book Writing", href: "/services/book-writing" },
          { label: "Memoir Writing", href: "/services/memoir-writing" },
          { label: "Biography Writing", href: "/services/biography-writing" },
          { label: "Children's Book Writing", href: "/services/childrens-book-writing" }
        ]
      },
      {
        heading: "Book Editing",
        items: [
          { label: "Proofreading", href: "/services/proofreading" },
          { label: "Copy Editing", href: "/services/copy-editing" }
        ]
      },
      {
        heading: "Publishing",
        items: [
          { label: "Self Publishing", href: "/services/self-publishing" },
          { label: "eBook Publishing", href: "/services/ebook-publishing" },
          { label: "Print-on-Demand", href: "/services/print-on-demand" }
        ]
      },
      {
        heading: "Book Marketing",
        items: [
          { label: "Author Website", href: "/services/author-website" },
          { label: "Book Cover Design", href: "/services/book-cover-design" },
          { label: "Social Media Marketing", href: "/services/social-media-marketing" },
          { label: "Book Trailer", href: "/services/book-trailer" },
          { label: "Audiobook Production", href: "/services/audiobook-production" }
        ]
      }
    ]
  },
  { label: "Portfolio", href: "/portfolio" },
  {
    label: "Pricing",
    dropdown: [
      {
        items: [
          { label: "All Pricing Plans", href: "/pricing" },
          { label: "Writing Packages", href: "/pricing/writing" },
          { label: "Editing Packages", href: "/pricing/editing" },
          { label: "Publishing Packages", href: "/pricing/publishing" },
          { label: "Marketing Packages", href: "/pricing/marketing" },
          { label: "Combo Packages", href: "/pricing/combo" }
        ]
      }
    ]
  },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" }
];
