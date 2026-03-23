import { ToolDefinition } from './types';

export const idealWeightCalculator: ToolDefinition = {
  slug: 'ideal-weight-calculator',
  title: 'Ideal Weight Calculator',
  shortDescription: 'Calculate your ideal body weight range using multiple formulas.',
  description: 'Find your ideal weight range using four established medical formulas (Devine, Robinson, Miller, and Hamwi). See the range of expert recommendations for your height and sex.',
  category: 'health',
  subcategory: 'fitness',
  tags: ['ideal weight', 'body weight', 'target weight', 'healthy weight', 'fitness'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'heightFeet', label: 'Height (feet)', type: 'number', defaultValue: 5, min: 4, max: 7, step: 1, suffix: ' ft' },
    { name: 'heightInches', label: 'Height (inches)', type: 'number', defaultValue: 10, min: 0, max: 11, step: 1, suffix: ' in' },
    { name: 'sex', label: 'Sex', type: 'select', defaultValue: 'male', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }] },
  ],
  calculate: (inputs) => {
    const totalInches = Number(inputs.heightFeet) * 12 + Number(inputs.heightInches);
    const heightCm = totalInches * 2.54;
    const inchesOver5ft = totalInches - 60;
    const isMale = inputs.sex === 'male';
    const devine = isMale ? 50 + 2.3 * inchesOver5ft : 45.5 + 2.3 * inchesOver5ft;
    const robinson = isMale ? 52 + 1.9 * inchesOver5ft : 49 + 1.7 * inchesOver5ft;
    const miller = isMale ? 56.2 + 1.41 * inchesOver5ft : 53.1 + 1.36 * inchesOver5ft;
    const hamwi = isMale ? 48 + 2.7 * inchesOver5ft : 45.4 + 2.2 * inchesOver5ft;
    const averageKg = (devine + robinson + miller + hamwi) / 4;
    const averageLbs = averageKg * 2.20462;
    const minLbs = Math.min(devine, robinson, miller, hamwi) * 2.20462;
    const maxLbs = Math.max(devine, robinson, miller, hamwi) * 2.20462;
    return {
      averageLbs: Math.round(averageLbs),
      minLbs: Math.round(minLbs),
      maxLbs: Math.round(maxLbs),
      averageKg: Math.round(averageKg * 10) / 10,
      bmiHealthyMin: Math.round((18.5 * (heightCm / 100) ** 2) * 2.20462),
      bmiHealthyMax: Math.round((24.9 * (heightCm / 100) ** 2) * 2.20462),
    };
  },
  outputs: [
    { name: 'averageLbs', label: 'Ideal Weight (Average)', type: 'number', decimals: 0, highlight: true, description: 'Average of 4 medical formulas (lbs)' },
    { name: 'minLbs', label: 'Formula Range Low', type: 'number', decimals: 0, description: 'Lowest ideal weight across all formulas (lbs)' },
    { name: 'maxLbs', label: 'Formula Range High', type: 'number', decimals: 0, description: 'Highest ideal weight across all formulas (lbs)' },
    { name: 'averageKg', label: 'Ideal Weight (kg)', type: 'number', decimals: 1 },
    { name: 'bmiHealthyMin', label: 'BMI Healthy Min (lbs)', type: 'number', decimals: 0, description: 'BMI 18.5' },
    { name: 'bmiHealthyMax', label: 'BMI Healthy Max (lbs)', type: 'number', decimals: 0, description: 'BMI 24.9' },
  ],
  examples: [
    { title: '5\'10" Male', description: 'Average height American male.', inputs: { heightFeet: 5, heightInches: 10, sex: 'male' } },
    { title: '5\'5" Female', description: 'Average height American female.', inputs: { heightFeet: 5, heightInches: 5, sex: 'female' } },
    { title: '6\'0" Male', description: 'Tall male ideal weight range.', inputs: { heightFeet: 6, heightInches: 0, sex: 'male' } },
  ],
  documentation: {
    overview: 'Ideal body weight formulas were developed by medical researchers to estimate a healthy weight for a given height. Different formulas give slightly different results — the range between them reflects genuine uncertainty about the "ideal" weight.',
    howToUse: ['Enter your height in feet and inches.', 'Select your sex.', 'Review the average ideal weight across four formulas and the BMI-based healthy range.'],
    formula: 'Devine (Male): 50 kg + 2.3 kg per inch over 5 ft\nRobinson (Male): 52 kg + 1.9 kg per inch over 5 ft\nMiller (Male): 56.2 kg + 1.41 kg per inch over 5 ft\nHamwi (Male): 48 kg + 2.7 kg per inch over 5 ft\n(Female formulas use similar base weights)',
    faqs: [
      { question: 'Is ideal weight more accurate than BMI?', answer: 'These formulas share BMI\'s limitation of not accounting for body composition — a muscular athlete may weigh more than the "ideal" but be perfectly healthy. Use these as rough reference points, not rigid targets.' },
    ],
  },
  relatedTools: ['bmi-calculator', 'calorie-needs-estimator', 'water-intake-calculator'],
};

