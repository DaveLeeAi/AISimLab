import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { TOOL_REGISTRY, ToolMeta } from '../data/toolRegistry';
import { CATEGORIES } from '../data/categories';
import { trackSearch } from '../lib/analytics';
import { Search, X, SlidersHorizontal } from 'lucide-react';

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'live' | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query);
      if (query) {
        setSearchParams({ q: query }, { replace: true });
        trackSearch(query);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, setSearchParams]);

  const results = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    return TOOL_REGISTRY.filter((t: ToolMeta) => {
      if (!q) return false;
      const matchesQuery =
        t.title.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q) ||
        t.slug.replace(/-/g, ' ').includes(q);
      const matchesCat = !selectedCategory || t.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;
      return matchesQuery && matchesCat && matchesStatus;
    });
  }, [debouncedQuery, selectedCategory, selectedStatus]);

  const livCount = results.filter((t) => t.status === 'live').length;
  const allCount = results.length;

  const suggestions = useMemo(() => {
    if (debouncedQuery.length > 1) return [];
    return ['mortgage', 'bmi', 'budget', 'retirement', 'tip calculator', 'loan', 'calories', 'inflation'];
  }, [debouncedQuery]);

  return (
    <Layout>
      <div className="bg-slate-900 text-white py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-5 text-center">Search Tools</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 50+ calculators and simulators..."
              className="w-full pl-12 pr-12 py-4 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setDebouncedQuery(''); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {suggestions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              <span className="text-slate-400 text-sm">Try:</span>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="text-sm text-blue-300 hover:text-blue-200 bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-full border border-slate-700 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {debouncedQuery && (
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <p className="text-slate-600 text-sm">
                <span className="font-semibold text-slate-900">{allCount}</span> result{allCount !== 1 ? 's' : ''} for{' '}
                <span className="font-semibold text-slate-900">"{debouncedQuery}"</span>
                {livCount < allCount && <span className="text-slate-400 ml-1">({livCount} live)</span>}
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        )}

        {showFilters && debouncedQuery && (
          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as 'live' | 'all')}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="live">Live Only</option>
              </select>
            </div>
            {(selectedCategory || selectedStatus !== 'all') && (
              <button
                onClick={() => { setSelectedCategory(''); setSelectedStatus('all'); }}
                className="self-end text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>
        )}

        {!debouncedQuery && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">Search for a tool</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">Type a keyword above to find the right calculator or simulator instantly.</p>
          </div>
        )}

        {debouncedQuery && results.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">No tools found</h2>
            <p className="text-slate-500 text-sm mb-6">No results for "{debouncedQuery}". Try a different keyword.</p>
            <Link to="/tools" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Browse all tools
            </Link>
          </div>
        )}

        {debouncedQuery && results.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((tool) => (
              <SearchResultCard key={tool.slug} tool={tool} query={debouncedQuery} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function SearchResultCard({ tool, query }: { tool: ToolMeta; query: string }) {
  return (
    <Link
      to={`/tools/${tool.category}/${tool.slug}`}
      className="group flex flex-col bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-5"
    >
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug">
          {highlightMatch(tool.title, query)}
        </h3>
      </div>
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">
        {highlightMatch(tool.shortDescription, query)}
      </p>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">{tool.category}</span>
        {tool.status === 'live' && (
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Live</span>
        )}
        {tool.status === 'coming_soon' && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Soon</span>
        )}
      </div>
    </Link>
  );
}
