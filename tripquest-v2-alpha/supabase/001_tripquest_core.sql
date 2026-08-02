create extension if not exists pgcrypto;

create table public.profiles(
 id uuid primary key references auth.users(id) on delete cascade,
 nickname text not null,
 avatar_emoji text not null default '🧭',
 created_at timestamptz not null default now()
);
create table public.games(
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references public.profiles(id) on delete restrict,
 name text not null check(char_length(name) between 2 and 80),
 emoji text not null default '🧭',description text,
 start_date date not null,end_date date not null,
 invite_code text not null unique,created_at timestamptz not null default now(),
 check(end_date>=start_date)
);
create table public.game_members(
 id uuid primary key default gen_random_uuid(),
 game_id uuid not null references public.games(id) on delete cascade,
 user_id uuid not null references public.profiles(id) on delete cascade,
 role text not null default 'player' check(role in('owner','player')),
 joined_at timestamptz not null default now(),unique(game_id,user_id)
);
create index game_members_user_idx on public.game_members(user_id);
create index game_members_game_idx on public.game_members(game_id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id,nickname) values(new.id,coalesce(nullif(trim(new.raw_user_meta_data->>'nickname'),''),split_part(new.email,'@',1)));return new;end;$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.generate_invite_code() returns text language plpgsql volatile set search_path=public as $$
declare alphabet constant text:='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';result text:='';i integer;begin for i in 1..6 loop result:=result||substr(alphabet,1+floor(random()*length(alphabet))::integer,1);end loop;return result;end;$$;

create or replace function public.create_tripquest_game(p_name text,p_emoji text,p_start_date date,p_end_date date,p_description text default null) returns uuid language plpgsql security definer set search_path=public as $$
declare gid uuid;code text;begin if auth.uid() is null then raise exception 'Debes iniciar sesión';end if;if p_end_date<p_start_date then raise exception 'La fecha final no puede ser anterior';end if;loop code:=public.generate_invite_code();exit when not exists(select 1 from public.games where invite_code=code);end loop;insert into public.games(owner_id,name,emoji,start_date,end_date,description,invite_code) values(auth.uid(),trim(p_name),coalesce(nullif(trim(p_emoji),''),'🧭'),p_start_date,p_end_date,p_description,code) returning id into gid;insert into public.game_members(game_id,user_id,role) values(gid,auth.uid(),'owner');return gid;end;$$;

create or replace function public.join_tripquest_game(p_invite_code text) returns uuid language plpgsql security definer set search_path=public as $$
declare gid uuid;begin if auth.uid() is null then raise exception 'Debes iniciar sesión';end if;select id into gid from public.games where invite_code=upper(trim(p_invite_code));if gid is null then raise exception 'Código no válido';end if;insert into public.game_members(game_id,user_id,role) values(gid,auth.uid(),'player') on conflict(game_id,user_id) do nothing;return gid;end;$$;

create or replace function public.is_game_member(p_game_id uuid) returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.game_members where game_id=p_game_id and user_id=auth.uid());
$$;

alter table public.profiles enable row level security;alter table public.games enable row level security;alter table public.game_members enable row level security;
create policy profiles_self_read on public.profiles for select to authenticated using(id=auth.uid());
create policy profiles_self_update on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
create policy games_member_read on public.games for select to authenticated using(public.is_game_member(id));
create policy members_same_game_read on public.game_members for select to authenticated using(public.is_game_member(game_id));
grant execute on function public.is_game_member(uuid) to authenticated;
grant execute on function public.create_tripquest_game(text,text,date,date,text) to authenticated;
grant execute on function public.join_tripquest_game(text) to authenticated;
