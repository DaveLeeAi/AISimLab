import { ToolDefinition } from './types';

export const weightConverter: ToolDefinition = {
  slug: 'weight-converter',
  title: 'Weight Converter',
  shortDescription: 'Convert weight between pounds, kilograms, ounces, grams, and stones.',
  description: 'Instantly convert any weight measurement between all common units. Useful for cooking, fitness, shipping, and international travel.',
  category: 'math',
  subcategory: 'conversions',
  tags: ['weight', 'pounds', 'kilograms', 'grams', 'ounces', 'stones', 'unit conversion'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'value', label: 'Weight Value', type: 'number', defaultValue: 150, min: 0, max: 1000000, step: 0.01 },
    { name: 'fromUnit', label: 'From Unit', type: 'select', defaultValue: 'lbs', options: [{ label: 'Pounds (lbs)', value: 'lbs' }, { label: 'Kilograms (kg)', value: 'kg' }, { label: 'Grams (g)', value: 'g' }, { label: 'Ounces (oz)', value: 'oz' }, { label: 'Stones (st)', value: 'st' }, { label: 'Milligrams (mg)', value: 'mg' }] },
  ],
  calculate: (inputs) => {
    const v = Number(inputs.value);
    const unit = String(inputs.fromUnit);
    const toKg: Record<string, number> = { lbs: 0.453592, kg: 1, g: 0.001, oz: 0.0283495, st: 6.35029, mg: 0.000001 };
    const kg = v * (toKg[unit] ?? 1);
    return {
      pounds: Math.round((kg / 0.453592) * 1000) / 1000,
      kilograms: Math.round(kg * 1000) / 1000,
      grams: Math.round(kg * 1000 * 100) / 100,
      ounces: Math.round((kg / 0.0283495) * 100) / 100,
      stones: Math.round((kg / 6.35029) * 100) / 100,
      milligrams: Math.round(kg * 1000000),
    };
  },
  outputs: [
    { name: 'pounds', label: 'Pounds (lbs)', type: 'number', decimals: 3, highlight: true },
    { name: 'kilograms', label: 'Kilograms (kg)', type: 'number', decimals: 3 },
    { name: 'grams', label: 'Grams (g)', type: 'number', decimals: 2 },
    { name: 'ounces', label: 'Ounces (oz)', type: 'number', decimals: 2 },
    { name: 'stones', label: 'Stones (st)', type: 'number', decimals: 2 },
    { name: 'milligrams', label: 'Milligrams (mg)', type: 'number', decimals: 0 },
  ],
  examples: [
    { title: 'Body Weight', description: '150 pounds to all units.', inputs: { value: 150, fromUnit: 'lbs' } },
    { title: 'Metric to Imperial', description: '70 kg to pounds.', inputs: { value: 70, fromUnit: 'kg' } },
    { title: 'Cooking Measurement', description: '500 grams to ounces.', inputs: { value: 500, fromUnit: 'g' } },
  ],
  documentation: {
    overview: 'A fast, multi-unit weight converter that outputs all common weight measurements simultaneously. No need to convert one unit at a time.',
    howToUse: ['Enter the weight value.', 'Select the unit you are converting from.', 'All other units update instantly.'],
    formula: 'All conversions use kilograms as the base unit: 1 kg = 2.20462 lbs = 35.274 oz = 0.157473 stones',
    faqs: [
      { question: 'How many pounds in a kilogram?', answer: '1 kilogram = 2.20462 pounds. To convert kg to lbs quickly, multiply by 2.2.' },
    ],
  },
  relatedTools: ['temperature-converter', 'length-converter', 'bmi-calculator'],
};

