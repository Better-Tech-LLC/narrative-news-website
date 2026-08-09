-- narrativeAI.dev — Supabase schema
-- Dedicated project: narrative-news (gbthuftvbbdtettsynue).

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
-- nn_subscribers: no table-level public policies. Writes go through the
-- SECURITY DEFINER function below, callable with the publishable key.

create or replace function nn_subscribe(p_email text, p_topics text[])
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' then
    raise exception 'invalid email';
  end if;
  if array_length(p_topics, 1) is null or array_length(p_topics, 1) > 10 then
    raise exception 'invalid topics';
  end if;
  insert into nn_subscribers (email, topics)
  values (lower(p_email), p_topics)
  on conflict (email) do update
    set topics = excluded.topics,
        unsubscribed_at = null;
end;
$$;

revoke all on function nn_subscribe(text, text[]) from public;
grant execute on function nn_subscribe(text, text[]) to anon;
