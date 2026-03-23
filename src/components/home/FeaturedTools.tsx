import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getFeaturedTools } from '../../data/toolRegistry';
import { ToolCard } from '../tools/ToolCard';

export function FeaturedTools() {
  const tools = getFeaturedTools();

  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Popular Tools</h2>
            <p className="text-slate-500">Most-used calculators across all categories</p>
          </div>
          <Link to="/tools" className="hidden sm:flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/tools" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Explore All Tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
