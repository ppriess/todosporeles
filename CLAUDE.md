# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js marketing website for an animal protection platform in Santa Catarina (SC). Facilitates reporting animal abuse, discovering local NGOs, and connecting citizens with animal protection organizations.

## Development Commands

```bash
# Start dev server (runs on http://localhost:3309)
pnpm dev

# Build for production
pnpm build

# Run linter
pnpm lint
```

**Package manager**: pnpm exclusively. Use `pnpm add`, `pnpm install`, etc.

**Adding shadcn/ui components**: `pnpm dlx shadcn@latest add <component-name>`

## Architecture

### Project Structure

- **`app/`** — Next.js App Router. `layout.tsx` sets up fonts and Vercel Analytics; `page.tsx` composes all section components in order.
- **`components/sections/`** — One file per homepage section. These are the primary building blocks.
- **`components/ui/`** — shadcn/ui "new-york" style components (Radix UI base). Treat as stable APIs; don't modify unless fixing bugs.
- **`components/header.tsx`**, **`components/footer.tsx`** — Layout wrappers.
- **`lib/utils.ts`** — `cn()` helper for Tailwind class merging.
- **`hooks/`** — `use-mobile.ts` (breakpoint detection), `use-toast.ts` (toast hook).

### Homepage Section Order

`Header → Hero → Pathways → WhatIsAbuse → Process → NGODirectory → RegisterNGO → Transparency → FAQ → Footer`

Each section has an `id` attribute used for in-page anchor navigation (e.g. `id="denuncia"`, `id="ongs"`, `id="cadastrar"`).

### Styling — Tailwind v4 + OKLCH

This project uses **Tailwind CSS v4**, which differs significantly from v3:

- Design tokens (colors, radius, fonts) are defined via `@theme inline` in **`app/globals.css`**, not in `tailwind.config.ts`. `tailwind.config.ts` only sets `darkMode` and `content`.
- All colors use the **OKLCH color space** (e.g. `oklch(0.50 0.20 250)`).
- CSS variables follow the shadcn/ui convention: `--primary`, `--accent`, `--muted`, etc., mapped to `--color-*` in the `@theme inline` block.
- Animation utilities come from `tw-animate-css` (imported in `globals.css`).
- Dark mode via `.dark` class on `<html>`.

### Client vs Server Components

Sections that use `useRef`, `useEffect`, or browser APIs (e.g. `IntersectionObserver` for scroll-triggered animations) must have `"use client"` at the top. Pure presentational sections can be Server Components.

### Animation Pattern

Scroll-triggered reveal: add class `reveal` to elements, then use an `IntersectionObserver` in `useEffect` to add `animate-in fade-in slide-in-from-bottom-4` when visible. See `components/sections/register-ngo.tsx` for the canonical example.

## Visual Feedback

Do NOT waste tokens explaining things to the user on the answers / CLI terminal, only if the user requested for ax explanation or if you have a strong reason to justify / explicit was done.
Do NOT waste tokens displaying diffs to the user on the CLI terminal.

## TypeScript

- `@/*` path alias resolves to the repository root.
- `next.config.mjs` has `ignoreBuildErrors: true` — fix type errors before committing even though builds pass.

## Current Limitations

- No backend exists; all inter-section links are client-side anchors (`#section-id`).
- Footer links to `/sobre`, `/termos`, `/privacidade`, `/transparencia`, `/contato` — these pages do not exist yet.
- All content is in Portuguese (pt-BR).
