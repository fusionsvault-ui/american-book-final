// Shared TypeScript Types for Beyond Book Publishing (BeyondBookpublishing.com)

export interface ServiceProcessStep {
  step: string;
  desc: string;
}

export interface ServiceExample {
  title: string;
  desc: string;
}

export interface ServiceItem {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  img: string;
  gallery: string[];
  description: string;
  benefits: string[];
  process: ServiceProcessStep[];
  examples: ServiceExample[];
  results: string[];
  faq: Array<{ q: string; a: string }>;
  relatedServices: string[];
}

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
  id?: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  img: string;
  tags?: string[];
}
