-- Create user stats table
create table public.user_stats (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  total_xp integer not null default 0,
  current_level integer not null default 1,
  streak_count integer not null default 0,
  streak_last_date date,
  longest_streak integer not null default 0,
  hearts integer not null default 3,
  max_hearts integer not null default 3,
  hearts_last_recharge timestamptz not null default now(),
  lessons_completed integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_stats enable row level security;

-- Auto-create stats when profile is created
create or replace function public.handle_new_profile()
returns trigger
set search_path = ''
as $$
begin
  insert into public.user_stats (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute function public.handle_new_profile();

-- RLS policies
create policy "Users can view own stats"
  on public.user_stats for select using ((select auth.uid()) = user_id);
create policy "Users can update own stats"
  on public.user_stats for update using ((select auth.uid()) = user_id);
