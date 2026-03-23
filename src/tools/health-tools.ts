import { ToolDefinition } from './types';

export const bmiCalculator: ToolDefinition = {
  slug: 'bmi-calculator',
  title: 'BMI Calculator',
  shortDescription: 'Calculate your Body Mass Index and understand your weight classification.',
  description: 'Calculate your BMI using US customary units (pounds and inches). See your classification, healthy weight range for your height, and context for interpreting your result.',
  category: 'health',
  subcategory: 'fitness',
  tags: ['bmi', 'body mass index', 'weight', 'health', 'obesity', 'underweight'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'weightLbs', label: 'Weight', type: 'number', defaultValue: 165, min: 10, max: 1000, step: 0.5, suffix: ' lbs' },
    { name: 'heightFt', label: 'Height — Feet', type: 'number', defaultValue: 5, min: 1, max: 8, step: 1, suffix: ' ft' },
    { name: 'heightIn', label: 'Height — Inches', type: 'number', defaultValue: 10, min: 0, max: 11, step: 1, suffix: ' in' },
    { name: 'age', label: 'Age', type: 'number', defaultValue: 30, min: 2, max: 120, step: 1, helpText: 'Used for context only' },
  ],
  calculate: (inputs) => {
    const weight = Number(inputs.weightLbs);
    const totalInches = Number(inputs.heightFt) * 12 + Number(inputs.heightIn);
    const bmi = totalInches > 0 ? (weight / (totalInches * totalInches)) * 703 : 0;
    const bmiRounded = Math.round(bmi * 10) / 10;

    let classification: string;
    if (bmi < 18.5) classification = 'Underweight';
    else if (bmi < 25) classification = 'Normal weight';
    else if (bmi < 30) classification = 'Overweight';
    else if (bmi < 35) classification = 'Obese (Class I)';
    else if (bmi < 40) classification = 'Obese (Class II)';
    else classification = 'Obese (Class III)';

    const healthyWeightLow = totalInches > 0 ? Math.round((18.5 * totalInches * totalInches) / 703) : 0;
    const healthyWeightHigh = totalInches > 0 ? Math.round((24.9 * totalInches * totalInches) / 703) : 0;

    return { bmi: bmiRounded, classification, healthyWeightLow, healthyWeightHigh };
  },
  outputs: [
    { name: 'bmi', label: 'BMI', type: 'number', decimals: 1, highlight: true, description: 'Body Mass Index' },
    { name: 'classification', label: 'Classification', type: 'text' },
    { name: 'healthyWeightLow', label: 'Healthy Weight Range — Low', type: 'number', decimals: 0, description: 'Minimum weight for Normal BMI at your height' },
    { name: 'healthyWeightHigh', label: 'Healthy Weight Range — High', type: 'number', decimals: 0, description: 'Maximum weight for Normal BMI at your height' },
  ],
  examples: [
    { title: 'Healthy Adult', description: '5\'10" person at 165 lbs — within normal range.', inputs: { weightLbs: 165, heightFt: 5, heightIn: 10, age: 35 } },
    { title: 'Underweight Example', description: '5\'8" person at 120 lbs.', inputs: { weightLbs: 120, heightFt: 5, heightIn: 8, age: 25 } },
    { title: 'Overweight Example', description: '5\'6" person at 200 lbs.', inputs: { weightLbs: 200, heightFt: 5, heightIn: 6, age: 45 } },
  ],
  documentation: {
    overview: 'Body Mass Index (BMI) is a simple ratio of weight to height squared, used as a screening tool for weight categories that may lead to health problems. It is not a diagnostic tool — it has known limitations, particularly for athletes and the elderly.',
    howToUse: [
      'Enter your weight in pounds.',
      'Enter your height in feet and inches.',
      'Review your BMI and classification.',
      'See the healthy weight range for your exact height.',
    ],
    formula: 'BMI = (Weight in lbs ÷ Height in inches²) × 703\nor\nBMI = Weight in kg ÷ Height in meters²',
    faqs: [
      { question: 'Is BMI an accurate measure of health?', answer: 'BMI is a useful population-level screening tool but has known limitations. It does not distinguish between muscle and fat, and may misclassify athletes (high muscle mass) or the elderly (low muscle mass). Use it as one data point alongside other health metrics.' },
      { question: 'What is a healthy BMI?', answer: 'The WHO defines 18.5–24.9 as "Normal weight." However, the optimal BMI may vary by age, sex, and ethnicity. For adults over 65, slightly higher BMI (25–27) may be protective.' },
    ],
  },
  relatedTools: ['calorie-needs-estimator', 'water-intake-calculator', 'savings-goal-calculator'],
};

