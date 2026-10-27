-- Codaluna – Supabase-Schema für Konten und Fortschritts-Synchronisation.
-- Im Supabase-Dashboard unter "SQL Editor" ausführen. Mehrfaches Ausführen ist unschädlich.

create table if not exists public.user_progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Row-Level-Security: jede:r sieht und bearbeitet NUR den eigenen Datensatz.
alter table public.user_progress enable row level security;

drop policy if exists "own row - select" on public.user_progress;
create policy "own row - select"
  on public.user_progress for select
  using (auth.uid() = user_id);

drop policy if exists "own row - insert" on public.user_progress;
create policy "own row - insert"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "own row - update" on public.user_progress;
create policy "own row - update"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own row - delete" on public.user_progress;
create policy "own row - delete"
  on public.user_progress for delete
  using (auth.uid() = user_id);

-- Konto selbst löschen ("Konto löschen" in der App).
-- Löscht den eigenen Auth-Benutzer; der Fortschritt verschwindet per "on delete cascade".
-- security definer: läuft mit den Rechten des Eigentümers, löscht aber nur auth.uid().
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not signed in';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
