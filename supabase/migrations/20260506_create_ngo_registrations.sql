-- Tabela de cadastros de ONGs
create table if not exists public.ngo_registrations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,

  -- Dados da organização
  ngo_name text not null,
  cnpj text not null,
  city text not null,
  activities text[] not null default '{}',
  about text not null,

  -- Dados do responsável
  contact_name text not null,
  email text not null,
  phone text not null,

  -- Status de verificação
  status text default 'pendente' not null
);

-- RLS obrigatório
alter table public.ngo_registrations enable row level security;

-- Qualquer visitante pode submeter um cadastro
create policy "Permitir inserção anônima"
  on public.ngo_registrations
  for insert
  to anon, authenticated
  with check (true);