export const calorieNeedsEstimator: ToolDefinition = {
  slug: 'calorie-needs-estimator',
  title: 'Calorie Needs Estimator',
  shortDescription: 'Calculate your daily calorie needs (TDEE) for weight loss, maintenance, or gain.',
  description: 'Using the Mifflin-St Jeor equation — the most accurate formula available — this tool calculates your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) based on your body stats and activity level.',
  category: 'health',
  subcategory: 'nutrition',
  tags: ['calories', 'tdee', 'bmr', 'nutrition', 'weight loss', 'diet', 'metabolism'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'weightLbs', label: 'Weight', type: 'number', defaultValue: 165, min: 50, max: 800, step: 1, suffix: ' lbs' },
    { name: 'heightIn', label: 'Total Height', type: 'number', defaultValue: 70, min: 36, max: 96, step: 0.5, suffix: ' inches', helpText: 'e.g. 5\'10" = 70 inches, 6\'0" = 72 inches' },
    { name: 'age', label: 'Age', type: 'number', defaultValue: 30, min: 15, max: 100, step: 1, suffix: ' years' },
    { name: 'sex', label: 'Biological Sex', type: 'select', defaultValue: 1, options: [{ label: 'Male', value: 1 }, { label: 'Female', value: 0 }] },
    { name: 'activityLevel', label: 'Activity Level', type: 'select', defaultValue: 1.375, options: [{ label: 'Sedentary (desk job, no exercise)', value: 1.2 }, { label: 'Lightly Active (light exercise 1–3×/week)', value: 1.375 }, { label: 'Moderately Active (moderate exercise 3–5×/week)', value: 1.55 }, { label: 'Very Active (hard exercise 6–7×/week)', value: 1.725 }, { label: 'Extra Active (very hard exercise, physical job)', value: 1.9 }] },
  ],
  calculate: (inputs) => {
    const weightLbs = Number(inputs.weightLbs);
    const heightIn = Number(inputs.heightIn);
    const age = Number(inputs.age);
    const isMale = Number(inputs.sex) === 1;
    const activityFactor = Number(inputs.activityLevel);

    const weightKg = weightLbs / 2.20462;
    const heightCm = heightIn * 2.54;

    const bmr = isMale
      ? (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
      : (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;

    const tdee = bmr * activityFactor;
    const weightLossCals = tdee - 500;
    const weightGainCals = tdee + 300;
    const aggressiveLoss = tdee - 1000;

    return {
      tdee: Math.round(tdee),
      bmr: Math.round(bmr),
      weightLossCals: Math.round(weightLossCals),
      weightGainCals: Math.round(weightGainCals),
      aggressiveLoss: Math.round(Math.max(1200, aggressiveLoss)),
    };
  },
  outputs: [
    { name: 'tdee', label: 'Daily Calorie Needs (TDEE)', type: 'number', decimals: 0, highlight: true, description: 'Calories to maintain current weight' },
    { name: 'bmr', label: 'Basal Metabolic Rate (BMR)', type: 'number', decimals: 0, description: 'Calories burned at complete rest' },
    { name: 'weightLossCals', label: 'Weight Loss Target', type: 'number', decimals: 0, description: 'TDEE − 500 cal/day = ~1 lb/week loss' },
    { name: 'weightGainCals', label: 'Weight Gain Target', type: 'number', decimals: 0, description: 'TDEE + 300 cal/day for lean gains' },
    { name: 'aggressiveLoss', label: 'Aggressive Loss Target', type: 'number', decimals: 0, description: 'TDEE − 1000 cal/day = ~2 lb/week (min 1200)' },
  ],
  examples: [
    { title: 'Active Male', description: 'Athletic 30-year-old male who exercises regularly.', inputs: { weightLbs: 180, heightIn: 72, age: 30, sex: 1, activityLevel: 1.55 } },
    { title: 'Sedentary Female', description: 'Desk-job woman looking to understand her baseline.', inputs: { weightLbs: 145, heightIn: 65, age: 35, sex: 0, activityLevel: 1.2 } },
    { title: 'Highly Active Female', description: 'Female athlete training 6 days per week.', inputs: { weightLbs: 135, heightIn: 67, age: 25, sex: 0, activityLevel: 1.725 } },
  ],
  documentation: {
    overview: 'Your TDEE (Total Daily Energy Expenditure) is the number of calories you burn each day accounting for your activity level. Eating at TDEE maintains weight; below it loses weight; above it gains weight. This calculator uses the Mifflin-St Jeor equation, which is the most validated formula for estimating BMR.',
    howToUse: [
      'Enter your weight in pounds.',
      'Enter your total height in inches (multiply feet × 12 then add extra inches).',
      'Enter your age and select your biological sex.',
      'Select the activity level that best matches your typical week.',
      'Use the resulting TDEE as your daily calorie target for weight maintenance.',
    ],
    formula: 'Male BMR = (10 × kg) + (6.25 × cm) − (5 × age) + 5\nFemale BMR = (10 × kg) + (6.25 × cm) − (5 × age) − 161\nTDEE = BMR × Activity Multiplier',
    faqs: [
      { question: 'How accurate is this estimate?', answer: 'The Mifflin-St Jeor equation is within ±10% for most adults. Activity multipliers are approximate — treat your TDEE as a starting point and adjust based on actual weight changes over 2–3 weeks.' },
      { question: 'Should I eat at TDEE or below?', answer: 'For maintenance: TDEE. For fat loss: TDEE minus 300–500 calories/day (0.5–1 lb/week). For muscle gain: TDEE plus 200–300 calories/day. Deficits larger than 1000 cal/day risk muscle loss.' },
    ],
  },
  relatedTools: ['bmi-calculator', 'water-intake-calculator', 'savings-goal-calculator'],
};

export const waterIntakeCalculator: ToolDefinition = {
  slug: 'water-intake-calculator',
  title: 'Water Intake Calculator',
  shortDescription: 'Calculate your daily water intake needs based on weight, activity, and climate.',
  description: 'Get a personalized daily water intake recommendation based on your body weight, activity level, and climate conditions. See your target in ounces, cups, liters, and standard water bottles.',
  category: 'health',
  subcategory: 'nutrition',
  tags: ['water', 'hydration', 'daily water intake', 'health', 'water needs'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'weightLbs', label: 'Body Weight', type: 'number', defaultValue: 165, min: 30, max: 800, step: 1, suffix: ' lbs' },
    { name: 'activityLevel', label: 'Activity Level', type: 'select', defaultValue: 1.0, options: [{ label: 'Sedentary (little or no exercise)', value: 1.0 }, { label: 'Moderately Active (exercise 3–5 days/week)', value: 1.3 }, { label: 'Very Active (intense daily exercise)', value: 1.6 }] },
    { name: 'climate', label: 'Climate / Environment', type: 'select', defaultValue: 0, options: [{ label: 'Temperate / Indoor', value: 0 }, { label: 'Hot or Humid', value: 1 }, { label: 'Dry / High Altitude', value: 2 }] },
    { name: 'pregnancyFactor', label: 'Special Condition', type: 'select', defaultValue: 0, options: [{ label: 'None', value: 0 }, { label: 'Pregnant (+10%)', value: 0.1 }, { label: 'Breastfeeding (+25%)', value: 0.25 }] },
  ],
  calculate: (inputs) => {
    const weight = Number(inputs.weightLbs);
    const activity = Number(inputs.activityLevel);
    const climate = Number(inputs.climate);
    const special = Number(inputs.pregnancyFactor);

    const baselineOz = weight * 0.5;
    const activityAdjusted = baselineOz * activity;
    const climateBonus = climate === 0 ? 0 : climate === 1 ? weight * 0.05 : weight * 0.03;
    const subtotal = activityAdjusted + climateBonus;
    const dailyOz = subtotal * (1 + special);

    const dailyCups = dailyOz / 8;
    const dailyLiters = dailyOz * 0.0295735;
    const dailyBottles = dailyOz / 16.9;

    return {
      dailyOz: Math.round(dailyOz),
      dailyCups: Math.round(dailyCups * 10) / 10,
      dailyLiters: Math.round(dailyLiters * 10) / 10,
      dailyBottles: Math.round(dailyBottles * 10) / 10,
    };
  },
  outputs: [
    { name: 'dailyOz', label: 'Daily Water (fl oz)', type: 'number', decimals: 0, highlight: true, description: 'Recommended daily fluid intake' },
    { name: 'dailyCups', label: 'In Cups', type: 'number', decimals: 1, description: '8 fl oz per cup' },
    { name: 'dailyLiters', label: 'In Liters', type: 'number', decimals: 1 },
    { name: 'dailyBottles', label: 'Standard Water Bottles', type: 'number', decimals: 1, description: '16.9 oz (500 ml) bottles' },
  ],
  examples: [
    { title: 'Average Active Adult', description: '165 lbs, moderately active, temperate climate.', inputs: { weightLbs: 165, activityLevel: 1.3, climate: 0, pregnancyFactor: 0 } },
    { title: 'Hot Climate Athlete', description: '185 lbs, very active, working out in the heat.', inputs: { weightLbs: 185, activityLevel: 1.6, climate: 1, pregnancyFactor: 0 } },
    { title: 'Sedentary Office Worker', description: '140 lbs, desk job, air-conditioned office.', inputs: { weightLbs: 140, activityLevel: 1.0, climate: 0, pregnancyFactor: 0 } },
  ],
  documentation: {
    overview: 'Staying hydrated is one of the simplest ways to maintain energy, focus, and physical performance. This calculator provides a personalized daily target based on your body weight and lifestyle factors — going beyond the generic "8 glasses a day" rule.',
    howToUse: [
      'Enter your body weight.',
      'Select your typical activity level.',
      'Choose your climate or environment.',
      'Select any special conditions that apply.',
      'Review your daily water target in multiple units.',
    ],
    formula: 'Baseline = Weight (lbs) × 0.5 oz\nActivity Adjusted = Baseline × Activity Factor\nClimate Bonus = Weight × 0.03–0.05 oz\nDaily Total = (Activity Adjusted + Climate Bonus) × Special Factor',
    faqs: [
      { question: 'Does coffee and tea count toward daily intake?', answer: 'Yes, all beverages — including coffee and tea — count toward your daily fluid intake. Caffeinated drinks are mild diuretics, but studies show the net hydration effect is still positive.' },
      { question: 'Are these targets for water only or all fluids?', answer: 'These targets represent total daily fluid intake from all sources — water, beverages, and the water content in foods (which contributes about 20% of daily intake for most people).' },
    ],
  },
  relatedTools: ['bmi-calculator', 'calorie-needs-estimator', 'focus-time-estimator'],
};
