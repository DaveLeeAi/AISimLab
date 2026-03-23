import { ToolDefinition } from './types';

export const profitMarginCalculator: ToolDefinition = {
  slug: 'profit-margin-calculator',
  title: 'Profit Margin Calculator',
  shortDescription: 'Calculate gross, operating, and net profit margins for any business or product.',
  description: 'Understand the profitability of your business at every level. Enter revenue, cost of goods, and operating expenses to see your gross margin, operating margin, and the ratio of each cost component.',
  category: 'business',
  subcategory: 'pricing',
  tags: ['profit margin', 'gross margin', 'operating margin', 'cogs', 'revenue', 'profitability'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'revenue', label: 'Total Revenue', type: 'currency', defaultValue: 100000, min: 1, max: 1000000000, step: 1000, prefix: '$', helpText: 'Total sales for the period' },
    { name: 'cogs', label: 'Cost of Goods Sold (COGS)', type: 'currency', defaultValue: 55000, min: 0, max: 1000000000, step: 500, prefix: '$', helpText: 'Direct costs: materials, manufacturing, fulfillment' },
    { name: 'operatingExpenses', label: 'Operating Expenses', type: 'currency', defaultValue: 28000, min: 0, max: 1000000000, step: 500, prefix: '$', helpText: 'Rent, salaries, marketing, software, admin' },
  ],
  calculate: (inputs) => {
    const revenue = Number(inputs.revenue);
    const cogs = Number(inputs.cogs);
    const opex = Number(inputs.operatingExpenses);

    const grossProfit = revenue - cogs;
    const grossMarginPct = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    const operatingProfit = grossProfit - opex;
    const operatingMarginPct = revenue > 0 ? (operatingProfit / revenue) * 100 : 0;
    const cogsRatio = revenue > 0 ? (cogs / revenue) * 100 : 0;
    const opexRatio = revenue > 0 ? (opex / revenue) * 100 : 0;

    return {
      grossProfit,
      grossMarginPct: Math.round(grossMarginPct * 10) / 10,
      operatingProfit,
      operatingMarginPct: Math.round(operatingMarginPct * 10) / 10,
      cogsRatio: Math.round(cogsRatio * 10) / 10,
      opexRatio: Math.round(opexRatio * 10) / 10,
    };
  },
  outputs: [
    { name: 'operatingProfit', label: 'Operating Profit (EBIT)', type: 'currency', highlight: true, description: 'Revenue minus COGS and operating expenses' },
    { name: 'operatingMarginPct', label: 'Operating Margin', type: 'percentage', decimals: 1 },
    { name: 'grossProfit', label: 'Gross Profit', type: 'currency' },
    { name: 'grossMarginPct', label: 'Gross Margin', type: 'percentage', decimals: 1 },
    { name: 'cogsRatio', label: 'COGS % of Revenue', type: 'percentage', decimals: 1 },
    { name: 'opexRatio', label: 'OpEx % of Revenue', type: 'percentage', decimals: 1 },
  ],
  examples: [
    { title: 'SaaS Business', description: 'Software company with low COGS and high operating expenses.', inputs: { revenue: 500000, cogs: 75000, operatingExpenses: 280000 } },
    { title: 'Retail Store', description: 'Retail business with high COGS from merchandise.', inputs: { revenue: 200000, cogs: 130000, operatingExpenses: 45000 } },
    { title: 'Service Business', description: 'Consulting firm — labor is the main cost.', inputs: { revenue: 150000, cogs: 30000, operatingExpenses: 60000 } },
  ],
  documentation: {
    overview: 'Profit margins tell you how efficiently your business converts revenue into profit. Gross margin reveals product-level profitability. Operating margin shows how well you manage overhead. Together they tell the story of your business economics.',
    howToUse: [
      'Enter your total revenue for the period (monthly, quarterly, or annual).',
      'Enter COGS — direct costs tied to producing/delivering your product or service.',
      'Enter all operating expenses (rent, salaries, marketing, software, etc.).',
      'Review gross and operating profit and margins.',
    ],
    formula: 'Gross Profit = Revenue − COGS\nGross Margin = (Gross Profit ÷ Revenue) × 100\nOperating Profit = Gross Profit − Operating Expenses\nOperating Margin = (Operating Profit ÷ Revenue) × 100',
    faqs: [
      { question: 'What is a good gross margin?', answer: 'Depends heavily on industry. SaaS: 70–80%+. Retail: 30–50%. Manufacturing: 25–40%. Service businesses: 50–70%.' },
      { question: 'What is the difference between gross and operating margin?', answer: 'Gross margin only deducts direct costs (COGS). Operating margin deducts all business expenses including overhead. Operating margin reflects the true profitability of your business operations.' },
    ],
  },
  relatedTools: ['break-even-analysis', 'markup-margin-calculator', 'startup-runway-calculator'],
};

