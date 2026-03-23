export interface ToolCollection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  slugs: string[];
}

export const TOOL_COLLECTIONS: ToolCollection[] = [
  {
    id: 'popular',
    title: 'Popular Tools',
    description: 'The most-used calculators on AISimuLab',
    icon: 'TrendingUp',
    color: 'blue',
    slugs: [
      'mortgage-calculator',
      'compound-interest-calculator',
      'bmi-calculator',
      'debt-payoff-planner',
      'retirement-savings-calculator',
      'rent-vs-buy-calculator',
      'inflation-calculator',
      'roi-calculator',
    ],
  },
  {
    id: 'money-essentials',
    title: 'Money Essentials',
    description: 'Core personal finance tools everyone should use',
    icon: 'DollarSign',
    color: 'emerald',
    slugs: [
      'budget-planner',
      'emergency-fund-calculator',
      'savings-goal-calculator',
      'debt-payoff-planner',
      'tip-calculator',
      'inflation-calculator',
    ],
  },
  {
    id: 'business-starter',
    title: 'Business Starter Pack',
    description: 'Essential tools for entrepreneurs and freelancers',
    icon: 'Briefcase',
    color: 'sky',
    slugs: [
      'break-even-analysis',
      'profit-margin-calculator',
      'pricing-strategy-calculator',
      'startup-runway-calculator',
      'hourly-rate-calculator',
      'roi-calculator',
    ],
  },
  {
    id: 'life-planning',
    title: 'Life Planning',
    description: 'Tools for big life decisions and milestones',
    icon: 'Map',
    color: 'orange',
    slugs: [
      'rent-vs-buy-calculator',
      'wedding-budget-calculator',
      'moving-cost-calculator',
      'home-renovation-calculator',
      'trip-budget-planner',
      'social-security-calculator',
    ],
  },
  {
    id: 'health-wellness',
    title: 'Health & Wellness',
    description: 'Tools for tracking and improving your health',
    icon: 'Heart',
    color: 'rose',
    slugs: [
      'bmi-calculator',
      'calorie-needs-estimator',
      'water-intake-calculator',
      'ideal-weight-calculator',
      'heart-rate-calculator',
      'sleep-calculator',
    ],
  },
  {
    id: 'quick-converters',
    title: 'Quick Converters',
    description: 'Instant unit and measurement conversions',
    icon: 'RefreshCw',
    color: 'slate',
    slugs: [
      'temperature-converter',
      'weight-converter',
      'length-converter',
      'speed-converter',
      'currency-converter',
      'percentage-calculator',
    ],
  },
];

export function getCollectionById(id: string): ToolCollection | undefined {
  return TOOL_COLLECTIONS.find((c) => c.id === id);
}
