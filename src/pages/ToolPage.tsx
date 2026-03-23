import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ToolEngine } from '../components/tools/ToolEngine';
import { ToolCard } from '../components/tools/ToolCard';
import { getToolDefinition } from '../tools/index';
import { getToolBySlug } from '../data/toolRegistry';
import { trackToolView } from '../lib/analytics';
import { Clock } from 'lucide-react';

function ComingSoonPanel({ title }: { title: string }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Clock className="w-8 h-8 text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-500 mb-6">This tool is coming soon. Check back shortly or explore our live tools below.</p>
      <Link to="/tools" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
        Browse Live Tools
      </Link>
    </div>
  );
}

export function ToolPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const meta = getToolBySlug(slug ?? '');
  const definition = getToolDefinition(slug ?? '');

  useEffect(() => {
    if (slug) trackToolView(slug);
  }, [slug]);

  if (!meta) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Tool not found</h1>
          <Link to="/tools" className="text-blue-600 hover:underline">Browse all tools</Link>
        </div>
      </Layout>
    );
  }

  const relatedTools = definition?.relatedTools
    .map((s) => getToolBySlug(s))
    .filter((t): t is NonNullable<typeof t> => !!t && t.slug !== slug)
    .slice(0, 3) ?? [];

  return (
    <Layout>
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="text-xs text-slate-500 mb-3">
            <Link to="/" className="hover:text-slate-700">Home</Link>
            <span className="mx-2">/</span>
            <Link to={`/tools/${category}`} className="hover:text-slate-700 capitalize">{category}</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-700">{meta.title}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{meta.title}</h1>
          <p className="text-slate-500">{meta.shortDescription}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {meta.status === 'coming_soon' || !definition ? (
          <ComingSoonPanel title={meta.title} />
        ) : (
          <ToolEngine tool={definition} />
        )}

        {relatedTools.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Related Tools</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
