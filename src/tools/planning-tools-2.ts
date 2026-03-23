import { ToolDefinition } from './types';

export const homeRenovationCalculator: ToolDefinition = {
  slug: 'home-renovation-calculator',
  title: 'Home Renovation Cost Estimator',
  shortDescription: 'Estimate the total cost of a home renovation project.',
  description: 'Get a realistic total renovation estimate by entering material costs, labor, permits, and applying a contingency buffer for unexpected expenses.',
  category: 'planning',
  subcategory: 'projects',
  tags: ['renovation', 'home improvement', 'remodeling', 'construction cost', 'contractor'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'materialCost', label: 'Materials Cost', type: 'currency', defaultValue: 15000, min: 0, max: 1000000, step: 500, prefix: '$' },
    { name: 'laborCost', label: 'Contractor Labor', type: 'currency', defaultValue: 20000, min: 0, max: 1000000, step: 500, prefix: '$' },
    { name: 'permitCost', label: 'Permits & Inspections', type: 'currency', defaultValue: 1500, min: 0, max: 50000, step: 100, prefix: '$' },
    { name: 'designCost', label: 'Design & Architecture', type: 'currency', defaultValue: 2000, min: 0, max: 100000, step: 250, prefix: '$' },
    { name: 'contingencyPct', label: 'Contingency Buffer', type: 'percentage', defaultValue: 15, min: 5, max: 40, step: 5, suffix: '%', helpText: 'Recommended 10–20% for unexpected costs' },
    { name: 'projectType', label: 'Project Type', type: 'select', defaultValue: 'kitchen', options: [{ label: 'Kitchen Remodel', value: 'kitchen' }, { label: 'Bathroom', value: 'bathroom' }, { label: 'Addition', value: 'addition' }, { label: 'Basement Finish', value: 'basement' }, { label: 'Deck/Patio', value: 'deck' }, { label: 'Full Home Renovation', value: 'full' }] },
  ],
  calculate: (inputs) => {
    const materials = Number(inputs.materialCost);
    const labor = Number(inputs.laborCost);
    const permits = Number(inputs.permitCost);
    const design = Number(inputs.designCost);
    const contingencyPct = Number(inputs.contingencyPct) / 100;
    const subtotal = materials + labor + permits + design;
    const contingencyAmt = subtotal * contingencyPct;
    const total = subtotal + contingencyAmt;
    const laborPct = labor > 0 ? (labor / total) * 100 : 0;
    const materialsPct = materials > 0 ? (materials / total) * 100 : 0;
    return {
      total: Math.round(total),
      subtotal: Math.round(subtotal),
      contingencyAmt: Math.round(contingencyAmt),
      laborPct: Math.round(laborPct * 10) / 10,
      materialsPct: Math.round(materialsPct * 10) / 10,
    };
  },
  outputs: [
    { name: 'total', label: 'Total Estimated Cost', type: 'currency', decimals: 0, highlight: true, description: 'Including contingency buffer' },
    { name: 'subtotal', label: 'Base Project Cost', type: 'currency', decimals: 0, description: 'Before contingency' },
    { name: 'contingencyAmt', label: 'Contingency Reserve', type: 'currency', decimals: 0 },
    { name: 'laborPct', label: 'Labor % of Total', type: 'percentage', decimals: 1 },
    { name: 'materialsPct', label: 'Materials % of Total', type: 'percentage', decimals: 1 },
  ],
  examples: [
    { title: 'Kitchen Remodel', description: 'Mid-range kitchen update with new cabinets and countertops.', inputs: { materialCost: 15000, laborCost: 20000, permitCost: 1500, designCost: 2000, contingencyPct: 15, projectType: 'kitchen' } },
    { title: 'Bathroom Renovation', description: 'Full bathroom gut and renovation.', inputs: { materialCost: 8000, laborCost: 12000, permitCost: 500, designCost: 1000, contingencyPct: 15, projectType: 'bathroom' } },
    { title: 'Basement Finish', description: 'Converting unfinished basement to living space.', inputs: { materialCost: 20000, laborCost: 25000, permitCost: 2000, designCost: 0, contingencyPct: 20, projectType: 'basement' } },
  ],
  documentation: {
    overview: 'Home renovation projects almost always go over initial estimates. This calculator builds in a contingency buffer from the start, giving you a more realistic total before you begin. Understanding the cost split also helps you negotiate with contractors.',
    howToUse: ['Enter your materials quote from suppliers or contractor bids.', 'Enter contractor labor costs.', 'Add permit and inspection fees from your municipality.', 'Add design or architecture costs if applicable.', 'Set a contingency percentage — 15% is a good default.'],
    formula: 'Subtotal = Materials + Labor + Permits + Design\nContingency = Subtotal × Contingency %\nTotal = Subtotal + Contingency',
    faqs: [
      { question: 'Why does every renovation go over budget?', answer: 'Hidden damage discovered during work (rot, plumbing, electrical), material price increases, scope creep, and unforeseen code requirements are the most common causes. A 15–20% contingency protects against these.' },
      { question: 'How do I get accurate contractor bids?', answer: 'Get at least 3 competitive bids, ensure all quotes cover the same scope, ask for itemized breakdowns, and check references. The lowest bid is not always the best value.' },
    ],
  },
  relatedTools: ['project-cost-estimator', 'mortgage-calculator', 'rent-vs-buy-calculator'],
};

