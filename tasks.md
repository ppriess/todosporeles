# Tasks & Roadmap

Status: `[ ]` pendente · `[x]` concluído

---

## Banco de dados

- [x] Criar migration `ngo_registrations` (tabela para cadastro de ONGs)
- [x] Definir RLS da tabela `ngo_registrations`
- [x] Criar migration `entidades` (diretório público) com RLS
- [x] Policies admin para `denuncias` e `ngo_registrations`

## Integrações form → BD

- [x] Form de denúncia (`report-abuse.tsx`) integrado com Supabase — insert em `denuncias` + upload no bucket `evidencias`
- [x] Form de cadastro de ONG (`register-ngo.tsx`) — insert em `ngo_registrations`

## Área admin

- [x] Middleware Next.js protegendo `/admin/*`
- [x] Login page (`/admin/login`) com Supabase Auth (email + senha)
- [x] Layout admin com sidebar (Denúncias / Entidades / Sair)
- [x] Lista de denúncias com filtros por status e risco iminente
- [x] Detalhe de denúncia: mudar status + encaminhar por email (Resend)
- [x] API route `POST /api/email` — envia denúncia formatada via Resend
- [x] CRUD de entidades (listar, criar, editar, excluir)

## Pendências da área admin

- [x] Adicionar `RESEND_API_KEY` no `.env.local` e configurar domínio remetente no Resend
- [x] Criar usuário admin no Supabase Auth (Dashboard → Authentication → Users)
- [x] Rodar migrations no Supabase (Dashboard → SQL Editor)
- [x] Adaptar `from:` na API de email para domínio verificado no Resend (`noreply@todosporeles.com.br`)
- [ ] Transformar lista de denúncias (`/admin/denuncias`) em kanban com colunas por status (Recebida / Em análise / Encaminhada / Arquivada) — arrastar card muda status no BD

## Terminologia (ONG → Entidade)

- [ ] Atualizar labels visíveis em `data/home-content.json` (ONG → entidade onde couber)
- [ ] Adicionar campo `tipo` no form de cadastro público (`register-ngo.tsx`)

## Páginas inexistentes (links no footer)

- [ ] `/sobre`
- [ ] `/termos`
- [ ] `/privacidade`
- [ ] `/transparencia`
- [ ] `/contato`
