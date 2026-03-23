import { Link } from 'react-router-dom';
import { TrendingUp, Briefcase, Map, Zap, Calculator, Heart, Atom, GitBranch } from 'lucide-react';
import { CATEGORIES, COLOR_MAP } from '../../data/categories';

const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, Briefcase, Map, Zap, Calculator, Heart, Atom, GitBranch,
};

export function CategoryGrid() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Browse by Category</h2>
          <p className="text-slate-500">Find the right tool for any situation</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] ?? Calculator;
            const colors = COLOR_MAP[cat.color];
            return (
              <Link
                key={cat.slug}
                to={`/tools/${cat.slug}`}
                className={`group flex flex-col items-center text-center p-6 rounded-xl border-2 ${colors.border} ${colors.bg} hover:shadow-md transition-all duration-200`}
              >
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <h3 className={`font-semibold text-sm ${colors.text}`}>{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{cat.description.split('.')[0]}.</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
