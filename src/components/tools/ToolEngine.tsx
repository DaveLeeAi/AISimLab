import { useState } from 'react';
import { ToolDefinition, InputField, OutputField } from '../../tools/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { RotateCcw } from 'lucide-react';

interface ToolEngineProps {
  tool: ToolDefinition;
}

function formatValue(value: number | string, output: OutputField): string {
  if (output.type === 'text') return String(value ?? '');
  const num = Number(value);
  if (isNaN(num)) return String(value);
  const decimals = output.decimals ?? 2;
  if (output.type === 'currency') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(num);
  }
  if (output.type === 'percentage') {
    return `${num.toFixed(decimals)}%`;
  }
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(num);
}

function InputControl({ field, value, onChange }: { field: InputField; value: number | string; onChange: (v: number | string) => void }) {
  if (field.type === 'select') {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {field.options?.map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>
          ))}
        </select>
        {field.helpText && <p className="text-xs text-slate-400 mt-1">{field.helpText}</p>}
      </div>
    );
  }

  if (field.type === 'slider') {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {field.label} — <span className="text-blue-600">{Number(value).toLocaleString()}{field.suffix ?? ''}</span>
        </label>
        <input
          type="range"
          min={field.min}
          max={field.max}
          step={field.step}
          value={Number(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{field.min}{field.suffix ?? ''}</span>
          <span>{field.max}{field.suffix ?? ''}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
      <div className="relative">
        {field.prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{field.prefix}</span>
        )}
        <input
          type="number"
          min={field.min}
          max={field.max}
          step={field.step}
          value={String(value)}
          onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
          className={`w-full border border-slate-200 rounded-lg py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${field.prefix ? 'pl-7 pr-3' : 'px-3'} ${field.suffix ? 'pr-10' : ''}`}
        />
        {field.suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{field.suffix}</span>
        )}
      </div>
      {field.helpText && <p className="text-xs text-slate-400 mt-1">{field.helpText}</p>}
    </div>
  );
}

function ResultsPanel({ outputs, results }: { outputs: OutputField[]; results: Record<string, number | string> }) {
  const highlighted = outputs.filter((o) => o.highlight);
  const regular = outputs.filter((o) => !o.highlight);

  return (
    <div className="space-y-4">
      {highlighted.map((output) => (
        <div key={output.name} className="bg-blue-600 rounded-xl p-6 text-white text-center">
          <div className="text-4xl font-bold tracking-tight mb-1">
            {formatValue(results[output.name] ?? 0, output)}
          </div>
          <div className="text-blue-100 text-sm font-medium">{output.label}</div>
          {output.description && <div className="text-blue-200 text-xs mt-1">{output.description}</div>}
        </div>
      ))}
      {regular.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {regular.map((output, i) => (
            <div key={output.name} className={`flex items-center justify-between px-4 py-3 ${i < regular.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div>
                <div className="text-sm font-medium text-slate-700">{output.label}</div>
                {output.description && <div className="text-xs text-slate-400">{output.description}</div>}
              </div>
              <div className="text-sm font-semibold text-slate-800 ml-4">
                {formatValue(results[output.name] ?? 0, output)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExamplesSection({ examples, onLoad }: { examples: ToolDefinition['examples']; onLoad: (inputs: Record<string, number | string>) => void }) {
  return (
    <div className="mt-8">
      <h3 className="text-base font-semibold text-slate-800 mb-3">Example Scenarios</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {examples.map((ex) => (
          <button
            key={ex.title}
            onClick={() => onLoad(ex.inputs)}
            className="text-left bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="text-sm font-semibold text-slate-800 mb-1">{ex.title}</div>
            <p className="text-xs text-slate-500 line-clamp-2">{ex.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

const DOC_TABS = ['Overview', 'How to Use', 'Formula', 'FAQ'] as const;

function DocumentationSection({ doc }: { doc: ToolDefinition['documentation'] }) {
  const [tab, setTab] = useState<typeof DOC_TABS[number]>('Overview');

  return (
    <div className="mt-8 bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-200 overflow-x-auto">
        {DOC_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${tab === t ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="p-5">
        {tab === 'Overview' && <p className="text-sm text-slate-600 leading-relaxed">{doc.overview}</p>}
        {tab === 'How to Use' && (
          <ol className="space-y-2">
            {doc.howToUse.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        )}
        {tab === 'Formula' && (
          <pre className="text-sm text-slate-700 bg-slate-50 rounded-lg p-4 whitespace-pre-wrap font-mono leading-relaxed">{doc.formula}</pre>
        )}
        {tab === 'FAQ' && (
          <div className="space-y-4">
            {doc.faqs.map((faq, i) => (
              <div key={i}>
                <p className="text-sm font-semibold text-slate-800 mb-1">{faq.question}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ToolEngine({ tool }: ToolEngineProps) {
  const defaultInputs = Object.fromEntries(tool.inputs.map((f) => [f.name, f.defaultValue]));
  const [inputs, setInputs] = useState<Record<string, number | string>>(defaultInputs);

  const results = tool.calculate(inputs);

  function setField(name: string, value: number | string) {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  function reset() {
    setInputs(defaultInputs);
  }

  return (
    <div>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-800">Inputs</h2>
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>
          </div>
          <div className="space-y-4">
            {tool.inputs.map((field) => (
              <InputControl
                key={field.name}
                field={field}
                value={inputs[field.name] ?? field.defaultValue}
                onChange={(v) => setField(field.name, v)}
              />
            ))}
          </div>
          {tool.accessLevel === 'free' && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Badge variant="free">Free Tool</Badge>
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <ResultsPanel outputs={tool.outputs} results={results} />
        </div>
      </div>

      <ExamplesSection examples={tool.examples} onLoad={(ex) => setInputs(ex)} />
      <DocumentationSection doc={tool.documentation} />
    </div>
  );
}
