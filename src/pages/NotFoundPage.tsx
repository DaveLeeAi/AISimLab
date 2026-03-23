import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';

export function NotFoundPage() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-8xl font-bold text-slate-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Page not found</h1>
        <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
            Go Home
          </Link>
          <Link to="/tools" className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm">
            Browse Tools
          </Link>
        </div>
      </div>
    </Layout>
  );
}
