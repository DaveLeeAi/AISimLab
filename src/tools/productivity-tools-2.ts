import { ToolDefinition } from './types';

export const salaryToHourlyCalculator: ToolDefinition = {
  slug: 'salary-to-hourly-calculator',
  title: 'Salary to Hourly Calculator',
  shortDescription: 'Convert annual salary to hourly rate (and back), with overtime.',
  description: 'Convert between annual salary, monthly, weekly, daily, and hourly pay. Calculates regular and overtime rates and compares two salary offers side by side.',
  category: 'productivity',
  subcategory: 'work',
  tags: ['salary', 'hourly rate', 'pay conversion', 'annual salary', 'wages'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'annualSalary', label: 'Annual Salary', type: 'currency', defaultValue: 75000, min: 10000, max: 5000000, step: 1000, prefix: '$' },
    { name: 'hoursPerWeek', label: 'Hours per Week', type: 'number', defaultValue: 40, min: 1, max: 80, step: 1, suffix: ' hrs' },
    { name: 'weeksPerYear', label: 'Weeks Worked per Year', type: 'number', defaultValue: 52, min: 40, max: 52, step: 1, suffix: ' weeks', helpText: 'Reduce for unpaid vacation weeks' },
    { name: 'paidTimeOffDays', label: 'Paid Time Off Days', type: 'number', defaultValue: 15, min: 0, max: 30, step: 1, suffix: ' days' },
  ],
  calculate: (inputs) => {
    const annual = Number(inputs.annualSalary);
    const hours = Number(inputs.hoursPerWeek);
    const weeks = Number(inputs.weeksPerYear);
    const totalHours = hours * weeks;
    const hourly = annual / totalHours;
    const weekly = annual / weeks;
    const biweekly = weekly * 2;
    const monthly = annual / 12;
    const overtime = hourly * 1.5;
    return {
      hourly: Math.round(hourly * 100) / 100,
      daily: Math.round((annual / (weeks * 5)) * 100) / 100,
      weekly: Math.round(weekly * 100) / 100,
      biweekly: Math.round(biweekly * 100) / 100,
      monthly: Math.round(monthly * 100) / 100,
      overtime: Math.round(overtime * 100) / 100,
    };
  },
  outputs: [
    { name: 'hourly', label: 'Hourly Rate', type: 'currency', decimals: 2, highlight: true },
    { name: 'overtime', label: 'Overtime Rate (1.5×)', type: 'currency', decimals: 2 },
    { name: 'daily', label: 'Daily Rate', type: 'currency', decimals: 2 },
    { name: 'weekly', label: 'Weekly Pay', type: 'currency', decimals: 2 },
    { name: 'biweekly', label: 'Bi-Weekly Pay', type: 'currency', decimals: 2 },
    { name: 'monthly', label: 'Monthly Pay', type: 'currency', decimals: 2 },
  ],
  examples: [
    { title: 'Standard US Worker', description: '$75K salary, 40 hrs/week, 52 weeks.', inputs: { annualSalary: 75000, hoursPerWeek: 40, weeksPerYear: 52, paidTimeOffDays: 15 } },
    { title: 'Part-Time Employee', description: '$45K salary, 30 hrs/week.', inputs: { annualSalary: 45000, hoursPerWeek: 30, weeksPerYear: 52, paidTimeOffDays: 10 } },
    { title: 'Senior Professional', description: '$150K salary, 45 hrs/week typical.', inputs: { annualSalary: 150000, hoursPerWeek: 45, weeksPerYear: 52, paidTimeOffDays: 20 } },
  ],
  documentation: {
    overview: 'Converting salary to hourly helps compare job offers, understand your actual pay rate, and determine if overtime pay is beneficial. It also helps freelancers set minimum rates when considering full-time roles.',
    howToUse: ['Enter your annual salary.', 'Enter your typical hours per week.', 'Set weeks worked per year (reduce if you take unpaid leave).', 'Review all pay period breakdowns and overtime rate.'],
    formula: 'Hourly = Annual Salary ÷ (Hours/Week × Weeks/Year)\nOvertime = Hourly × 1.5',
    faqs: [
      { question: 'Should I include vacation time in the hours calculation?', answer: 'If you have paid vacation, you still earn your salary during those weeks, so use the full 52 weeks. Reduce weeks only for unpaid leave.' },
      { question: 'Is overtime guaranteed for salaried workers?', answer: 'Overtime rules for salaried workers depend on whether you are classified as exempt or non-exempt. Employees earning below ~$35,568/year are generally non-exempt and entitled to overtime.' },
    ],
  },
  relatedTools: ['hourly-rate-calculator', 'working-hours-calculator', 'employee-cost-calculator'],
};

