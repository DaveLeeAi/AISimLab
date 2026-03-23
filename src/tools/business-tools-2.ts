import { ToolDefinition } from './types';

export const pricingStrategyCalculator: ToolDefinition = {
  slug: 'pricing-strategy-calculator',
  title: 'Pricing Strategy Calculator',
  shortDescription: 'Compare cost-plus, value-based, and competitive pricing strategies.',
  description: 'Calculate your optimal price using three common pricing strategies: cost-plus (markup on costs), competitive (relative to market), and value-based (based on customer willingness to pay). See which maximizes your margin.',
  category: 'business',
  subcategory: 'pricing',
  tags: ['pricing', 'price strategy', 'cost-plus', 'value-based pricing', 'markup'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'cogs', label: 'Cost of Goods Sold (per unit)', type: 'currency', defaultValue: 25, min: 0.01, max: 100000, step: 0.5, prefix: '$' },
    { name: 'overhead', label: 'Overhead per Unit', type: 'currency', defaultValue: 10, min: 0, max: 100000, step: 0.5, prefix: '$', helpText: 'Fixed costs allocated per unit' },
    { name: 'desiredMargin', label: 'Desired Gross Margin', type: 'percentage', defaultValue: 50, min: 1, max: 95, step: 1, suffix: '%' },
    { name: 'competitorPrice', label: 'Competitor Average Price', type: 'currency', defaultValue: 80, min: 0.01, max: 100000, step: 1, prefix: '$' },
    { name: 'perceivedValue', label: 'Customer Perceived Value', type: 'currency', defaultValue: 120, min: 0.01, max: 100000, step: 1, prefix: '$', helpText: 'Max price customers would pay' },
  ],
  calculate: (inputs) => {
    const totalCost = Number(inputs.cogs) + Number(inputs.overhead);
    const margin = Number(inputs.desiredMargin) / 100;
    const costPlusPrice = totalCost / (1 - margin);
    const competitivePrice = Number(inputs.competitorPrice);
    const valueBased = Number(inputs.perceivedValue) * 0.85;
    const costPlusMargin = ((costPlusPrice - totalCost) / costPlusPrice) * 100;
    const valueBasedMargin = ((valueBased - totalCost) / valueBased) * 100;
    return {
      costPlusPrice: Math.round(costPlusPrice * 100) / 100,
      competitivePrice: Math.round(competitivePrice * 100) / 100,
      valueBased: Math.round(valueBased * 100) / 100,
      costPlusMargin: Math.round(costPlusMargin * 10) / 10,
      valueBasedMargin: Math.round(valueBasedMargin * 10) / 10,
    };
  },
  outputs: [
    { name: 'costPlusPrice', label: 'Cost-Plus Price', type: 'currency', decimals: 2, highlight: true, description: 'Your desired margin on total cost' },
    { name: 'competitivePrice', label: 'Competitive Price', type: 'currency', decimals: 2, description: 'Market reference price' },
    { name: 'valueBased', label: 'Value-Based Price', type: 'currency', decimals: 2, description: '85% of perceived customer value' },
    { name: 'costPlusMargin', label: 'Cost-Plus Margin', type: 'percentage', decimals: 1 },
    { name: 'valueBasedMargin', label: 'Value-Based Margin', type: 'percentage', decimals: 1 },
  ],
  examples: [
    { title: 'SaaS Product', description: '$25 COGS, $10 overhead, 50% margin target, $80 competitor price.', inputs: { cogs: 25, overhead: 10, desiredMargin: 50, competitorPrice: 80, perceivedValue: 120 } },
    { title: 'Physical Goods', description: 'Manufacturing product with tight competitive market.', inputs: { cogs: 15, overhead: 8, desiredMargin: 40, competitorPrice: 40, perceivedValue: 55 } },
    { title: 'Premium Service', description: 'High perceived value, low cost to deliver.', inputs: { cogs: 5, overhead: 20, desiredMargin: 70, competitorPrice: 150, perceivedValue: 300 } },
  ],
  documentation: {
    overview: 'Pricing is one of the highest-leverage decisions in business. This tool compares three foundational strategies: cost-plus (start from costs and add margin), competitive (match or beat the market), and value-based (charge based on what the customer values).',
    howToUse: ['Enter your total unit cost (COGS + overhead).', 'Set your target gross margin percentage.', 'Enter the average competitor price in your market.', 'Enter the maximum perceived value a customer places on your product.', 'Compare all three prices and margins.'],
    formula: 'Cost-Plus Price = Total Cost ÷ (1 − Desired Margin)\nValue-Based Price = Perceived Value × 0.85 (20% discount from max willingness to pay)',
    faqs: [
      { question: 'Which pricing strategy is best?', answer: 'Value-based pricing typically produces the highest margins if your product has strong differentiation. Cost-plus is safe but leaves money on the table. Competitive works well in commoditized markets.' },
      { question: 'What is "perceived value"?', answer: 'The maximum price a typical customer would pay before choosing an alternative. You can discover this through surveys, A/B testing, or analyzing what customers pay for close substitutes.' },
    ],
  },
  relatedTools: ['profit-margin-calculator', 'markup-margin-calculator', 'break-even-analysis'],
};

