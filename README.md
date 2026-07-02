# Wobb Frontend Assignment — Submission

A polished influencer search application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Browse creators across Instagram, YouTube, and TikTok, view detailed profiles, and curate a persistent shortlist.

## Live Demo

https://wobb-ai-rosy.vercel.app/

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run lint`  | Run ESLint               |
| `npm run preview` | Preview production build |

## What Changed

### Bug Fixes

- **Case-insensitive search** — username matching is now case-insensitive (previously only full name was).
- **Engagement rate display** — fixed incorrect `× 10000` multiplier on the profile detail page; now uses the shared formatter (`× 100`).
- **Engagements stat** — the "Engagements" card now shows the actual engagement count instead of reusing the engagement rate formatter.
- **Stale state** — removed debug `clickCount` logic that used a stale closure in `setState`.
- **Profile loading** — added error handling, request cancellation on unmount/username change, and a loading skeleton.
- **Accessibility** — image `alt` text, keyboard navigation on profile cards, `rel="noopener noreferrer"` on external links, ARIA labels on interactive controls.
- **Dependency conflict** — removed unused `react-beautiful-dnd` (incompatible with React 19 and never used).

### UI/UX Redesign

- Modern layout with sticky header, responsive two-column grid (search + selected list sidebar).
- Mobile-friendly selected list drawer with badge count.
- Platform filter pills with platform-specific accent colors.
- Card-based profile list with hover/focus states and empty states.
- Redesigned profile detail page with stat grid and skeleton loading.
- Light/dark mode support via CSS custom properties.
- Subtle slide-up animation for the mobile list panel (respects `prefers-reduced-motion`).

### State Management (Zustand)

Replaced the starter's implicit/local state approach with a **Zustand** store (`src/stores/useSelectedListStore.ts`) using the `persist` middleware. Selected profiles survive page refresh via `localStorage`.

### "Add to List" Feature

- Add profiles from search cards or the profile detail page.
- Duplicate prevention by username.
- Visual feedback: "In List", "Added!", or "Already added".
- Selected list panel shows avatar, platform badge, follower count, and remove actions.
- "Clear all" to reset the list.

### Code Quality & Structure

```
src/
├── components/
│   ├── layout/       # App shell
│   ├── profile/      # Profile cards, stats, add button
│   ├── search/       # Platform filter & search input
│   ├── selected/     # Selected list panel
│   └── ui/           # Reusable Button, Input, Avatar, badges
├── hooks/            # useProfile
├── pages/            # Route-level components
├── stores/           # Zustand stores
├── types/            # Shared TypeScript types
└── utils/            # Data helpers, formatters, profile loader
```

- Consolidated duplicate follower-formatting logic into `utils/formatters.ts`.
- Extracted `ProfileStats`, `AddToListButton`, and `useProfile` for reuse and clarity.
- Proper TypeScript throughout with platform type guards.

### Performance

- `useMemo` for filtered profile lists on the search page.
- `memo` on `ProfileCard`, `ProfileList`, `SelectedListPanel`, and `AddToListButton`.
- Zustand selectors and `useShallow` to minimize re-renders in the selected list panel.
- Lazy-loaded profile images.

## Libraries Added

| Library        | Purpose                                      |
| -------------- | -------------------------------------------- |
| `zustand`      | Global state + localStorage persistence      |
| `lucide-react` | Lightweight, accessible icons                |

## Libraries Removed

| Library               | Reason                                           |
| --------------------- | ------------------------------------------------ |
| `react-beautiful-dnd` | Unused, deprecated, incompatible with React 19   |

## Assumptions

- Profiles are uniquely identified by **username** for duplicate detection (not `user_id`).
- When a profile detail page is opened without a valid `?platform=` query param, **Instagram** is used as the default platform for list metadata.
- Only usernames with a matching JSON file in `src/assets/data/profiles/` have detail pages; others show a friendly error.
- Selected list persistence uses `localStorage` key `wobb-selected-profiles`.

## Trade-offs

- **No drag-and-drop reordering** of the selected list — prioritized simplicity and persistence over ordering UX.
- **No toast library** — inline button feedback keeps bundle size small.
- **No data-fetching library** (React Query/SWR) — static JSON data doesn't warrant the overhead.
- **No unit tests** — focused on core assignment deliverables; tests would be a natural next step.

## Remaining Improvements

- Deploy to Vercel/Netlify and add the live URL above.
- Add unit/integration tests (Vitest + React Testing Library).
- Virtualize the profile list for very large datasets.
- Add drag-and-drop reordering in the selected list.
- Toast notifications for add/remove actions.
- Route-level code splitting for profile detail chunks.

## Submission Checklist

- [x] `npm run build` passes
- [x] Application runs without errors
- [x] Zustand for state management
- [x] Add to List feature with persistence
- [x] UI/UX redesign
- [x] README with changes, libraries, assumptions, trade-offs
- [x] Public GitHub repository URL submitted before deadline
- [x] Optional: deployment URL

---

Built for the Wobb Frontend Assignment. Good luck with your review! 🚀
