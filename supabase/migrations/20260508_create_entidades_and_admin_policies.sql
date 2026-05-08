-- Tabela de entidades aprovadas (diretório público)
create table if not exists public.entidades (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,

  nome text not null,
  cnpj text,
  cidade text not null,
  atividades text[] not null default '{}',
  descricao text not null,
  tipo text not null check (tipo in ('ong', 'orgao_governamental', 'grupo_local')),

  contato_nome text,
  email text,
  telefone text,
  website text,

  verificada boolean default false not null,
  ativa boolean default true not null
);

alter table public.entidades enable row level security;

do $$ begin
  create policy "Leitura pública de entidades ativas"
    on public.entidades for select
    to anon, authenticated
    using (ativa = true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Admin gerencia entidades"
    on public.entidades for all
    to authenticated
    using (true)
    with check (true);
exception when duplicate_object then null;
end $$;

-- Policies de leitura/atualização para admin nas tabelas existentes
-- (apenas INSERT existia antes, via "Permitir inserção anônima")

do $$ begin
  create policy "Admin lê denúncias"
    on public.denuncias for select
    to authenticated
    using (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Admin atualiza denúncias"
    on public.denuncias for update
    to authenticated
    using (true)
    with check (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Admin lê cadastros"
    on public.ngo_registrations for select
    to authenticated
    using (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Admin atualiza cadastros"
    on public.ngo_registrations for update
    to authenticated
    using (true)
    with check (true);
exception when duplicate_object then null;
end $$;