export const weddingBudgetCalculator: ToolDefinition = {
  slug: 'wedding-budget-calculator',
  title: 'Wedding Budget Calculator',
  shortDescription: 'Plan and track total wedding costs across all major categories.',
  description: 'Get a realistic wedding budget by entering costs across venue, catering, photography, flowers, music, and other categories. See total spend and cost per guest.',
  category: 'planning',
  subcategory: 'events',
  tags: ['wedding', 'wedding budget', 'event planning', 'cost per guest'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'guestCount', label: 'Guest Count', type: 'number', defaultValue: 120, min: 10, max: 1000, step: 5, suffix: ' guests' },
    { name: 'venue', label: 'Venue', type: 'currency', defaultValue: 8000, min: 0, max: 200000, step: 500, prefix: '$' },
    { name: 'catering', label: 'Catering & Bar', type: 'currency', defaultValue: 12000, min: 0, max: 200000, step: 500, prefix: '$' },
    { name: 'photography', label: 'Photography & Video', type: 'currency', defaultValue: 4000, min: 0, max: 50000, step: 250, prefix: '$' },
    { name: 'flowers', label: 'Flowers & Decor', type: 'currency', defaultValue: 3000, min: 0, max: 50000, step: 250, prefix: '$' },
    { name: 'music', label: 'Music / DJ / Band', type: 'currency', defaultValue: 2500, min: 0, max: 30000, step: 250, prefix: '$' },
    { name: 'attire', label: 'Attire & Rings', type: 'currency', defaultValue: 5000, min: 0, max: 100000, step: 250, prefix: '$' },
    { name: 'other', label: 'Other (invites, transport, cake)', type: 'currency', defaultValue: 3000, min: 0, max: 50000, step: 250, prefix: '$' },
  ],
  calculate: (inputs) => {
    const guests = Number(inputs.guestCount);
    const venue = Number(inputs.venue);
    const catering = Number(inputs.catering);
    const photography = Number(inputs.photography);
    const flowers = Number(inputs.flowers);
    const music = Number(inputs.music);
    const attire = Number(inputs.attire);
    const other = Number(inputs.other);
    const total = venue + catering + photography + flowers + music + attire + other;
    const perGuest = guests > 0 ? total / guests : 0;
    const cateringPct = total > 0 ? (catering / total) * 100 : 0;
    return {
      total: Math.round(total),
      perGuest: Math.round(perGuest),
      cateringPct: Math.round(cateringPct),
    };
  },
  outputs: [
    { name: 'total', label: 'Total Wedding Budget', type: 'currency', decimals: 0, highlight: true },
    { name: 'perGuest', label: 'Cost Per Guest', type: 'currency', decimals: 0 },
    { name: 'cateringPct', label: 'Catering % of Budget', type: 'percentage', decimals: 0, description: 'Typically 40–50% of total budget' },
  ],
  examples: [
    { title: 'Mid-Range Wedding', description: '120 guests, standard vendor mix.', inputs: { guestCount: 120, venue: 8000, catering: 12000, photography: 4000, flowers: 3000, music: 2500, attire: 5000, other: 3000 } },
    { title: 'Intimate Wedding', description: '50 guests, quality over quantity.', inputs: { guestCount: 50, venue: 4000, catering: 6000, photography: 5000, flowers: 2000, music: 1500, attire: 6000, other: 2000 } },
    { title: 'Large Celebration', description: '250 guests, full ballroom.', inputs: { guestCount: 250, venue: 20000, catering: 35000, photography: 7000, flowers: 8000, music: 6000, attire: 8000, other: 6000 } },
  ],
  documentation: {
    overview: 'Weddings are complex events with costs spread across many vendors. This calculator gives you a clear picture of your total budget and the per-guest cost, which is the key lever for controlling overall spend.',
    howToUse: ['Enter your expected guest count.', 'Fill in quotes or estimates for each major category.', 'Review total cost and cost per guest.', 'Reduce guest count or vendor tiers to hit your target budget.'],
    formula: 'Total = Sum of all categories\nPer Guest = Total ÷ Guest Count',
    faqs: [
      { question: 'What does an average wedding cost?', answer: 'The US average is approximately $30,000–$35,000. Costs vary enormously by location, season, and vendor tier. Urban weddings in major cities often run $50,000–$100,000+.' },
      { question: 'What is the biggest cost to cut?', answer: 'Guest count is the single most powerful lever. Reducing from 150 to 100 guests can save $5,000–$15,000+ on catering alone. Choosing an off-peak date (Friday, Sunday, winter) can reduce venue costs 20–40%.' },
    ],
  },
  relatedTools: ['trip-budget-planner', 'project-cost-estimator', 'budget-planner'],
};

