// Website Data Configurations for American Book Founders

export interface TestimonialItem {
  quote: string;
  name: string;
  title: string;
  avatar: string;
}

export interface AuthorItem {
  name: string;
  genre: string;
  img: string;
}

export interface TeamMemberItem {
  name: string;
  role: string;
  img: string;
  bio: string;
}

export interface PortfolioBookItem {
  img: string;
  title: string;
  author: string;
  genre: string;
  rating: string;
  year: string;
}

export interface PricingPackageItem {
  name: string;
  price: string;
  period: string;
  badge?: string;
  features: string[];
  cta: string;
}

export interface BlogPostItem {
  img: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: "Working with American Book Founders was a transformative experience. They brought my story to life with an elegance I couldn't have imagined on my own.",
    name: "Sarah Johnson",
    title: "First-time Author",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    quote: "The ghostwriting team was incredibly professional and captured my voice perfectly. My business book hit the bestseller list within weeks of launch.",
    name: "Michael Rodriguez",
    title: "Business Author",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    quote: "From concept to publication, every step was seamless. Highly recommend their comprehensive publishing services to any aspiring author.",
    name: "Jennifer Lee",
    title: "Memoir Writer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150"
  }
];

export const FEATURED_AUTHORS: AuthorItem[] = [
  { name: "James Carter", genre: "Thriller Author", img: "/author-1.png" },
  { name: "Amara Williams", genre: "Romance Novelist", img: "/author-2.png" },
  { name: "David Chen", genre: "Sci-Fi Writer", img: "/author-3.png" },
  { name: "Linda Foster", genre: "Memoir Author", img: "/author-4.png" },
  { name: "Carlos Rivera", genre: "Business Writer", img: "/author-5.png" },
  { name: "Yuki Tanaka", genre: "Literary Fiction", img: "/author-6.png" }
];

export const TEAM_MEMBERS: TeamMemberItem[] = [
  {
    name: "Jonathan M. Blake",
    role: "Founder & CEO",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "20+ years in traditional and indie publishing. Former editor at Penguin Random House."
  },
  {
    name: "Sarah E. Collins",
    role: "Head of Ghostwriting",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "NYT bestselling ghostwriter with 80+ published titles across fiction and non-fiction."
  },
  {
    name: "Marcus D. Wright",
    role: "Editorial Director",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Award-winning editor specializing in memoir, biography, and literary fiction."
  },
  {
    name: "Amanda R. Foster",
    role: "Publishing Strategist",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Built distribution networks for 500+ indie authors across Amazon and IngramSpark."
  },
  {
    name: "Daniel H. Torres",
    role: "Creative Director",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Book cover designer with work featured in Publishers Weekly and Shelf Awareness."
  },
  {
    name: "Lisa C. Nguyen",
    role: "Client Success Manager",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Ensures every author has a smooth, transparent journey from manuscript to market."
  }
];

export const PORTFOLIO_BOOKS: PortfolioBookItem[] = [
  { img: "/book-cover-1.webp", title: "The Silent Witness", author: "Eleanor Vance", genre: "True Crime", rating: "4.9", year: "2023" },
  { img: "/book-cover-2.webp", title: "Golden Hour", author: "Amelia Rose", genre: "Romance", rating: "4.8", year: "2023" },
  { img: "/book-cover-3.webp", title: "The Dragon's Blade", author: "Lara Vance", genre: "Fantasy", rating: "4.9", year: "2022" },
  { img: "/book-cover-4.webp", title: "The Sundered Dawn", author: "Ava Reid", genre: "Biblical", rating: "4.7", year: "2022" },
  { img: "/book-cover-5.webp", title: "Rising Sun", author: "Kaizen Moore", genre: "Human Resources", rating: "4.8", year: "2023" },
  { img: "/book-cover-6.webp", title: "The Final Act", author: "Elara Stone", genre: "Illustration", rating: "4.9", year: "2021" },
  { img: "/book-cover-7.webp", title: "Shadow Protocol", author: "J.R. Black", genre: "Real Estate", rating: "4.8", year: "2023" },
  { img: "/book-cover-8.webp", title: "Nightfall Manor", author: "D. Thorne", genre: "Fantasy", rating: "4.7", year: "2022" },
  { img: "/book-cover-1.webp", title: "Crown of Embers", author: "M.K. Davis", genre: "Fantasy", rating: "4.9", year: "2023" },
  { img: "/book-cover-2.webp", title: "Midnight in Manhattan", author: "Clara Bell", genre: "Romance", rating: "4.8", year: "2023" },
  { img: "/book-cover-3.webp", title: "Dust & Thunder", author: "Tom Rider", genre: "Illustration", rating: "4.7", year: "2022" },
  { img: "/book-cover-4.webp", title: "The Evidence Board", author: "Sara Hill", genre: "True Crime", rating: "4.8", year: "2023" },
  { img: "/book-cover-5.webp", title: "Sunrise Over America", author: "L. Foster", genre: "Memoir", rating: "4.9", year: "2023" },
  { img: "/book-cover-6.webp", title: "Beyond the Rings", author: "A. Turing", genre: "Biblical", rating: "4.8", year: "2022" },
  { img: "/book-cover-7.webp", title: "Storm Caller", author: "Y. Tanaka", genre: "Fantasy", rating: "4.7", year: "2021" },
  { img: "/book-cover-8.webp", title: "The Last Grave", author: "C. Rivera", genre: "True Crime", rating: "4.8", year: "2023" },
  { img: "/book-cover-1.webp", title: "Dead Reckoning", author: "P. Stone", genre: "Human Resources", rating: "4.9", year: "2023" },
  { img: "/book-cover-3.webp", title: "Ember & Ash", author: "W. James", genre: "Fantasy", rating: "4.8", year: "2022" }
];

