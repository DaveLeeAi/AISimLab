import { ToolDefinition } from './types';

export const loanAffordabilityCalculator: ToolDefinition = {
  slug: 'loan-affordability-calculator',
  title: 'Loan Affordability Calculator',
  shortDescription: 'Estimate the maximum loan amount you can qualify for based on income and debts.',
  description: 'Using standard debt-to-income (DTI) ratios used by lenders, this calculator estimates the maximum mortgage or loan you can realistically qualify for given your income and existing debt obligations.',
  category: 'finance',
  subcategory: 'loans',
  tags: ['loan', 'affordability', 'dti', 'debt to income', 'mortgage qualification', 'borrowing power'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'grossMonthlyIncome', label: 'Gross Monthly Income', type: 'currency', defaultValue: 7000, min: 0, max: 1000000, step: 100, prefix: '$', helpText: 'Before-tax income' },
    { name: 'monthlyDebts', label: 'Existing Monthly Debt Payments', type: 'currency', defaultValue: 400, min: 0, max: 100000, step: 50, prefix: '$', helpText: 'Car loans, student loans, credit cards' },
    { name: 'annualInterestRate', label: 'Expected Interest Rate', type: 'percentage', defaultValue: 6.75, min: 0.1, max: 25, step: 0.05, suffix: '%' },
    { name: 'loanTerm', label: 'Loan Term', type: 'select', defaultValue: 30, options: [{ label: '10 years', value: 10 }, { label: '15 years', value: 15 }, { label: '20 years', value: 20 }, { label: '30 years', value: 30 }] },
    { name: 'downPayment', label: 'Down Payment', type: 'currency', defaultValue: 50000, min: 0, max: 10000000, step: 1000, prefix: '$' },
  ],
  calculate: (inputs) => {
    const income = Number(inputs.grossMonthlyIncome);
    const debts = Number(inputs.monthlyDebts);
    const rate = Number(inputs.annualInterestRate) / 100 / 12;
    const n = Number(inputs.loanTerm) * 12;
    const down = Number(inputs.downPayment);

    const frontEndMax = income * 0.28;
    const backEndMax = Math.max(0, income * 0.36 - debts);
    const maxMonthlyPI = Math.min(frontEndMax, backEndMax);

    const maxLoan = rate > 0
      ? maxMonthlyPI * (1 - Math.pow(1 + rate, -n)) / rate
      : maxMonthlyPI * n;

    const maxHomePrice = maxLoan + down;
    const frontEndDTI = income > 0 ? (maxMonthlyPI / income) * 100 : 0;
    const backEndDTI = income > 0 ? ((maxMonthlyPI + debts) / income) * 100 : 0;

    return {
      maxLoanAmount: Math.round(maxLoan),
      maxHomePrice: Math.round(maxHomePrice),
      maxMonthlyPayment: Math.round(maxMonthlyPI),
      frontEndDTI: Math.round(frontEndDTI * 10) / 10,
      backEndDTI: Math.round(backEndDTI * 10) / 10,
    };
  },
  outputs: [
    { name: 'maxLoanAmount', label: 'Maximum Loan Amount', type: 'currency', highlight: true, description: 'Estimated borrowing limit based on DTI rules' },
    { name: 'maxHomePrice', label: 'Max Purchase Price', type: 'currency', description: 'Loan + down payment' },
    { name: 'maxMonthlyPayment', label: 'Max Monthly P&I', type: 'currency' },
    { name: 'frontEndDTI', label: 'Front-End DTI', type: 'percentage', decimals: 1, description: 'Housing payment as % of income (28% limit)' },
    { name: 'backEndDTI', label: 'Back-End DTI', type: 'percentage', decimals: 1, description: 'All debts as % of income (36% limit)' },
  ],
  examples: [
    { title: 'Dual Income Household', description: '$7K/month combined income, modest existing debts.', inputs: { grossMonthlyIncome: 7000, monthlyDebts: 400, annualInterestRate: 6.75, loanTerm: 30, downPayment: 50000 } },
    { title: 'First-Time Buyer', description: 'Single income, student loan payments, low down payment.', inputs: { grossMonthlyIncome: 5000, monthlyDebts: 600, annualInterestRate: 7.0, loanTerm: 30, downPayment: 20000 } },
    { title: 'High Income, Debt-Free', description: 'Strong income with no existing obligations.', inputs: { grossMonthlyIncome: 12000, monthlyDebts: 0, annualInterestRate: 6.5, loanTerm: 30, downPayment: 100000 } },
  ],
  documentation: {
    overview: "Lenders use debt-to-income (DTI) ratios to determine how much they'll lend you. The front-end ratio limits housing costs to 28% of gross income; the back-end ratio limits all debt payments to 36%. This calculator applies both limits and uses the more conservative result.",
    howToUse: [
      'Enter your total gross (pre-tax) monthly income.',
      'Enter all existing monthly debt payments (car, student loans, credit card minimums).',
      'Set the expected interest rate and loan term.',
      'Enter your planned down payment.',
      'The result is the maximum loan most lenders would approve.',
    ],
    formula: 'Front-End Max P&I = Gross Income × 28%\nBack-End Max P&I = (Gross Income × 36%) − Existing Debts\nMax Loan = Min(Front-End, Back-End) × [1 − (1+r)^−n] ÷ r',
    faqs: [
      { question: 'Is this what lenders actually use?', answer: 'The 28/36 rule is a conventional guideline. FHA loans allow up to 31%/43%, and some lenders go higher with compensating factors. This gives you a conservative, realistic baseline.' },
      { question: 'What counts as existing debt?', answer: 'Include: car payments, student loan minimums, credit card minimum payments, personal loans, and any other recurring debt obligations. Do not include utilities, groceries, or insurance.' },
    ],
  },
  relatedTools: ['mortgage-calculator', 'debt-payoff-planner', 'budget-planner'],
};

