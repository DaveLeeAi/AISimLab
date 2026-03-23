import { ToolDefinition } from './types';

export const cdCalculator: ToolDefinition = {
  slug: 'cd-calculator',
  title: 'CD Calculator',
  shortDescription: 'Calculate earnings on a Certificate of Deposit with APY compounding.',
  description: 'See exactly how much interest a CD will earn and your total payout at maturity. Compare term lengths and rates to find the best option.',
  category: 'finance',
  subcategory: 'investing',
  tags: ['CD', 'certificate of deposit', 'APY', 'savings', 'bank'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'principal', label: 'Deposit Amount', type: 'currency', defaultValue: 10000, min: 100, max: 1000000, step: 500, prefix: '$' },
    { name: 'apy', label: 'Annual Percentage Yield (APY)', type: 'percentage', defaultValue: 5.0, min: 0.01, max: 15, step: 0.05, suffix: '%' },
    { name: 'termMonths', label: 'CD Term', type: 'select', defaultValue: 12, options: [{ label: '3 months', value: 3 }, { label: '6 months', value: 6 }, { label: '12 months', value: 12 }, { label: '18 months', value: 18 }, { label: '24 months', value: 24 }, { label: '36 months', value: 36 }, { label: '60 months', value: 60 }] },
    { name: 'compoundFreq', label: 'Compounding Frequency', type: 'select', defaultValue: 12, options: [{ label: 'Monthly', value: 12 }, { label: 'Quarterly', value: 4 }, { label: 'Annually', value: 1 }, { label: 'Daily', value: 365 }] },
  ],
  calculate: (inputs) => {
    const P = Number(inputs.principal);
    const r = Number(inputs.apy) / 100;
    const n = Number(inputs.compoundFreq);
    const t = Number(inputs.termMonths) / 12;
    const maturityValue = P * Math.pow(1 + r / n, n * t);
    const interestEarned = maturityValue - P;
    const effectiveRate = (interestEarned / P) * 100;
    return {
      maturityValue: Math.round(maturityValue * 100) / 100,
      interestEarned: Math.round(interestEarned * 100) / 100,
      effectiveRate: Math.round(effectiveRate * 100) / 100,
    };
  },
  outputs: [
    { name: 'maturityValue', label: 'Maturity Value', type: 'currency', decimals: 2, highlight: true, description: 'Total payout at end of term' },
    { name: 'interestEarned', label: 'Interest Earned', type: 'currency', decimals: 2 },
    { name: 'effectiveRate', label: 'Effective Return', type: 'percentage', decimals: 2, description: 'Total % gained over the term' },
  ],
  examples: [
    { title: 'High-Yield 1-Year CD', description: '$10,000 at 5% APY for 12 months, monthly compounding.', inputs: { principal: 10000, apy: 5.0, termMonths: 12, compoundFreq: 12 } },
    { title: 'Short-Term 6-Month', description: '$25,000 at 4.75% APY for 6 months.', inputs: { principal: 25000, apy: 4.75, termMonths: 6, compoundFreq: 12 } },
    { title: '5-Year Long-Term', description: '$50,000 at 4.5% APY over 5 years.', inputs: { principal: 50000, apy: 4.5, termMonths: 60, compoundFreq: 12 } },
  ],
  documentation: {
    overview: 'A Certificate of Deposit (CD) is a savings product offered by banks that pays a fixed interest rate in exchange for leaving your money untouched for a set term. CDs typically offer higher rates than regular savings accounts.',
    howToUse: ['Enter the amount you plan to deposit.', 'Enter the APY advertised by the bank.', 'Select the CD term length.', 'Select compounding frequency (usually monthly).', 'Read the maturity value and total interest earned.'],
    formula: 'A = P × (1 + r/n)^(n×t)\nwhere P = principal, r = APY as decimal, n = compounds per year, t = years',
    faqs: [
      { question: 'What happens if I withdraw early?', answer: 'Most CDs charge an early withdrawal penalty, typically 3–6 months of interest. Factor this in before committing.' },
      { question: 'Is CD interest taxable?', answer: 'Yes, CD interest is taxable as ordinary income in the year it is earned, even if you do not withdraw it.' },
    ],
  },
  relatedTools: ['compound-interest-calculator', 'savings-goal-calculator', 'investment-return-calculator'],
};