export const movingCostCalculator: ToolDefinition = {
  slug: 'moving-cost-calculator',
  title: 'Moving Cost Calculator',
  shortDescription: 'Estimate the total cost of moving to a new home.',
  description: 'Calculate your full moving budget including professional movers, packing supplies, truck rental, deposits, and temporary housing if needed.',
  category: 'planning',
  subcategory: 'projects',
  tags: ['moving', 'relocation', 'moving cost', 'movers', 'moving budget'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'moveDistance', label: 'Move Distance', type: 'select', defaultValue: 'local', options: [{ label: 'Local (under 50 miles)', value: 'local' }, { label: 'Regional (50–250 miles)', value: 'regional' }, { label: 'Long Distance (250–1000 miles)', value: 'longdist' }, { label: 'Cross Country (1000+ miles)', value: 'crosscountry' }] },
    { name: 'homeSizeBedrooms', label: 'Home Size', type: 'select', defaultValue: 2, options: [{ label: 'Studio / 1 Bedroom', value: 1 }, { label: '2 Bedrooms', value: 2 }, { label: '3 Bedrooms', value: 3 }, { label: '4+ Bedrooms', value: 4 }] },
    { name: 'packingSupplies', label: 'Packing Supplies', type: 'currency', defaultValue: 200, min: 0, max: 2000, step: 25, prefix: '$' },
    { name: 'storage', label: 'Storage (if needed)', type: 'currency', defaultValue: 0, min: 0, max: 5000, step: 50, prefix: '$' },
    { name: 'newDeposit', label: 'First Month + Security Deposit', type: 'currency', defaultValue: 4000, min: 0, max: 50000, step: 500, prefix: '$' },
    { name: 'miscellaneous', label: 'Miscellaneous & Tips', type: 'currency', defaultValue: 300, min: 0, max: 5000, step: 50, prefix: '$' },
  ],
  calculate: (inputs) => {
    const distanceMultiplier: Record<string, number> = { local: 1, regional: 1.8, longdist: 3.5, crosscountry: 6 };
    const sizeBase: Record<number, number> = { 1: 800, 2: 1400, 3: 2000, 4: 3000 };
    const dist = distanceMultiplier[String(inputs.moveDistance)] ?? 1;
    const base = sizeBase[Number(inputs.homeSizeBedrooms)] ?? 1400;
    const moverCost = base * dist;
    const packing = Number(inputs.packingSupplies);
    const storage = Number(inputs.storage);
    const deposit = Number(inputs.newDeposit);
    const misc = Number(inputs.miscellaneous);
    const total = moverCost + packing + storage + deposit + misc;
    return {
      total: Math.round(total),
      moverCost: Math.round(moverCost),
      movingOnly: Math.round(moverCost + packing),
    };
  },
  outputs: [
    { name: 'total', label: 'Total Moving Budget', type: 'currency', decimals: 0, highlight: true, description: 'Including deposit and all costs' },
    { name: 'movingOnly', label: 'Moving Day Costs', type: 'currency', decimals: 0, description: 'Movers + packing supplies' },
    { name: 'moverCost', label: 'Estimated Mover Cost', type: 'currency', decimals: 0 },
  ],
  examples: [
    { title: 'Local 2-Bedroom Move', description: 'Moving within the same city.', inputs: { moveDistance: 'local', homeSizeBedrooms: 2, packingSupplies: 200, storage: 0, newDeposit: 4000, miscellaneous: 300 } },
    { title: 'Cross-State Relocation', description: 'Moving a 3-bedroom house 500 miles.', inputs: { moveDistance: 'longdist', homeSizeBedrooms: 3, packingSupplies: 400, storage: 300, newDeposit: 6000, miscellaneous: 500 } },
    { title: 'Cross-Country Move', description: 'Full household move coast to coast.', inputs: { moveDistance: 'crosscountry', homeSizeBedrooms: 4, packingSupplies: 600, storage: 500, newDeposit: 8000, miscellaneous: 800 } },
  ],
  documentation: {
    overview: 'Moving costs are easy to underestimate because expenses extend well beyond the movers themselves. This calculator captures the full budget including deposits, packing, and setup costs at your new place.',
    howToUse: ['Select your move distance (affects mover estimate).', 'Select your home size.', 'Add packing supply costs.', 'Include any storage unit costs if you need temporary storage.', 'Add your new place deposit and first month\'s rent/costs.'],
    formula: 'Mover Cost = Base Cost by Size × Distance Multiplier\nTotal = Mover Cost + Packing + Storage + Deposit + Miscellaneous',
    faqs: [
      { question: 'Should I hire movers or rent a truck?', answer: 'For local moves with fewer than 3 bedrooms, truck rental (U-Haul, Penske) can save 50–70%. For long-distance or large homes, professional movers save back injury and are often worth the cost.' },
      { question: 'When should I book movers?', answer: 'Book 4–8 weeks in advance, especially for summer moves (peak season). Moving at the end of the month is more expensive — middle-of-month moves are often cheaper.' },
    ],
  },
  relatedTools: ['trip-budget-planner', 'rent-vs-buy-calculator', 'budget-planner'],
};

