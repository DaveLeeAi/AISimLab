import { ToolDefinition } from './types';

export const meetingCostCalculator: ToolDefinition = {
  slug: 'meeting-cost-calculator',
  title: 'Meeting Cost Calculator',
  shortDescription: 'Calculate the true dollar cost of any meeting based on attendees and salaries.',
  description: 'Every meeting has a hidden price tag. Calculate the actual cost of any meeting based on attendee count, duration, and average compensation — then see how it adds up weekly and annually.',
  category: 'planning',
  subcategory: 'scheduling',
  tags: ['meeting cost', 'productivity', 'time cost', 'salary', 'meeting efficiency'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'attendees', label: 'Number of Attendees', type: 'number', defaultValue: 6, min: 1, max: 1000, step: 1 },
    { name: 'durationHours', label: 'Meeting Duration', type: 'number', defaultValue: 1, min: 0.25, max: 8, step: 0.25, suffix: ' hours' },
    { name: 'avgHourlyRate', label: 'Average Hourly Rate per Person', type: 'currency', defaultValue: 65, min: 1, max: 10000, step: 5, prefix: '$', helpText: 'Annual salary ÷ 2,080 working hours' },
    { name: 'meetingsPerWeek', label: 'This Meeting Occurs', type: 'select', defaultValue: 1, options: [{ label: 'Once (one-time)', value: 1 }, { label: 'Daily (5×/week)', value: 5 }, { label: '2× per week', value: 2 }, { label: 'Weekly', value: 1 }, { label: 'Bi-weekly', value: 0.5 }] },
  ],
  calculate: (inputs) => {
    const attendees = Number(inputs.attendees);
    const duration = Number(inputs.durationHours);
    const rate = Number(inputs.avgHourlyRate);
    const freq = Number(inputs.meetingsPerWeek);

    const singleCost = attendees * duration * rate;
    const costPerMinute = singleCost / (duration * 60);
    const weeklyCost = singleCost * freq;
    const annualCost = weeklyCost * 50;
    const personHoursPerOccurrence = attendees * duration;

    return {
      singleCost: Math.round(singleCost),
      costPerMinute: Math.round(costPerMinute * 100) / 100,
      weeklyCost: Math.round(weeklyCost),
      annualCost: Math.round(annualCost),
      personHoursPerOccurrence: Math.round(personHoursPerOccurrence * 10) / 10,
    };
  },
  outputs: [
    { name: 'singleCost', label: 'Cost per Meeting', type: 'currency', highlight: true, description: 'Total salary cost of one occurrence' },
    { name: 'costPerMinute', label: 'Cost per Minute', type: 'currency' },
    { name: 'weeklyCost', label: 'Weekly Cost', type: 'currency' },
    { name: 'annualCost', label: 'Annual Cost', type: 'currency', description: 'Over 50 working weeks' },
    { name: 'personHoursPerOccurrence', label: 'Total Person-Hours', type: 'number', decimals: 1, description: 'Combined team time consumed' },
  ],
  examples: [
    { title: 'Daily Standup', description: '8 engineers, 15-min daily standup at $75/hr.', inputs: { attendees: 8, durationHours: 0.25, avgHourlyRate: 75, meetingsPerWeek: 5 } },
    { title: 'Weekly All-Hands', description: '25 people, 1 hour weekly meeting.', inputs: { attendees: 25, durationHours: 1, avgHourlyRate: 60, meetingsPerWeek: 1 } },
    { title: 'Executive Review', description: '6 executives, 2-hour bi-weekly review.', inputs: { attendees: 6, durationHours: 2, avgHourlyRate: 200, meetingsPerWeek: 0.5 } },
  ],
  documentation: {
    overview: "Most people don't think about meetings in dollar terms — but every hour in a meeting is an hour of salary being spent. This tool makes the cost tangible, helping teams decide whether a meeting is worth its price tag.",
    howToUse: [
      'Enter the number of people attending the meeting.',
      'Set the meeting duration in hours (0.25 = 15 minutes).',
      "Enter the average hourly rate (a person earning $100K/year costs about $48/hour at 2,080 hours).",
      'Select how often the meeting occurs for recurring cost projections.',
    ],
    formula: 'Single Cost = Attendees × Duration × Hourly Rate\nAnnual Cost = Single Cost × Frequency × 50 weeks',
    faqs: [
      { question: 'How do I estimate hourly rates?', answer: 'Divide annual salary by 2,080 (52 weeks × 40 hours). A $75,000/year employee costs ~$36/hr in salary. Add ~30–40% for benefits and overhead to get the true cost.' },
      { question: "What's a meeting worth having?", answer: 'A meeting is worth its cost if the decisions made, information shared, or alignment achieved would cost more to achieve asynchronously. Many status update meetings can become async Slack updates or shared documents.' },
    ],
  },
  relatedTools: ['focus-time-estimator', 'working-hours-calculator', 'project-cost-estimator'],
};