export const salesTaxCalculator: ToolDefinition = {
  slug: 'sales-tax-calculator',
  title: 'Sales Tax Calculator',
  shortDescription: 'Calculate the final price after adding or backing out sales tax.',
  description: 'Quickly add sales tax to a price or reverse-calculate the pre-tax price from a total. Useful for invoicing, budgeting, and understanding true costs.',
  category: 'business',
  subcategory: 'pricing',
  tags: ['sales tax', 'VAT', 'tax rate', 'pre-tax', 'post-tax'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'amount', label: 'Price', type: 'currency', defaultValue: 100, min: 0.01, max: 10000000, step: 0.01, prefix: '$' },
    { name: 'taxRate', label: 'Tax Rate', type: 'percentage', defaultValue: 8.5, min: 0, max: 30, step: 0.1, suffix: '%' },
    { name: 'mode', label: 'Calculate', type: 'select', defaultValue: 'add', options: [{ label: 'Add tax to price', value: 'add' }, { label: 'Remove tax from total', value: 'remove' }] },
  ],
  calculate: (inputs) => {
    const amount = Number(inputs.amount);
    const rate = Number(inputs.taxRate) / 100;
    let preTax: number, taxAmount: number, total: number;
    if (inputs.mode === 'add') {
      preTax = amount;
      taxAmount = amount * rate;
      total = amount + taxAmount;
    } else {
      total = amount;
      preTax = amount / (1 + rate);
      taxAmount = total - preTax;
    }
    return {
      preTax: Math.round(preTax * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  },
  outputs: [
    { name: 'total', label: 'Total with Tax', type: 'currency', decimals: 2, highlight: true },
    { name: 'preTax', label: 'Pre-Tax Amount', type: 'currency', decimals: 2 },
    { name: 'taxAmount', label: 'Tax Amount', type: 'currency', decimals: 2 },
  ],
  examples: [
    { title: 'Retail Purchase', description: '$100 item at 8.5% sales tax.', inputs: { amount: 100, taxRate: 8.5, mode: 'add' } },
    { title: 'Reverse Tax', description: 'You paid $108.50 total — what was the price?', inputs: { amount: 108.5, taxRate: 8.5, mode: 'remove' } },
    { title: 'Invoice Calculation', description: '$2,500 service at 6% local tax.', inputs: { amount: 2500, taxRate: 6.0, mode: 'add' } },
  ],
  documentation: {
    overview: 'Sales tax (or VAT) is added to the selling price of goods and services. This calculator handles both directions: adding tax to a price and removing (reversing) tax from a total to find the base price.',
    howToUse: ['Enter the price or total amount.', 'Enter the applicable tax rate.', 'Choose whether to add tax to the price or remove it from a total.'],
    formula: 'Add Tax: Total = Price × (1 + Rate)\nRemove Tax: Pre-Tax = Total ÷ (1 + Rate)',
    faqs: [
      { question: 'How do I find my local sales tax rate?', answer: 'Visit your state or city tax authority website, or search "[your state] sales tax rate". Rates vary by state, county, and city and can range from 0% to 11%.' },
      { question: 'What is the difference between sales tax and VAT?', answer: 'Sales tax is added at the final point of sale (common in the US). VAT (Value-Added Tax) is collected at each step of production (common in Europe). For end consumers, the effect is similar.' },
    ],
  },
  relatedTools: ['profit-margin-calculator', 'markup-margin-calculator', 'pricing-strategy-calculator'],
};

export const employeeCostCalculator: ToolDefinition = {
  slug: 'employee-cost-calculator',
  title: 'Employee True Cost Calculator',
  shortDescription: 'Calculate the total annual cost of hiring an employee beyond just salary.',
  description: 'Hiring an employee costs significantly more than their salary. This tool calculates the true total cost including payroll taxes, benefits, equipment, and other overhead — typically 1.25–1.4× the base salary.',
  category: 'business',
  subcategory: 'startup',
  tags: ['employee cost', 'hiring', 'salary', 'payroll tax', 'HR', 'total compensation'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'baseSalary', label: 'Annual Base Salary', type: 'currency', defaultValue: 80000, min: 10000, max: 2000000, step: 1000, prefix: '$' },
    { name: 'healthInsurance', label: 'Monthly Health Insurance', type: 'currency', defaultValue: 600, min: 0, max: 5000, step: 50, prefix: '$', helpText: 'Employer contribution per employee' },
    { name: 'bonusPct', label: 'Annual Bonus', type: 'percentage', defaultValue: 10, min: 0, max: 100, step: 1, suffix: '% of salary' },
    { name: 'otherBenefits', label: 'Other Annual Benefits', type: 'currency', defaultValue: 3000, min: 0, max: 50000, step: 250, prefix: '$', helpText: '401k match, gym, remote stipend, etc.' },
    { name: 'equipmentOnboarding', label: 'Equipment & Onboarding', type: 'currency', defaultValue: 3500, min: 0, max: 50000, step: 250, prefix: '$', helpText: 'Laptop, software, training (one-time)' },
  ],
  calculate: (inputs) => {
    const salary = Number(inputs.baseSalary);
    const bonus = salary * (Number(inputs.bonusPct) / 100);
    const healthAnnual = Number(inputs.healthInsurance) * 12;
    const ficaEmployer = salary * 0.0765;
    const suiRate = Math.min(salary, 7000) * 0.06;
    const totalBenefits = healthAnnual + Number(inputs.otherBenefits) + ficaEmployer + suiRate;
    const totalAnnual = salary + bonus + totalBenefits;
    const totalWithOnboarding = totalAnnual + Number(inputs.equipmentOnboarding);
    const multiplier = totalAnnual / salary;
    return {
      totalAnnual: Math.round(totalAnnual),
      totalWithOnboarding: Math.round(totalWithOnboarding),
      ficaEmployer: Math.round(ficaEmployer),
      totalBenefits: Math.round(totalBenefits),
      multiplier: Math.round(multiplier * 100) / 100,
    };
  },
  outputs: [
    { name: 'totalAnnual', label: 'True Annual Cost', type: 'currency', decimals: 0, highlight: true, description: 'Full recurring cost per year' },
    { name: 'totalWithOnboarding', label: 'First-Year Cost', type: 'currency', decimals: 0, description: 'Includes equipment & onboarding' },
    { name: 'totalBenefits', label: 'Total Benefits & Taxes', type: 'currency', decimals: 0 },
    { name: 'ficaEmployer', label: 'Payroll Taxes (FICA)', type: 'currency', decimals: 0, description: 'Social Security + Medicare employer share' },
    { name: 'multiplier', label: 'Cost Multiplier', type: 'number', decimals: 2, description: 'Total cost ÷ base salary' },
  ],
  examples: [
    { title: 'Mid-Level Engineer', description: '$80K salary, standard benefits package.', inputs: { baseSalary: 80000, healthInsurance: 600, bonusPct: 10, otherBenefits: 3000, equipmentOnboarding: 3500 } },
    { title: 'Sales Rep', description: '$60K base, higher bonus, minimal equipment.', inputs: { baseSalary: 60000, healthInsurance: 500, bonusPct: 20, otherBenefits: 1500, equipmentOnboarding: 1500 } },
    { title: 'Senior Leader', description: '$150K salary, full executive benefits.', inputs: { baseSalary: 150000, healthInsurance: 800, bonusPct: 15, otherBenefits: 10000, equipmentOnboarding: 5000 } },
  ],
  documentation: {
    overview: 'When budgeting for a hire, most people focus only on salary. But employer payroll taxes, benefits, bonuses, and equipment typically add 25–40% on top. This tool surfaces the true cost so you can budget accurately.',
    howToUse: ['Enter the employee\'s base salary.', 'Enter your monthly health insurance contribution per employee.', 'Set the annual bonus percentage.', 'Add other benefits (401k match, stipends, perks).', 'Enter first-year equipment and onboarding costs.'],
    formula: 'Total Cost = Salary + Bonus + Health Insurance + FICA (7.65%) + SUI + Other Benefits\nCost Multiplier = Total Annual Cost ÷ Base Salary',
    faqs: [
      { question: 'What is the typical employer cost multiplier?', answer: 'For most US employers, total cost is 1.25× to 1.4× base salary. High-benefit companies or those in expensive locations can reach 1.5× or more.' },
      { question: 'What about contractors?', answer: 'Contractors are typically 1.0× their rate (no employer taxes or benefits) but their hourly rate is usually 20–40% higher than equivalent employees to account for their own self-employment taxes and benefits.' },
    ],
  },
  relatedTools: ['startup-runway-calculator', 'hourly-rate-calculator', 'break-even-analysis'],
};

