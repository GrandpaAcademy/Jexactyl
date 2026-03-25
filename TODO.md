# Zero-Bot.net — Panel Rebrand & UI Overhaul TODO

> Transform Jexactyl into **Zero-Bot.net** — a premium, modern game server panel.

---

## Phase 1: Design System Foundation

- [x] Update `tailwind.config.js` — add Zero-Bot color palette
  - `zb-bg: #0A0E17`, `zb-surface: #111827`, `zb-card: #1A1F2E`
  - `zb-accent: #00F0FF` (cyan), `zb-accent-2: #7C3AED` (violet)
  - Added Inter + JetBrains Mono fonts, animations, shadows
- [x] Update `resources/scripts/assets/tailwind.css` — added Google Fonts import
- [ ] Update `resources/scripts/assets/theme.ts` — styled-components theme object *(minor, breakpoints only)*
- [x] Update `resources/scripts/assets/css/GlobalStylesheet.ts` — CSS variables, aurora bg, glassmorphism utils, styled scrollbar, selection color
- [x] `pnpm build` — verified ✓ (2277 modules, 45s)

---

## Phase 2: Branding

- [x] Create `public/assets/zerobot-logo.svg` (main logo with gradient Z icon + wordmark)
- [ ] Create `public/assets/zerobot-favicon.ico` *(defer — needs image tool)*
- [x] Create `public/assets/zerobot-logo-small.svg` (icon-only for sidebar)
- [x] Update `resources/views/templates/wrapper.blade.php` — title, meta description, theme-color `#00F0FF`, favicon mask color, Google Fonts preconnect hints, removed old font imports
- [x] Global text replacement across all 24 frontend `.tsx/.ts` files:
  - `Jexactyl` → `Zero-Bot`
  - `Jexpanel` → `Zero-Bot.net`
- [x] `pnpm build` — verified ✓

---

## Phase 3: Core UI Components

### Navigation & Layout
- [ ] `elements/NavigationBar.tsx` — glassmorphism top bar, logo, user dropdown, gradient border
- [ ] `elements/Sidebar.tsx` — dark glass sidebar, cyan active indicator, collapsible animation
- [ ] `elements/MobileSidebar.tsx` — slide-in overlay with blur backdrop
- [ ] `elements/SubNavigation.tsx` — tab-style nav with animated cyan underline

### Cards & Containers
- [ ] `elements/ContentBox.tsx` — glass card (`bg-zb-card/60`, blur, rounded-2xl)
- [ ] `elements/GreyRowBox.tsx` — dark glass row with hover glow
- [ ] `elements/TitledGreyBox.tsx` — gradient title text, glass background
- [ ] `elements/PageContentBlock.tsx` — Framer Motion page transitions (fade + slide-up)
- [ ] `elements/AdminBox.tsx` — glass card for admin sections
- [ ] `elements/AdminContentBlock.tsx` — consistent admin layout

### Forms & Inputs
- [ ] `elements/Input.tsx` — dark glass inputs, cyan focus glow
- [ ] `elements/button/` — gradient primary (cyan→violet), ghost secondary, danger variant, ripple effect
- [ ] `elements/Select.tsx` — dark dropdown, glass styling
- [ ] `elements/SearchableSelect.tsx` — dark theme, cyan highlight
- [ ] `elements/SelectField.tsx` — consistent with Select
- [ ] `elements/Switch.tsx` — cyan glow when active, spring animation
- [ ] `elements/Checkbox.tsx` — styled checkbox matching theme
- [ ] `elements/Field.tsx` — label + input wrapper styling

### Modals & Overlays
- [ ] `elements/Modal.tsx` — blur backdrop, glass card, scale-in animation
- [ ] `elements/ConfirmationModal.tsx` — consistent with Modal
- [ ] `elements/DropdownMenu.tsx` — glass dropdown with hover states

### Tables & Data
- [ ] `elements/Table.tsx` — glass table, striped rows, sticky header
- [ ] `elements/AdminTable.tsx` — admin-specific glass table
- [ ] `elements/Pagination.tsx` — pill buttons, cyan active state
- [ ] `elements/Pill.tsx` — status pills with glow (green/red/yellow)

### Loading & Feedback
- [ ] `elements/Spinner.tsx` — branded loading animation + skeleton placeholders
- [ ] `elements/SpinnerOverlay.tsx` — glass overlay spinner
- [ ] `elements/ProgressBar.tsx` — gradient bar (cyan→violet) with glow
- [ ] `elements/FlashMessageRender.tsx` — toast-style notifications
- [ ] `elements/MessageBox.tsx` — styled alert boxes