export const projectCostEstimator: ToolDefinition = {
  slug: 'project-cost-estimator',
  title: 'Project Cost Estimator',
  shortDescription: 'Estimate total project cost based on team size, hours, overhead, and contingency.',
  description: 'Build a complete project cost estimate from team labor, overhead multipliers, and contingency reserves. Get a realistic budget range for any project — from small tasks to full initiatives.',
  category: 'planning',
  subcategory: 'projects',
  tags: ['project cost', 'budget', 'estimation', 'team', 'overhead', 'contingency'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'teamSize', label: 'Team Size', type: 'number', defaultValue: 4, min: 1, max: 1000, step: 1 },
    { name: 'avgHourlyRate', label: 'Average Hourly Rate', type: 'currency', defaultValue: 85, min: 1, max: 10000, step: 5, prefix: '$' },
    { name: 'hoursPerPerson', label: 'Estimated Hours per Person', type: 'number', defaultValue: 160, min: 1, max: 10000, step: 10, helpText: 'Total hours each team member will work on this project' },
    { name: 'overheadPct', label: 'Overhead Rate', type: 'percentage', defaultValue: 25, min: 0, max: 200, step: 5, suffix: '%', helpText: 'Facilities, management, tools — above direct labor' },
    { name: 'contingencyPct', label: 'Contingency Reserve', type: 'percentage', defaultValue: 15, min: 0, max: 100, step: 5, suffix: '%', helpText: 'Buffer for unknowns and scope changes' },
  ],
  calculate: (inputs) => {
    const team = Number(inputs.teamSize);
    const rate = Number(inputs.avgHourlyRate);
    const hours = Number(inputs.hoursPerPerson);
    const overhead = Number(inputs.overheadPct) / 100;
    const contingency = Number(inputs.contingencyPct) / 100;

    const directLaborCost = team * rate * hours;
    const overheadCost = directLaborCost * overhead;
    const subtotal = directLaborCost + overheadCost;
    const contingencyCost = subtotal * contingency;
    const totalEstimate = subtotal + contingencyCost;
    const totalProjectHours = team * hours;

    return {
      totalEstimate: Math.round(totalEstimate),
      directLaborCost: Math.round(directLaborCost),
      overheadCost: Math.round(overheadCost),
      contingencyCost: Math.round(contingencyCost),
      totalProjectHours: Math.round(totalProjectHours),
    };
  },
  outputs: [
    { name: 'totalEstimate', label: 'Total Project Estimate', type: 'currency', highlight: true, description: 'Including overhead and contingency' },
    { name: 'directLaborCost', label: 'Direct Labor Cost', type: 'currency' },
    { name: 'overheadCost', label: 'Overhead Cost', type: 'currency' },
    { name: 'contingencyCost', label: 'Contingency Reserve', type: 'currency' },
    { name: 'totalProjectHours', label: 'Total Project Hours', type: 'number', decimals: 0 },
  ],
  examples: [
    { title: 'Small Feature Build', description: '4-person team for a 4-week sprint.', inputs: { teamSize: 4, avgHourlyRate: 80, hoursPerPerson: 160, overheadPct: 20, contingencyPct: 10 } },
    { title: 'Medium Project', description: '8-person team, 3-month engagement.', inputs: { teamSize: 8, avgHourlyRate: 90, hoursPerPerson: 480, overheadPct: 30, contingencyPct: 15 } },
    { title: 'Agency Client Project', description: 'Agency billing with higher overhead and risk buffer.', inputs: { teamSize: 5, avgHourlyRate: 120, hoursPerPerson: 300, overheadPct: 40, contingencyPct: 20 } },
  ],
  documentation: {
    overview: 'Accurate project cost estimation is critical for profitability and client trust. This estimator builds a budget from the ground up — direct labor, overhead recovery, and a contingency reserve for the inevitable unknowns.',
    howToUse: [
      'Enter your team size and average hourly rate.',
      'Estimate total hours per person for the entire project.',
      'Set your overhead rate (typically 20–40% for software teams).',
      'Add a contingency reserve — 10–20% is standard for managed risk.',
      'Review the total and adjust inputs until the estimate is realistic.',
    ],
    formula: 'Direct Labor = Team × Rate × Hours\nOverhead = Direct Labor × Overhead %\nContingency = (Labor + Overhead) × Contingency %\nTotal = Labor + Overhead + Contingency',
    faqs: [
      { question: 'What overhead rate should I use?', answer: 'For in-house teams: 20–35%. For agencies billing clients: 35–60%. Overhead includes management time, office costs, software licenses, HR, and other indirect costs.' },
      { question: "Why include contingency?", answer: "All projects encounter unexpected issues. A contingency reserve is your financial buffer. 10% for well-scoped projects, 15–20% for complex ones, 25%+ for highly uncertain work." },
    ],
  },
  relatedTools: ['meeting-cost-calculator', 'hourly-rate-calculator', 'startup-runway-calculator'],
};

