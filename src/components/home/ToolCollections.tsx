import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, DollarSign, Briefcase, Map, Heart, RefreshCw } from 'lucide-react';
import { TOOL_COLLECTIONS } from '../../data/collections';
import { TOOL_REGISTRY, ToolMeta } from '../../data/toolRegistry';

const COLLECTION_ICONS: Record<string, React.ElementType> = {
  TrendingUp, DollarSign, Briefcase, Map, Heart, RefreshCw,
};

const COLLECTION_COLORS: Record<string, { bg: string; text: string; badge: string; border: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-700', badge: 'bg-sky-100 text-sky-700', border: 'border-sky-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700', border: 'border-orange-200' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700', border: 'border-rose-200' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-700', badge: 'bg-slate-100 text-slate-700', border: 'border-slate-200' },
};

function getToolsBySlug(slugs: string[]): ToolMeta[] {
  return slugs
    .map((s) => TOOL_REGISTRY.find((t) => t.slug === s))
    .filter((t): t is ToolMeta => !!t && t.status === 'live');
}

export function ToolCollections() {
  const featured = TOOL_COLLECTIONS.slice(0, 3);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Curated Collections</h2>
          <p className="text-slate-500">Handpicked tools for every goal and situation</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {featured.map((collection) => {
            const Icon = COLLECTION_ICONS[collection.icon] ?? TrendingUp;
            const colors = COLLECTION_COLORS[collection.color] ?? COLLECTION_COLORS.blue;
            const tools = getToolsBySlug(collection.slugs).slice(0, 4);

            return (
              <div key={collection.id} className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-base ${colors.text}`}>{collection.title}</h3>
                    <p className="text-xs text-slate-500">{collection.description}</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-5">
                  {tools.map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        to={`/tools/${tool.category}/${tool.slug}`}
                        className="flex items-center gap-2 group text-sm text-slate-700 hover:text-slate-900"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors shrink-0" />
                        <span className="group-hover:underline truncate">{tool.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/tools"
                  className={`inline-flex items-center gap-1 text-sm font-medium ${colors.text} hover:underline`}
                >
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