export const startupRunwayCalculator: ToolDefinition = {
  slug: 'startup-runway-calculator',
  title: 'Startup Runway Calculator',
  shortDescription: 'Calculate how long your funding lasts based on burn rate and current cash.',
  description: 'Enter your current cash, monthly revenue, and monthly expenses to see your net burn rate and how many months of runway you have before you need more funding or reach profitability.',
  category: 'business',
  subcategory: 'startup',
  tags: ['runway', 'burn rate', 'startup', 'funding', 'cash flow', 'months left'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'cashBalance', label: 'Current Cash Balance', type: 'currency', defaultValue: 500000, min: 0, max: 1000000000, step: 10000, prefix: '$' },
    { name: 'monthlyRevenue', label: 'Monthly Revenue', type: 'currency', defaultValue: 35000, min: 0, max: 100000000, step: 1000, prefix: '$', helpText: 'Current monthly recurring revenue' },
    { name: 'monthlyExpenses', label: 'Total Monthly Expenses', type: 'currency', defaultValue: 120000, min: 1, max: 100000000, step: 1000, prefix: '$', helpText: 'All operating costs including payroll' },
  ],
  calculate: (inputs) => {
    const cash = Number(inputs.cashBalance);
    const revenue = Number(inputs.monthlyRevenue);
    const expenses = Number(inputs.monthlyExpenses);

    const netBurnRate = Math.max(0, expenses - revenue);
    const grossBurnRate = expenses;
    const runwayMonths = netBurnRate > 0 ? cash / netBurnRate : 999;
    const revenueNeeded = expenses;
    const revenueGap = Math.max(0, revenueNeeded - revenue);
    const defaultRisk = runwayMonths < 6 ? 1 : runwayMonths < 12 ? 2 : 3;

    return {
      runwayMonths: Math.min(999, Math.round(runwayMonths * 10) / 10),
      netBurnRate,
      grossBurnRate,
      revenueGap,
      defaultRisk,
    };
  },
  outputs: [
    { name: 'runwayMonths', label: 'Runway (Months)', type: 'number', decimals: 1, highlight: true, description: 'Months of cash remaining at current burn' },
    { name: 'netBurnRate', label: 'Net Burn Rate', type: 'currency', description: 'Monthly cash consumed (expenses minus revenue)' },
    { name: 'grossBurnRate', label: 'Gross Burn Rate', type: 'currency', description: 'Total monthly expenses' },
    { name: 'revenueGap', label: 'Revenue Gap to Break-Even', type: 'currency', description: 'Additional monthly revenue needed to stop burning cash' },
  ],
  examples: [
    { title: 'Seed-Funded Startup', description: '$500K raised, early revenue, moderate burn.', inputs: { cashBalance: 500000, monthlyRevenue: 35000, monthlyExpenses: 120000 } },
    { title: 'Pre-Revenue Startup', description: 'No revenue yet, all expenses from funding.', inputs: { cashBalance: 1200000, monthlyRevenue: 0, monthlyExpenses: 85000 } },
    { title: 'Near Break-Even', description: 'Revenue nearly covers costs — tight but manageable.', inputs: { cashBalance: 300000, monthlyRevenue: 88000, monthlyExpenses: 95000 } },
  ],
  documentation: {
    overview: "Runway is the lifeblood metric of any funded startup. It tells you how long you can operate before running out of money. Knowing your runway gives you time to fundraise, cut costs, or accelerate revenue before you're forced into a crisis.",
    howToUse: [
      'Enter your total current cash (bank balance, not including credit lines).',
      'Enter your current monthly revenue.',
      'Enter all monthly expenses (payroll, rent, software, vendors, etc.).',
      'Review your net burn rate and runway in months.',
    ],
    formula: 'Net Burn Rate = Monthly Expenses − Monthly Revenue\nRunway = Cash Balance ÷ Net Burn Rate',
    faqs: [
      { question: 'How much runway should I maintain?', answer: "Most investors and advisors recommend maintaining at least 12–18 months of runway at all times. Start fundraising when you have 9–12 months remaining — fundraising takes 3–6 months on average." },
      { question: "What's the difference between gross and net burn?", answer: 'Gross burn is your total monthly expenses. Net burn is what you actually consume from your cash reserves (expenses minus revenue). Investors typically care most about net burn.' },
    ],
  },
  relatedTools: ['break-even-analysis', 'profit-margin-calculator', 'cac-calculator'],
};

