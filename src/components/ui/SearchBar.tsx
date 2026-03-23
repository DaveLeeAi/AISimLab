import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ArrowRight, Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchTools, ToolMeta } from '../../data/toolRegistry';
import { trackSearchClick } from '../../lib/analytics';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const RECENT_KEY = 'asl_recent_searches';

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function addRecentSearch(q: string) {
  try {
    const existing = getRecentSearches().filter((s) => s !== q);
    const updated = [q, ...existing].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {
  }
}

export function SearchBar({ placeholder = 'Search calculators...', className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ToolMeta[]>([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length > 1) {
      const res = searchTools(query);
      setResults(res);
      setOpen(true);
      setActiveIndex(-1);
    } else {
      setResults([]);
      if (focused && query.length === 0) {
        setOpen(true);
        setRecentSearches(getRecentSearches());
      } else {
        setOpen(false);
      }
    }
  }, [query, focused]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = useCallback(
    (tool: ToolMeta, q: string) => {
      addRecentSearch(q || tool.title);
      trackSearchClick(tool.slug, q);
      setQuery('');
      setOpen(false);
      setFocused(false);
      navigate(`/tools/${tool.category}/${tool.slug}`);
    },
    [navigate]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        addRecentSearch(query.trim());
        setOpen(false);
        setFocused(false);
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        setQuery('');
      }
    },
    [query, navigate]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && results[activeIndex]) {
        e.preventDefault();
        handleSelect(results[activeIndex], query);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setFocused(false);
      inputRef.current?.blur();
    }
  }

  const showRecent = focused && query.length === 0 && recentSearches.length > 0;
  const showResults = query.length > 1 && results.length > 0;
  const showEmpty = query.length > 1 && results.length === 0;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setFocused(true);
              setRecentSearches(getRecentSearches());
              if (query.length === 0) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setOpen(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {open && (showRecent || showResults || showEmpty) && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
          {showRecent && (
            <div>
              <div className="px-4 pt-3 pb-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Recent</span>
              </div>
              {recentSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); inputRef.current?.focus(); }}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors"
                >
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-600">{s}</span>
                </button>
              ))}
              <div className="h-px bg-slate-100 mx-4 my-1" />
              <button
                onClick={() => navigate('/tools')}
                className="w-full text-left px-4 py-2.5 flex items-center justify-between text-sm text-blue-600 font-medium hover:bg-slate-50 transition-colors"
              >
                <span>Browse all tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {showResults && (
            <>
              <div className="px-4 pt-3 pb-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tools</span>
              </div>
              {results.map((tool, idx) => (
                <button
                  key={tool.slug}
                  onClick={() => handleSelect(tool, query)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-slate-50 last:border-b-0 ${activeIndex === idx ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">{tool.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">{tool.shortDescription}</div>
                  </div>
                  <span className="shrink-0 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded capitalize">{tool.category}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  addRecentSearch(query);
                  navigate(`/search?q=${encodeURIComponent(query)}`);
                  setQuery('');
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 flex items-center justify-between bg-slate-50 text-sm text-blue-600 font-medium hover:bg-slate-100 transition-colors"
              >
                <span>See all results for "{query}"</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {showEmpty && (
            <div className="px-4 py-4 text-sm text-slate-500">
              No tools found for <span className="font-medium text-slate-700">"{query}"</span>
              <button
                onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
                className="ml-2 text-blue-600 hover:underline"
              >
                Search anyway
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