export const sleepCalculator: ToolDefinition = {
  slug: 'sleep-calculator',
  title: 'Sleep Calculator',
  shortDescription: 'Find the best bedtime or wake-up time based on sleep cycles.',
  description: 'Calculate the optimal time to wake up or go to bed based on 90-minute sleep cycles. Waking between cycles helps you feel more refreshed.',
  category: 'health',
  subcategory: 'wellness',
  tags: ['sleep', 'sleep cycle', 'bedtime', 'wake time', 'REM', 'rest'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'mode', label: 'I want to', type: 'select', defaultValue: 'wakeup', options: [{ label: 'Find my wake-up time (I know when I sleep)', value: 'wakeup' }, { label: 'Find my bedtime (I know when I wake up)', value: 'bedtime' }] },
    { name: 'targetHour', label: 'Target Time (hour)', type: 'number', defaultValue: 22, min: 0, max: 23, step: 1, suffix: ':00', helpText: '22 = 10 PM' },
    { name: 'targetMinute', label: 'Target Time (minutes)', type: 'number', defaultValue: 30, min: 0, max: 59, step: 15 },
    { name: 'sleepOnsetMinutes', label: 'Time to Fall Asleep', type: 'number', defaultValue: 15, min: 0, max: 60, step: 5, suffix: ' min' },
  ],
  calculate: (inputs) => {
    const mode = String(inputs.mode);
    const hour = Number(inputs.targetHour);
    const minute = Number(inputs.targetMinute);
    const onset = Number(inputs.sleepOnsetMinutes);
    const CYCLE = 90;
    const startMinutes = hour * 60 + minute;

    const results: Record<string, number | string> = {};
    if (mode === 'wakeup') {
      const asleepAt = startMinutes + onset;
      for (let c = 4; c <= 6; c++) {
        const wakeMin = (asleepAt + c * CYCLE) % (24 * 60);
        const wh = Math.floor(wakeMin / 60);
        const wm = wakeMin % 60;
        const ampm = wh >= 12 ? 'PM' : 'AM';
        const h12 = wh % 12 === 0 ? 12 : wh % 12;
        results[`cycle${c}`] = `${h12}:${String(wm).padStart(2, '0')} ${ampm} (${c} cycles, ${Math.round(c * 1.5 * 10) / 10} hrs)`;
      }
      results.cycles = 3;
    } else {
      for (let c = 4; c <= 6; c++) {
        const bedMin = ((startMinutes - onset - c * CYCLE) + 24 * 60) % (24 * 60);
        const bh = Math.floor(bedMin / 60);
        const bm = bedMin % 60;
        const ampm = bh >= 12 ? 'PM' : 'AM';
        const h12 = bh % 12 === 0 ? 12 : bh % 12;
        results[`cycle${c}`] = `${h12}:${String(bm).padStart(2, '0')} ${ampm} (${c} cycles, ${Math.round(c * 1.5 * 10) / 10} hrs)`;
      }
      results.cycles = 3;
    }
    results.recommendedSleep = '7–9 hours (5–6 cycles)';
    return results;
  },
  outputs: [
    { name: 'cycle4', label: '4 Cycles (6 hours)', type: 'text', highlight: false },
    { name: 'cycle5', label: '5 Cycles (7.5 hours)', type: 'text', highlight: true },
    { name: 'cycle6', label: '6 Cycles (9 hours)', type: 'text', highlight: false },
    { name: 'recommendedSleep', label: 'Recommended Duration', type: 'text' },
  ],
  examples: [
    { title: 'Sleeping at 10:30 PM', description: 'Find best wake-up times if you go to bed at 10:30 PM.', inputs: { mode: 'wakeup', targetHour: 22, targetMinute: 30, sleepOnsetMinutes: 15 } },
    { title: 'Wake at 6:30 AM', description: 'Find best bedtimes if you must wake at 6:30 AM.', inputs: { mode: 'bedtime', targetHour: 6, targetMinute: 30, sleepOnsetMinutes: 15 } },
    { title: 'Early Bird (Wake 5 AM)', description: 'Optimal bedtimes for a 5 AM wake-up.', inputs: { mode: 'bedtime', targetHour: 5, targetMinute: 0, sleepOnsetMinutes: 10 } },
  ],
  documentation: {
    overview: 'Sleep occurs in 90-minute cycles. Each cycle includes light sleep, deep sleep, and REM sleep. Waking at the end of a complete cycle — rather than in the middle of deep sleep — leaves you feeling more refreshed.',
    howToUse: ['Choose whether you know your sleep time or wake time.', 'Enter your target hour and minute.', 'Enter how long it typically takes you to fall asleep.', 'Choose the wake/bedtime that best fits your schedule.'],
    formula: 'Wake time = Sleep time + Onset time + (N × 90 minutes)\nBedtime = Wake time − Onset time − (N × 90 minutes)',
    faqs: [
      { question: 'How many sleep cycles do I need?', answer: 'Most adults need 5–6 complete cycles (7.5–9 hours). Athletes and growing teens may need 6+ cycles. Below 4 cycles (6 hours) on a regular basis is associated with reduced cognitive performance and health risks.' },
    ],
  },
  relatedTools: ['calorie-needs-estimator', 'water-intake-calculator', 'focus-time-estimator'],
};

