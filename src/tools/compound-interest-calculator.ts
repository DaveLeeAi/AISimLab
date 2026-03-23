import { ToolDefinition } from './types';

export const compoundInterestCalculator: ToolDefinition = {
  slug: 'compound-interest-calculator',
  title: 'Compound Interest Calculator',
  shortDescription: 'See how your investment grows with compound interest over time.',
  description: 'Calculate the future value of an investment using compound interest. Add optional monthly contributions to model regular savings or investment plans.',
  category: 'finance',
  subcategory: 'investing',
  tags: ['compound interest', 'investment growth', 'future value', 'savings', 'interest'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'principal', label: 'Initial Investment', type: 'currency', defaultValue: 10000, min: 0, max: 10000000, step: 500, prefix: '$' },
    { name: 'annualRate', label: 'Annual Interest Rate', type: 'percentage', defaultValue: 7, min: 0.1, max: 30, step: 0.1, suffix: '%' },
    { name: 'years', label: 'Time Period', type: 'slider', defaultValue: 20, min: 1, max: 50, step: 1, suffix: ' years' },
    { name: 'compoundFreq', label: 'Compounding Frequency', type: 'select', defaultValue: 12, options: [{ label: 'Annually', value: 1 }, { label: 'Quarterly', value: 4 }, { label: 'Monthly', value: 12 }, { label: 'Daily', value: 365 }] },
    { name: 'monthlyContribution', label: 'Monthly Contribution', type: 'currency', defaultValue: 500, min: 0, max: 100000, step: 50, prefix: '$', helpText: 'Optional regular addition to principal' },
  ],
  calculate: (inputs) => {
    const P = Number(inputs.principal);
    const r = Number(inputs.annualRate) / 100;
    const n = Number(inputs.compoundFreq);
    const t = Number(inputs.years);
    const pmt = Number(inputs.monthlyContribution);

    const futureValuePrincipal = P * Math.pow(1 + r / n, n * t);
    const monthlyRate = r / 12;
    const futureValueContributions = monthlyRate > 0
      ? pmt * (Math.pow(1 + monthlyRate, t * 12) - 1) / monthlyRate
      : pmt * t * 12;
    const futureValue = futureValuePrincipal + futureValueContributions;
    const totalContributions = P + pmt * 12 * t;
    const totalInterestEarned = futureValue - totalContributions;

    return {
      futureValue: Math.round(futureValue),
      totalContributions: Math.round(totalContributions),
      totalInterestEarned: Math.round(totalInterestEarned),
    };
  },
  outputs: [
    { name: 'futureValue', label: 'Future Value', type: 'currency', decimals: 0, highlight: true, description: 'Total value after compounding' },
    { name: 'totalContributions', label: 'Total Amount Invested', type: 'currency', decimals: 0 },
    { name: 'totalInterestEarned', label: 'Interest Earned', type: 'currency', decimals: 0, description: 'Growth from compounding alone' },
  ],
  examples: [
    { title: 'Long-Term Investing', description: '$10K invested at 7% for 20 years with $500/month.', inputs: { principal: 10000, annualRate: 7, years: 20, compoundFreq: 12, monthlyContribution: 500 } },
    { title: 'Savings Account', description: '$5K in a high-yield savings at 4.5% for 5 years.', inputs: { principal: 5000, annualRate: 4.5, years: 5, compoundFreq: 12, monthlyContribution: 0 } },
    { title: 'Retirement Nest Egg', description: '$25K at 8% over 30 years with $1,000/month.', inputs: { principal: 25000, annualRate: 8, years: 30, compoundFreq: 12, monthlyContribution: 1000 } },
  ],
  documentation: {
    overview: 'Compound interest is the process of earning interest on both your initial principal and accumulated interest. Over long periods, compounding creates exponential growth — often called "the eighth wonder of the world."',
    howToUse: [
      'Enter your starting investment amount.',
      'Enter the expected annual interest or growth rate.',
      'Set the time period using the slider.',
      'Select how frequently interest compounds (monthly is typical for most accounts).',
      'Optionally add regular monthly contributions to model a savings plan.',
    ],
    formula: 'A = P(1 + r/n)^(nt)\nwhere P = principal, r = annual rate, n = compounding frequency, t = years\nWith contributions: add FV of annuity component',
    faqs: [
      { question: 'What interest rate should I use?', answer: 'For long-term stock market investments, a 7–10% nominal rate is commonly used (historical S&P 500 average is ~10%, or ~7% inflation-adjusted). For savings accounts, use your bank\'s current APY. For bonds, use the current yield.' },
      { question: 'Does compounding frequency matter much?', answer: 'The difference between monthly and daily compounding is minimal (less than 0.1% at typical rates). The interest rate and time horizon matter far more than compounding frequency.' },
    ],
  },
  relatedTools: ['investment-return-calculator', 'retirement-savings-calculator', 'savings-goal-calculator'],
};