export const rentVsBuyCalculator: ToolDefinition = {
  slug: 'rent-vs-buy-calculator',
  title: 'Rent vs Buy Calculator',
  shortDescription: 'Compare the true 5-year cost of renting versus buying a home.',
  description: 'Determine whether renting or buying makes more financial sense by comparing total costs over a 5-year period, accounting for equity built, opportunity cost, and typical expenses.',
  category: 'finance',
  subcategory: 'real-estate',
  tags: ['rent vs buy', 'home buying', 'renting', 'real estate decision'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'homePrice', label: 'Home Purchase Price', type: 'currency', defaultValue: 400000, min: 50000, max: 5000000, step: 5000, prefix: '$' },
    { name: 'downPaymentPct', label: 'Down Payment', type: 'percentage', defaultValue: 20, min: 3, max: 50, step: 1, suffix: '%' },
    { name: 'mortgageRate', label: 'Mortgage Rate', type: 'percentage', defaultValue: 6.75, min: 2, max: 15, step: 0.05, suffix: '%' },
    { name: 'monthlyRent', label: 'Equivalent Monthly Rent', type: 'currency', defaultValue: 2000, min: 100, max: 20000, step: 50, prefix: '$' },
    { name: 'annualAppreciation', label: 'Annual Home Appreciation', type: 'percentage', defaultValue: 3, min: 0, max: 10, step: 0.5, suffix: '%', helpText: 'Historical average is 3–4%' },
    { name: 'yearsToStay', label: 'Years You Plan to Stay', type: 'slider', defaultValue: 5, min: 1, max: 15, step: 1, suffix: ' years' },
  ],
  calculate: (inputs) => {
    const price = Number(inputs.homePrice);
    const dp = price * (Number(inputs.downPaymentPct) / 100);
    const loan = price - dp;
    const r = Number(inputs.mortgageRate) / 100 / 12;
    const n = 30 * 12;
    const years = Number(inputs.yearsToStay);
    const months = years * 12;
    const monthlyPI = r > 0 ? loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loan / n;
    const totalMortgage = monthlyPI * months;
    const propertyTax = price * 0.012 * years;
    const maintenance = price * 0.01 * years;
    const insurance = price * 0.003 * years;
    const closingCosts = price * 0.03;
    const sellingCosts = price * 0.06;
    const totalBuyCost = dp + totalMortgage + propertyTax + maintenance + insurance + closingCosts + sellingCosts;
    const homeValue = price * Math.pow(1 + Number(inputs.annualAppreciation) / 100, years);
    const equityBuilt = homeValue - loan;
    const netBuyCost = totalBuyCost - homeValue;
    const totalRentCost = Number(inputs.monthlyRent) * months * 1.03;
    const difference = totalRentCost - netBuyCost;
    return {
      netBuyCost: Math.round(netBuyCost),
      totalRentCost: Math.round(totalRentCost),
      homeValueAtSale: Math.round(homeValue),
      equityBuilt: Math.round(equityBuilt),
      difference: Math.round(Math.abs(difference)),
    };
  },
  outputs: [
    { name: 'netBuyCost', label: 'Net Cost to Buy', type: 'currency', decimals: 0, highlight: true, description: 'Total buy costs minus home sale value' },
    { name: 'totalRentCost', label: 'Total Cost to Rent', type: 'currency', decimals: 0 },
    { name: 'homeValueAtSale', label: 'Projected Home Value', type: 'currency', decimals: 0 },
    { name: 'equityBuilt', label: 'Equity Built', type: 'currency', decimals: 0, description: 'Home value minus remaining loan' },
    { name: 'difference', label: 'Savings Difference', type: 'currency', decimals: 0, description: 'Amount cheaper option saves' },
  ],
  examples: [
    { title: 'Urban Apartment Decision', description: '$400K home, 20% down, $2,000/month rent, staying 5 years.', inputs: { homePrice: 400000, downPaymentPct: 20, mortgageRate: 6.75, monthlyRent: 2000, annualAppreciation: 3, yearsToStay: 5 } },
    { title: 'Long-Term Stay', description: '$350K home vs $1,800/month rent, staying 10 years.', inputs: { homePrice: 350000, downPaymentPct: 10, mortgageRate: 7.0, monthlyRent: 1800, annualAppreciation: 4, yearsToStay: 10 } },
    { title: 'Hot Market Buy', description: '$600K home vs $2,500/month, 5% appreciation.', inputs: { homePrice: 600000, downPaymentPct: 20, mortgageRate: 6.5, monthlyRent: 2500, annualAppreciation: 5, yearsToStay: 7 } },
  ],
  documentation: {
    overview: 'The rent vs buy decision is one of the most significant financial choices most people make. This calculator compares the total out-of-pocket cost of buying (including equity gained) against the total cost of renting over the same period.',
    howToUse: ['Enter the home purchase price you\'re considering.', 'Set your down payment percentage.', 'Enter the expected mortgage interest rate.', 'Enter what you would pay in rent for an equivalent home.', 'Adjust the years you plan to stay — this is the biggest factor.'],
    formula: 'Net Buy Cost = Down Payment + Mortgage Payments + Taxes + Maintenance + Closing/Selling Costs − Home Sale Value\nRent Cost = Monthly Rent × Months × 1.03 (annual rent increase)',
    faqs: [
      { question: 'What is not included in this calculation?', answer: 'Investment returns on the down payment (opportunity cost), mortgage interest tax deduction, and HOA fees. A more complete analysis would factor these in.' },
      { question: 'How long do you need to stay for buying to win?', answer: 'The break-even point is typically 3–7 years depending on market conditions, down payment size, and rent levels. The longer you stay, the more favorable buying becomes.' },
    ],
  },
  relatedTools: ['mortgage-calculator', 'loan-affordability-calculator', 'compound-interest-calculator'],
};