export const cacCalculator: ToolDefinition = {
  slug: 'cac-calculator',
  title: 'Customer Acquisition Cost (CAC)',
  shortDescription: 'Calculate your cost to acquire each new customer and your LTV:CAC ratio.',
  description: 'Calculate the true cost of acquiring a new customer across all sales and marketing spend. Then model the LTV:CAC ratio to understand whether your acquisition economics are sustainable.',
  category: 'business',
  subcategory: 'marketing',
  tags: ['cac', 'customer acquisition cost', 'ltv', 'ltv cac ratio', 'marketing roi', 'payback'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'marketingSpend', label: 'Total Marketing Spend', type: 'currency', defaultValue: 30000, min: 0, max: 100000000, step: 500, prefix: '$', helpText: 'Ads, content, events, tools — monthly or period total' },
    { name: 'salesSpend', label: 'Total Sales Spend', type: 'currency', defaultValue: 20000, min: 0, max: 100000000, step: 500, prefix: '$', helpText: 'Sales team salaries, commissions, tools' },
    { name: 'newCustomers', label: 'New Customers Acquired', type: 'number', defaultValue: 80, min: 1, max: 10000000, step: 1 },
    { name: 'avgCustomerLTV', label: 'Average Customer Lifetime Value', type: 'currency', defaultValue: 1200, min: 0, max: 10000000, step: 50, prefix: '$', helpText: 'Total revenue expected from an average customer' },
  ],
  calculate: (inputs) => {
    const marketing = Number(inputs.marketingSpend);
    const sales = Number(inputs.salesSpend);
    const customers = Math.max(1, Number(inputs.newCustomers));
    const ltv = Number(inputs.avgCustomerLTV);

    const totalSpend = marketing + sales;
    const cac = totalSpend / customers;
    const ltvCacRatio = cac > 0 ? ltv / cac : 0;
    const profitPerCustomer = ltv - cac;
    const paybackMonths = cac > 0 && ltv > 0 ? (cac / (ltv / 12)) : 0;

    return {
      cac: Math.round(cac * 100) / 100,
      ltvCacRatio: Math.round(ltvCacRatio * 10) / 10,
      profitPerCustomer: Math.round(profitPerCustomer),
      paybackMonths: Math.round(paybackMonths * 10) / 10,
      totalSpend,
    };
  },
  outputs: [
    { name: 'cac', label: 'Customer Acquisition Cost', type: 'currency', highlight: true, description: 'Total cost to acquire one new customer' },
    { name: 'ltvCacRatio', label: 'LTV:CAC Ratio', type: 'number', decimals: 1, description: 'Ideally 3:1 or higher' },
    { name: 'profitPerCustomer', label: 'Profit per Customer', type: 'currency', description: 'LTV minus CAC' },
    { name: 'paybackMonths', label: 'CAC Payback Period', type: 'number', decimals: 1, description: 'Months to recoup acquisition cost' },
    { name: 'totalSpend', label: 'Total Acquisition Spend', type: 'currency' },
  ],
  examples: [
    { title: 'SaaS Company', description: 'Software company with strong LTV from recurring subscriptions.', inputs: { marketingSpend: 30000, salesSpend: 20000, newCustomers: 80, avgCustomerLTV: 2400 } },
    { title: 'E-Commerce Brand', description: 'DTC brand with moderate LTV from repeat purchases.', inputs: { marketingSpend: 45000, salesSpend: 5000, newCustomers: 250, avgCustomerLTV: 380 } },
    { title: 'Enterprise Software', description: 'High-touch sales with large contract values.', inputs: { marketingSpend: 50000, salesSpend: 120000, newCustomers: 8, avgCustomerLTV: 60000 } },
  ],
  documentation: {
    overview: 'CAC is one of the most important metrics in business — it tells you how much it costs to bring in each new customer. When compared against Customer Lifetime Value (LTV), it reveals whether your business model is fundamentally sustainable.',
    howToUse: [
      'Add up all marketing expenses for the period.',
      'Add all sales costs (salaries, commissions, tools).',
      'Enter the number of new customers acquired in that period.',
      'Enter your average customer LTV (total revenue over their entire relationship with you).',
      'Review your CAC, LTV:CAC ratio, and payback period.',
    ],
    formula: 'CAC = (Marketing Spend + Sales Spend) ÷ New Customers\nLTV:CAC Ratio = LTV ÷ CAC\nPayback Period = CAC ÷ (LTV ÷ 12 months)',
    faqs: [
      { question: 'What is a good LTV:CAC ratio?', answer: "3:1 is the standard benchmark. Below 1:1 means you're losing money on every customer. Above 5:1 may indicate underinvestment in growth." },
      { question: 'How do I calculate LTV?', answer: 'LTV = Average Purchase Value × Purchase Frequency × Average Customer Lifespan. For SaaS: LTV = Monthly Recurring Revenue ÷ Monthly Churn Rate.' },
    ],
  },
  relatedTools: ['startup-runway-calculator', 'break-even-analysis', 'profit-margin-calculator'],
};