export const heartRateCalculator: ToolDefinition = {
  slug: 'heart-rate-calculator',
  title: 'Target Heart Rate Calculator',
  shortDescription: 'Find your target heart rate zones for fat burn, cardio, and peak effort.',
  description: 'Calculate your maximum heart rate and target training zones based on age and fitness level. Use these zones to optimize workouts for fat burning, aerobic fitness, or peak performance.',
  category: 'health',
  subcategory: 'fitness',
  tags: ['heart rate', 'target heart rate', 'cardio', 'fat burn zone', 'VO2 max', 'fitness'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'age', label: 'Age', type: 'number', defaultValue: 35, min: 15, max: 90, step: 1, suffix: ' years' },
    { name: 'restingHR', label: 'Resting Heart Rate', type: 'number', defaultValue: 65, min: 40, max: 100, step: 1, suffix: ' bpm', helpText: 'Measure first thing in the morning' },
    { name: 'fitnessLevel', label: 'Fitness Level', type: 'select', defaultValue: 'average', options: [{ label: 'Beginner', value: 'beginner' }, { label: 'Average', value: 'average' }, { label: 'Athletic', value: 'athletic' }, { label: 'Elite', value: 'elite' }] },
  ],
  calculate: (inputs) => {
    const age = Number(inputs.age);
    const rhr = Number(inputs.restingHR);
    const maxHR = 220 - age;
    const hrr = maxHR - rhr;
    const fatBurnLow = Math.round(rhr + hrr * 0.50);
    const fatBurnHigh = Math.round(rhr + hrr * 0.60);
    const cardioLow = Math.round(rhr + hrr * 0.60);
    const cardioHigh = Math.round(rhr + hrr * 0.70);
    const anaerobicLow = Math.round(rhr + hrr * 0.80);
    const anaerobicHigh = Math.round(rhr + hrr * 0.90);
    const peakHigh = Math.round(rhr + hrr * 1.0);
    return {
      maxHR,
      fatBurnLow,
      fatBurnHigh,
      cardioLow,
      cardioHigh,
      anaerobicLow,
      anaerobicHigh,
      peakHigh,
    };
  },
  outputs: [
    { name: 'maxHR', label: 'Estimated Max Heart Rate', type: 'number', decimals: 0, highlight: true, description: 'bpm — upper limit for your age' },
    { name: 'fatBurnLow', label: 'Fat Burn Zone Low', type: 'number', decimals: 0, description: '50–60% max HR (bpm)' },
    { name: 'fatBurnHigh', label: 'Fat Burn Zone High', type: 'number', decimals: 0 },
    { name: 'cardioLow', label: 'Cardio Zone Low', type: 'number', decimals: 0, description: '60–70% max HR (bpm)' },
    { name: 'cardioHigh', label: 'Cardio Zone High', type: 'number', decimals: 0 },
    { name: 'anaerobicLow', label: 'Anaerobic Zone Low', type: 'number', decimals: 0, description: '80–90% max HR (bpm)' },
    { name: 'anaerobicHigh', label: 'Anaerobic Zone High', type: 'number', decimals: 0 },
  ],
  examples: [
    { title: '35-Year-Old Average Fitness', description: 'Standard training zones for a moderately active 35-year-old.', inputs: { age: 35, restingHR: 65, fitnessLevel: 'average' } },
    { title: 'Older Active Adult', description: '55-year-old with good resting heart rate of 58 bpm.', inputs: { age: 55, restingHR: 58, fitnessLevel: 'athletic' } },
    { title: 'Young Beginner', description: '25-year-old starting a workout program.', inputs: { age: 25, restingHR: 72, fitnessLevel: 'beginner' } },
  ],
  documentation: {
    overview: 'Heart rate zones help you train at the right intensity for your goal. Working in the fat burn zone (50–60%) maximizes fat oxidation. The cardio zone (60–70%) builds aerobic base. The anaerobic zone (80–90%) builds speed and power.',
    howToUse: ['Enter your age.', 'Enter your resting heart rate (best measured in the morning before getting up).', 'Select your fitness level.', 'Use the heart rate zones to guide your workout intensity.'],
    formula: 'Max HR = 220 − Age\nTarget HR = Resting HR + (Max HR − Resting HR) × Intensity %\n(Karvonen formula)',
    faqs: [
      { question: 'How do I measure my resting heart rate?', answer: 'Lie still for 5 minutes after waking up, then count your heartbeats for 60 seconds. For accuracy, measure on 3 consecutive days and average the results.' },
    ],
  },
  relatedTools: ['calorie-needs-estimator', 'bmi-calculator', 'water-intake-calculator'],
};

