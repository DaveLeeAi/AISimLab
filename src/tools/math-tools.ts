import { ToolDefinition } from './types';

export const percentageCalculator: ToolDefinition = {
  slug: 'percentage-calculator',
  title: 'Percentage Calculator',
  shortDescription: 'Solve any percentage problem — find a percentage, calculate change, or work backwards.',
  description: 'A multi-purpose percentage tool that simultaneously answers the five most common percentage questions: finding a percent of a value, working backwards, calculating percentage change, and more.',
  category: 'data',
  subcategory: 'converters',
  tags: ['percentage', 'percent', 'percent change', 'percent of', 'calculator', 'math'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'baseValue', label: 'Base Value (A)', type: 'number', defaultValue: 200, min: -1000000000, max: 1000000000, step: 1, helpText: 'Your starting or reference number' },
    { name: 'compareValue', label: 'Compare Value (B)', type: 'number', defaultValue: 250, min: -1000000000, max: 1000000000, step: 1, helpText: 'The value to compare against A' },
    { name: 'percentage', label: 'Percentage (P)', type: 'number', defaultValue: 20, min: -10000, max: 10000, step: 0.1, suffix: '%', helpText: 'The percentage to apply' },
  ],
  calculate: (inputs) => {
    const a = Number(inputs.baseValue);
    const b = Number(inputs.compareValue);
    const p = Number(inputs.percentage);

    const pOfA = (p / 100) * a;
    const aAsPercentOfB = b !== 0 ? (a / b) * 100 : 0;
    const percentChangeAtoB = a !== 0 ? ((b - a) / Math.abs(a)) * 100 : 0;
    const aIncreasedByP = a * (1 + p / 100);
    const aDecreasedByP = a * (1 - p / 100);

    return {
      pOfA: Math.round(pOfA * 10000) / 10000,
      aAsPercentOfB: Math.round(aAsPercentOfB * 100) / 100,
      percentChangeAtoB: Math.round(percentChangeAtoB * 100) / 100,
      aIncreasedByP: Math.round(aIncreasedByP * 10000) / 10000,
      aDecreasedByP: Math.round(aDecreasedByP * 10000) / 10000,
    };
  },
  outputs: [
    { name: 'pOfA', label: 'P% of A', type: 'number', decimals: 4, highlight: true, description: 'e.g. 20% of 200 = 40' },
    { name: 'aAsPercentOfB', label: 'A as % of B', type: 'percentage', decimals: 2, description: 'e.g. 200 is 80% of 250' },
    { name: 'percentChangeAtoB', label: '% Change from A to B', type: 'percentage', decimals: 2, description: 'Positive = increase, negative = decrease' },
    { name: 'aIncreasedByP', label: 'A increased by P%', type: 'number', decimals: 4, description: 'e.g. 200 + 20% = 240' },
    { name: 'aDecreasedByP', label: 'A decreased by P%', type: 'number', decimals: 4, description: 'e.g. 200 − 20% = 160' },
  ],
  examples: [
    { title: 'Sales Tax Calculation', description: 'Item costs $85 — what is the total with 8.5% tax?', inputs: { baseValue: 85, compareValue: 92.225, percentage: 8.5 } },
    { title: 'Price Increase', description: 'Product went from $40 to $52 — what percent increase?', inputs: { baseValue: 40, compareValue: 52, percentage: 30 } },
    { title: 'Discount Calculation', description: '$150 item with 25% off — what do you pay?', inputs: { baseValue: 150, compareValue: 112.5, percentage: 25 } },
  ],
  documentation: {
    overview: 'This calculator answers all common percentage questions at once using just three numbers. Enter your base value (A), a comparison value (B), and a percentage (P) to see five simultaneous results covering the most common use cases.',
    howToUse: [
      'Enter your base or starting value in field A.',
      'Enter a comparison or reference value in field B.',
      'Enter a percentage value in field P.',
      'All five calculations update instantly — read the ones relevant to your question.',
    ],
    formula: 'P% of A = A × (P ÷ 100)\nA as % of B = (A ÷ B) × 100\n% Change A→B = ((B − A) ÷ |A|) × 100\nA + P% = A × (1 + P/100)\nA − P% = A × (1 − P/100)',
    faqs: [
      { question: 'How do I calculate the percentage increase between two numbers?', answer: 'Enter the original number as A, the new number as B. The "% Change from A to B" output shows the increase or decrease.' },
      { question: 'How do I find what percentage one number is of another?', answer: 'Enter your number as A and the reference number as B. The "A as % of B" output gives the answer.' },
    ],
  },
  relatedTools: ['markup-margin-calculator', 'investment-return-calculator', 'break-even-analysis'],
};

