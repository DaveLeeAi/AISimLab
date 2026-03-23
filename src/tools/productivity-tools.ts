import { ToolDefinition } from './types';

export const hourlyRateCalculator: ToolDefinition = {
  slug: 'hourly-rate-calculator',
  title: 'Hourly Rate Calculator',
  shortDescription: 'Calculate the freelance hourly rate you need to hit your income goal after taxes and expenses.',
  description: 'Set your target annual income, estimate your billable hours and business costs, and calculate exactly what hourly rate you must charge to hit your financial goals as a freelancer or consultant.',
  category: 'productivity',
  subcategory: 'freelance',
  tags: ['hourly rate', 'freelance', 'consulting', 'billing', 'self-employed', 'income goal'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'desiredAnnualIncome', label: 'Desired Annual Net Income', type: 'currency', defaultValue: 80000, min: 1000, max: 10000000, step: 1000, prefix: '$', helpText: 'After-tax income you want to take home' },
    { name: 'billableHoursPerWeek', label: 'Billable Hours per Week', type: 'number', defaultValue: 30, min: 1, max: 60, step: 1, helpText: 'Not all work hours are billable' },
    { name: 'vacationWeeks', label: 'Vacation / Time Off Weeks', type: 'number', defaultValue: 4, min: 0, max: 30, step: 1 },
    { name: 'annualBusinessExpenses', label: 'Annual Business Expenses', type: 'currency', defaultValue: 6000, min: 0, max: 1000000, step: 250, prefix: '$', helpText: 'Software, equipment, insurance, marketing' },
    { name: 'taxRate', label: 'Effective Tax Rate', type: 'percentage', defaultValue: 30, min: 0, max: 60, step: 1, suffix: '%', helpText: 'Self-employment + income tax combined' },
  ],
  calculate: (inputs) => {
    const income = Number(inputs.desiredAnnualIncome);
    const billableHours = Number(inputs.billableHoursPerWeek);
    const vacation = Number(inputs.vacationWeeks);
    const expenses = Number(inputs.annualBusinessExpenses);
    const taxRate = Number(inputs.taxRate) / 100;

    const workingWeeks = 52 - vacation;
    const totalBillableHours = billableHours * workingWeeks;
    const grossIncomeNeeded = taxRate < 1 ? (income + expenses) / (1 - taxRate) : income + expenses;
    const minimumRate = totalBillableHours > 0 ? grossIncomeNeeded / totalBillableHours : 0;
    const recommendedRate = minimumRate * 1.2;
    const effectiveDailyRate = minimumRate * 8;

    return {
      recommendedRate: Math.round(recommendedRate * 100) / 100,
      minimumRate: Math.round(minimumRate * 100) / 100,
      effectiveDailyRate: Math.round(effectiveDailyRate),
      totalBillableHours: Math.round(totalBillableHours),
      grossIncomeNeeded: Math.round(grossIncomeNeeded),
    };
  },
  outputs: [
    { name: 'recommendedRate', label: 'Recommended Hourly Rate', type: 'currency', highlight: true, description: 'Minimum + 20% buffer for scope creep and gaps' },
    { name: 'minimumRate', label: 'Minimum Viable Rate', type: 'currency', description: 'Absolute floor to meet your income goal' },
    { name: 'effectiveDailyRate', label: 'Daily Rate (8 hours)', type: 'currency' },
    { name: 'totalBillableHours', label: 'Annual Billable Hours', type: 'number', decimals: 0 },
    { name: 'grossIncomeNeeded', label: 'Required Gross Revenue', type: 'currency', description: 'Before taxes and expenses' },
  ],
  examples: [
    { title: 'Mid-Level Developer', description: 'Targeting $80K net, 30 billable hours/week.', inputs: { desiredAnnualIncome: 80000, billableHoursPerWeek: 30, vacationWeeks: 4, annualBusinessExpenses: 6000, taxRate: 30 } },
    { title: 'Senior Consultant', description: 'High-income goal with fewer billable hours.', inputs: { desiredAnnualIncome: 150000, billableHoursPerWeek: 25, vacationWeeks: 6, annualBusinessExpenses: 12000, taxRate: 35 } },
    { title: 'Part-Time Freelancer', description: 'Side income goal alongside a full-time job.', inputs: { desiredAnnualIncome: 30000, billableHoursPerWeek: 15, vacationWeeks: 2, annualBusinessExpenses: 2000, taxRate: 22 } },
  ],
  documentation: {
    overview: 'Many freelancers underprice themselves by forgetting to account for taxes, business expenses, non-billable time, and income gaps between projects. This calculator backs into the rate you actually need — not just what sounds reasonable.',
    howToUse: [
      'Enter your desired annual take-home income (after tax).',
      'Set your realistic billable hours per week — not all work hours generate invoices.',
      'Account for vacation and time off in weeks.',
      'List your annual business costs (tools, equipment, insurance, etc.).',
      'Set your expected combined tax rate (income + self-employment).',
    ],
    formula: 'Gross Needed = (Desired Income + Expenses) ÷ (1 − Tax Rate)\nMin Rate = Gross Needed ÷ Annual Billable Hours\nRecommended Rate = Min Rate × 1.20',
    faqs: [
      { question: "Why is the recommended rate 20% above minimum?", answer: 'The 20% buffer covers inevitable gaps: client delays, late payments, scope creep, unpaid admin time, and months between projects. The minimum rate leaves no margin for error.' },
      { question: 'What tax rate should I use?', answer: 'In the US, self-employed individuals pay 15.3% self-employment tax plus income tax. At $80K net income, combined effective rates typically land between 25–35%. Consult a tax professional for your specific situation.' },
    ],
  },
  relatedTools: ['meeting-cost-calculator', 'working-hours-calculator', 'focus-time-estimator'],
};

