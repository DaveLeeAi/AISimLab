import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <Zap className="w-5 h-5 text-blue-400" />
              AISimuLab
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Smart calculators and simulation tools for everyday decisions.
            </p>
          </div>

          <div>
            <h4 className="text-slate-300 font-semibold text-sm mb-3">Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tools" className="hover:text-white transition-colors">All Tools</Link></li>
              <li><Link to="/tools/finance" className="hover:text-white transition-colors">Finance</Link></li>
              <li><Link to="/tools/business" className="hover:text-white transition-colors">Business</Link></li>
              <li><Link to="/tools/health" className="hover:text-white transition-colors">Health</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-300 font-semibold text-sm mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/tools/${cat.slug}`} className="hover:text-white transition-colors">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-300 font-semibold text-sm mb-3">More</h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.slice(5).map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/tools/${cat.slug}`} className="hover:text-white transition-colors">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} AISimuLab. All results are estimates only.
          </p>
        </div>
      </div>
    </footer>
  );
}
