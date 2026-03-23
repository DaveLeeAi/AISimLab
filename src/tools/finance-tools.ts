import { ToolDefinition } from './types';

export const tipCalculator: ToolDefinition = {
  slug: 'tip-calculator',
  title: 'Tip Calculator',
  shortDescription: 'Calculate tip amounts and split bills evenly across any number of people.',
  description: 'Instantly calculate the tip on any bill, see the total amount, and split evenly across your party. Adjust the tip percentage to match the service level.',
  category: 'finance',
  subcategory: 'budgeting',
  tags: ['tip', 'bill split', 'restaurant', 'gratuity', 'split bill'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'billAmount', label: 'Bill Amount', type: 'currency', defaultValue: 65, min: 0.01, max: 100000, step: 0.5, prefix: '$' },
    { name: 'tipPercentage', label: 'Tip Percentage', type: 'slider', defaultValue: 18, min: 0, max: 50, step: 1, suffix: '%' },
    { name: 'numberOfPeople', label: 'Number of People', type: 'number', defaultValue: 2, min: 1, max: 100, step: 1 },
  ],
  calculate: (inputs) => {
    const bill = Number(inputs.billAmount);
    const tip = Number(inputs.tipPercentage) / 100;
    const people = Math.max(1, Number(inputs.numberOfPeople));
    const tipAmount = bill * tip;
    const totalBill = bill + tipAmount;
    const perPerson = totalBill / people;
    const tipPerPerson = tipAmount / people;
    return { tipAmount, totalBill, perPerson, tipPerPerson };
  },
  outputs: [
    { name: 'tipAmount', label: 'Tip Amount', type: 'currency', highlight: true, description: 'Gratuity on the pre-tax bill' },
    { name: 'totalBill', label: 'Total Bill', type: 'currency', description: 'Bill + tip combined' },
    { name: 'perPerson', label: 'Per Person', type: 'currency', description: 'Total split equally' },
    { name: 'tipPerPerson', label: 'Tip Per Person', type: 'currency' },
  ],
  examples: [
    { title: 'Dinner for Two', description: 'A $65 restaurant bill with standard 18% tip.', inputs: { billAmount: 65, tipPercentage: 18, numberOfPeople: 2 } },
    { title: 'Group of 6', description: 'Large group dinner — 20% tip split six ways.', inputs: { billAmount: 220, tipPercentage: 20, numberOfPeople: 6 } },
    { title: 'Excellent Service', description: 'Outstanding service deserves a 25% tip.', inputs: { billAmount: 48, tipPercentage: 25, numberOfPeople: 1 } },
  ],
  documentation: {
    overview: 'The Tip Calculator makes it simple to calculate the right gratuity and split the total among your group. Adjust the tip percentage to reflect service quality — 15% is standard, 18–20% is common for good service, and 25%+ for exceptional experiences.',
    howToUse: [
      'Enter the bill amount (before tax if applicable).',
      'Drag the slider to set your desired tip percentage.',
      'Enter the number of people sharing the bill.',
      'See the tip amount, total, and per-person costs instantly.',
    ],
    formula: 'Tip Amount = Bill × (Tip % ÷ 100)\nTotal Bill = Bill + Tip Amount\nPer Person = Total Bill ÷ Number of People',
    faqs: [
      { question: 'Should I tip on the pre-tax or post-tax amount?', answer: 'Convention varies by region. In the US, tipping on the pre-tax subtotal is common, but tipping on the post-tax amount is also widely accepted.' },
      { question: 'What is a standard tip percentage?', answer: '15% is the traditional minimum for adequate service. 18–20% is now standard for good service. 25% or more for exceptional service.' },
    ],
  },
  relatedTools: ['budget-planner', 'trip-budget-planner'],
};