export const focusTimeEstimator: ToolDefinition = {
  slug: 'focus-time-estimator',
  title: 'Focus Time Estimator',
  shortDescription: 'Calculate your true deep work hours after accounting for meetings, email, and admin.',
  description: 'Most knowledge workers have far less actual deep work time than they think. This tool reveals your real focused work capacity each day and week after removing meetings, communication, and administrative tasks.',
  category: 'productivity',
  subcategory: 'time',
  tags: ['deep work', 'focus time', 'meetings', 'productivity', 'time blocking', 'knowledge work'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'workHoursPerDay', label: 'Total Work Hours per Day', type: 'number', defaultValue: 8, min: 1, max: 16, step: 0.5 },
    { name: 'meetingHoursPerDay', label: 'Meeting Hours per Day', type: 'number', defaultValue: 2.5, min: 0, max: 12, step: 0.5 },
    { name: 'emailAdminHoursPerDay', label: 'Email, Slack & Admin Hours', type: 'number', defaultValue: 1.5, min: 0, max: 8, step: 0.25 },
    { name: 'breakHoursPerDay', label: 'Breaks per Day', type: 'number', defaultValue: 0.5, min: 0, max: 4, step: 0.25 },
    { name: 'workDaysPerWeek', label: 'Work Days per Week', type: 'select', defaultValue: 5, options: [{ label: '3 days', value: 3 }, { label: '4 days', value: 4 }, { label: '5 days', value: 5 }] },
  ],
  calculate: (inputs) => {
    const total = Number(inputs.workHoursPerDay);
    const meetings = Number(inputs.meetingHoursPerDay);
    const comms = Number(inputs.emailAdminHoursPerDay);
    const breaks = Number(inputs.breakHoursPerDay);
    const days = Number(inputs.workDaysPerWeek);

    const deepWorkPerDay = Math.max(0, total - meetings - comms - breaks);
    const deepWorkPct = total > 0 ? (deepWorkPerDay / total) * 100 : 0;
    const deepWorkWeekly = deepWorkPerDay * days;
    const meetingLoadPct = total > 0 ? (meetings / total) * 100 : 0;
    const annualDeepWorkHours = deepWorkWeekly * 48;

    return {
      deepWorkPerDay: Math.round(deepWorkPerDay * 10) / 10,
      deepWorkPct: Math.round(deepWorkPct),
      deepWorkWeekly: Math.round(deepWorkWeekly * 10) / 10,
      meetingLoadPct: Math.round(meetingLoadPct),
      annualDeepWorkHours: Math.round(annualDeepWorkHours),
    };
  },
  outputs: [
    { name: 'deepWorkPerDay', label: 'Deep Work Hours / Day', type: 'number', decimals: 1, highlight: true, description: 'Uninterrupted focused work time available' },
    { name: 'deepWorkWeekly', label: 'Deep Work Hours / Week', type: 'number', decimals: 1 },
    { name: 'deepWorkPct', label: 'Deep Work %', type: 'percentage', decimals: 0, description: '% of work day available for focused work' },
    { name: 'meetingLoadPct', label: 'Meeting Load', type: 'percentage', decimals: 0 },
    { name: 'annualDeepWorkHours', label: 'Annual Deep Work Hours', type: 'number', decimals: 0 },
  ],
  examples: [
    { title: 'Manager Role', description: 'Heavy meeting schedule with limited focus blocks.', inputs: { workHoursPerDay: 8, meetingHoursPerDay: 4, emailAdminHoursPerDay: 2, breakHoursPerDay: 0.5, workDaysPerWeek: 5 } },
    { title: 'Developer / IC', description: 'Mostly heads-down work with some sync time.', inputs: { workHoursPerDay: 8, meetingHoursPerDay: 1.5, emailAdminHoursPerDay: 1, breakHoursPerDay: 0.5, workDaysPerWeek: 5 } },
    { title: 'Founder / Executive', description: 'High meeting load with long working hours.', inputs: { workHoursPerDay: 10, meetingHoursPerDay: 5, emailAdminHoursPerDay: 2, breakHoursPerDay: 0.5, workDaysPerWeek: 5 } },
  ],
  documentation: {
    overview: 'Cal Newport\'s research suggests that 4 hours of deep work per day is roughly the maximum most people can sustain. This tool shows you how much of your schedule is available for that kind of focused, high-value work — and how much is consumed by reactive tasks.',
    howToUse: [
      'Enter your total working hours per day.',
      'Estimate daily meeting time honestly (include 1:1s, standups, and ad-hoc calls).',
      'Estimate email, Slack, and administrative overhead.',
      'Enter break time (lunch, mental resets).',
      'See your remaining deep work capacity.',
    ],
    formula: 'Deep Work = Total Hours − Meetings − Comms/Admin − Breaks\nDeep Work % = (Deep Work ÷ Total Hours) × 100',
    faqs: [
      { question: 'How much deep work is realistic per day?', answer: "Research suggests 3–4 hours of intense deep work per day is the sustainable maximum for most people. If you're getting less than 2 hours, consider auditing your meeting schedule." },
      { question: 'How can I increase my deep work time?', answer: 'Batch meetings into blocks, set communication windows (e.g., check email at 9am and 3pm only), use do-not-disturb blocks, and protect mornings for high-focus work.' },
    ],
  },
  relatedTools: ['meeting-cost-calculator', 'hourly-rate-calculator', 'working-hours-calculator'],
};

