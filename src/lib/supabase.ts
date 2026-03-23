import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function recordToolView(toolSlug: string) {
  try {
    const sessionId = sessionStorage.getItem('session_id') || (() => {
      const id = crypto.randomUUID();
      sessionStorage.setItem('session_id', id);
      return id;
    })();
    await supabase.from('tool_views').insert({ tool_slug: toolSlug, session_id: sessionId });
  } catch {
  }
}
