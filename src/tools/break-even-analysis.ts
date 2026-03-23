import { ToolDefinition } from './types';

export const breakEvenAnalysis: ToolDefinition = {
  slug: 'break-even-analysis',
  title: 'Break-Even Analysis',
  shortDescription: 'Find exactly how many units you must sell to cover all costs.',
  description: 'Calculate your break-even point in units and revenue. Enter your fixed costs, variable cost per unit, and selling price to find the exact point where you stop losing money and start making profit.',
  category: 'business',
  subcategory: 'financial-analysis',
  tags: ['break-even', 'profit', 'fixed costs', 'variable costs', 'contribution margin', 'unit economics'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'fixedCosts', label: 'Total Fixed Costs', type: 'currency', defaultValue: 10000, min: 0, max: 10000000, step: 100, prefix: '$', helpText: 'Rent, salaries, software — costs that do not change with volume' },
    { name: 'variableCostPerUnit', label: 'Variable Cost per Unit', type: 'currency', defaultValue: 15, min: 0, max: 100000, step: 0.5, prefix: '$', helpText: 'Materials, labor, shipping per unit sold' },
    { name: 'sellingPricePerUnit', label: 'Selling Price per Unit', type: 'currency', defaultValue: 50, min: 0.01, max: 100000, step: 0.5, prefix: '$' },
    { name: 'targetProfit', label: 'Target Monthly Profit', type: 'currency', defaultValue: 5000, min: 0, max: 10000000, step: 100, prefix: '$', helpText: 'Optional — units needed to reach a profit goal' },
  ],
  calculate: (inputs) => {
    const fixedCosts = Number(inputs.fixedCosts);
    const variableCost = Number(inputs.variableCostPerUnit);
    const sellingPrice = Number(inputs.sellingPricePerUnit);
    const targetProfit = Number(inputs.targetProfit);

    const contributionMargin = sellingPrice - variableCost;
    const contributionMarginRatio = sellingPrice > 0 ? contributionMargin / sellingPrice : 0;
    const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;
    const breakEvenRevenue = breakEvenUnits * sellingPrice;
    const unitsForTarget = contributionMargin > 0 ? Math.ceil((fixedCosts + targetProfit) / contributionMargin) : 0;

    return {
      breakEvenUnits,
      breakEvenRevenue: Math.round(breakEvenRevenue),
      contributionMargin: Math.round(contributionMargin * 100) / 100,
      contributionMarginRatio: Math.round(contributionMarginRatio * 1000) / 10,
      unitsForTarget,
    };
  },
  outputs: [
    { name: 'breakEvenUnits', label: 'Break-Even Units', type: 'number', decimals: 0, highlight: true, description: 'Units to sell to cover all costs' },
    { name: 'breakEvenRevenue', label: 'Break-Even Revenue', type: 'currency', decimals: 0, description: 'Revenue at the break-even point' },
    { name: 'contributionMargin', label: 'Contribution Margin per Unit', type: 'currency', decimals: 2, description: 'Selling price minus variable cost' },
    { name: 'contributionMarginRatio', label: 'Contribution Margin Ratio', type: 'percentage', decimals: 1, description: 'Margin as a % of selling price' },
    { name: 'unitsForTarget', label: 'Units for Target Profit', type: 'number', decimals: 0, description: 'Units to reach your profit goal' },
  ],
  examples: [
    { title: 'SaaS Product', description: '$10K/mo fixed costs, $15 variable, $50 price.', inputs: { fixedCosts: 10000, variableCostPerUnit: 15, sellingPricePerUnit: 50, targetProfit: 5000 } },
    { title: 'Physical Product', description: 'Small manufacturer with $25K overhead.', inputs: { fixedCosts: 25000, variableCostPerUnit: 30, sellingPricePerUnit: 80, targetProfit: 10000 } },
    { title: 'Food & Beverage', description: 'Cafe analyzing per-drink profitability.', inputs: { fixedCosts: 8000, variableCostPerUnit: 2.5, sellingPricePerUnit: 6, targetProfit: 3000 } },
  ],
  documentation: {
    overview: 'Break-even analysis tells you the minimum sales volume needed to avoid a loss. It is fundamental for pricing decisions, launch planning, and understanding how sensitive your business is to volume changes.',
    howToUse: [
      'Enter all fixed monthly costs (rent, salaries, subscriptions).',
      'Enter the variable cost per unit sold.',
      'Enter the selling price per unit.',
      'Optionally enter a profit target to see how many units beyond break-even you need.',
    ],
    formula: 'Contribution Margin = Selling Price − Variable Cost\nBreak-Even Units = Fixed Costs ÷ Contribution Margin\nUnits for Target = (Fixed Costs + Target Profit) ÷ Contribution Margin',
    faqs: [
      { question: 'What counts as a fixed vs variable cost?', answer: 'Fixed costs stay the same regardless of sales volume: rent, insurance, salaries, loan payments, software subscriptions. Variable costs change directly with production or sales: raw materials, shipping, payment processing fees, sales commissions.' },
      { question: 'How do I use this for pricing decisions?', answer: 'Run the calculator at different price points to see how break-even units change. A higher price means fewer units needed to break even — but may reduce demand. The goal is to find the price where your realistic sales volume exceeds break-even units.' },
    ],
  },
  relatedTools: ['profit-margin-calculator', 'startup-runway-calculator', 'markup-margin-calculator'],
};