export const eventBudgetCalculator: ToolDefinition = {
  slug: 'event-budget-calculator',
  title: 'Event Budget Calculator',
  shortDescription: 'Budget any event — conference, party, or corporate event.',
  description: 'Plan the full budget for any event by entering venue, catering, A/V, staffing, and marketing costs. Calculate cost per attendee and see your budget breakdown.',
  category: 'planning',
  subcategory: 'events',
  tags: ['event', 'event budget', 'conference', 'party', 'corporate event', 'cost per attendee'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'attendees', label: 'Number of Attendees', type: 'number', defaultValue: 100, min: 5, max: 10000, step: 5 },
    { name: 'venue', label: 'Venue Rental', type: 'currency', defaultValue: 3000, min: 0, max: 500000, step: 250, prefix: '$' },
    { name: 'catering', label: 'Catering & Drinks', type: 'currency', defaultValue: 4000, min: 0, max: 500000, step: 250, prefix: '$' },
    { name: 'av', label: 'A/V & Technology', type: 'currency', defaultValue: 1500, min: 0, max: 100000, step: 100, prefix: '$' },
    { name: 'staffing', label: 'Staff & Entertainment', type: 'currency', defaultValue: 1000, min: 0, max: 100000, step: 100, prefix: '$' },
    { name: 'marketing', label: 'Marketing & Invitations', type: 'currency', defaultValue: 500, min: 0, max: 50000, step: 50, prefix: '$' },
    { name: 'contingency', label: 'Contingency', type: 'percentage', defaultValue: 10, min: 0, max: 30, step: 5, suffix: '%' },
  ],
  calculate: (inputs) => {
    const attendees = Number(inputs.attendees);
    const base = Number(inputs.venue) + Number(inputs.catering) + Number(inputs.av) + Number(inputs.staffing) + Number(inputs.marketing);
    const contingencyAmt = base * (Number(inputs.contingency) / 100);
    const total = base + contingencyAmt;
    const perAttendee = attendees > 0 ? total / attendees : 0;
    const cateringPct = total > 0 ? (Number(inputs.catering) / total) * 100 : 0;
    return {
      total: Math.round(total),
      perAttendee: Math.round(perAttendee * 100) / 100,
      cateringPct: Math.round(cateringPct),
      contingencyAmt: Math.round(contingencyAmt),
    };
  },
  outputs: [
    { name: 'total', label: 'Total Event Budget', type: 'currency', decimals: 0, highlight: true },
    { name: 'perAttendee', label: 'Cost Per Attendee', type: 'currency', decimals: 2 },
    { name: 'contingencyAmt', label: 'Contingency Reserve', type: 'currency', decimals: 0 },
    { name: 'cateringPct', label: 'Catering % of Budget', type: 'percentage', decimals: 0 },
  ],
  examples: [
    { title: 'Corporate Team Event', description: '100 people, offsite team day.', inputs: { attendees: 100, venue: 3000, catering: 4000, av: 1500, staffing: 1000, marketing: 500, contingency: 10 } },
    { title: 'Small Conference', description: '250 attendees, half-day conference.', inputs: { attendees: 250, venue: 8000, catering: 10000, av: 5000, staffing: 3000, marketing: 2000, contingency: 15 } },
    { title: 'Holiday Party', description: '75 person company holiday party.', inputs: { attendees: 75, venue: 2500, catering: 5000, av: 500, staffing: 1500, marketing: 200, contingency: 10 } },
  ],
  documentation: {
    overview: 'Event budgeting requires tracking many simultaneous cost categories. This calculator gives you a clear total and per-attendee cost, which is the key metric for justifying the spend to stakeholders.',
    howToUse: ['Enter the expected number of attendees.', 'Fill in costs for each budget category.', 'Add a contingency buffer for last-minute costs.', 'Review cost per attendee — typically the key approval metric.'],
    formula: 'Total = (Venue + Catering + A/V + Staffing + Marketing) × (1 + Contingency %)\nPer Attendee = Total ÷ Attendees',
    faqs: [
      { question: 'What is a typical cost per person for a corporate event?', answer: 'A modest lunch meeting: $30–$60/person. A half-day event with catering: $100–$200/person. A full-day conference: $200–$400/person. Galas and premium events: $400–$1,000+/person.' },
    ],
  },
  relatedTools: ['meeting-cost-calculator', 'wedding-budget-calculator', 'project-cost-estimator'],
};