export const debtPayoffPlanner: ToolDefinition = {
  slug: 'debt-payoff-planner',
  title: 'Debt Payoff Planner',
  shortDescription: 'See how extra payments dramatically reduce your debt payoff time and total interest.',
  description: 'Compare the cost of paying only the minimum vs. adding an extra monthly payment. See exactly how many months and how much interest you save by accelerating debt payoff.',
  category: 'finance',
  subcategory: 'budgeting',
  tags: ['debt payoff', 'credit card', 'loan', 'minimum payment', 'interest', 'debt free'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'balance', label: 'Current Balance', type: 'currency', defaultValue: 8500, min: 1, max: 10000000, step: 100, prefix: '$' },
    { name: 'annualInterestRate', label: 'Annual Interest Rate (APR)', type: 'percentage', defaultValue: 19.99, min: 0.1, max: 50, step: 0.01, suffix: '%' },
    { name: 'minimumPayment', label: 'Minimum Monthly Payment', type: 'currency', defaultValue: 200, min: 1, max: 100000, step: 10, prefix: '$' },
    { name: 'extraPayment', label: 'Extra Monthly Payment', type: 'currency', defaultValue: 150, min: 0, max: 100000, step: 25, prefix: '$', helpText: 'Additional amount above minimum' },
  ],
  calculate: (inputs) => {
    const balance = Number(inputs.balance);
    const monthlyRate = Number(inputs.annualInterestRate) / 100 / 12;
    const minPayment = Number(inputs.minimumPayment);
    const extraPayment = Number(inputs.extraPayment);

    function calcPayoff(payment: number) {
      if (payment <= balance * monthlyRate) return { months: Infinity, interest: Infinity };
      let bal = balance, months = 0, totalInterest = 0;
      while (bal > 0 && months < 1200) {
        const interest = bal * monthlyRate;
        totalInterest += interest;
        bal = bal + interest - payment;
        if (bal < 0) bal = 0;
        months++;
      }
      return { months, interest: totalInterest };
    }

    const minOnly = calcPayoff(minPayment);
    const withExtra = calcPayoff(minPayment + extraPayment);

    const monthsSaved = isFinite(minOnly.months) ? minOnly.months - withExtra.months : 0;
    const interestSaved = isFinite(minOnly.interest) ? minOnly.interest - withExtra.interest : 0;

    return {
      payoffWithExtra: withExtra.months,
      payoffMinOnly: isFinite(minOnly.months) ? minOnly.months : 0,
      totalInterestExtra: Math.round(withExtra.interest),
      totalInterestMinOnly: isFinite(minOnly.interest) ? Math.round(minOnly.interest) : 0,
      interestSaved: Math.round(Math.max(0, interestSaved)),
      monthsSaved: Math.max(0, monthsSaved),
    };
  },
  outputs: [
    { name: 'payoffWithExtra', label: 'Payoff Time (With Extra)', type: 'number', decimals: 0, highlight: true, description: 'Months to pay off with extra payments' },
    { name: 'payoffMinOnly', label: 'Payoff Time (Min Only)', type: 'number', decimals: 0 },
    { name: 'monthsSaved', label: 'Months Saved', type: 'number', decimals: 0 },
    { name: 'interestSaved', label: 'Interest Saved', type: 'currency', description: 'Total interest avoided by paying extra' },
    { name: 'totalInterestExtra', label: 'Total Interest (With Extra)', type: 'currency' },
    { name: 'totalInterestMinOnly', label: 'Total Interest (Min Only)', type: 'currency' },
  ],
  examples: [
    { title: 'Credit Card Debt', description: '$8,500 credit card debt at ~20% APR.', inputs: { balance: 8500, annualInterestRate: 19.99, minimumPayment: 200, extraPayment: 150 } },
    { title: 'Personal Loan', description: '$15K personal loan at 12% APR with aggressive payoff.', inputs: { balance: 15000, annualInterestRate: 12.0, minimumPayment: 350, extraPayment: 300 } },
    { title: 'Small Balance', description: 'Clearing a $2K balance quickly.', inputs: { balance: 2000, annualInterestRate: 22.9, minimumPayment: 60, extraPayment: 200 } },
  ],
  documentation: {
    overview: 'High-interest debt is one of the most expensive financial burdens. This planner shows you the dramatic difference between minimum payments and an accelerated payoff strategy. Even a small extra monthly payment can save thousands of dollars in interest.',
    howToUse: [
      "Enter your current debt balance.",
      'Enter the APR (Annual Percentage Rate) from your statement.',
      'Enter your minimum required monthly payment.',
      'Enter any extra amount you could add each month.',
      'Compare payoff time and total interest for both scenarios.',
    ],
    formula: 'Monthly Interest = Balance × (APR ÷ 12)\nNew Balance = Balance + Interest − Payment\nRepeat until Balance = 0',
    faqs: [
      { question: 'What if the minimum payment barely covers the interest?', answer: "If your minimum payment is less than or equal to the monthly interest charge, your balance never decreases. This calculator will show high payoff times — the fix is to increase payments immediately." },
      { question: 'Should I pay off debt or invest?', answer: 'If your debt interest rate exceeds your expected investment return (typically 7–10%), pay off debt first. High-interest credit card debt (15–25%) should almost always be prioritized over investing.' },
    ],
  },
  relatedTools: ['budget-planner', 'loan-affordability-calculator', 'emergency-fund-calculator'],
};