export const lengthConverter: ToolDefinition = {
  slug: 'length-converter',
  title: 'Length & Distance Converter',
  shortDescription: 'Convert between metric and imperial length units instantly.',
  description: 'Convert any length or distance between meters, feet, inches, centimeters, miles, kilometers, and more. All units displayed simultaneously.',
  category: 'math',
  subcategory: 'conversions',
  tags: ['length', 'distance', 'meters', 'feet', 'inches', 'miles', 'kilometers', 'unit conversion'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'value', label: 'Length Value', type: 'number', defaultValue: 100, min: 0, max: 1000000000, step: 0.001 },
    { name: 'fromUnit', label: 'From Unit', type: 'select', defaultValue: 'meters', options: [{ label: 'Meters (m)', value: 'meters' }, { label: 'Feet (ft)', value: 'feet' }, { label: 'Inches (in)', value: 'inches' }, { label: 'Centimeters (cm)', value: 'cm' }, { label: 'Kilometers (km)', value: 'km' }, { label: 'Miles (mi)', value: 'miles' }, { label: 'Yards (yd)', value: 'yards' }, { label: 'Millimeters (mm)', value: 'mm' }] },
  ],
  calculate: (inputs) => {
    const v = Number(inputs.value);
    const unit = String(inputs.fromUnit);
    const toMeters: Record<string, number> = { meters: 1, feet: 0.3048, inches: 0.0254, cm: 0.01, km: 1000, miles: 1609.344, yards: 0.9144, mm: 0.001 };
    const m = v * (toMeters[unit] ?? 1);
    return {
      meters: Math.round(m * 10000) / 10000,
      feet: Math.round((m / 0.3048) * 10000) / 10000,
      inches: Math.round((m / 0.0254) * 100) / 100,
      centimeters: Math.round(m * 100 * 100) / 100,
      kilometers: Math.round((m / 1000) * 100000) / 100000,
      miles: Math.round((m / 1609.344) * 100000) / 100000,
      yards: Math.round((m / 0.9144) * 1000) / 1000,
      millimeters: Math.round(m * 1000),
    };
  },
  outputs: [
    { name: 'meters', label: 'Meters (m)', type: 'number', decimals: 4, highlight: true },
    { name: 'feet', label: 'Feet (ft)', type: 'number', decimals: 4 },
    { name: 'inches', label: 'Inches (in)', type: 'number', decimals: 2 },
    { name: 'centimeters', label: 'Centimeters (cm)', type: 'number', decimals: 2 },
    { name: 'kilometers', label: 'Kilometers (km)', type: 'number', decimals: 5 },
    { name: 'miles', label: 'Miles (mi)', type: 'number', decimals: 5 },
    { name: 'yards', label: 'Yards (yd)', type: 'number', decimals: 3 },
    { name: 'millimeters', label: 'Millimeters (mm)', type: 'number', decimals: 0 },
  ],
  examples: [
    { title: '100 Meters', description: 'Olympic sprint distance in all units.', inputs: { value: 100, fromUnit: 'meters' } },
    { title: '5 Miles', description: '5 mile run in kilometers and meters.', inputs: { value: 5, fromUnit: 'miles' } },
    { title: '6 Feet Tall', description: 'Height in centimeters and meters.', inputs: { value: 6, fromUnit: 'feet' } },
  ],
  documentation: {
    overview: 'A comprehensive length and distance converter outputting all common units at once. Useful for construction, travel, fitness, and international communication.',
    howToUse: ['Enter the length value.', 'Select the unit you are starting from.', 'All units update instantly.'],
    formula: 'All conversions use meters as the base: 1 m = 3.28084 ft = 39.3701 in = 0.000621371 miles',
    faqs: [
      { question: 'How many feet in a meter?', answer: '1 meter = 3.28084 feet. For a quick approximation, multiply meters by 3.28.' },
    ],
  },
  relatedTools: ['weight-converter', 'temperature-converter', 'fuel-cost-estimator'],
};

export const currencyConverter: ToolDefinition = {
  slug: 'currency-converter',
  title: 'Currency Converter',
  shortDescription: 'Convert amounts between major world currencies using common rates.',
  description: 'Convert between major world currencies using approximate exchange rates. Note: rates are approximate — use a live rates service for real transactions.',
  category: 'math',
  subcategory: 'conversions',
  tags: ['currency', 'exchange rate', 'forex', 'money', 'international'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'amount', label: 'Amount', type: 'number', defaultValue: 100, min: 0.01, max: 1000000000, step: 0.01 },
    { name: 'fromCurrency', label: 'From Currency', type: 'select', defaultValue: 'USD', options: [{ label: 'USD — US Dollar', value: 'USD' }, { label: 'EUR — Euro', value: 'EUR' }, { label: 'GBP — British Pound', value: 'GBP' }, { label: 'JPY — Japanese Yen', value: 'JPY' }, { label: 'CAD — Canadian Dollar', value: 'CAD' }, { label: 'AUD — Australian Dollar', value: 'AUD' }, { label: 'CHF — Swiss Franc', value: 'CHF' }, { label: 'CNY — Chinese Yuan', value: 'CNY' }, { label: 'MXN — Mexican Peso', value: 'MXN' }, { label: 'INR — Indian Rupee', value: 'INR' }] },
  ],
  calculate: (inputs) => {
    const amount = Number(inputs.amount);
    const from = String(inputs.fromCurrency);
    const toUSD: Record<string, number> = { USD: 1, EUR: 1.09, GBP: 1.27, JPY: 0.0067, CAD: 0.74, AUD: 0.65, CHF: 1.13, CNY: 0.138, MXN: 0.058, INR: 0.012 };
    const inUSD = amount * (toUSD[from] ?? 1);
    return {
      EUR: Math.round((inUSD / 1.09) * 100) / 100,
      GBP: Math.round((inUSD / 1.27) * 100) / 100,
      JPY: Math.round(inUSD / 0.0067),
      CAD: Math.round((inUSD / 0.74) * 100) / 100,
      AUD: Math.round((inUSD / 0.65) * 100) / 100,
      CHF: Math.round((inUSD / 1.13) * 100) / 100,
      USD: Math.round(inUSD * 100) / 100,
    };
  },
  outputs: [
    { name: 'USD', label: 'US Dollars (USD)', type: 'number', decimals: 2, highlight: true },
    { name: 'EUR', label: 'Euros (EUR)', type: 'number', decimals: 2 },
    { name: 'GBP', label: 'British Pounds (GBP)', type: 'number', decimals: 2 },
    { name: 'JPY', label: 'Japanese Yen (JPY)', type: 'number', decimals: 0 },
    { name: 'CAD', label: 'Canadian Dollars (CAD)', type: 'number', decimals: 2 },
    { name: 'AUD', label: 'Australian Dollars (AUD)', type: 'number', decimals: 2 },
    { name: 'CHF', label: 'Swiss Francs (CHF)', type: 'number', decimals: 2 },
  ],
  examples: [
    { title: '100 USD', description: '$100 in major currencies.', inputs: { amount: 100, fromCurrency: 'USD' } },
    { title: '1000 EUR', description: '€1,000 converted to USD and other currencies.', inputs: { amount: 1000, fromCurrency: 'EUR' } },
    { title: '50,000 JPY', description: '¥50,000 yen in dollars and euros.', inputs: { amount: 50000, fromCurrency: 'JPY' } },
  ],
  documentation: {
    overview: 'A quick multi-currency converter showing approximate values in 7 major currencies at once. Great for travel planning, budgeting, and international pricing estimates.',
    howToUse: ['Enter the amount to convert.', 'Select your source currency.', 'All target currencies update instantly.'],
    formula: 'All currencies first convert to USD, then to target currency using approximate rates.',
    faqs: [
      { question: 'Are these rates live?', answer: 'No, these rates are approximate and updated periodically. For real financial transactions, always use a live rate service such as XE.com or your bank\'s current rate.' },
    ],
  },
  relatedTools: ['trip-budget-planner', 'percentage-calculator', 'inflation-calculator'],
};

