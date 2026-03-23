import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ToolMeta } from '../../data/toolRegistry';
import { Badge } from '../ui/Badge';
import { getCategoryBySlug, COLOR_MAP } from '../../data/categories';

interface ToolCardProps {
  tool: ToolMeta;
}

export function ToolCard({ tool }: ToolCardProps) {
  const category = getCategoryBySlug(tool.category);
  const colors = category ? COLOR_MAP[category.color] : COLOR_MAP.slate;

  return (
    <Link
      to={`/tools/${tool.category}/${tool.slug}`}
      className="group flex flex-col bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-5"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
          {tool.title}
        </h3>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {tool.status === 'beta' && <Badge variant="beta">Beta</Badge>}
          {tool.status === 'coming_soon' && <Badge variant="coming_soon">Soon</Badge>}
          {tool.accessLevel === 'pro' && <Badge variant="pro">Pro</Badge>}
        </div>
      </div>
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">
        {tool.shortDescription}
      </p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${colors.badge}`}>
          {category?.name ?? tool.category}
        </span>
        {tool.status === 'live' && (
          <span className="text-xs text-blue-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Open <ArrowRight className="w-3 h-3" />
          </span>
        )}
      </div>
    </Link>
  );
}