export const workingHoursCalculator: ToolDefinition = {
  slug: 'working-hours-calculator',
  title: 'Working Hours Calculator',
  shortDescription: 'Calculate net working hours, overtime, and pay for any shift.',
  description: 'Enter your shift start and end times, break duration, and hourly rate to instantly calculate net working hours, regular pay, and any overtime earned.',
  category: 'productivity',
  subcategory: 'time',
  tags: ['working hours', 'overtime', 'shift', 'pay', 'timesheet', 'hourly'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'startHour', label: 'Start Time (24h decimal)', type: 'number', defaultValue: 9, min: 0, max: 23.99, step: 0.25, helpText: 'e.g. 9 = 9:00am, 9.5 = 9:30am, 13.5 = 1:30pm' },
    { name: 'endHour', label: 'End Time (24h decimal)', type: 'number', defaultValue: 17.5, min: 0.01, max: 24, step: 0.25, helpText: 'e.g. 17.5 = 5:30pm, 21 = 9:00pm' },
    { name: 'breakMinutes', label: 'Total Break Time', type: 'number', defaultValue: 30, min: 0, max: 480, step: 5, suffix: ' min' },
    { name: 'hourlyRate', label: 'Hourly Rate', type: 'currency', defaultValue: 28, min: 0, max: 10000, step: 0.5, prefix: '$' },
    { name: 'overtimeThreshold', label: 'Overtime After', type: 'select', defaultValue: 8, options: [{ label: '8 hours (standard)', value: 8 }, { label: '10 hours', value: 10 }, { label: '12 hours', value: 12 }] },
  ],
  calculate: (inputs) => {
    const start = Number(inputs.startHour);
    const end = Number(inputs.endHour);
    const breakHours = Number(inputs.breakMinutes) / 60;
    const rate = Number(inputs.hourlyRate);
    const overtimeAt = Number(inputs.overtimeThreshold);

    const grossHours = Math.max(0, end - start);
    const netHours = Math.max(0, grossHours - breakHours);
    const regularHours = Math.min(netHours, overtimeAt);
    const overtimeHours = Math.max(0, netHours - overtimeAt);
    const regularPay = regularHours * rate;
    const overtimePay = overtimeHours * rate * 1.5;
    const totalPay = regularPay + overtimePay;

    return {
      totalPay: Math.round(totalPay * 100) / 100,
      netHours: Math.round(netHours * 100) / 100,
      regularHours: Math.round(regularHours * 100) / 100,
      overtimeHours: Math.round(overtimeHours * 100) / 100,
      overtimePay: Math.round(overtimePay * 100) / 100,
    };
  },
  outputs: [
    { name: 'totalPay', label: 'Total Pay', type: 'currency', highlight: true, description: 'Regular + overtime combined' },
    { name: 'netHours', label: 'Net Hours Worked', type: 'number', decimals: 2, description: 'After deducting break time' },
    { name: 'regularHours', label: 'Regular Hours', type: 'number', decimals: 2 },
    { name: 'overtimeHours', label: 'Overtime Hours', type: 'number', decimals: 2 },
    { name: 'overtimePay', label: 'Overtime Pay', type: 'currency', description: 'At 1.5× standard rate' },
  ],
  examples: [
    { title: 'Standard Day Shift', description: '9am–5:30pm with 30 min lunch at $28/hr.', inputs: { startHour: 9, endHour: 17.5, breakMinutes: 30, hourlyRate: 28, overtimeThreshold: 8 } },
    { title: 'Long Shift with OT', description: '7am–7pm shift with 1 hour of breaks.', inputs: { startHour: 7, endHour: 19, breakMinutes: 60, hourlyRate: 22, overtimeThreshold: 8 } },
    { title: 'Evening Part-Time', description: '5pm–10pm shift, no breaks.', inputs: { startHour: 17, endHour: 22, breakMinutes: 0, hourlyRate: 18, overtimeThreshold: 8 } },
  ],
  documentation: {
    overview: 'The Working Hours Calculator computes your net hours and pay for any single shift. It handles break deductions and automatically calculates overtime at 1.5× rate after the threshold you set.',
    howToUse: [
      'Enter your start time in 24-hour decimal format (e.g., 9.5 = 9:30 AM, 13.75 = 1:45 PM).',
      'Enter your end time.',
      'Enter total break time in minutes.',
      'Enter your hourly rate.',
      'Set your overtime threshold (typically 8 hours).',
    ],
    formula: 'Net Hours = (End − Start) − (Break ÷ 60)\nRegular Hours = min(Net Hours, Overtime Threshold)\nOvertime Hours = max(0, Net Hours − Threshold)\nTotal Pay = (Regular × Rate) + (Overtime × Rate × 1.5)',
    faqs: [
      { question: 'How do I enter times like 9:45 AM?', answer: 'Convert minutes to decimals: 9:45 = 9.75, 10:30 = 10.5, 14:15 = 14.25. Divide the minutes by 60 and add to the hour.' },
      { question: 'Is overtime always at 1.5×?', answer: 'In the US, federal law requires 1.5× for hours over 40/week, not necessarily 8/day. Some states (like California) mandate daily overtime over 8 hours. Check your local labor laws.' },
    ],
  },
  relatedTools: ['hourly-rate-calculator', 'meeting-cost-calculator', 'focus-time-estimator'],
};
