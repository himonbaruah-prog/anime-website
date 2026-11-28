create table if not exists public.videos (
  id text primary key,
  title text not null,
  description text default '',
  playback_url text not null,
  thumbnail_url text,
  duration_seconds integer,
  status text not null default 'ready',
  created_at timestamptz not null default now()
);

alter table public.videos enable row level security;

-- Public visitors may read only published videos.
create policy "Public can read ready videos"
on public.videos for select
to anon, authenticated
using (status = 'ready');

-- Writes are performed only by the backend using the service-role key.
