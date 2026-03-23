import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ToolCard } from '../components/tools/ToolCard';
import { TOOL_REGISTRY, ToolMeta, getLiveTools } from '../data/toolRegistry';
import { CATEGORIES, COLOR_MAP } from '../data/categories';
import { TOOL_COLLECTIONS } from '../data/collections';
import { Search, X, TrendingUp, Briefcase, Map, Zap, Calculator, Heart, Atom, GitBranch, ArrowRight, LayoutGrid, List } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, Briefcase, Map, Zap, Calculator, Heart, Atom, GitBranch,
};

type ViewMode = 'grouped' | 'grid';

function getCollectionTools(slugs: string[]): ToolMeta[] {
  return slugs
    .map((s) => TOOL_REGISTRY.find((t) => t.slug === s))
    .filter((t): t is ToolMeta => !!t && t.status === 'live')
    .slice(0, 4);
}

export function BrowsePage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grouped');

  const liveCount = getLiveTools().length;

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return TOOL_REGISTRY.filter((t: ToolMeta) => {
      const matchesQuery = !q || t.title.toLowerCase().includes(q) || t.shortDescription.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchesCategory = !selectedCategory || t.category === selectedCategory;
      const matchesStatus = !selectedStatus || t.status === selectedStatus;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [query, selectedCategory, selectedStatus]);

  const grouped = useMemo(() => {
    const map: Record<string, ToolMeta[]> = {};
    filtered.forEach((t) => {
      if (!map[t.category]) map[t.category] = [];
      map[t.category].push(t);
    });
    return map;
  }, [filtered]);

  const isFiltering = !!(query || selectedCategory || selectedStatus);
  const categoryOrder = CATEGORIES.map((c) => c.slug);
  const sortedGroups = categoryOrder.filter((slug) => grouped[slug]);

  return (
    <Layout>
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">All Tools</h1>
            <p className="text-slate-400">{liveCount} live calculators and simulators across {CATEGORIES.length} categories</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search all tools..."
                className="w-full pl-9 pr-8 py-3 bg-slate-700/60 border border-slate-600 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-700"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-700/60 border border-slate-600 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => <option key={cat.slug} value={cat.slug}>{cat.name}</option>)}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-700/60 border border-slate-600 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="live">Live Only</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </div>
        </div>
      </div>

      {!isFiltering && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-base font-semibold text-slate-700 mb-4">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = ICON_MAP[cat.icon] ?? Calculator;
                const colors = COLOR_MAP[cat.color];
                const catLiveCount = TOOL_REGISTRY.filter((t) => t.category === cat.slug && t.status === 'live').length;
                return (
                  <Link
                    key={cat.slug}
                    to={`/tools/${cat.slug}`}
                    className={`group flex flex-col items-center text-center p-4 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-md transition-all`}
                  >
                    <Icon className={`w-6 h-6 ${colors.icon} mb-2`} />
                    <span className={`text-xs font-semibold ${colors.text}`}>{cat.name}</span>
                    <span className="text-xs text-slate-400 mt-0.5">{catLiveCount} tools</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!isFiltering && (
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-base font-semibold text-slate-700 mb-4">Curated Collections</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOOL_COLLECTIONS.slice(0, 3).map((collection) => {
                const tools = getCollectionTools(collection.slugs);
                return (
                  <div key={collection.id} className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="font-semibold text-slate-800 mb-1 text-sm">{collection.title}</h3>
                    <p className="text-xs text-slate-500 mb-3">{collection.description}</p>
                    <ul className="space-y-1.5">
                      {tools.map((tool) => (
                        <li key={tool.slug}>
                          <Link
                            to={`/tools/${tool.category}/${tool.slug}`}
                            className="text-xs text-slate-600 hover:text-blue-600 hover:underline flex items-center gap-1.5"
                          >
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            {tool.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="text-sm text-slate-500">
            {isFiltering ? (
              <span>
                <strong className="text-slate-800">{filtered.length}</strong> result{filtered.length !== 1 ? 's' : ''}
                {(selectedCategory || selectedStatus) && (
                  <button
                    onClick={() => { setSelectedCategory(''); setSelectedStatus(''); setQuery(''); }}
                    className="ml-2 text-red-500 hover:text-red-700 text-xs"
                  >
                    Clear all
                  </button>
                )}
              </span>
            ) : (
              <span>All <strong className="text-slate-800">{TOOL_REGISTRY.length}</strong> tools</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grouped')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grouped' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 mb-3">No tools found for "{query}"</p>
            <button onClick={() => setQuery('')} className="text-blue-600 hover:underline text-sm">Clear search</button>
          </div>
        )}

        {viewMode === 'grouped' && !isFiltering ? (
          <div className="space-y-10">
            {sortedGroups.map((catSlug) => {
              const cat = CATEGORIES.find((c) => c.slug === catSlug);
              const tools = grouped[catSlug];
              const colors = cat ? COLOR_MAP[cat.color] : COLOR_MAP.slate;
              return (
                <div key={catSlug}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-slate-800">{cat?.name ?? catSlug}</h2>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
                        {tools.filter((t) => t.status === 'live').length} live
                      </span>
                    </div>
                    <Link
                      to={`/tools/${catSlug}`}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      View all <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