export const pregnancyDueDateCalculator: ToolDefinition = {
  slug: 'due-date-calculator',
  title: 'Pregnancy Due Date Calculator',
  shortDescription: 'Calculate estimated due date and current gestational week.',
  description: 'Calculate your estimated due date based on the first day of your last menstrual period (LMP) or conception date. Shows current gestational week and trimester.',
  category: 'health',
  subcategory: 'wellness',
  tags: ['pregnancy', 'due date', 'gestational age', 'LMP', 'trimester'],
  accessLevel: 'free',
  status: 'live',
  inputs: [
    { name: 'lmpDaysAgo', label: 'Days Since Last Period Started', type: 'number', defaultValue: 56, min: 1, max: 280, step: 1, suffix: ' days ago', helpText: 'Enter how many days ago your last menstrual period started' },
    { name: 'cycleLength', label: 'Average Cycle Length', type: 'number', defaultValue: 28, min: 21, max: 35, step: 1, suffix: ' days' },
  ],
  calculate: (inputs) => {
    const lmpDaysAgo = Number(inputs.lmpDaysAgo);
    const cycleAdj = Number(inputs.cycleLength) - 28;
    const gestationalDays = lmpDaysAgo;
    const gestationalWeeks = Math.floor(gestationalDays / 7);
    const gestationalDaysRemainder = gestationalDays % 7;
    const daysUntilDue = 280 + cycleAdj - gestationalDays;
    const weeksRemaining = Math.floor(Math.max(0, daysUntilDue) / 7);
    const trimester = gestationalWeeks < 14 ? 1 : gestationalWeeks < 28 ? 2 : 3;
    const percentComplete = Math.min(100, Math.round((gestationalDays / 280) * 100));
    return {
      gestationalWeeks,
      gestationalDaysRemainder,
      daysUntilDue: Math.max(0, daysUntilDue),
      weeksRemaining,
      trimester,
      percentComplete,
    };
  },
  outputs: [
    { name: 'gestationalWeeks', label: 'Gestational Age (weeks)', type: 'number', decimals: 0, highlight: true },
    { name: 'gestationalDaysRemainder', label: 'Plus Days', type: 'number', decimals: 0, description: 'Additional days beyond full weeks' },
    { name: 'daysUntilDue', label: 'Days Until Due Date', type: 'number', decimals: 0 },
    { name: 'weeksRemaining', label: 'Weeks Remaining', type: 'number', decimals: 0 },
    { name: 'trimester', label: 'Trimester', type: 'number', decimals: 0 },
    { name: 'percentComplete', label: 'Pregnancy Complete', type: 'percentage', decimals: 0 },
  ],
  examples: [
    { title: '8 Weeks Pregnant', description: 'LMP started 56 days ago, 28-day cycle.', inputs: { lmpDaysAgo: 56, cycleLength: 28 } },
    { title: 'Second Trimester', description: 'LMP started 16 weeks (112 days) ago.', inputs: { lmpDaysAgo: 112, cycleLength: 28 } },
    { title: 'Late Pregnancy', description: 'LMP started 36 weeks (252 days) ago.', inputs: { lmpDaysAgo: 252, cycleLength: 28 } },
  ],
  documentation: {
    overview: 'Naegele\'s rule has been used to calculate due dates for over 200 years. A typical pregnancy lasts 280 days (40 weeks) from the first day of the last menstrual period. Only about 5% of babies are born on their exact due date, but 80% are born within 2 weeks.',
    howToUse: ['Enter how many days ago your last menstrual period started.', 'Enter your average cycle length (adjusts calculation if different from 28 days).', 'See your current gestational age in weeks and days, and estimated days until delivery.'],
    formula: 'Estimated Due Date = LMP + 280 days + (Cycle Length − 28) days\nGestational Age = Days Since LMP',
    faqs: [
      { question: 'How accurate is this calculator?', answer: 'Due dates are estimates. Ultrasound dating in the first trimester is more accurate. This tool is for informational purposes — always work with your healthcare provider for medical guidance.' },
    ],
  },
  relatedTools: ['water-intake-calculator', 'calorie-needs-estimator', 'bmi-calculator'],
};
