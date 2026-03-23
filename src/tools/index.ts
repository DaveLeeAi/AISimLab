import { ToolDefinition } from './types';
import { mortgageCalculator } from './mortgage-calculator';
import { compoundInterestCalculator } from './compound-interest-calculator';
import { breakEvenAnalysis } from './break-even-analysis';
import {
  tipCalculator,
  savingsGoalCalculator,
  emergencyFundCalculator,
  budgetPlanner,
  investmentReturnCalculator,
} from './finance-tools';
import {
  loanAffordabilityCalculator,
  debtPayoffPlanner,
  retirementSavingsCalculator,
} from './loan-debt-tools';
import {
  profitMarginCalculator,
  startupRunwayCalculator,
  cacCalculator,
  markupMarginCalculator,
} from './business-tools';
import {
  hourlyRateCalculator,
  focusTimeEstimator,
  workingHoursCalculator,
} from './productivity-tools';
import {
  meetingCostCalculator,
  projectCostEstimator,
  tripBudgetPlanner,
  fuelCostEstimator,
} from './planning-tools';
import {
  percentageCalculator,
  temperatureConverter,
} from './math-tools';
import {
  bmiCalculator,
  calorieNeedsEstimator,
  waterIntakeCalculator,
} from './health-tools';
import {
  cdCalculator,
  rentVsBuyCalculator,
  socialSecurityCalculator,
  inflationCalculator,
} from './finance-tools-2';
import {
  pricingStrategyCalculator,
  salesTaxCalculator,
  employeeCostCalculator,
  roiCalculator,
} from './business-tools-2';
import {
  salaryToHourlyCalculator,
  deadlineCalculator,
  timeValueCalculator,
  ptoCalculator,
} from './productivity-tools-2';
import {
  homeRenovationCalculator,
  weddingBudgetCalculator,
  movingCostCalculator,
  eventBudgetCalculator,
} from './planning-tools-2';
import {
  weightConverter,
  lengthConverter,
  currencyConverter,
  speedConverter,
} from './converter-tools';
import {
  idealWeightCalculator,
  sleepCalculator,
  heartRateCalculator,
  pregnancyDueDateCalculator,
} from './health-tools-2';

const allTools: ToolDefinition[] = [
  mortgageCalculator,
  compoundInterestCalculator,
  breakEvenAnalysis,
  tipCalculator,
  savingsGoalCalculator,
  emergencyFundCalculator,
  budgetPlanner,
  investmentReturnCalculator,
  loanAffordabilityCalculator,
  debtPayoffPlanner,
  retirementSavingsCalculator,
  profitMarginCalculator,
  startupRunwayCalculator,
  cacCalculator,
  markupMarginCalculator,
  hourlyRateCalculator,
  focusTimeEstimator,
  workingHoursCalculator,
  meetingCostCalculator,
  projectCostEstimator,
  tripBudgetPlanner,
  fuelCostEstimator,
  percentageCalculator,
  temperatureConverter,
  bmiCalculator,
  calorieNeedsEstimator,
  waterIntakeCalculator,
  cdCalculator,
  rentVsBuyCalculator,
  socialSecurityCalculator,
  inflationCalculator,
  pricingStrategyCalculator,
  salesTaxCalculator,
  employeeCostCalculator,
  roiCalculator,
  salaryToHourlyCalculator,
  deadlineCalculator,
  timeValueCalculator,
  ptoCalculator,
  homeRenovationCalculator,
  weddingBudgetCalculator,
  movingCostCalculator,
  eventBudgetCalculator,
  weightConverter,
  lengthConverter,
  currencyConverter,
  speedConverter,
  idealWeightCalculator,
  sleepCalculator,
  heartRateCalculator,
  pregnancyDueDateCalculator,
];

export const TOOL_DEFINITIONS: Record<string, ToolDefinition> = Object.fromEntries(
  allTools.map((t) => [t.slug, t])
);

export function getToolDefinition(slug: string): ToolDefinition | undefined {
  return TOOL_DEFINITIONS[slug];
}