export const deadlineCalculator: ToolDefinition = {
  slug: 'deadline-calculator',
  title: 'Deadline & Workload Calculator',
  shortDescription: 'Figure out if a project is achievable before its deadline.',
  description: 'Given a total workload in hours and a deadline in days, calculate whether the project is feasible, how many hours per day are needed, and if you have buffer time.',
  category: 'productivity',
  subcategory: 'time-management',
  tags: ['deadline', 'workload', 'project planning', 'hours per day', 'feasibility'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'totalHours', label: 'Total Work Hours Needed', type: 'number', defaultValue: 40, min: 1, max: 10000, step: 1, suffix: ' hours' },
    { name: 'daysUntilDeadline', label: 'Days Until Deadline', type: 'number', defaultValue: 10, min: 1, max: 365, step: 1, suffix: ' days' },
    { name: 'hoursAvailablePerDay', label: 'Available Hours per Day', type: 'number', defaultValue: 6, min: 0.5, max: 16, step: 0.5, suffix: ' hours' },
    { name: 'workingDaysPerWeek', label: 'Working Days per Week', type: 'select', defaultValue: 5, options: [{ label: '5 days (Mon–Fri)', value: 5 }, { label: '6 days', value: 6 }, { label: '7 days', value: 7 }] },
    { name: 'bufferPct', label: 'Buffer / Rework Allowance', type: 'percentage', defaultValue: 20, min: 0, max: 50, step: 5, suffix: '%', helpText: 'Extra time added for revisions and unexpected issues' },
  ],
  calculate: (inputs) => {
    const total = Number(inputs.totalHours);
    const days = Number(inputs.daysUntilDeadline);
    const hoursDay = Number(inputs.hoursAvailablePerDay);
    const workDays = Number(inputs.workingDaysPerWeek);
    const buffer = Number(inputs.bufferPct) / 100;
    const totalWithBuffer = total * (1 + buffer);
    const weeksUntil = days / 7;
    const availableWorkDays = weeksUntil * workDays;
    const availableHours = availableWorkDays * hoursDay;
    const hoursPerDayNeeded = totalWithBuffer / availableWorkDays;
    const bufferHours = availableHours - totalWithBuffer;
    const feasible = bufferHours >= 0 ? 1 : 0;
    return {
      hoursPerDayNeeded: Math.round(hoursPerDayNeeded * 10) / 10,
      availableHours: Math.round(availableHours),
      totalWithBuffer: Math.round(totalWithBuffer * 10) / 10,
      bufferHours: Math.round(bufferHours),
      feasible,
    };
  },
  outputs: [
    { name: 'hoursPerDayNeeded', label: 'Hours Needed per Day', type: 'number', decimals: 1, highlight: true, description: 'Daily work needed to meet deadline' },
    { name: 'availableHours', label: 'Total Available Hours', type: 'number', decimals: 0, description: 'Hours before deadline' },
    { name: 'totalWithBuffer', label: 'Hours with Buffer', type: 'number', decimals: 1, description: 'Work estimate + rework allowance' },
    { name: 'bufferHours', label: 'Spare Hours', type: 'number', decimals: 0, description: 'Positive = on track, negative = behind' },
  ],
  examples: [
    { title: 'Sprint Planning', description: '40 hours of work, 10 days, 6 hrs/day available.', inputs: { totalHours: 40, daysUntilDeadline: 10, hoursAvailablePerDay: 6, workingDaysPerWeek: 5, bufferPct: 20 } },
    { title: 'Tight Deadline', description: '80 hours needed in 7 days, 8 hrs/day.', inputs: { totalHours: 80, daysUntilDeadline: 7, hoursAvailablePerDay: 8, workingDaysPerWeek: 7, bufferPct: 10 } },
    { title: 'Month-Long Project', description: '160-hour project over 30 days, 6 hrs/day weekdays.', inputs: { totalHours: 160, daysUntilDeadline: 30, hoursAvailablePerDay: 6, workingDaysPerWeek: 5, bufferPct: 20 } },
  ],
  documentation: {
    overview: 'Project feasibility checking before committing is one of the most under-used productivity habits. This tool calculates whether a project is achievable within a deadline given your realistic daily availability.',
    howToUse: ['Estimate the total hours of work required.', 'Enter how many days remain until the deadline.', 'Set your realistic productive hours per working day.', 'Choose how many days per week you work on this project.', 'Add a buffer percentage for rework and unexpected blockers.'],
    formula: 'Available Work Days = (Days ÷ 7) × Working Days/Week\nHours/Day Needed = (Total × (1 + Buffer)) ÷ Available Work Days\nSpare Hours = Available Hours − Total with Buffer',
    faqs: [
      { question: 'What buffer percentage should I use?', answer: 'For well-defined tasks: 10–15%. For creative or collaborative work: 20–30%. For research or exploratory projects: 30–50%. Underestimating is one of the most common causes of missed deadlines.' },
      { question: 'What if spare hours is negative?', answer: 'You either need to reduce scope, increase your daily hours, push the deadline, or add resources. Do not ignore a negative buffer — it means the plan is not realistic as stated.' },
    ],
  },
  relatedTools: ['working-hours-calculator', 'focus-time-estimator', 'meeting-cost-calculator'],
};

