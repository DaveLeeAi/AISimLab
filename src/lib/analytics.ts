import { supabase } from './supabase';

function getSessionId(): string {
  const key = 'asl_session';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

async function track(payload: {
  event_type: string;
  tool_slug?: string;
  query?: string;
  category?: string;
}) {
  try {
    await supabase.from('tool_events').insert({
      ...payload,
      session_id: getSessionId(),
    });
  } catch {
  }
}

async function incrementCount(slug: string, field: 'view_count' | 'run_count') {
  try {
    const { data } = await supabase
      .from('tool_view_counts')
      .select('view_count, run_count')
      .eq('tool_slug', slug)
      .maybeSingle();

    if (data) {
      await supabase
        .from('tool_view_counts')
        .update({ [field]: (data[field] ?? 0) + 1, updated_at: new Date().toISOString() })
        .eq('tool_slug', slug);
    } else {
      await supabase.from('tool_view_counts').insert({
        tool_slug: slug,
        view_count: field === 'view_count' ? 1 : 0,
        run_count: field === 'run_count' ? 1 : 0,
      });
    }
  } catch {
  }
}

export async function trackToolView(slug: string) {
  await Promise.all([
    track({ event_type: 'view', tool_slug: slug }),
    incrementCount(slug, 'view_count'),
  ]);
}

export async function trackToolRun(slug: string) {
  await Promise.all([
    track({ event_type: 'run', tool_slug: slug }),
    incrementCount(slug, 'run_count'),
  ]);
}

export async function trackSearch(query: string) {
  await track({ event_type: 'search_query', query });
}

export async function trackSearchClick(slug: string, query: string) {
  await track({ event_type: 'search_click', tool_slug: slug, query });
}

export async function trackCategoryVisit(category: string) {
  await track({ event_type: 'category_visit', category });
}

export async function getTrendingTools(limit = 8): Promise<{ tool_slug: string; view_count: number; run_count: number }[]> {
  try {
    const { data } = await supabase
      .from('tool_view_counts')
      .select('tool_slug, view_count, run_count')
      .order('view_count', { ascending: false })
      .limit(limit);
    return (data as { tool_slug: string; view_count: number; run_count: number }[]) ?? [];
  } catch {
    return [];
  }
}