### Misc Elements
- [ ] `elements/Avatar.tsx` — ring with accent glow
- [ ] `elements/CopyOnClick.tsx` — styled tooltip
- [ ] `elements/ScreenBlock.tsx` — error/empty state screens
- [ ] `elements/SpeedDial.tsx` — glass speed dial
- [ ] `elements/Stepper.tsx` — multi-step indicator

- [ ] `pnpm build` — verify no errors

---

## Phase 4: Page-Level Upgrades

### Authentication (`components/auth/`)
- [ ] `LoginContainer.tsx` — full-screen aurora bg, centered glass card, gradient button
- [ ] `LoginFormContainer.tsx` — form styling
- [ ] `LoginCheckpointContainer.tsx` — 2FA page styling
- [ ] `RegisterContainer.tsx` — match login aesthetic, multi-step
- [ ] `ForgotPasswordContainer.tsx` — glass card
- [ ] `ResetPasswordContainer.tsx` — glass card

### Dashboard (`components/account/`)
- [ ] `DashboardContainer.tsx` — welcome header, server grid layout, search bar
- [ ] `ServerRow.tsx` → redesign as card: status dot, CPU/RAM/Disk mini-bars, hover scale
- [ ] `DashboardAlert.tsx` — styled alert banner
- [ ] `AccountOverviewContainer.tsx` — glass sections
- [ ] `AccountApiContainer.tsx` — API key management styling
- [ ] `Onboarding.tsx` — welcome wizard styling

### Server Management (`components/server/`)
- [ ] `console/` — xterm.js custom ZeroBot theme, glass container, colored power buttons, gradient resource graphs
- [ ] `files/` — glass file browser, icon-based file types, breadcrumb pills, drag-drop upload
- [ ] `backups/` — glass backup cards with progress indicators
- [ ] `databases/` — glass database cards
- [ ] `schedules/` — glass schedule cards, task list styling
- [ ] `network/` — allocation management styling
- [ ] `startup/` — startup parameters styling
- [ ] `users/` — subuser management styling
- [ ] `billing/` — billing integration styling

### Admin Panel (`components/admin/`)
- [ ] `general/` — overview dashboard with stat cards (Servers, Users, Nodes, Revenue)
- [ ] `management/` — users/servers/nodes tables with glass theme
- [ ] `service/` — nests/eggs management styling
- [ ] `modules/` — module settings styling
- [ ] `setup/` — initial setup wizard styling

### Admin Sub-Navigation
- [ ] `admin/SubNavigation.tsx` — match global sub-nav theme

- [ ] `pnpm build` — verify no errors

---

## Phase 5: Animations & Polish

### Micro-Animations
- [ ] Page transitions — fade + slide-up (150ms, Framer Motion)
- [ ] Card hover — scale 1.01x + shadow increase
- [ ] Button press — scale 0.97x + ripple
- [ ] Modal open — backdrop blur fade + card scale-in
- [ ] Sidebar items — staggered fade-in on load
- [ ] Status indicators — pulsing glow (CSS keyframes)
- [ ] Toast notifications — slide-in from right
- [ ] Loading — skeleton shimmer with glass gradient

### Responsive Design
- [ ] Test at 375px (mobile)
- [ ] Test at 768px (tablet)
- [ ] Test at 1024px (laptop)
- [ ] Test at 1440px (desktop)
- [ ] Fix any responsive issues

### Accessibility
- [ ] Focus rings (cyan glow) for keyboard navigation
- [ ] ARIA labels on interactive elements
- [ ] Color contrast check

### Performance
- [ ] Limit nested `backdrop-filter` usage
- [ ] Add `will-change` hints for animated elements
- [ ] Lazy-load heavy components

---

## Final QA

- [ ] Visual check: Login page (`/auth/login`)
- [ ] Visual check: Dashboard (`/`)
- [ ] Visual check: Server console (`/server/:id`)
- [ ] Visual check: Admin panel (`/admin`)
- [ ] `pnpm build` — final production build
- [ ] `pnpm test` — all existing tests pass

---

**Brand**: Zero-Bot.net
**Palette**: Cyan `#00F0FF` + Violet `#7C3AED` on Dark `#0A0E17`
**Fonts**: Inter (body) + JetBrains Mono (code)
**Style**: Dark glassmorphism with neon accents
