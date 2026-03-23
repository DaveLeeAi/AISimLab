import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, Flame } from 'lucide-react';
import { getTrendingTools } from '../../lib/analytics';
import { TOOL_REGISTRY, ToolMeta } from '../../data/toolRegistry';
import { TOOL_COLLECTIONS } from '../../data/collections';

function getPopularFallback(): ToolMeta[] {
  const popularSlugs = TOOL_COLLECTIONS.find((c) => c.id === 'popular')?.slugs ?? [];
  return popularSlugs
    .map((s) => TOOL_REGISTRY.find((t) => t.slug === s))
    .filter((t): t is ToolMeta => !!t && t.status === 'live')
    .slice(0, 6);
}

export function TrendingTools() {
  const [tools, setTools] = useState<ToolMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingTools(6).then((data) => {
      if (data.length > 0) {
        const mapped = data
          .map((d) => TOOL_REGISTRY.find((t) => t.slug === d.tool_slug))
          .filter((t): t is ToolMeta => !!t && t.status === 'live');
        setTools(mapped.length >= 4 ? mapped : getPopularFallback());
      } else {
        setTools(getPopularFallback());
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="py-12 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-slate-900">Trending Now</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-slate-900">Trending Now</h2>
          </div>
          <Link
            to="/tools"
            className="hidden sm:flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700"
          >
            All tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tools.map((tool, idx) => (
            <Link
              key={tool.slug}
              to={`/tools/${tool.category}/${tool.slug}`}
              className="group flex items-center gap-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm p-4 transition-all"
            >
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600">#{idx + 1}</span>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                  {tool.title}
                </div>
                <div className="text-xs text-slate-500 truncate mt-0.5 capitalize">{tool.category}</div>
              </div>
              <TrendingUp className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors ml-auto shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