export const savingsGoalCalculator: ToolDefinition = {
  slug: 'savings-goal-calculator',
  title: 'Savings Goal Calculator',
  shortDescription: 'Calculate how long it takes to reach any savings goal with regular contributions.',
  description: 'Set a savings target, enter your current balance and monthly contribution, and see exactly when you will reach your goal — including the interest earned along the way.',
  category: 'finance',
  subcategory: 'budgeting',
  tags: ['savings', 'goal', 'target', 'monthly contribution', 'timeline'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'goalAmount', label: 'Savings Goal', type: 'currency', defaultValue: 20000, min: 1, max: 10000000, step: 500, prefix: '$' },
    { name: 'currentSavings', label: 'Current Savings', type: 'currency', defaultValue: 2000, min: 0, max: 10000000, step: 100, prefix: '$' },
    { name: 'monthlyContribution', label: 'Monthly Contribution', type: 'currency', defaultValue: 500, min: 1, max: 1000000, step: 50, prefix: '$' },
    { name: 'annualInterestRate', label: 'Annual Interest Rate', type: 'percentage', defaultValue: 4.5, min: 0, max: 20, step: 0.1, suffix: '%', helpText: 'High-yield savings or investment return' },
  ],
  calculate: (inputs) => {
    const goal = Number(inputs.goalAmount);
    const current = Number(inputs.currentSavings);
    const monthly = Number(inputs.monthlyContribution);
    const annualRate = Number(inputs.annualInterestRate) / 100;
    const monthlyRate = annualRate / 12;

    if (current >= goal) return { monthsToGoal: 0, yearsToGoal: 0, totalContributions: current, interestEarned: 0, completionYear: new Date().getFullYear() };

    let balance = current;
    let months = 0;
    while (balance < goal && months < 1200) {
      balance = balance * (1 + monthlyRate) + monthly;
      months++;
    }

    const totalContributions = current + monthly * months;
    const interestEarned = Math.max(0, goal - totalContributions);
    const completionYear = new Date().getFullYear() + Math.floor(months / 12);
    const yearsToGoal = months / 12;

    return { monthsToGoal: months, yearsToGoal: Math.round(yearsToGoal * 10) / 10, totalContributions, interestEarned, completionYear };
  },
  outputs: [
    { name: 'monthsToGoal', label: 'Months to Goal', type: 'number', highlight: true, decimals: 0, description: 'Time to reach your target' },
    { name: 'yearsToGoal', label: 'Years to Goal', type: 'number', decimals: 1 },
    { name: 'totalContributions', label: 'Total Contributed', type: 'currency' },
    { name: 'interestEarned', label: 'Interest Earned', type: 'currency' },
    { name: 'completionYear', label: 'Completion Year', type: 'number', decimals: 0 },
  ],
  examples: [
    { title: 'Emergency Fund', description: 'Building a $10K emergency fund starting with $500.', inputs: { goalAmount: 10000, currentSavings: 500, monthlyContribution: 400, annualInterestRate: 4.5 } },
    { title: 'Down Payment', description: 'Saving $50K for a home down payment.', inputs: { goalAmount: 50000, currentSavings: 5000, monthlyContribution: 1200, annualInterestRate: 4.5 } },
    { title: 'Vacation Fund', description: 'Saving $3K for a vacation next year.', inputs: { goalAmount: 3000, currentSavings: 200, monthlyContribution: 250, annualInterestRate: 2 } },
  ],
  documentation: {
    overview: 'The Savings Goal Calculator helps you build a realistic plan to reach any financial target. It accounts for your existing savings, regular contributions, and interest earned — giving you an honest timeline and milestone date.',
    howToUse: [
      'Enter your total savings target.',
      'Enter how much you have saved already.',
      'Set your planned monthly contribution.',
      'Add an interest rate if your savings are in a high-yield account or investment.',
      'Review the months and completion year.',
    ],
    formula: 'Each month: Balance = Balance × (1 + r) + Monthly Contribution\nWhere r = Annual Rate ÷ 12\nRepeat until Balance ≥ Goal',
    faqs: [
      { question: 'What interest rate should I use?', answer: 'Use your actual savings account APY. High-yield savings accounts currently offer 4–5%. For investment accounts, use 7–10% for long-term goals.' },
      { question: 'What if I can increase contributions over time?', answer: 'Re-run the calculator periodically with updated figures. Even small increases in monthly contributions can significantly shorten your timeline.' },
    ],
  },
  relatedTools: ['emergency-fund-calculator', 'budget-planner', 'compound-interest-calculator'],
};

