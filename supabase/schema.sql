-- narrativeAI.dev — Supabase schema
-- Tables prefixed nn_ (Better Tech convention for the shared project).
-- Apply via Supabase MCP or SQL editor when wiring the backend.

create table if not exists nn_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  topics text[] not null default '{}',
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create table if not exists nn_issues (
  id uuid primary key default gen_random_uuid(),
  issue_date date not null unique,
  summary text not null default '',
  published_at timestamptz
);

create table if not exists nn_stories (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references nn_issues (id) on delete cascade,
  slug text not null unique,
  section text not null check (section in ('geopolitics','markets','tech','sports')),
  headline text not null,
  dek text not null default '',
  image_url text,
  image_alt text,
  crux text not null default '',
  body jsonb not null default '[]',        -- array of paragraphs
  sources text[] not null default '{}',
  consensus text not null default '',
  outlier_model_id text,
  outlier_note text,
  divergence numeric(3,2) not null default 0 check (divergence between 0 and 1),
  created_at timestamptz not null default now()
);

create table if not exists nn_takes (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references nn_stories (id) on delete cascade,
  model_id text not null,
  stance text not null default '',
  body text not null,
  position numeric(3,2) not null default 0 check (position between -1 and 1),
  unique (story_id, model_id)
);

-- RLS: public read for published content, no public writes.
alter table nn_subscribers enable row level security;
alter table nn_issues enable row level security;
alter table nn_stories enable row level security;
alter table nn_takes enable row level security;

create policy "public read issues" on nn_issues
  for select using (published_at is not null);
create policy "public read stories" on nn_stories
  for select using (true);
create policy "public read takes" on nn_takes
  for select using (true);
-- nn_subscribers: no public policies — service role only (server actions).
