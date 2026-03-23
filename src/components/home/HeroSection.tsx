import { Link } from 'react-router-dom';
import { SearchBar } from '../ui/SearchBar';
import { ArrowRight, Calculator, TrendingUp, Heart, Briefcase } from 'lucide-react';
import { getLiveTools } from '../../data/toolRegistry';
import { CATEGORIES } from '../../data/categories';

const QUICK_LINKS = [
  { label: 'Mortgage', slug: 'mortgage-calculator', cat: 'finance' },
  { label: 'BMI', slug: 'bmi-calculator', cat: 'health' },
  { label: 'Budget', slug: 'budget-planner', cat: 'finance' },
  { label: 'ROI', slug: 'roi-calculator', cat: 'business' },
  { label: 'Calories', slug: 'calorie-needs-estimator', cat: 'health' },
  { label: 'Retirement', slug: 'retirement-savings-calculator', cat: 'finance' },
];

export function HeroSection() {
  const liveCount = getLiveTools().length;
  const catCount = CATEGORIES.length;

  return (
    <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-20 sm:py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs text-blue-300 font-medium mb-6">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          {liveCount} live tools · always free
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-tight">
          Smart calculators for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
            every decision
          </span>
        </h1>

        <p className="text-slate-300 text-lg sm:text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
          Finance, business, health, planning, and more. Instant answers with no sign-up required.
        </p>

        <div className="max-w-xl mx-auto mb-6">
          <SearchBar placeholder={`Search ${liveCount}+ calculators and simulators...`} className="text-base" />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {QUICK_LINKS.map((l) => (
            <Link
              key={l.slug}
              to={`/tools/${l.cat}/${l.slug}`}
              className="text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 rounded-full px-3 py-1.5 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-400" />
            <span><strong className="text-white">{liveCount}+</strong> Tools</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span><strong className="text-white">{catCount}</strong> Categories</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <span><strong className="text-white">100%</strong> Free</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-orange-400" />
            <span><strong className="text-white">No</strong> Sign-up</span>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pb-8">
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/tools/${cat.slug}`}
              className="group flex items-center gap-2 bg-slate-800/60 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-xl px-4 py-2.5 transition-all"
            >
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{cat.name}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