export const markupMarginCalculator: ToolDefinition = {
  slug: 'markup-margin-calculator',
  title: 'Markup & Margin Calculator',
  shortDescription: 'Convert between markup percentage, gross margin, and selling price instantly.',
  description: 'Markup and margin are often confused but are fundamentally different. Enter any two of cost, price, or profit — and instantly calculate all other values including markup % and gross margin %.',
  category: 'business',
  subcategory: 'pricing',
  tags: ['markup', 'margin', 'gross margin', 'selling price', 'cost price', 'pricing'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'costPrice', label: 'Cost Price (per unit)', type: 'currency', defaultValue: 40, min: 0.01, max: 10000000, step: 0.5, prefix: '$', helpText: 'Your cost to produce or acquire' },
    { name: 'sellingPrice', label: 'Selling Price (per unit)', type: 'currency', defaultValue: 70, min: 0.01, max: 10000000, step: 0.5, prefix: '$' },
    { name: 'unitsPerMonth', label: 'Units Sold per Month', type: 'number', defaultValue: 200, min: 0, max: 10000000, step: 10, helpText: 'Optional — for monthly profit estimate' },
  ],
  calculate: (inputs) => {
    const cost = Number(inputs.costPrice);
    const price = Number(inputs.sellingPrice);
    const units = Number(inputs.unitsPerMonth);

    const grossProfit = price - cost;
    const markupPct = cost > 0 ? (grossProfit / cost) * 100 : 0;
    const grossMarginPct = price > 0 ? (grossProfit / price) * 100 : 0;
    const monthlyProfit = grossProfit * units;

    const priceForMarkup60 = cost * 1.6;
    const priceForMargin40 = cost > 0 ? cost / (1 - 0.4) : 0;

    return {
      grossProfit: Math.round(grossProfit * 100) / 100,
      markupPct: Math.round(markupPct * 10) / 10,
      grossMarginPct: Math.round(grossMarginPct * 10) / 10,
      monthlyProfit,
      priceForMarkup60: Math.round(priceForMarkup60 * 100) / 100,
      priceForMargin40: Math.round(priceForMargin40 * 100) / 100,
    };
  },
  outputs: [
    { name: 'grossProfit', label: 'Gross Profit per Unit', type: 'currency', highlight: true },
    { name: 'markupPct', label: 'Markup %', type: 'percentage', decimals: 1, description: 'Profit as % of cost price' },
    { name: 'grossMarginPct', label: 'Gross Margin %', type: 'percentage', decimals: 1, description: 'Profit as % of selling price' },
    { name: 'monthlyProfit', label: 'Monthly Gross Profit', type: 'currency' },
    { name: 'priceForMarkup60', label: 'Price at 60% Markup', type: 'currency', description: 'Reference: price needed for 60% markup' },
    { name: 'priceForMargin40', label: 'Price at 40% Margin', type: 'currency', description: 'Reference: price needed for 40% gross margin' },
  ],
  examples: [
    { title: 'Retail Product', description: 'Physical product with typical retail markup.', inputs: { costPrice: 25, sellingPrice: 60, unitsPerMonth: 500 } },
    { title: 'Wholesale to Retail', description: 'Pricing for a wholesale product sold to retailers.', inputs: { costPrice: 8, sellingPrice: 18, unitsPerMonth: 2000 } },
    { title: 'Service Pricing', description: 'Service with time/material cost at hourly rate.', inputs: { costPrice: 50, sellingPrice: 150, unitsPerMonth: 80 } },
  ],
  documentation: {
    overview: 'Markup and gross margin are both ways to express profit, but they use different denominators. Markup divides profit by cost; margin divides profit by selling price. Confusing the two leads to underpricing — a common and costly mistake.',
    howToUse: [
      'Enter your per-unit cost (what you pay to make or acquire the item).',
      'Enter your selling price.',
      'Optionally enter monthly units sold for a monthly profit estimate.',
      'Use the reference prices at the bottom to see what price hits common targets.',
    ],
    formula: 'Gross Profit = Selling Price − Cost\nMarkup % = (Gross Profit ÷ Cost) × 100\nGross Margin % = (Gross Profit ÷ Selling Price) × 100\nPrice for Target Margin = Cost ÷ (1 − Target Margin)',
    faqs: [
      { question: 'What is the difference between markup and margin?', answer: 'Markup = Profit ÷ Cost. Margin = Profit ÷ Selling Price. A 60% markup gives a 37.5% margin. A 40% margin requires a 66.7% markup. They are not interchangeable.' },
      { question: 'What margin should I target?', answer: 'Varies by industry. Retail: 30–50%. Wholesale: 15–30%. SaaS/Software: 70–80%. Services: 40–70%. Physical manufacturing: 20–40%.' },
    ],
  },
  relatedTools: ['profit-margin-calculator', 'break-even-analysis', 'pricing-strategy-simulator'],
};