export const retirementSavingsCalculator: ToolDefinition = {
  slug: 'retirement-savings-calculator',
  title: 'Retirement Savings Calculator',
  shortDescription: 'Project your retirement nest egg and see if you\'re on track for your income goals.',
  description: 'Estimate your retirement portfolio value based on current savings, monthly contributions, and investment returns. Then compare the projected nest egg against your target monthly income using the 4% withdrawal rule.',
  category: 'finance',
  subcategory: 'retirement',
  tags: ['retirement', '401k', 'savings', 'ira', 'nest egg', '4% rule', 'retirement planning'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 32, min: 18, max: 80, step: 1 },
    { name: 'retirementAge', label: 'Retirement Age', type: 'number', defaultValue: 65, min: 40, max: 85, step: 1 },
    { name: 'currentSavings', label: 'Current Retirement Savings', type: 'currency', defaultValue: 45000, min: 0, max: 100000000, step: 1000, prefix: '$' },
    { name: 'monthlyContribution', label: 'Monthly Contribution', type: 'currency', defaultValue: 600, min: 0, max: 100000, step: 50, prefix: '$', helpText: 'Total from all accounts (401k, IRA, etc.)' },
    { name: 'annualReturn', label: 'Expected Annual Return', type: 'percentage', defaultValue: 7, min: 0, max: 20, step: 0.5, suffix: '%', helpText: 'Historical stock market average ~7–10%' },
    { name: 'monthlyIncomeNeeded', label: 'Monthly Income Needed in Retirement', type: 'currency', defaultValue: 4500, min: 0, max: 500000, step: 100, prefix: '$' },
  ],
  calculate: (inputs) => {
    const currentAge = Number(inputs.currentAge);
    const retirementAge = Number(inputs.retirementAge);
    const currentSavings = Number(inputs.currentSavings);
    const monthlyContribution = Number(inputs.monthlyContribution);
    const annualReturn = Number(inputs.annualReturn) / 100;
    const monthlyIncomeNeeded = Number(inputs.monthlyIncomeNeeded);

    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    const months = yearsToRetirement * 12;
    const monthlyRate = annualReturn / 12;

    const principalGrowth = currentSavings * Math.pow(1 + monthlyRate, months);
    const contributionGrowth = monthlyRate > 0
      ? monthlyContribution * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate
      : monthlyContribution * months;

    const nestEgg = principalGrowth + contributionGrowth;
    const annualWithdrawal = nestEgg * 0.04;
    const monthlyWithdrawal = annualWithdrawal / 12;
    const totalNeeded = (monthlyIncomeNeeded * 12) / 0.04;
    const fundingGap = monthlyIncomeNeeded - monthlyWithdrawal;

    return {
      nestEgg: Math.round(nestEgg),
      monthlyWithdrawal: Math.round(monthlyWithdrawal),
      totalNeeded: Math.round(totalNeeded),
      fundingGap: Math.round(fundingGap),
      yearsToRetirement,
    };
  },
  outputs: [
    { name: 'nestEgg', label: 'Projected Nest Egg', type: 'currency', highlight: true, description: 'Estimated retirement portfolio value' },
    { name: 'monthlyWithdrawal', label: 'Sustainable Monthly Income', type: 'currency', description: '4% annual withdrawal rule' },
    { name: 'fundingGap', label: 'Monthly Income Gap', type: 'currency', description: 'Positive = shortfall, negative = surplus' },
    { name: 'totalNeeded', label: 'Total Savings Needed', type: 'currency', description: 'To fund your target income indefinitely' },
    { name: 'yearsToRetirement', label: 'Years to Retirement', type: 'number', decimals: 0 },
  ],
  examples: [
    { title: 'On Track at 32', description: 'Starting early with consistent contributions.', inputs: { currentAge: 32, retirementAge: 65, currentSavings: 45000, monthlyContribution: 600, annualReturn: 7, monthlyIncomeNeeded: 4500 } },
    { title: 'Late Starter at 45', description: 'Starting serious saving at 45 with higher contributions.', inputs: { currentAge: 45, retirementAge: 67, currentSavings: 80000, monthlyContribution: 1500, annualReturn: 7, monthlyIncomeNeeded: 5000 } },
    { title: 'Aggressive Saver', description: 'High earner maximizing contributions for early retirement.', inputs: { currentAge: 30, retirementAge: 55, currentSavings: 150000, monthlyContribution: 3000, annualReturn: 8, monthlyIncomeNeeded: 6000 } },
  ],
  documentation: {
    overview: 'The Retirement Savings Calculator projects your portfolio value at retirement using compound growth, then applies the widely-used 4% withdrawal rule to estimate how much monthly income your nest egg can sustainably provide. If there is a gap, you can see exactly how much more to save.',
    howToUse: [
      'Enter your current age and target retirement age.',
      'Enter all current retirement savings (401k, IRA, brokerage, etc. combined).',
      'Set your total monthly contributions across all accounts.',
      'Use 7% for a balanced portfolio, 10% for all-equities historical average.',
      'Enter your desired monthly income in retirement (in today\'s dollars).',
      'Review your nest egg projection and whether it meets your income goal.',
    ],
    formula: 'Nest Egg = P×(1+r)^n + PMT×[(1+r)^n−1]/r\nMonthly Income = (Nest Egg × 4%) ÷ 12\nTotal Needed = (Annual Income Needed) ÷ 4%',
    faqs: [
      { question: 'What is the 4% rule?', answer: 'The 4% rule (from the Trinity Study) suggests you can withdraw 4% of your portfolio in year one, then adjust for inflation, and your money will last 30+ years. It\'s a widely-used retirement planning benchmark.' },
      { question: 'Does this account for inflation?', answer: 'The projection uses nominal returns (not inflation-adjusted). For a conservative estimate, subtract 2–3% from your expected return rate to use real (inflation-adjusted) returns.' },
      { question: 'What return rate should I use?', answer: 'The S&P 500 has returned ~10% nominal, ~7% real (after inflation) historically. A 60/40 stock-bond portfolio averages closer to 6–7% nominal. Use 6–8% for balanced, long-term projections.' },
    ],
  },
  relatedTools: ['compound-interest-calculator', 'savings-goal-calculator', 'investment-return-calculator'],
};