export const socialSecurityCalculator: ToolDefinition = {
  slug: 'social-security-calculator',
  title: 'Social Security Estimator',
  shortDescription: 'Estimate your monthly Social Security benefit based on earnings and claiming age.',
  description: 'Get a rough estimate of your Social Security retirement benefit based on your average lifetime earnings and the age at which you plan to claim benefits.',
  category: 'finance',
  subcategory: 'retirement',
  tags: ['social security', 'retirement', 'SSA benefit', 'claiming age'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'avgAnnualEarnings', label: 'Average Annual Earnings', type: 'currency', defaultValue: 65000, min: 5000, max: 250000, step: 1000, prefix: '$', helpText: 'Average over your working career' },
    { name: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 45, min: 22, max: 64, step: 1, suffix: ' years' },
    { name: 'claimingAge', label: 'Planned Claiming Age', type: 'select', defaultValue: 67, options: [{ label: '62 (Early — reduced)', value: 62 }, { label: '63', value: 63 }, { label: '64', value: 64 }, { label: '65', value: 65 }, { label: '66', value: 66 }, { label: '67 (Full Retirement Age)', value: 67 }, { label: '68', value: 68 }, { label: '69', value: 69 }, { label: '70 (Maximum)', value: 70 }] },
    { name: 'workingYears', label: 'Years of Work History', type: 'slider', defaultValue: 25, min: 5, max: 40, step: 1, suffix: ' years' },
  ],
  calculate: (inputs) => {
    const aime = Number(inputs.avgAnnualEarnings) / 12;
    let pia = 0;
    if (aime <= 1115) pia = aime * 0.9;
    else if (aime <= 6721) pia = 1003.5 + (aime - 1115) * 0.32;
    else pia = 1003.5 + 1794 + (aime - 6721) * 0.15;
    const fra = 67;
    const claimAge = Number(inputs.claimingAge);
    let adjustment = 1;
    if (claimAge < fra) {
      const monthsEarly = (fra - claimAge) * 12;
      adjustment = 1 - (monthsEarly <= 36 ? monthsEarly * (5 / 9 / 100) : 36 * (5 / 9 / 100) + (monthsEarly - 36) * (5 / 12 / 100));
    } else if (claimAge > fra) {
      adjustment = 1 + (claimAge - fra) * 0.08;
    }
    const monthlyBenefit = pia * adjustment;
    const annualBenefit = monthlyBenefit * 12;
    const lifeExpectancy = 85;
    const yearsCollecting = Math.max(0, lifeExpectancy - claimAge);
    const lifetimeBenefit = monthlyBenefit * 12 * yearsCollecting;
    return {
      monthlyBenefit: Math.round(monthlyBenefit),
      annualBenefit: Math.round(annualBenefit),
      lifetimeBenefit: Math.round(lifetimeBenefit),
      adjustmentPct: Math.round((adjustment - 1) * 100),
    };
  },
  outputs: [
    { name: 'monthlyBenefit', label: 'Est. Monthly Benefit', type: 'currency', decimals: 0, highlight: true, description: 'At your chosen claiming age' },
    { name: 'annualBenefit', label: 'Annual Benefit', type: 'currency', decimals: 0 },
    { name: 'lifetimeBenefit', label: 'Est. Lifetime Benefit', type: 'currency', decimals: 0, description: 'Assuming life expectancy of 85' },
    { name: 'adjustmentPct', label: 'Benefit Adjustment', type: 'percentage', decimals: 0, description: 'vs. full retirement age amount' },
  ],
  examples: [
    { title: 'Full Retirement Age', description: '$65K/year average, claiming at 67.', inputs: { avgAnnualEarnings: 65000, currentAge: 45, claimingAge: 67, workingYears: 25 } },
    { title: 'Early Claiming at 62', description: 'Same earnings, claiming early for more years.', inputs: { avgAnnualEarnings: 65000, currentAge: 45, claimingAge: 62, workingYears: 25 } },
    { title: 'Delay to 70 for Max', description: 'High earner maximizing by delaying to 70.', inputs: { avgAnnualEarnings: 120000, currentAge: 50, claimingAge: 70, workingYears: 35 } },
  ],
  documentation: {
    overview: 'Social Security benefits are calculated using your Average Indexed Monthly Earnings (AIME) from your 35 highest-earning years. The age you claim significantly affects your monthly benefit — claiming early reduces it, delaying increases it.',
    howToUse: ['Enter your average annual earnings across your career.', 'Enter your current age.', 'Select the age at which you plan to claim benefits.', 'Adjust years of work history for accuracy.'],
    formula: 'PIA = 90% of first $1,115 AIME + 32% of next $5,606 + 15% above $6,721\nAdjustment: −5/9% per month before FRA (up to 36 months), −5/12% beyond; +8% per year after FRA',
    faqs: [
      { question: 'When should I claim?', answer: 'If you are in good health and expect to live past 80, delaying to 70 usually maximizes lifetime benefits. If health is a concern or you need income sooner, claiming earlier may make sense.' },
      { question: 'How accurate is this estimate?', answer: 'This is a rough estimate. Your actual benefit depends on your complete earnings record and SSA\'s exact formula. Visit ssa.gov for a personalized statement.' },
    ],
  },
  relatedTools: ['retirement-savings-calculator', 'compound-interest-calculator', 'debt-payoff-planner'],
};

