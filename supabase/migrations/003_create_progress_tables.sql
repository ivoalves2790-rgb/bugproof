-- Course progress
create table public.user_course_progress (
  id bigint primary key generated always as identity,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_slug text not null,
  current_unit_index integer not null default 0,
  current_lesson_index integer not null default 0,
  course_xp integer not null default 0,
  level text not null default 'novice'
    check (level in ('novice', 'apprentice', 'engineer', 'architect')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, course_slug)
);

alter table public.user_course_progress enable row level security;

create policy "Users can view own course progress"
  on public.user_course_progress for select using ((select auth.uid()) = user_id);
create policy "Users can insert own course progress"
  on public.user_course_progress for insert with check ((select auth.uid()) = user_id);
create policy "Users can update own course progress"
  on public.user_course_progress for update using ((select auth.uid()) = user_id);

-- Lesson progress
create table public.user_lesson_progress (
  id bigint primary key generated always as identity,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_slug text not null,
  unit_slug text not null,
  lesson_slug text not null,
  completed boolean not null default false,
  score integer,
  xp_earned integer not null default 0,
  attempts integer not null default 1,
  best_score integer,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, course_slug, unit_slug, lesson_slug)
);

alter table public.user_lesson_progress enable row level security;

create policy "Users can view own lesson progress"
  on public.user_lesson_progress for select using ((select auth.uid()) = user_id);
create policy "Users can insert own lesson progress"
  on public.user_lesson_progress for insert with check ((select auth.uid()) = user_id);
create policy "Users can update own lesson progress"
  on public.user_lesson_progress for update using ((select auth.uid()) = user_id);

-- Assessment results
create table public.assessment_results (
  id bigint primary key generated always as identity,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_slug text not null,
  assessed_level text not null
    check (assessed_level in ('novice', 'apprentice', 'engineer', 'architect')),
  score integer not null,
  answers jsonb not null default '[]',
  taken_at timestamptz not null default now(),
  unique (user_id, course_slug)
);

alter table public.assessment_results enable row level security;

create policy "Users can view own assessment results"
  on public.assessment_results for select using ((select auth.uid()) = user_id);
create policy "Users can insert own assessment results"
  on public.assessment_results for insert with check ((select auth.uid()) = user_id);