export const timeValueCalculator: ToolDefinition = {
  slug: 'time-value-calculator',
  title: 'Time Value of Money Calculator',
  shortDescription: 'Is a task worth your time? Calculate the true cost of any activity.',
  description: 'Determine whether outsourcing a task makes financial sense by comparing your time\'s dollar value to the cost of delegation. Also calculates the value of recurring time savings.',
  category: 'productivity',
  subcategory: 'time-management',
  tags: ['time value', 'outsourcing', 'delegation', 'opportunity cost', 'hourly value'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'annualIncome', label: 'Your Annual Income', type: 'currency', defaultValue: 100000, min: 10000, max: 5000000, step: 5000, prefix: '$' },
    { name: 'hoursWorkedPerWeek', label: 'Hours Worked per Week', type: 'number', defaultValue: 50, min: 10, max: 80, step: 1, suffix: ' hrs' },
    { name: 'taskHours', label: 'Task Duration', type: 'number', defaultValue: 3, min: 0.25, max: 100, step: 0.25, suffix: ' hours' },
    { name: 'taskFrequencyPerYear', label: 'How Often per Year', type: 'number', defaultValue: 12, min: 1, max: 365, step: 1, suffix: '× per year' },
    { name: 'outsourceCost', label: 'Cost to Outsource (per occurrence)', type: 'currency', defaultValue: 50, min: 0, max: 10000, step: 5, prefix: '$' },
  ],
  calculate: (inputs) => {
    const annual = Number(inputs.annualIncome);
    const weeklyHours = Number(inputs.hoursWorkedPerWeek);
    const hourlyValue = annual / (weeklyHours * 52);
    const taskHours = Number(inputs.taskHours);
    const frequency = Number(inputs.taskFrequencyPerYear);
    const outsourceCost = Number(inputs.outsourceCost);
    const taskValue = taskHours * hourlyValue;
    const annualTimeCost = taskValue * frequency;
    const annualOutsourceCost = outsourceCost * frequency;
    const annualSavings = annualTimeCost - annualOutsourceCost;
    return {
      hourlyValue: Math.round(hourlyValue * 100) / 100,
      taskValue: Math.round(taskValue * 100) / 100,
      annualTimeCost: Math.round(annualTimeCost),
      annualOutsourceCost: Math.round(annualOutsourceCost),
      annualSavings: Math.round(annualSavings),
    };
  },
  outputs: [
    { name: 'hourlyValue', label: 'Your Hourly Value', type: 'currency', decimals: 2, highlight: true, description: 'What one hour of your time is worth' },
    { name: 'taskValue', label: 'Value of This Task', type: 'currency', decimals: 2, description: 'What this task costs you in time value' },
    { name: 'annualTimeCost', label: 'Annual Time Cost', type: 'currency', decimals: 0 },
    { name: 'annualOutsourceCost', label: 'Annual Outsource Cost', type: 'currency', decimals: 0 },
    { name: 'annualSavings', label: 'Annual Net Savings from Outsourcing', type: 'currency', decimals: 0, description: 'Positive = worthwhile to delegate' },
  ],
  examples: [
    { title: 'Bookkeeping Decision', description: '$100K income, 3 hr/month bookkeeping vs $50 outsource cost.', inputs: { annualIncome: 100000, hoursWorkedPerWeek: 50, taskHours: 3, taskFrequencyPerYear: 12, outsourceCost: 50 } },
    { title: 'Lawn Mowing', description: '$80K income, 2 hr lawn every 2 weeks vs $60 lawn service.', inputs: { annualIncome: 80000, hoursWorkedPerWeek: 45, taskHours: 2, taskFrequencyPerYear: 26, outsourceCost: 60 } },
    { title: 'Administrative Tasks', description: 'CEO spending 5 hrs/week on admin vs $500/month VA.', inputs: { annualIncome: 300000, hoursWorkedPerWeek: 60, taskHours: 5, taskFrequencyPerYear: 52, outsourceCost: 125 } },
  ],
  documentation: {
    overview: 'Every hour you spend on low-value tasks has an opportunity cost — you could be spending that time on higher-value work. This calculator makes that cost explicit and compares it to the cost of outsourcing or delegating.',
    howToUse: ['Enter your annual income to establish your hourly value.', 'Enter how many hours you typically work per week.', 'Enter the task duration and how often you do it.', 'Enter what it would cost to outsource or delegate the task.', 'A positive annual savings means it is worth outsourcing.'],
    formula: 'Hourly Value = Annual Income ÷ (Hours/Week × 52)\nTask Value = Hourly Value × Task Hours\nAnnual Savings = (Task Value × Frequency) − (Outsource Cost × Frequency)',
    faqs: [
      { question: 'What if I can\'t actually bill those freed hours?', answer: 'Even if you can\'t directly bill additional hours, time freed from low-value tasks can go to strategic work, business development, rest (which improves productivity), or personal life — all of which have real value.' },
      { question: 'How do I find someone to outsource to?', answer: 'For professional tasks: Upwork, Fiverr, or specialized agencies. For personal tasks: TaskRabbit, local services, or referrals. For internal business tasks: virtual assistants, offshore teams, or automation.' },
    ],
  },
  relatedTools: ['hourly-rate-calculator', 'focus-time-estimator', 'meeting-cost-calculator'],
};