export const tripBudgetPlanner: ToolDefinition = {
  slug: 'trip-budget-planner',
  title: 'Trip Budget Planner',
  shortDescription: 'Plan the full cost of any trip — accommodation, food, activities, and transport.',
  description: 'Build a complete travel budget by entering your daily costs and trip length. See per-person costs, total budget, and add a buffer for unexpected expenses.',
  category: 'planning',
  subcategory: 'scheduling',
  tags: ['trip budget', 'travel', 'vacation cost', 'travel planning', 'per person cost'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'numberOfDays', label: 'Trip Length', type: 'number', defaultValue: 7, min: 1, max: 365, step: 1, suffix: ' days' },
    { name: 'numberOfPeople', label: 'Number of Travelers', type: 'number', defaultValue: 2, min: 1, max: 100, step: 1 },
    { name: 'dailyAccommodation', label: 'Accommodation per Night (total)', type: 'currency', defaultValue: 140, min: 0, max: 100000, step: 10, prefix: '$' },
    { name: 'dailyFoodPerPerson', label: 'Food & Dining per Person/Day', type: 'currency', defaultValue: 70, min: 0, max: 10000, step: 5, prefix: '$' },
    { name: 'dailyActivitiesPerPerson', label: 'Activities & Sightseeing per Person/Day', type: 'currency', defaultValue: 45, min: 0, max: 10000, step: 5, prefix: '$' },
    { name: 'totalTransport', label: 'Transport Total (flights, trains, etc.)', type: 'currency', defaultValue: 800, min: 0, max: 1000000, step: 50, prefix: '$', helpText: 'Total for all travelers combined' },
    { name: 'bufferPct', label: 'Emergency Buffer', type: 'percentage', defaultValue: 15, min: 0, max: 50, step: 5, suffix: '%' },
  ],
  calculate: (inputs) => {
    const days = Number(inputs.numberOfDays);
    const people = Number(inputs.numberOfPeople);
    const accommodation = Number(inputs.dailyAccommodation) * days;
    const food = Number(inputs.dailyFoodPerPerson) * people * days;
    const activities = Number(inputs.dailyActivitiesPerPerson) * people * days;
    const transport = Number(inputs.totalTransport);
    const buffer = Number(inputs.bufferPct) / 100;

    const subtotal = accommodation + food + activities + transport;
    const bufferAmount = subtotal * buffer;
    const totalBudget = subtotal + bufferAmount;
    const perPersonCost = people > 0 ? totalBudget / people : 0;
    const costPerDay = days > 0 ? totalBudget / days : 0;

    return {
      totalBudget: Math.round(totalBudget),
      perPersonCost: Math.round(perPersonCost),
      costPerDay: Math.round(costPerDay),
      subtotal: Math.round(subtotal),
      bufferAmount: Math.round(bufferAmount),
      accommodation: Math.round(accommodation),
    };
  },
  outputs: [
    { name: 'totalBudget', label: 'Total Trip Budget', type: 'currency', highlight: true, description: 'All costs including buffer' },
    { name: 'perPersonCost', label: 'Per Person Cost', type: 'currency' },
    { name: 'costPerDay', label: 'Cost per Day', type: 'currency' },
    { name: 'accommodation', label: 'Accommodation Total', type: 'currency' },
    { name: 'bufferAmount', label: 'Emergency Buffer', type: 'currency' },
    { name: 'subtotal', label: 'Subtotal (Before Buffer)', type: 'currency' },
  ],
  examples: [
    { title: 'European City Break', description: 'Couple, 7 nights in a European city.', inputs: { numberOfDays: 7, numberOfPeople: 2, dailyAccommodation: 150, dailyFoodPerPerson: 80, dailyActivitiesPerPerson: 50, totalTransport: 900, bufferPct: 15 } },
    { title: 'Solo Backpacker', description: 'Solo budget traveler, 14 days in Southeast Asia.', inputs: { numberOfDays: 14, numberOfPeople: 1, dailyAccommodation: 35, dailyFoodPerPerson: 25, dailyActivitiesPerPerson: 20, totalTransport: 600, bufferPct: 20 } },
    { title: 'Family Vacation', description: 'Family of 4, 10-day beach vacation.', inputs: { numberOfDays: 10, numberOfPeople: 4, dailyAccommodation: 250, dailyFoodPerPerson: 60, dailyActivitiesPerPerson: 40, totalTransport: 2400, bufferPct: 15 } },
  ],
  documentation: {
    overview: 'A trip budget planner helps you avoid the surprise of a credit card bill after a vacation. By planning daily costs and adding a buffer, you can enjoy your trip knowing the financial impact in advance.',
    howToUse: [
      'Set your trip length and number of travelers.',
      'Enter the nightly accommodation cost (total, not per person).',
      'Enter estimated daily food and activity costs per person.',
      'Add the total transportation costs (flights, trains, car rental).',
      'Set a buffer percentage for unexpected expenses (15% recommended).',
    ],
    formula: 'Subtotal = Accommodation + (Food × People × Days) + (Activities × People × Days) + Transport\nBuffer = Subtotal × Buffer %\nTotal = Subtotal + Buffer',
    faqs: [
      { question: 'Should accommodation be per room or per person?', answer: 'Enter the total nightly cost for the accommodation (the price of the room/unit). The calculator splits costs per person at the end.' },
      { question: 'What buffer percentage should I use?', answer: '10–15% for well-planned trips to familiar destinations. 20–25% for new destinations, adventure travel, or trips with variable itineraries.' },
    ],
  },
  relatedTools: ['tip-calculator', 'budget-planner', 'fuel-cost-estimator'],
};