export const PORTFOLIO_FILTERS: string[] = ["All", "Real Estate", "Fantasy", "Romance", "Biblical", "Human Resources", "Illustration", "True Crime", "Memoir"];

export const PRICING_PACKAGES: Record<string, PricingPackageItem[]> = {
  Writing: [
    { name: "Starter", price: "$999", period: "one-time", features: ["Up to 5,000 words", "1 professional writer", "2 revision rounds", "Proofreading included", "Manuscript in Word format"], cta: "Get Started" },
    { name: "Professional", price: "$2,499", period: "one-time", badge: "Most Popular", features: ["Up to 20,000 words", "Dedicated senior writer", "Unlimited revisions", "Proofreading + light editing", "Chapter-by-chapter delivery", "Author consultation calls"], cta: "Get Started" },
    { name: "Premium", price: "$5,999", period: "one-time", features: ["Full-length book (up to 80,000 words)", "Elite ghostwriter", "Unlimited revisions", "Full editorial package", "Dedicated project manager", "Publishing guidance included", "Marketing strategy session"], cta: "Get Started" }
  ],
  Editing: [
    { name: "Proofreading", price: "$299", period: "one-time", features: ["Grammar & spelling fixes", "Punctuation corrections", "Consistency check", "3-5 day turnaround", "Track Changes delivery"], cta: "Get Started" },
    { name: "Copy Editing", price: "$599", period: "one-time", badge: "Most Popular", features: ["Everything in Proofreading", "Sentence-level clarity edits", "Style guide compliance", "Author approval via Track Changes", "7-day turnaround"], cta: "Get Started" },
    { name: "Developmental", price: "$1,299", period: "one-time", features: ["Full structural analysis", "Plot & pacing review", "Character arc assessment", "Detailed editorial letter", "60-min consultation call", "One round of revision review"], cta: "Get Started" }
  ],
  Publishing: [
    { name: "Basic", price: "$499", period: "one-time", features: ["Amazon KDP setup", "eBook publishing", "ISBN registration", "Basic metadata optimization", "Author account setup"], cta: "Get Started" },
    { name: "Standard", price: "$999", period: "one-time", badge: "Most Popular", features: ["Everything in Basic", "Print + eBook publishing", "IngramSpark distribution", "Barnes & Noble setup", "Keyword & category research", "A+ content page"], cta: "Get Started" },
    { name: "Complete", price: "$1,999", period: "one-time", features: ["Everything in Standard", "40+ global retailer distribution", "Audio publishing (ACX)", "Author website setup", "Press release", "Dedicated publishing manager"], cta: "Get Started" }
  ],
  Marketing: [
    { name: "Launch", price: "$799", period: "one-time", features: ["Social media announcement kit", "5 promotional graphics", "Amazon listing optimization", "Email announcement template", "Launch checklist"], cta: "Get Started" },
    { name: "Growth", price: "$1,799", period: "monthly", badge: "Most Popular", features: ["Everything in Launch", "30 days social media management", "AMS Amazon advertising setup", "Goodreads author profile", "2 blog posts per month", "Monthly performance report"], cta: "Get Started" },
    { name: "Authority", price: "$3,499", period: "monthly", features: ["Everything in Growth", "Full PR campaign", "Podcast outreach (10 shows)", "Influencer review program", "Book trailer production", "Dedicated marketing manager"], cta: "Get Started" }
  ],
  Combo: [
    { name: "Elite Author", price: "$4,999", period: "one-time", badge: "Greatest Value", features: ["Up to 40,000 words ghostwritten", "Full editorial package (editing + formatting)", "Amazon print & eBook self-publishing setup", "Custom book cover design", "30 days growth marketing package", "Dedicated author publishing coach"], cta: "Get Started" },
    { name: "Bestseller Combo", price: "$8,999", period: "one-time", badge: "Elite Choice", features: ["Full-length book (up to 80,000 words) ghostwritten", "Deluxe formatting and cover design layout", "Global publishing distribution setup", "Audiobook production and release", "90 days of complete authority marketing program", "Lifetime VIP priority consulting Support"], cta: "Get Started" }
  ]
};