export const emergencyFundCalculator: ToolDefinition = {
  slug: 'emergency-fund-calculator',
  title: 'Emergency Fund Calculator',
  shortDescription: 'Determine exactly how much emergency savings you need based on your monthly expenses.',
  description: 'Calculate your ideal emergency fund target based on your actual monthly expenses. See how your current savings compare and how long until you reach full coverage.',
  category: 'finance',
  subcategory: 'budgeting',
  tags: ['emergency fund', 'savings', 'financial safety', 'expenses', '3 months', '6 months'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'monthlyRent', label: 'Monthly Housing (Rent/Mortgage)', type: 'currency', defaultValue: 1500, min: 0, max: 50000, step: 50, prefix: '$' },
    { name: 'monthlyFood', label: 'Monthly Food & Groceries', type: 'currency', defaultValue: 600, min: 0, max: 10000, step: 25, prefix: '$' },
    { name: 'monthlyUtilities', label: 'Monthly Utilities & Bills', type: 'currency', defaultValue: 250, min: 0, max: 5000, step: 25, prefix: '$' },
    { name: 'monthlyTransport', label: 'Monthly Transport', type: 'currency', defaultValue: 400, min: 0, max: 5000, step: 25, prefix: '$' },
    { name: 'monthlyOther', label: 'Other Monthly Essentials', type: 'currency', defaultValue: 350, min: 0, max: 10000, step: 25, prefix: '$' },
    { name: 'targetMonths', label: 'Target Coverage', type: 'slider', defaultValue: 6, min: 1, max: 12, step: 1, suffix: ' months' },
    { name: 'currentSavings', label: 'Current Emergency Savings', type: 'currency', defaultValue: 3000, min: 0, max: 10000000, step: 100, prefix: '$' },
  ],
  calculate: (inputs) => {
    const total = Number(inputs.monthlyRent) + Number(inputs.monthlyFood) + Number(inputs.monthlyUtilities) + Number(inputs.monthlyTransport) + Number(inputs.monthlyOther);
    const months = Number(inputs.targetMonths);
    const current = Number(inputs.currentSavings);
    const targetFund = total * months;
    const remaining = Math.max(0, targetFund - current);
    const monthsCovered = total > 0 ? current / total : 0;
    const percentComplete = targetFund > 0 ? Math.min(100, (current / targetFund) * 100) : 100;
    return { targetFund, monthlyExpenses: total, remaining, monthsCovered: Math.round(monthsCovered * 10) / 10, percentComplete: Math.round(percentComplete * 10) / 10 };
  },
  outputs: [
    { name: 'targetFund', label: 'Target Emergency Fund', type: 'currency', highlight: true, description: 'Total savings needed for full coverage' },
    { name: 'monthlyExpenses', label: 'Total Monthly Expenses', type: 'currency' },
    { name: 'remaining', label: 'Still Needed', type: 'currency', description: 'Gap between current savings and target' },
    { name: 'monthsCovered', label: 'Months Currently Covered', type: 'number', decimals: 1 },
    { name: 'percentComplete', label: 'Goal Progress', type: 'percentage', decimals: 1 },
  ],
  examples: [
    { title: 'Single Renter', description: 'Single person renting with moderate expenses, targeting 6 months.', inputs: { monthlyRent: 1400, monthlyFood: 500, monthlyUtilities: 180, monthlyTransport: 350, monthlyOther: 270, targetMonths: 6, currentSavings: 4000 } },
    { title: 'Family of Four', description: 'Family with higher expenses targeting a full 6-month cushion.', inputs: { monthlyRent: 2200, monthlyFood: 1200, monthlyUtilities: 400, monthlyTransport: 700, monthlyOther: 600, targetMonths: 6, currentSavings: 8000 } },
    { title: 'Minimal Coverage', description: 'Getting started — targeting just 3 months.', inputs: { monthlyRent: 1000, monthlyFood: 400, monthlyUtilities: 150, monthlyTransport: 250, monthlyOther: 200, targetMonths: 3, currentSavings: 1500 } },
  ],
  documentation: {
    overview: 'An emergency fund is your first line of financial defense. Most financial experts recommend 3–6 months of essential expenses. This calculator helps you determine your specific target based on your real monthly costs — not a generic number.',
    howToUse: [
      'Enter each category of monthly essential expenses (be honest — include all regular bills).',
      'Set your target coverage period (3 months minimum, 6 is the standard recommendation).',
      'Enter what you currently have saved in your emergency account.',
      'See your target, the gap remaining, and your progress percentage.',
    ],
    formula: 'Target Fund = Total Monthly Expenses × Target Months\nMonths Covered = Current Savings ÷ Monthly Expenses\nProgress % = (Current Savings ÷ Target Fund) × 100',
    faqs: [
      { question: 'Should I include discretionary spending?', answer: "Enter only essential, unavoidable expenses. In an emergency, you'd cut entertainment and dining — so only include rent, food, utilities, transport, and insurance-type essentials." },
      { question: 'Where should I keep my emergency fund?', answer: 'Keep it in a high-yield savings account — liquid, safe, and earning interest. Do not invest it in stocks or anything with market risk.' },
    ],
  },
  relatedTools: ['savings-goal-calculator', 'budget-planner', 'debt-payoff-planner'],
};