export const speedConverter: ToolDefinition = {
  slug: 'speed-converter',
  title: 'Speed Converter',
  shortDescription: 'Convert speed between mph, kph, m/s, knots, and more.',
  description: 'Convert any speed measurement between miles per hour, kilometers per hour, meters per second, knots, and feet per second. Useful for travel, aviation, and physics.',
  category: 'math',
  subcategory: 'conversions',
  tags: ['speed', 'mph', 'kph', 'knots', 'velocity', 'unit conversion'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'value', label: 'Speed Value', type: 'number', defaultValue: 60, min: 0, max: 1000000, step: 0.1 },
    { name: 'fromUnit', label: 'From Unit', type: 'select', defaultValue: 'mph', options: [{ label: 'Miles per Hour (mph)', value: 'mph' }, { label: 'Kilometers per Hour (kph)', value: 'kph' }, { label: 'Meters per Second (m/s)', value: 'mps' }, { label: 'Knots (kn)', value: 'knots' }, { label: 'Feet per Second (fps)', value: 'fps' }] },
  ],
  calculate: (inputs) => {
    const v = Number(inputs.value);
    const unit = String(inputs.fromUnit);
    const toMps: Record<string, number> = { mph: 0.44704, kph: 0.277778, mps: 1, knots: 0.514444, fps: 0.3048 };
    const mps = v * (toMps[unit] ?? 1);
    return {
      mph: Math.round((mps / 0.44704) * 1000) / 1000,
      kph: Math.round((mps / 0.277778) * 1000) / 1000,
      mps: Math.round(mps * 10000) / 10000,
      knots: Math.round((mps / 0.514444) * 1000) / 1000,
      fps: Math.round((mps / 0.3048) * 1000) / 1000,
    };
  },
  outputs: [
    { name: 'mph', label: 'Miles per Hour (mph)', type: 'number', decimals: 3, highlight: true },
    { name: 'kph', label: 'Kilometers per Hour (kph)', type: 'number', decimals: 3 },
    { name: 'mps', label: 'Meters per Second (m/s)', type: 'number', decimals: 4 },
    { name: 'knots', label: 'Knots (kn)', type: 'number', decimals: 3 },
    { name: 'fps', label: 'Feet per Second (fps)', type: 'number', decimals: 3 },
  ],
  examples: [
    { title: 'Highway Speed', description: '60 mph in kph and other units.', inputs: { value: 60, fromUnit: 'mph' } },
    { title: 'Running Pace', description: 'World record marathon pace ~5.7 m/s.', inputs: { value: 5.7, fromUnit: 'mps' } },
    { title: 'Aircraft Speed', description: '500 knots in mph and kph.', inputs: { value: 500, fromUnit: 'knots' } },
  ],
  documentation: {
    overview: 'Convert any speed value between all common units instantly. Essential for drivers, pilots, athletes, and physics students.',
    howToUse: ['Enter the speed value.', 'Select your source unit.', 'All units convert simultaneously.'],
    formula: 'All conversions via meters per second: 1 mph = 0.44704 m/s, 1 kph = 0.277778 m/s, 1 knot = 0.514444 m/s',
    faqs: [
      { question: 'How do I convert mph to kph?', answer: 'Multiply mph by 1.60934. For a quick estimate, multiply by 1.6.' },
    ],
  },
  relatedTools: ['fuel-cost-estimator', 'length-converter', 'temperature-converter'],
};