export const PRICING_CATEGORIES: string[] = ["Writing", "Editing", "Publishing", "Marketing", "Combo"];

export const BLOG_POSTS: BlogPostItem[] = [
  { img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400&h=250", category: "Ghostwriting", title: "How to Find the Right Ghostwriter for Your Book", excerpt: "Choosing a ghostwriter is one of the most important decisions you'll make as an author. Here's exactly what to look for — and what red flags to avoid.", author: "Sarah E. Collins", date: "May 15, 2024", readTime: "7 min read" },
  { img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400&h=250", category: "Publishing", title: "Self-Publishing vs Traditional Publishing: The 2024 Guide", excerpt: "Both paths have their advantages. We break down royalties, timelines, creative control, and marketing requirements so you can make the right choice.", author: "Amanda R. Foster", date: "April 28, 2024", readTime: "9 min read" },
  { img: "https://images.unsplash.com/photo-1560523136-4078a946ad4e?auto=format&fit=crop&q=80&w=400&h=250", category: "Book Marketing", title: "10 Proven Strategies to Market Your Book on Amazon", excerpt: "Amazon is the world's biggest bookstore. Here are 10 strategies our marketing team uses to get books in front of the right readers — fast.", author: "Daniel H. Torres", date: "April 10, 2024", readTime: "11 min read" },
  { img: "https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?auto=format&fit=crop&q=80&w=400&h=250", category: "Writing Tips", title: "How to Write a Compelling First Chapter That Hooks Readers", excerpt: "You have less than 30 seconds to convince a reader to keep going. Learn the techniques professional authors use to make the first page impossible to put down.", author: "Marcus D. Wright", date: "March 22, 2024", readTime: "8 min read" },
  { img: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400&h=250", category: "Editing", title: "The Difference Between Proofreading, Copy Editing, and Developmental Editing", excerpt: "Many authors don't know which type of editing their manuscript needs. We explain each stage clearly so you invest in exactly the right service.", author: "Marcus D. Wright", date: "March 5, 2024", readTime: "6 min read" },
  { img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400&h=250", category: "Success Stories", title: "From Idea to Bestseller: Tom Rider's Publishing Journey", excerpt: "Tom came to us with a rough outline for a western. 8 months later, he was holding his physical book which hit top bestseller ranks.", author: "Jane M. Doe", date: "Feb 18, 2024", readTime: "8 min read" }
];

export const DEFAULT_HERO = {
  eyebrow: "Become A Self-Published Author:",
  headline: "Control Your Work, Share Your Voice, And Keep 100% Of Your Royalties",
  subText: 'Americanbookfounders team of experts will work very hard on your book, help you get it published, and make you a "stunning author." Join hands with the authentic and powerful team of creative book writers!',
  bullets: [
    "Not able to write a great manuscript?",
    "Are you frustrated with waiting for approvals?",
    "As a publisher, do you know what to do next?"
  ],
  phone: "+1 (800) 555-0199",
  ratingText: "Rated 9.1 out of 10",
  ratingCount: "3428"
};

export const WHY_CHOOSE_US_STATS = [
  { title: "Author-First Philosophy", desc: "You keep 100% of your royalties and creative control — always." },
  { title: "Uncompromising Quality", desc: "Every manuscript is reviewed by multiple professionals before delivery." },
  { title: "American-Made Team", desc: "All writers, editors, and designers are based in the United States." },
  { title: "Proven Track Record", desc: "3,400+ satisfied authors and hundreds of bestselling titles published." }
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