export const inflationCalculator: ToolDefinition = {
  slug: 'inflation-calculator',
  title: 'Inflation Calculator',
  shortDescription: 'See how inflation erodes purchasing power over time.',
  description: 'Calculate the future value of money accounting for inflation, or find what a past amount is worth in today\'s dollars. Essential for retirement and long-term financial planning.',
  category: 'finance',
  subcategory: 'personal-finance',
  tags: ['inflation', 'purchasing power', 'CPI', 'real value', 'cost of living'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'amount', label: 'Amount', type: 'currency', defaultValue: 50000, min: 1, max: 10000000, step: 1000, prefix: '$' },
    { name: 'inflationRate', label: 'Annual Inflation Rate', type: 'percentage', defaultValue: 3.0, min: 0.1, max: 20, step: 0.1, suffix: '%', helpText: 'US average is ~3%; recent years ~4–8%' },
    { name: 'years', label: 'Number of Years', type: 'slider', defaultValue: 20, min: 1, max: 50, step: 1, suffix: ' years' },
  ],
  calculate: (inputs) => {
    const amount = Number(inputs.amount);
    const rate = Number(inputs.inflationRate) / 100;
    const years = Number(inputs.years);
    const futureValue = amount * Math.pow(1 + rate, years);
    const purchasingPowerLoss = futureValue - amount;
    const realValueToday = amount / Math.pow(1 + rate, years);
    const percentLoss = (purchasingPowerLoss / futureValue) * 100;
    return {
      futureValue: Math.round(futureValue),
      purchasingPowerLoss: Math.round(purchasingPowerLoss),
      realValueToday: Math.round(realValueToday),
      percentLoss: Math.round(percentLoss * 10) / 10,
    };
  },
  outputs: [
    { name: 'futureValue', label: 'Amount Needed in Future', type: 'currency', decimals: 0, highlight: true, description: 'To match today\'s purchasing power' },
    { name: 'realValueToday', label: 'Today\'s Value of Future Amount', type: 'currency', decimals: 0, description: 'What your money is really worth' },
    { name: 'purchasingPowerLoss', label: 'Purchasing Power Lost', type: 'currency', decimals: 0 },
    { name: 'percentLoss', label: 'Value Lost to Inflation', type: 'percentage', decimals: 1 },
  ],
  examples: [
    { title: 'Retirement Savings', description: 'How much will $50,000 be worth in 20 years at 3% inflation?', inputs: { amount: 50000, inflationRate: 3, years: 20 } },
    { title: 'High Inflation Scenario', description: '$100,000 over 10 years at 6% inflation.', inputs: { amount: 100000, inflationRate: 6, years: 10 } },
    { title: 'Annual Salary Review', description: 'Does your $75K salary keep up over 5 years?', inputs: { amount: 75000, inflationRate: 3.5, years: 5 } },
  ],
  documentation: {
    overview: 'Inflation silently erodes the purchasing power of money over time. A dollar today buys less than a dollar did 10 years ago. This calculator helps you understand the real impact of inflation on savings, salaries, and long-term goals.',
    howToUse: ['Enter the monetary amount you want to analyze.', 'Enter the expected annual inflation rate.', 'Set how many years to project forward.', 'See how much more you will need in the future to maintain the same purchasing power.'],
    formula: 'Future Value = Amount × (1 + inflation rate)^years\nReal Value Today = Future Amount ÷ (1 + rate)^years',
    faqs: [
      { question: 'What inflation rate should I use?', answer: 'The US long-term average is about 3%. For conservative planning, use 3–4%. Recent inflation (2021–2023) ran higher at 5–8%, but typically returns to the long-run average.' },
      { question: 'How does this affect my retirement savings?', answer: 'If your retirement fund earns 7% annually but inflation is 3%, your real (inflation-adjusted) return is only about 4%. Always plan using real returns, not nominal ones.' },
    ],
  },
  relatedTools: ['retirement-savings-calculator', 'compound-interest-calculator', 'savings-goal-calculator'],
};
