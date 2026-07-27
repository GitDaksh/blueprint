<div align="center">

# BluePrint

**A modern productivity platform for developers.**

Kanban boards, a dev journal, a snippet library, and a command palette — built to feel like a real product, not a tutorial project.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

---

## Screenshots

<!--
  Add screenshots here once you have them. Suggested shots:
  - Kanban board with a few tasks across columns
  - Task detail sheet open
  - Dark mode vs light mode, side by side

  Example:
  ![Board view](./docs/screenshots/board.png)
-->

*Screenshots coming soon.*

## About

BluePrint is a productivity app built specifically for how developers work — a fast, keyboard-friendly alternative to general-purpose tools like Trello or Notion, purpose-built around the workflows of a solo dev or small team.

This project is being built entirely **frontend-first**: no backend, no database, no paid services. All data currently lives in the browser via a typed, validated local data layer designed so a real backend can be dropped in later with minimal rework.

## Features

### ✅ Done

- 🗂️ **Kanban board** — create, edit, and delete tasks across columns
- 🖱️ **Drag and drop** — reorder tasks within a column or move them across columns, powered by [`dnd-kit`](https://dndkit.com)
- 🌓 **Dark mode** — system-aware, persisted, flicker-free on load
- ✅ **Schema-validated forms** — every input validated end-to-end with [Zod](https://zod.dev) and [React Hook Form](https://react-hook-form.com)
- 💾 **Local-first data layer** — a repository pattern over `localStorage`, structured so it can be swapped for a real API later without touching the UI

### 🚧 Planned

- 🗃️ Multiple boards / workspaces
- ⌘ Command palette (⌘K) for fast navigation
- 📓 Dev journal with markdown notes
- 📎 Code snippet library with syntax highlighting
- 🔍 Global search across tasks, notes, and snippets
- ⏱️ Focus timer
- 📊 Dashboard with activity stats
- ⌨️ Full keyboard shortcut system

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Components | [shadcn/ui](https://ui.shadcn.com) |
| Forms & Validation | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Drag & Drop | [`@dnd-kit/react`](https://dndkit.com) |
| Icons | [Lucide](https://lucide.dev) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |

## Getting Started

### Prerequisites

- Node.js 18.18 or later
- npm

### Installation

```bash
git clone https://github.com/GitDaksh/blueprint.git
cd blueprint
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

src/
├── app/ # Next.js App Router — routes and layouts
├── components/
│ ├── ui/ # shadcn/ui primitives (Button, Dialog, Field, etc.)
│ └── layout/ # Sidebar, Topbar, shared app shell
├── features/ # Feature-based modules (board, journal, snippets…)
│ └── board/
│ ├── components/
│ └── hooks/
├── lib/
│ ├── storage/ # localStorage-backed repository layer
│ ├── schema.ts # Zod schemas + derived TypeScript types
│ └── utils.ts


## Roadmap

- [x] App shell, theming, project foundation
- [x] Kanban board with drag-and-drop
- [x] Full task CRUD
- [ ] Multiple boards
- [ ] Command palette
- [ ] Dev journal
- [ ] Snippet library
- [ ] Global search
- [ ] Focus timer & dashboard
- [ ] Backend (auth, database, sync) — planned as a second phase after the frontend is complete

## Author

**Daksh Pushpad**
