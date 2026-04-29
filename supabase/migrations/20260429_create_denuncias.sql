-- Tabela principal de denúncias
create table if not exists public.denuncias (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,

  -- Dados do denunciante (opcionais / nulos se anônimo)
  denunciante_nome text,
  denunciante_email text,
  denunciante_telefone text,
  denuncia_anonima boolean default false not null,

  -- Detalhes
  tipo_denuncia text not null,
  data_ocorrencia date not null,
  local_ocorrencia text not null,
  descricao_fato text not null,
  risco_iminente boolean default false not null,

  -- Caminhos das evidências no Supabase Storage (bucket: evidencias)
  evidencias_urls text[] default '{}' not null,

  -- Status de triagem
  status text default 'recebida' not null
);

-- RLS obrigatório em toda tabela pública
alter table public.denuncias enable row level security;

-- Qualquer visitante pode inserir uma denúncia (formulário público)
create policy "Permitir inserção anônima"
  on public.denuncias
  for insert
  to anon, authenticated
  with check (true);

-- Bucket de evidências (privado, 50 MB por arquivo)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'evidencias',
  'evidencias',
  false,
  52428800,
  array[
    'image/jpeg', 'image/jpg', 'image/png',
    'application/pdf',
    'video/mp4', 'video/quicktime', 'video/webm'
  ]
)
on conflict (id) do nothing;

-- Qualquer visitante pode fazer upload de evidências
create policy "Permitir upload anônimo"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'evidencias');