export const roiCalculator: ToolDefinition = {
  slug: 'roi-calculator',
  title: 'ROI Calculator',
  shortDescription: 'Calculate Return on Investment and payback period for any project.',
  description: 'Measure the profitability of any investment or project. Enter your initial cost and expected gains to get ROI percentage, net profit, and how quickly you recoup the investment.',
  category: 'business',
  subcategory: 'financial-analysis',
  tags: ['ROI', 'return on investment', 'payback', 'profit', 'investment analysis'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'initialInvestment', label: 'Initial Investment', type: 'currency', defaultValue: 10000, min: 1, max: 100000000, step: 100, prefix: '$' },
    { name: 'netAnnualReturn', label: 'Net Annual Return', type: 'currency', defaultValue: 3000, min: 1, max: 100000000, step: 100, prefix: '$', helpText: 'Revenue or savings minus annual operating costs' },
    { name: 'projectLifeYears', label: 'Project Life', type: 'slider', defaultValue: 5, min: 1, max: 20, step: 1, suffix: ' years' },
    { name: 'annualCostIncrease', label: 'Annual Cost Increase', type: 'percentage', defaultValue: 2, min: 0, max: 20, step: 0.5, suffix: '%', helpText: 'Expected increase in operating costs per year' },
  ],
  calculate: (inputs) => {
    const invest = Number(inputs.initialInvestment);
    const annualReturn = Number(inputs.netAnnualReturn);
    const years = Number(inputs.projectLifeYears);
    const costIncrease = Number(inputs.annualCostIncrease) / 100;
    let totalReturn = 0;
    for (let i = 0; i < years; i++) {
      totalReturn += annualReturn * Math.pow(1 - costIncrease, i);
    }
    const roi = ((totalReturn - invest) / invest) * 100;
    const paybackYears = invest / annualReturn;
    const annualizedROI = (Math.pow(1 + roi / 100, 1 / years) - 1) * 100;
    return {
      totalReturn: Math.round(totalReturn),
      roi: Math.round(roi * 10) / 10,
      annualizedROI: Math.round(annualizedROI * 10) / 10,
      paybackYears: Math.round(paybackYears * 10) / 10,
      netProfit: Math.round(totalReturn - invest),
    };
  },
  outputs: [
    { name: 'roi', label: 'Total ROI', type: 'percentage', decimals: 1, highlight: true, description: 'Over the full project life' },
    { name: 'annualizedROI', label: 'Annualized ROI', type: 'percentage', decimals: 1, description: 'Average return per year' },
    { name: 'paybackYears', label: 'Payback Period', type: 'number', decimals: 1, description: 'Years to recover initial investment' },
    { name: 'netProfit', label: 'Net Profit', type: 'currency', decimals: 0, description: 'Total return minus investment' },
    { name: 'totalReturn', label: 'Total Return', type: 'currency', decimals: 0 },
  ],
  examples: [
    { title: 'Software Tool Investment', description: '$10K tool, saves $3K/year in labor over 5 years.', inputs: { initialInvestment: 10000, netAnnualReturn: 3000, projectLifeYears: 5, annualCostIncrease: 2 } },
    { title: 'Marketing Campaign', description: '$50K campaign generating $20K/year in new revenue.', inputs: { initialInvestment: 50000, netAnnualReturn: 20000, projectLifeYears: 3, annualCostIncrease: 0 } },
    { title: 'Equipment Purchase', description: '$100K machine, $35K/year net savings, 8-year life.', inputs: { initialInvestment: 100000, netAnnualReturn: 35000, projectLifeYears: 8, annualCostIncrease: 3 } },
  ],
  documentation: {
    overview: 'ROI (Return on Investment) measures how efficiently an investment generates profit relative to its cost. It is the universal metric for comparing any two investments or projects, regardless of size.',
    howToUse: ['Enter the total upfront cost of the investment.', 'Enter the net annual return — this is revenue or savings minus ongoing operating costs.', 'Set the expected life of the project or investment.', 'Adjust for annual cost increases if applicable.'],
    formula: 'ROI = (Total Returns − Initial Investment) ÷ Initial Investment × 100\nPayback Period = Initial Investment ÷ Annual Return\nAnnualized ROI = (1 + ROI)^(1/years) − 1',
    faqs: [
      { question: 'What is a good ROI?', answer: 'It depends on the context. For stock market investments, 7–10% annually is typical. For business investments, 15–25%+ is generally considered good. Marketing and software investments often target 3–5× return (200–400% ROI).' },
      { question: 'Should I use ROI or NPV?', answer: 'ROI is simpler and great for comparisons. Net Present Value (NPV) is more accurate because it discounts future cash flows. For large capital expenditures, NPV is preferred. For quick comparisons, ROI is sufficient.' },
    ],
  },
  relatedTools: ['break-even-analysis', 'profit-margin-calculator', 'cac-calculator'],
};
