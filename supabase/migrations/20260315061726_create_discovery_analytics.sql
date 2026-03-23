/*
  # Discovery & Analytics Tables

  ## New Tables
  - `tool_events` — records all tool interactions (view, run, search_click)
    - `id` (uuid, pk)
    - `tool_slug` (text) — which tool was interacted with
    - `event_type` (text) — 'view' | 'run' | 'search_click' | 'category_visit' | 'search_query'
    - `session_id` (text) — anonymous session identifier
    - `query` (text, nullable) — search query if event_type = 'search_query'
    - `category` (text, nullable) — category slug if event_type = 'category_visit'
    - `created_at` (timestamptz)

  - `tool_view_counts` — materialized view-like table for fast trending
    - `tool_slug` (text, pk)
    - `view_count` (int8)
    - `run_count` (int8)
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled on both tables
  - Public insert allowed for event tracking (anonymous)
  - No public reads on raw events (privacy)
  - tool_view_counts readable by all (used for trending UI)
*/

CREATE TABLE IF NOT EXISTS tool_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_slug text,
  event_type text NOT NULL,
  session_id text,
  query text,
  category text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tool_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert events"
  ON tool_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS tool_view_counts (
  tool_slug text PRIMARY KEY,
  view_count bigint DEFAULT 0,
  run_count bigint DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tool_view_counts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read view counts"
  ON tool_view_counts
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can upsert view counts"
  ON tool_view_counts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update view counts"
  ON tool_view_counts
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS tool_events_slug_idx ON tool_events (tool_slug);
CREATE INDEX IF NOT EXISTS tool_events_type_idx ON tool_events (event_type);
CREATE INDEX IF NOT EXISTS tool_events_created_idx ON tool_events (created_at DESC);
