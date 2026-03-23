import { SlidersHorizontal, BarChart3, BookOpen } from 'lucide-react';

const steps = [
  { icon: SlidersHorizontal, title: 'Enter your numbers', description: 'Fill in the inputs with your real values. Defaults are provided to get you started fast.' },
  { icon: BarChart3, title: 'Get instant results', description: 'Results update in real-time as you type. No submit button, no waiting.' },
  { icon: BookOpen, title: 'Understand the math', description: 'Each tool includes formulas, examples, and FAQs so you know exactly what the numbers mean.' },
];

export function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">How it works</h2>
        <p className="text-slate-500 mb-10">Every tool follows the same simple pattern</p>
        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <step.icon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
