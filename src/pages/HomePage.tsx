import { Layout } from '../components/layout/Layout';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedTools } from '../components/home/FeaturedTools';
import { HowItWorks } from '../components/home/HowItWorks';
import { TrendingTools } from '../components/home/TrendingTools';
import { ToolCollections } from '../components/home/ToolCollections';

export function HomePage() {
  return (
    <Layout>
      <HeroSection />
      <CategoryGrid />
      <FeaturedTools />
      <TrendingTools />
      <ToolCollections />
      <HowItWorks />
    </Layout>
  );
}
