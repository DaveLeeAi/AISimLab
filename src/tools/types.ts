export type FieldType = 'currency' | 'percentage' | 'number' | 'select' | 'slider' | 'text';
export type AccessLevel = 'free' | 'pro';
export type ToolStatus = 'live' | 'beta' | 'coming_soon' | 'draft';
export type OutputType = 'number' | 'currency' | 'percentage' | 'text';

export interface SelectOption {
  label: string;
  value: number | string;
}

export interface InputField {
  name: string;
  label: string;
  type: FieldType;
  defaultValue: number | string;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  options?: SelectOption[];
  helpText?: string;
}

export interface OutputField {
  name: string;
  label: string;
  type: OutputType;
  highlight?: boolean;
  description?: string;
  decimals?: number;
}

export interface ToolExample {
  title: string;
  description: string;
  inputs: Record<string, number | string>;
}

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolDocumentation {
  overview: string;
  howToUse: string[];
  formula: string;
  faqs: ToolFAQ[];
}

export interface ToolDefinition {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
  accessLevel: AccessLevel;
  status: ToolStatus;
  inputs: InputField[];
  calculate: (inputs: Record<string, number | string>) => Record<string, number | string>;
  outputs: OutputField[];
  examples: ToolExample[];
  documentation: ToolDocumentation;
  relatedTools: string[];
}
