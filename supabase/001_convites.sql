-- Executar uma única vez no SQL Editor do Supabase.
-- Dados privados: nenhuma tabela permite acesso direto por chaves públicas.

create table if not exists public.invite_groups (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-f0-9]{40}$'),
  created_at timestamptz not null default now()
);

create table if not exists public.invite_people (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invite_groups(id) on delete cascade,
  position integer not null check (position >= 0),
  name text not null check (char_length(btrim(name)) between 1 and 80),
  attendance text not null default 'pending' check (attendance in ('pending','yes','no')),
  model text check (model in ('tradicional','babyLook','infantil')),
  size text,
  updated_at timestamptz,
  unique (invitation_id, position),
  constraint valid_abada check (
    (attendance = 'yes' and model is not null and size is not null) or
    (attendance in ('pending','no') and model is null and size is null)
  )
);

create index if not exists idx_invite_people_invitation on public.invite_people(invitation_id);

alter table public.invite_groups enable row level security;
alter table public.invite_people enable row level security;
revoke all on public.invite_groups from anon, authenticated;
revoke all on public.invite_people from anon, authenticated;
grant select, insert, update, delete on public.invite_groups to service_role;
grant select, insert, update, delete on public.invite_people to service_role;

-- Alterações de uma família são aplicadas em transação única.
create or replace function public.save_invitation_responses(p_code text, p_responses jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  group_id uuid;
  total_people integer;
  total_received integer;
begin
  select g.id into group_id from public.invite_groups g where g.code = p_code for update;
  if group_id is null then raise exception 'Convite inexistente'; end if;
  if jsonb_typeof(p_responses) is distinct from 'array' then
    raise exception 'Respostas devem ser uma lista';
  end if;
  select count(*) into total_people from public.invite_people where invitation_id = group_id;
  total_received := jsonb_array_length(p_responses);
  if total_received <> total_people or total_received > 20 then
    raise exception 'Quantidade de pessoas incorreta';
  end if;
  if exists (
    select 1 from jsonb_to_recordset(p_responses) as x(id uuid, attendance text, model text, size text)
    left join public.invite_people p on p.id = x.id and p.invitation_id = group_id
    where p.id is null or x.attendance not in ('yes','no')
      or (x.attendance = 'yes' and (x.model not in ('tradicional','babyLook','infantil') or x.model is null or x.size is null))
      or (x.attendance = 'no' and (x.model is not null or x.size is not null))
  ) then raise exception 'Respostas inválidas'; end if;
  if (
    select count(distinct id)
    from jsonb_to_recordset(p_responses) as x(id uuid)
  ) <> total_received then raise exception 'Pessoas duplicadas'; end if;

  update public.invite_people p
  set attendance = x.attendance,
      model = x.model,
      size = x.size,
      updated_at = now()
  from jsonb_to_recordset(p_responses) as x(id uuid, attendance text, model text, size text)
  where p.invitation_id = group_id and p.id = x.id;
end;
$$;

revoke all on function public.save_invitation_responses(text,jsonb) from public, anon, authenticated;
grant execute on function public.save_invitation_responses(text,jsonb) to service_role;