export const budgetPlanner: ToolDefinition = {
  slug: 'budget-planner',
  title: 'Budget Planner',
  shortDescription: 'Model your monthly income vs. expenses and find your true savings rate.',
  description: 'Enter your monthly income and expense categories to see exactly how your money is allocated, whether you have a surplus or deficit, and your personal savings rate.',
  category: 'finance',
  subcategory: 'budgeting',
  tags: ['budget', 'monthly expenses', 'savings rate', 'income', 'spending'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'monthlyIncome', label: 'Monthly Take-Home Income', type: 'currency', defaultValue: 5000, min: 0, max: 1000000, step: 100, prefix: '$', helpText: 'After-tax income' },
    { name: 'housing', label: 'Housing (Rent / Mortgage)', type: 'currency', defaultValue: 1500, min: 0, max: 50000, step: 50, prefix: '$' },
    { name: 'food', label: 'Food & Dining', type: 'currency', defaultValue: 600, min: 0, max: 10000, step: 25, prefix: '$' },
    { name: 'transport', label: 'Transportation', type: 'currency', defaultValue: 400, min: 0, max: 10000, step: 25, prefix: '$' },
    { name: 'utilities', label: 'Utilities & Subscriptions', type: 'currency', defaultValue: 250, min: 0, max: 5000, step: 25, prefix: '$' },
    { name: 'entertainment', label: 'Entertainment & Hobbies', type: 'currency', defaultValue: 300, min: 0, max: 10000, step: 25, prefix: '$' },
    { name: 'otherExpenses', label: 'Other Expenses', type: 'currency', defaultValue: 350, min: 0, max: 10000, step: 25, prefix: '$' },
  ],
  calculate: (inputs) => {
    const income = Number(inputs.monthlyIncome);
    const totalExpenses = Number(inputs.housing) + Number(inputs.food) + Number(inputs.transport) + Number(inputs.utilities) + Number(inputs.entertainment) + Number(inputs.otherExpenses);
    const remaining = income - totalExpenses;
    const savingsRate = income > 0 ? (remaining / income) * 100 : 0;
    const housingRatio = income > 0 ? (Number(inputs.housing) / income) * 100 : 0;
    const annualSavings = remaining * 12;
    return { remaining, totalExpenses, savingsRate: Math.round(savingsRate * 10) / 10, housingRatio: Math.round(housingRatio * 10) / 10, annualSavings };
  },
  outputs: [
    { name: 'remaining', label: 'Monthly Surplus / Deficit', type: 'currency', highlight: true, description: 'Positive = surplus, negative = deficit' },
    { name: 'savingsRate', label: 'Savings Rate', type: 'percentage', decimals: 1, description: '% of income available to save' },
    { name: 'totalExpenses', label: 'Total Monthly Expenses', type: 'currency' },
    { name: 'housingRatio', label: 'Housing Ratio', type: 'percentage', decimals: 1, description: 'Ideally under 30% of income' },
    { name: 'annualSavings', label: 'Annual Savings Potential', type: 'currency' },
  ],
  examples: [
    { title: 'Balanced Budget', description: 'A typical salaried professional with a healthy surplus.', inputs: { monthlyIncome: 5500, housing: 1600, food: 550, transport: 400, utilities: 200, entertainment: 250, otherExpenses: 300 } },
    { title: 'Tight Budget', description: 'Living paycheck-to-paycheck — identifying the squeeze.', inputs: { monthlyIncome: 3800, housing: 1400, food: 700, transport: 450, utilities: 280, entertainment: 400, otherExpenses: 500 } },
    { title: 'High Earner', description: 'Higher income with room for aggressive saving.', inputs: { monthlyIncome: 10000, housing: 2500, food: 800, transport: 600, utilities: 300, entertainment: 500, otherExpenses: 600 } },
  ],
  documentation: {
    overview: 'A budget is the foundation of financial health. This planner gives you a clear snapshot of your monthly cash flow — where your money goes, how much you keep, and whether your spending is balanced. Use it monthly to stay on track.',
    howToUse: [
      'Enter your monthly take-home (after-tax) income.',
      'Fill in your actual monthly expenses by category.',
      "Be honest — use real numbers, not what you wish you spent.",
      'Review your surplus/deficit and savings rate.',
      'Adjust categories to find where you can cut or reallocate.',
    ],
    formula: 'Remaining = Income − Total Expenses\nSavings Rate = (Remaining ÷ Income) × 100\nHousing Ratio = (Housing ÷ Income) × 100',
    faqs: [
      { question: 'What is a good savings rate?', answer: 'Financial experts recommend saving at least 20% of your income (the 50/30/20 rule). Even 10% is meaningful. Below 5% should be a warning sign.' },
      { question: 'My housing ratio is over 30% — is that bad?', answer: "The 30% rule is a guideline, not a strict limit. In high cost-of-living areas, 35–40% is common. But if housing dominates your budget, it limits your ability to save and handle emergencies." },
    ],
  },
  relatedTools: ['emergency-fund-calculator', 'savings-goal-calculator', 'debt-payoff-planner'],
};

