import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Zap } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { SearchBar } from '../ui/SearchBar';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 10); }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 bg-slate-900 transition-shadow ${scrolled ? 'shadow-lg' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <Zap className="w-6 h-6 text-blue-400" />
            AISimuLab
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/tools" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 transition-colors">
              All Tools
            </Link>
            <div className="relative group">
              <button className="flex items-center gap-1 text-slate-300 hover:text-white px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 transition-colors">
                Categories <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => navigate(`/tools/${cat.slug}`)}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          <div className="hidden lg:block w-64">
            <SearchBar />
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-slate-300 hover:text-white p-2">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-slate-800 border-t border-slate-700 px-4 py-4 space-y-2">
          <SearchBar className="mb-3" />
          <Link to="/tools" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white py-2 text-sm font-medium">All Tools</Link>
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} to={`/tools/${cat.slug}`} onClick={() => setMenuOpen(false)} className="block text-slate-400 hover:text-white py-1.5 text-sm pl-2">
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