export const ptoCalculator: ToolDefinition = {
  slug: 'pto-calculator',
  title: 'PTO & Vacation Calculator',
  shortDescription: 'Track PTO balance, accrual rate, and projected time off.',
  description: 'Calculate how much paid time off you will have accrued by any date, how many days remain after planned vacation, and the dollar value of unused PTO.',
  category: 'productivity',
  subcategory: 'work',
  tags: ['PTO', 'vacation', 'paid time off', 'accrual', 'benefits'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'currentBalance', label: 'Current PTO Balance', type: 'number', defaultValue: 5, min: 0, max: 100, step: 0.5, suffix: ' days' },
    { name: 'accrualRatePerYear', label: 'Annual PTO Accrual', type: 'number', defaultValue: 15, min: 0, max: 60, step: 1, suffix: ' days/year' },
    { name: 'weeksUntilVacation', label: 'Weeks Until Vacation', type: 'number', defaultValue: 8, min: 0, max: 52, step: 1, suffix: ' weeks' },
    { name: 'plannedVacationDays', label: 'Planned Vacation Days', type: 'number', defaultValue: 5, min: 0, max: 60, step: 1, suffix: ' days' },
    { name: 'hourlySalary', label: 'Hourly Wage (for cash value)', type: 'currency', defaultValue: 35, min: 7.25, max: 500, step: 0.5, prefix: '$', helpText: 'Annual salary ÷ 2080' },
  ],
  calculate: (inputs) => {
    const current = Number(inputs.currentBalance);
    const annualAccrual = Number(inputs.accrualRatePerYear);
    const weeks = Number(inputs.weeksUntilVacation);
    const planned = Number(inputs.plannedVacationDays);
    const hourly = Number(inputs.hourlySalary);
    const accrualPerWeek = annualAccrual / 52;
    const accrued = accrualPerWeek * weeks;
    const balanceAtVacation = current + accrued;
    const remaining = balanceAtVacation - planned;
    const cashValue = remaining * 8 * hourly;
    return {
      balanceAtVacation: Math.round(balanceAtVacation * 10) / 10,
      accrued: Math.round(accrued * 10) / 10,
      remaining: Math.round(remaining * 10) / 10,
      cashValue: Math.round(cashValue),
    };
  },
  outputs: [
    { name: 'balanceAtVacation', label: 'PTO Balance at Vacation Date', type: 'number', decimals: 1, highlight: true, description: 'Current + accrued before your trip' },
    { name: 'accrued', label: 'Days Accruing Before Vacation', type: 'number', decimals: 1 },
    { name: 'remaining', label: 'Days Remaining After Trip', type: 'number', decimals: 1 },
    { name: 'cashValue', label: 'Cash Value of Remaining PTO', type: 'currency', decimals: 0, description: 'If paid out at separation' },
  ],
  examples: [
    { title: 'Summer Vacation', description: '5 days balance, 8 weeks until vacation, 15 days/year accrual.', inputs: { currentBalance: 5, accrualRatePerYear: 15, weeksUntilVacation: 8, plannedVacationDays: 5, hourlySalary: 35 } },
    { title: 'Extended Holiday', description: 'Taking 2 weeks off, checking if you have enough PTO.', inputs: { currentBalance: 10, accrualRatePerYear: 20, weeksUntilVacation: 6, plannedVacationDays: 10, hourlySalary: 50 } },
    { title: 'End of Year Check', description: 'How much unused PTO will carry over or be paid out?', inputs: { currentBalance: 8, accrualRatePerYear: 15, weeksUntilVacation: 12, plannedVacationDays: 5, hourlySalary: 40 } },
  ],
  documentation: {
    overview: 'PTO tracking helps you plan vacations without going negative, understand the cash value of unused leave, and ensure you do not lose accrued days if your company has a "use it or lose it" policy.',
    howToUse: ['Enter your current PTO balance in days.', 'Enter how many days you accrue per year.', 'Set how many weeks until your planned vacation.', 'Enter how many days your vacation will use.', 'Enter your hourly wage to see the cash value of remaining PTO.'],
    formula: 'Accrual per Week = Annual Accrual ÷ 52\nBalance at Vacation = Current Balance + (Accrual/Week × Weeks)\nCash Value = Remaining Days × 8 hours × Hourly Rate',
    faqs: [
      { question: 'What is "use it or lose it" PTO?', answer: 'Some employers require you to use PTO within the year or forfeit it. Others allow unlimited rollover or pay out unused days when you leave. Check your employee handbook for your company\'s policy.' },
      { question: 'How do I calculate my hourly wage from salary?', answer: 'Divide your annual salary by 2,080 (52 weeks × 40 hours). For example, $72,800 salary ÷ 2,080 = $35/hour.' },
    ],
  },
  relatedTools: ['working-hours-calculator', 'salary-to-hourly-calculator', 'focus-time-estimator'],
};
