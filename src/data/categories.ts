export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: CategoryColor;
  subcategories: Subcategory[];
}

export interface Subcategory {
  slug: string;
  name: string;
}

export type CategoryColor = 'emerald' | 'blue' | 'sky' | 'orange' | 'slate' | 'rose' | 'teal' | 'amber';

export const COLOR_MAP: Record<CategoryColor, { bg: string; text: string; icon: string; border: string; badge: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-600', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-600', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-700', icon: 'text-sky-600', border: 'border-sky-200', badge: 'bg-sky-100 text-sky-700' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-600', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-700', icon: 'text-slate-600', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-700' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-700', icon: 'text-rose-600', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-700' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-700', icon: 'text-teal-600', border: 'border-teal-200', badge: 'bg-teal-100 text-teal-700' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-600', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' },
};

export const CATEGORIES: Category[] = [
  {
    slug: 'finance',
    name: 'Finance',
    description: 'Mortgages, investments, savings, debt payoff, and personal money management.',
    icon: 'TrendingUp',
    color: 'emerald',
    subcategories: [
      { slug: 'investing', name: 'Investing' },
      { slug: 'real-estate', name: 'Real Estate' },
      { slug: 'personal-finance', name: 'Personal Finance' },
      { slug: 'debt', name: 'Debt & Loans' },
      { slug: 'retirement', name: 'Retirement' },
    ],
  },
  {
    slug: 'business',
    name: 'Business',
    description: 'Pricing, margins, runway, customer acquisition, and startup metrics.',
    icon: 'Briefcase',
    color: 'blue',
    subcategories: [
      { slug: 'financial-analysis', name: 'Financial Analysis' },
      { slug: 'pricing', name: 'Pricing' },
      { slug: 'startup', name: 'Startups' },
      { slug: 'marketing', name: 'Marketing' },
    ],
  },
  {
    slug: 'planning',
    name: 'Planning',
    description: 'Trip budgets, project costs, meeting expenses, and fuel calculations.',
    icon: 'Map',
    color: 'sky',
    subcategories: [
      { slug: 'travel', name: 'Travel' },
      { slug: 'projects', name: 'Projects' },
      { slug: 'events', name: 'Events & Meetings' },
    ],
  },
  {
    slug: 'productivity',
    name: 'Productivity',
    description: 'Hourly rates, focus time, working hours, and freelance billing tools.',
    icon: 'Zap',
    color: 'orange',
    subcategories: [
      { slug: 'freelance', name: 'Freelance' },
      { slug: 'time-management', name: 'Time Management' },
      { slug: 'work', name: 'Work & Hours' },
    ],
  },
  {
    slug: 'math',
    name: 'Data & Math',
    description: 'Percentages, unit conversions, statistics, and number crunching.',
    icon: 'Calculator',
    color: 'slate',
    subcategories: [
      { slug: 'conversions', name: 'Conversions' },
      { slug: 'percentages', name: 'Percentages' },
      { slug: 'statistics', name: 'Statistics' },
    ],
  },
  {
    slug: 'health',
    name: 'Health',
    description: 'BMI, calorie needs, water intake, and wellness estimators.',
    icon: 'Heart',
    color: 'rose',
    subcategories: [
      { slug: 'fitness', name: 'Fitness' },
      { slug: 'nutrition', name: 'Nutrition' },
      { slug: 'wellness', name: 'Wellness' },
    ],
  },
  {
    slug: 'science',
    name: 'Science',
    description: 'Physics, chemistry, engineering, and natural phenomena simulations.',
    icon: 'Atom',
    color: 'teal',
    subcategories: [
      { slug: 'physics', name: 'Physics' },
      { slug: 'chemistry', name: 'Chemistry' },
      { slug: 'engineering', name: 'Engineering' },
    ],
  },
  {
    slug: 'decisions',
    name: 'Decisions',
    description: 'Decision frameworks, probability tools, and risk assessments.',
    icon: 'GitBranch',
    color: 'amber',
    subcategories: [
      { slug: 'probability', name: 'Probability' },
      { slug: 'risk', name: 'Risk Assessment' },
      { slug: 'frameworks', name: 'Decision Frameworks' },
    ],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