export const investmentReturnCalculator: ToolDefinition = {
  slug: 'investment-return-calculator',
  title: 'Investment Return Calculator',
  shortDescription: 'Calculate ROI, annualized return, and CAGR on any investment.',
  description: 'Input your initial investment and current value to instantly calculate total return, percentage gain, and Compound Annual Growth Rate (CAGR) — the most accurate measure of investment performance.',
  category: 'finance',
  subcategory: 'investments',
  tags: ['roi', 'return', 'investment', 'cagr', 'annualized', 'profit'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'initialInvestment', label: 'Initial Investment', type: 'currency', defaultValue: 10000, min: 1, max: 100000000, step: 500, prefix: '$' },
    { name: 'finalValue', label: 'Current / Final Value', type: 'currency', defaultValue: 16500, min: 0, max: 100000000, step: 500, prefix: '$' },
    { name: 'years', label: 'Holding Period', type: 'number', defaultValue: 5, min: 0.1, max: 100, step: 0.5, suffix: ' years', helpText: 'Time the investment was held' },
  ],
  calculate: (inputs) => {
    const initial = Number(inputs.initialInvestment);
    const final = Number(inputs.finalValue);
    const years = Number(inputs.years);
    const totalReturn = final - initial;
    const totalReturnPct = initial > 0 ? (totalReturn / initial) * 100 : 0;
    const cagr = initial > 0 && years > 0 ? (Math.pow(final / initial, 1 / years) - 1) * 100 : 0;
    const simpleAnnualized = years > 0 ? totalReturnPct / years : 0;
    return {
      totalReturn,
      totalReturnPct: Math.round(totalReturnPct * 100) / 100,
      cagr: Math.round(cagr * 100) / 100,
      simpleAnnualized: Math.round(simpleAnnualized * 100) / 100,
    };
  },
  outputs: [
    { name: 'totalReturn', label: 'Total Return', type: 'currency', highlight: true, description: 'Net gain or loss in dollars' },
    { name: 'totalReturnPct', label: 'Total Return %', type: 'percentage', decimals: 2 },
    { name: 'cagr', label: 'CAGR', type: 'percentage', decimals: 2, description: 'Compound Annual Growth Rate — the most accurate measure' },
    { name: 'simpleAnnualized', label: 'Simple Annualized Return', type: 'percentage', decimals: 2 },
  ],
  examples: [
    { title: 'Stock Market Investment', description: 'A 5-year S&P 500 investment that grew 65%.', inputs: { initialInvestment: 10000, finalValue: 16500, years: 5 } },
    { title: 'Real Estate', description: 'Property purchased for $250K, now worth $380K after 8 years.', inputs: { initialInvestment: 250000, finalValue: 380000, years: 8 } },
    { title: 'Poor Investment', description: 'An investment that lost 30% over 3 years.', inputs: { initialInvestment: 5000, finalValue: 3500, years: 3 } },
  ],
  documentation: {
    overview: 'The Investment Return Calculator measures the true performance of any investment. While simple ROI tells you the total percentage gain, CAGR (Compound Annual Growth Rate) normalizes the return across time — making it easy to compare investments held for different periods.',
    howToUse: [
      'Enter your original investment amount.',
      'Enter the current or final value of the investment.',
      'Enter how many years you held (or plan to hold) the investment.',
      'Review total return, percentage gain, and CAGR.',
    ],
    formula: 'Total Return = Final Value − Initial Investment\nROI % = (Total Return ÷ Initial Investment) × 100\nCAGR = (Final Value ÷ Initial Value)^(1÷Years) − 1',
    faqs: [
      { question: 'What is CAGR and why is it better than simple ROI?', answer: 'CAGR (Compound Annual Growth Rate) smooths out the return as if it grew at a steady rate each year. It accounts for the holding period, making it fair to compare a 2-year investment with a 10-year one.' },
      { question: 'Does this include dividends or distributions?', answer: 'Only if you include them in your final value. For a total return calculation, add all received dividends to the final value before entering it.' },
    ],
  },
  relatedTools: ['compound-interest-calculator', 'retirement-savings-calculator', 'mortgage-calculator'],
};