export const temperatureConverter: ToolDefinition = {
  slug: 'temperature-converter',
  title: 'Temperature Converter',
  shortDescription: 'Convert any temperature between Celsius, Fahrenheit, and Kelvin instantly.',
  description: 'Enter a temperature in any scale and instantly see the equivalent in all three temperature scales: Celsius, Fahrenheit, and Kelvin. Includes common reference points for context.',
  category: 'science',
  subcategory: 'engineering',
  tags: ['temperature', 'celsius', 'fahrenheit', 'kelvin', 'converter', 'unit conversion'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'inputValue', label: 'Temperature Value', type: 'number', defaultValue: 100, min: -273.15, max: 1000000, step: 0.1 },
    { name: 'inputUnit', label: 'Input Unit', type: 'select', defaultValue: 'celsius', options: [{ label: 'Celsius (°C)', value: 'celsius' }, { label: 'Fahrenheit (°F)', value: 'fahrenheit' }, { label: 'Kelvin (K)', value: 'kelvin' }] },
  ],
  calculate: (inputs) => {
    const value = Number(inputs.inputValue);
    const unit = String(inputs.inputUnit);

    let celsius: number;
    if (unit === 'celsius') celsius = value;
    else if (unit === 'fahrenheit') celsius = (value - 32) * 5 / 9;
    else celsius = value - 273.15;

    const fahrenheit = celsius * 9 / 5 + 32;
    const kelvin = celsius + 273.15;

    let description = '';
    if (celsius <= 0) description = 'At or below freezing point of water';
    else if (celsius < 20) description = 'Cold — below room temperature';
    else if (celsius < 28) description = 'Comfortable room temperature range';
    else if (celsius < 40) description = 'Warm to hot — above room temperature';
    else if (celsius < 100) description = 'Hot — approaching boiling';
    else if (celsius === 100) description = 'Boiling point of water at sea level';
    else description = 'Above boiling point of water';

    return {
      celsius: Math.round(celsius * 10000) / 10000,
      fahrenheit: Math.round(fahrenheit * 10000) / 10000,
      kelvin: Math.round(kelvin * 10000) / 10000,
      description,
    };
  },
  outputs: [
    { name: 'fahrenheit', label: 'Fahrenheit (°F)', type: 'number', decimals: 2, highlight: true },
    { name: 'celsius', label: 'Celsius (°C)', type: 'number', decimals: 2 },
    { name: 'kelvin', label: 'Kelvin (K)', type: 'number', decimals: 2 },
    { name: 'description', label: 'Context', type: 'text' },
  ],
  examples: [
    { title: 'Body Temperature', description: 'Normal human body temperature: 37°C.', inputs: { inputValue: 37, inputUnit: 'celsius' } },
    { title: 'Oven Temperature', description: '375°F oven — common baking temperature.', inputs: { inputValue: 375, inputUnit: 'fahrenheit' } },
    { title: 'Absolute Zero', description: 'The coldest possible temperature: 0 Kelvin.', inputs: { inputValue: 0, inputUnit: 'kelvin' } },
  ],
  documentation: {
    overview: 'Temperature scales each have different uses: Celsius is the global standard, Fahrenheit is common in the US, and Kelvin is used in scientific contexts. This converter instantly shows all three simultaneously.',
    howToUse: [
      'Enter your temperature value.',
      'Select the input unit (Celsius, Fahrenheit, or Kelvin).',
      'All three scales update instantly.',
    ],
    formula: 'Celsius → Fahrenheit: F = (C × 9/5) + 32\nFahrenheit → Celsius: C = (F − 32) × 5/9\nCelsius → Kelvin: K = C + 273.15\nKelvin → Celsius: C = K − 273.15',
    faqs: [
      { question: 'What is absolute zero?', answer: 'Absolute zero (0 Kelvin, −273.15°C, −459.67°F) is the theoretical lowest possible temperature — the point at which all molecular motion stops.' },
      { question: 'Are Celsius and Centigrade the same?', answer: 'Yes. "Centigrade" was the original name for the scale. It was officially renamed "Celsius" in 1948 to honor Anders Celsius who developed it.' },
    ],
  },
  relatedTools: ['unit-converter', 'percentage-calculator', 'speed-distance-time'],
};