export const fuelCostEstimator: ToolDefinition = {
  slug: 'fuel-cost-estimator',
  title: 'Fuel Cost Estimator',
  shortDescription: 'Calculate the fuel cost of any road trip based on distance and fuel economy.',
  description: 'Enter your trip distance, vehicle fuel economy, and current gas prices to instantly calculate how much fuel you need and what it will cost.',
  category: 'planning',
  subcategory: 'scheduling',
  tags: ['fuel cost', 'gas cost', 'road trip', 'mpg', 'driving cost', 'travel'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'tripDistance', label: 'Trip Distance', type: 'number', defaultValue: 350, min: 1, max: 100000, step: 5, suffix: ' miles' },
    { name: 'fuelEconomy', label: 'Fuel Economy', type: 'number', defaultValue: 28, min: 1, max: 150, step: 0.5, suffix: ' mpg' },
    { name: 'fuelPricePerGallon', label: 'Fuel Price per Gallon', type: 'currency', defaultValue: 3.79, min: 0.01, max: 50, step: 0.01, prefix: '$' },
    { name: 'tripType', label: 'Trip Type', type: 'select', defaultValue: 1, options: [{ label: 'One Way', value: 1 }, { label: 'Round Trip', value: 2 }] },
    { name: 'numberOfVehicles', label: 'Number of Vehicles', type: 'number', defaultValue: 1, min: 1, max: 100, step: 1 },
  ],
  calculate: (inputs) => {
    const distance = Number(inputs.tripDistance);
    const mpg = Number(inputs.fuelEconomy);
    const pricePerGallon = Number(inputs.fuelPricePerGallon);
    const multiplier = Number(inputs.tripType);
    const vehicles = Number(inputs.numberOfVehicles);

    const totalMiles = distance * multiplier * vehicles;
    const gallonsNeeded = mpg > 0 ? totalMiles / mpg : 0;
    const totalFuelCost = gallonsNeeded * pricePerGallon;
    const costPerMile = mpg > 0 ? pricePerGallon / mpg : 0;
    const costPerHundredMiles = costPerMile * 100;

    return {
      totalFuelCost: Math.round(totalFuelCost * 100) / 100,
      gallonsNeeded: Math.round(gallonsNeeded * 10) / 10,
      totalMiles: Math.round(totalMiles),
      costPerMile: Math.round(costPerMile * 100) / 100,
      costPerHundredMiles: Math.round(costPerHundredMiles * 100) / 100,
    };
  },
  outputs: [
    { name: 'totalFuelCost', label: 'Total Fuel Cost', type: 'currency', highlight: true },
    { name: 'gallonsNeeded', label: 'Gallons Needed', type: 'number', decimals: 1 },
    { name: 'totalMiles', label: 'Total Miles', type: 'number', decimals: 0 },
    { name: 'costPerMile', label: 'Cost per Mile', type: 'currency', decimals: 2 },
    { name: 'costPerHundredMiles', label: 'Cost per 100 Miles', type: 'currency' },
  ],
  examples: [
    { title: 'Weekend Road Trip', description: '350-mile round trip in a 28 mpg car.', inputs: { tripDistance: 350, fuelEconomy: 28, fuelPricePerGallon: 3.79, tripType: 2, numberOfVehicles: 1 } },
    { title: 'Cross-Country Drive', description: '2,800-mile one-way cross-country move.', inputs: { tripDistance: 2800, fuelEconomy: 24, fuelPricePerGallon: 3.89, tripType: 1, numberOfVehicles: 1 } },
    { title: 'Caravan Trip', description: 'Two vehicles driving to the same destination.', inputs: { tripDistance: 200, fuelEconomy: 22, fuelPricePerGallon: 3.75, tripType: 2, numberOfVehicles: 2 } },
  ],
  documentation: {
    overview: 'Knowing your fuel cost before a road trip helps you budget accurately and compare driving vs. flying. This estimator works for any vehicle — just enter your real-world fuel economy (not the EPA estimate, which is typically 10–15% optimistic).',
    howToUse: [
      'Enter the one-way trip distance in miles.',
      'Enter your vehicle\'s real-world fuel economy in mpg.',
      'Enter the current gas price per gallon.',
      'Select one-way or round trip.',
      'Add multiple vehicles if carpooling or convoying.',
    ],
    formula: 'Total Miles = Distance × Trip Type Multiplier × Vehicles\nGallons = Total Miles ÷ MPG\nFuel Cost = Gallons × Price per Gallon',
    faqs: [
      { question: 'Where can I find current gas prices?', answer: 'GasBuddy.com shows real-time prices by location. AAA also publishes national and regional averages daily.' },
      { question: "Should I use the EPA or real-world MPG?", answer: 'Use your actual observed MPG from recent fill-ups. EPA ratings are measured in ideal conditions; real-world driving with AC, highway speeds, and cargo typically delivers 10–15% less.' },
    ],
  },
  relatedTools: ['trip-budget-planner', 'budget-planner', 'percentage-calculator'],
};
