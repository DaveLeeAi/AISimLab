import { useParams, Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { ToolCard } from '../components/tools/ToolCard';
import { getCategoryBySlug, COLOR_MAP, CATEGORIES } from '../data/categories';
import { getToolsByCategory, ToolMeta } from '../data/toolRegistry';
import { trackCategoryVisit } from '../lib/analytics';
import { TrendingUp, Briefcase, Map, Zap, Calculator, Heart, Atom, GitBranch, Search, X, ArrowRight } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, Briefcase, Map, Zap, Calculator, Heart, Atom, GitBranch,
};

type SortOption = 'default' | 'alpha' | 'alpha-desc';

function sortTools(tools: ToolMeta[], sort: SortOption): ToolMeta[] {
  if (sort === 'alpha') return [...tools].sort((a, b) => a.title.localeCompare(b.title));
  if (sort === 'alpha-desc') return [...tools].sort((a, b) => b.title.localeCompare(a.title));
  return tools;
}

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const cat = getCategoryBySlug(category ?? '');
  const allTools = getToolsByCategory(category ?? '');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('default');
  const [selectedSubcat, setSelectedSubcat] = useState('');

  useEffect(() => {
    if (category) trackCategoryVisit(category);
  }, [category]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return allTools.filter((t) => {
      const matchesQuery = !q || t.title.toLowerCase().includes(q) || t.shortDescription.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchesSubcat = !selectedSubcat || t.subcategory === selectedSubcat;
      return matchesQuery && matchesSubcat;
    });
  }, [allTools, query, selectedSubcat]);

  const liveTools = useMemo(() => sortTools(filtered.filter((t) => t.status === 'live'), sort), [filtered, sort]);
  const comingTools = filtered.filter((t) => t.status === 'coming_soon');

  const relatedCategories = CATEGORIES.filter((c) => c.slug !== category).slice(0, 4);

  if (!cat) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Category not found</h1>
          <Link to="/tools" className="text-blue-600 hover:underline">Browse all tools</Link>
        </div>
      </Layout>
    );
  }

  const Icon = ICON_MAP[cat.icon] ?? Calculator;
  const colors = COLOR_MAP[cat.color];

  return (
    <Layout>
      <div className={`${colors.bg} border-b ${colors.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="text-xs text-slate-500 mb-4 flex items-center gap-1">
            <Link to="/" className="hover:text-slate-700">Home</Link>
            <span>/</span>
            <Link to="/tools" className="hover:text-slate-700">Tools</Link>
            <span>/</span>
            <span className={colors.text}>{cat.name}</span>
          </nav>
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
              <Icon className={`w-7 h-7 ${colors.icon}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{cat.name}</h1>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}>
                  {liveTools.length} live
                </span>
              </div>
              <p className="text-slate-600 mt-1">{cat.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            <button
              onClick={() => setSelectedSubcat('')}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${!selectedSubcat ? `${colors.badge} ${colors.border}` : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
              All
            </button>
            {cat.subcategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => setSelectedSubcat(selectedSubcat === sub.slug ? '' : sub.slug)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${selectedSubcat === sub.slug ? `${colors.badge} ${colors.border}` : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${cat.name} tools...`}
              className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Sort: Default</option>
            <option value="alpha">A → Z</option>
            <option value="alpha-desc">Z → A</option>
          </select>
        </div>

        {query && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-3">No tools found for "{query}"</p>
            <button onClick={() => setQuery('')} className="text-blue-600 hover:underline text-sm">Clear search</button>
          </div>
        )}

        {liveTools.length > 0 && (
          <div className="mb-10">
            <h2 className="text-base font-semibold text-slate-700 mb-4">
              {query ? `Results (${liveTools.length})` : `Live Tools (${liveTools.length})`}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {liveTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
            </div>
          </div>
        )}

        {!query && comingTools.length > 0 && (
          <div className="mb-10">
            <h2 className="text-base font-semibold text-slate-400 mb-4">Coming Soon ({comingTools.length})</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {comingTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
            </div>
          </div>
        )}

        {relatedCategories.length > 0 && (
          <div className="mt-12 border-t border-slate-100 pt-10">
            <h2 className="text-base font-semibold text-slate-700 mb-4">Explore More Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedCategories.map((relCat) => {
                const RelIcon = ICON_MAP[relCat.icon] ?? Calculator;
                const relColors = COLOR_MAP[relCat.color];
                return (
                  <Link
                    key={relCat.slug}
                    to={`/tools/${relCat.slug}`}
                    className={`group flex items-center gap-3 p-4 rounded-xl border ${relColors.border} ${relColors.bg} hover:shadow-sm transition-all`}
                  >
                    <RelIcon className={`w-5 h-5 ${relColors.icon} shrink-0`} />
                    <span className={`text-sm font-medium ${relColors.text} group-hover:underline`}>{relCat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors ml-auto shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
