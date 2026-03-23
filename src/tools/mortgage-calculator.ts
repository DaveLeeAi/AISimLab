import { ToolDefinition } from './types';

export const mortgageCalculator: ToolDefinition = {
  slug: 'mortgage-calculator',
  title: 'Mortgage Calculator',
  shortDescription: 'Calculate your monthly mortgage payment, total interest, and amortization details.',
  description: 'Estimate your monthly mortgage payment using principal, interest rate, and loan term. See total interest paid over the life of the loan and your effective interest cost.',
  category: 'finance',
  subcategory: 'real-estate',
  tags: ['mortgage', 'home loan', 'monthly payment', 'amortization', 'interest', 'real estate'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'homePrice', label: 'Home Price', type: 'currency', defaultValue: 400000, min: 10000, max: 10000000, step: 1000, prefix: '$' },
    { name: 'downPayment', label: 'Down Payment', type: 'currency', defaultValue: 80000, min: 0, max: 5000000, step: 1000, prefix: '$' },
    { name: 'interestRate', label: 'Annual Interest Rate', type: 'percentage', defaultValue: 6.5, min: 0.1, max: 20, step: 0.05, suffix: '%' },
    { name: 'loanTermYears', label: 'Loan Term', type: 'select', defaultValue: 30, options: [{ label: '10 years', value: 10 }, { label: '15 years', value: 15 }, { label: '20 years', value: 20 }, { label: '30 years', value: 30 }] },
    { name: 'propertyTax', label: 'Annual Property Tax', type: 'currency', defaultValue: 4800, min: 0, max: 100000, step: 100, prefix: '$', helpText: 'Optional — adds to monthly cost' },
    { name: 'homeInsurance', label: 'Annual Home Insurance', type: 'currency', defaultValue: 1200, min: 0, max: 50000, step: 100, prefix: '$', helpText: 'Optional — adds to monthly cost' },
  ],
  calculate: (inputs) => {
    const principal = Number(inputs.homePrice) - Number(inputs.downPayment);
    const monthlyRate = Number(inputs.interestRate) / 100 / 12;
    const numPayments = Number(inputs.loanTermYears) * 12;
    const monthlyPI = monthlyRate > 0
      ? principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
      : principal / numPayments;
    const monthlyTax = Number(inputs.propertyTax) / 12;
    const monthlyInsurance = Number(inputs.homeInsurance) / 12;
    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance;
    const totalPaid = monthlyPI * numPayments;
    const totalInterest = totalPaid - principal;
    return {
      monthlyPayment: Math.round(totalMonthly),
      principalAndInterest: Math.round(monthlyPI),
      totalInterest: Math.round(totalInterest),
      totalCost: Math.round(totalPaid + Number(inputs.downPayment)),
      loanAmount: Math.round(principal),
    };
  },
  outputs: [
    { name: 'monthlyPayment', label: 'Total Monthly Payment', type: 'currency', decimals: 0, highlight: true, description: 'Principal, interest, tax & insurance' },
    { name: 'principalAndInterest', label: 'Principal & Interest', type: 'currency', decimals: 0 },
    { name: 'loanAmount', label: 'Loan Amount', type: 'currency', decimals: 0 },
    { name: 'totalInterest', label: 'Total Interest Paid', type: 'currency', decimals: 0, description: 'Over the full loan term' },
    { name: 'totalCost', label: 'Total Cost of Home', type: 'currency', decimals: 0, description: 'Down payment + all principal & interest payments' },
  ],
  examples: [
    { title: 'Typical Home Purchase', description: '$400K home, 20% down, 30-year fixed at 6.5%.', inputs: { homePrice: 400000, downPayment: 80000, interestRate: 6.5, loanTermYears: 30, propertyTax: 4800, homeInsurance: 1200 } },
    { title: 'First-Time Buyer (Low Down)', description: '$300K home, 3.5% down, 30-year at 7%.', inputs: { homePrice: 300000, downPayment: 10500, interestRate: 7.0, loanTermYears: 30, propertyTax: 3600, homeInsurance: 900 } },
    { title: '15-Year Payoff', description: '$500K home, 20% down, 15-year fixed at 6%.', inputs: { homePrice: 500000, downPayment: 100000, interestRate: 6.0, loanTermYears: 15, propertyTax: 6000, homeInsurance: 1500 } },
  ],
  documentation: {
    overview: 'A mortgage calculator helps you estimate the true monthly cost of buying a home, including property taxes and insurance. Understanding your payment before you buy prevents overextending your budget.',
    howToUse: [
      'Enter the home purchase price.',
      'Enter your planned down payment.',
      'Enter your expected interest rate (check current rates at your bank).',
      'Select the loan term (30-year is most common, 15-year saves interest).',
      'Optionally add annual property tax and insurance for a complete picture.',
    ],
    formula: 'Monthly P&I = P × [r(1+r)^n] / [(1+r)^n - 1]\nwhere P = loan amount, r = monthly rate, n = number of payments',
    faqs: [
      { question: 'What is included in my mortgage payment?', answer: 'The principal (loan balance reduction), interest (lender fee), property taxes, and homeowners insurance. Lenders often collect taxes and insurance in an "escrow" account as part of your payment.' },
      { question: 'Should I choose a 15-year or 30-year mortgage?', answer: 'A 15-year mortgage builds equity faster and saves tens of thousands in interest, but the monthly payment is significantly higher. A 30-year provides more cash flow flexibility. A common strategy: take the 30-year but make extra principal payments when possible.' },
    ],
  },
  relatedTools: ['loan-affordability-calculator', 'compound-interest-calculator', 'savings-goal-calculator'],
};
