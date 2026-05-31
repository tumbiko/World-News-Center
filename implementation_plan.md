# Implementation Plan - Tailwind CSS v4 & shadcn/ui Migration

Migrate the World News Center application from Vanilla CSS Modules to **Tailwind CSS v4** and integrate **shadcn/ui** components (such as a dropdown menu for the theme toggler). We will leverage Tailwind v4's new CSS-first configuration and ensure that all premium design system details (glassmorphism, vibrant colors, glow animations, dark mode) are fully preserved and optimized.

---

## User Review Required

> [!IMPORTANT]
> - **CSS-First Theme Variables**: We will define shadcn/ui custom variables inside `@theme` in `src/app/globals.css` to work seamlessly with Tailwind v4.
> - **CSS Modules Removal**: All `.module.css` files will be removed after their utility equivalents are migrated.
> - **Theme Toggle Integration**: We will use a shadcn `DropdownMenu` and `Button` along with `lucide-react` for a premium Theme Toggle, matching standard shadcn design patterns.

---

## Proposed Changes

### Dependencies & Setup

#### [MODIFY] [package.json](file:///c:/Users/Vitumbiko/World%20News%20Center/package.json)
- Add Tailwind CSS v4 dependencies: `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `lucide-react`, `next-themes` (for SSR-safe theme integration).
- Ensure shadcn dependencies: `clsx`, `tailwind-merge`.

#### [NEW] [postcss.config.mjs](file:///c:/Users/Vitumbiko/World%20News%20Center/postcss.config.mjs)
- Configure PostCSS to compile Tailwind CSS using `@tailwindcss/postcss`.

#### [NEW] [components.json](file:///c:/Users/Vitumbiko/World%20News%20Center/components.json)
- shadcn/ui configuration file mapping typescript paths and style presets for Tailwind CSS v4.

---

### Core Styling & Components

#### [MODIFY] [globals.css](file:///c:/Users/Vitumbiko/World%20News%20Center/src/app/globals.css)
- Replace all custom resets and styles with `@import "tailwindcss";` and `@theme` directives.
- Implement Tailwind v4 class-based dark mode: `@custom-variant dark (&:where(.dark, .dark *));`.
- Port all existing custom animations (`pulseSlow`, `fadeIn`), gradients, and decorative glow variables into Tailwind `@theme` utilities.
- Define shadcn CSS variables for light/dark themes.

#### [NEW] [cn.ts](file:///c:/Users/Vitumbiko/World%20News%20Center/src/lib/utils.ts)
- Standard utility file for conditional class merging.

#### [NEW] [ThemeProvider.tsx](file:///c:/Users/Vitumbiko/World%20News%20Center/src/components/ThemeProvider.tsx)
- Use `next-themes` provider for SSR-safe class-based theme handling.

#### [MODIFY] [layout.tsx](file:///c:/Users/Vitumbiko/World%20News%20Center/src/app/layout.tsx)
- Wrap the tree in `ThemeProvider`.
- Remove legacy raw script used to prevent theme flash, replacing it with the standard `next-themes` setup.

#### [MODIFY] [ThemeToggle.tsx](file:///c:/Users/Vitumbiko/World%20News%20Center/src/components/ThemeToggle.tsx)
- Rewrite using shadcn `DropdownMenu` and `Button` and `lucide-react` icons.

---

### UI Migration (Vanilla CSS to Tailwind classes)

#### [MODIFY] [Navbar.tsx](file:///c:/Users/Vitumbiko/World%20News%20Center/src/components/Navbar.tsx)
- Rewrite class attributes to use Tailwind equivalents for glassmorphism, responsive menu trigger, and buttons.

#### [MODIFY] [Footer.tsx](file:///c:/Users/Vitumbiko/World%20News%20Center/src/components/Footer.tsx)
- Port styling to Tailwind CSS.

#### [MODIFY] [page.tsx](file:///c:/Users/Vitumbiko/World%20News%20Center/src/app/page.tsx)
- Port main homepage layouts, spotlight hero, categories bar, video feed switcher, and news grid to Tailwind CSS.

#### [MODIFY] [page.tsx](file:///c:/Users/Vitumbiko/World%20News%20Center/src/app/news/%5Bslug%5D/page.tsx)
- Port details page structure, custom video wrapper, article text content elements, and sidebar widgets to Tailwind.

#### [MODIFY] [LikeButton.tsx](file:///c:/Users/Vitumbiko/World%20News%20Center/src/components/LikeButton.tsx)
- Port to Tailwind styles (incorporate heart animation and premium active states).

#### [MODIFY] [page.tsx](file:///c:/Users/Vitumbiko/World%20News%20Center/src/app/login/page.tsx)
#### [MODIFY] [page.tsx](file:///c:/Users/Vitumbiko/World%20News%20Center/src/app/signup/page.tsx)
- Port authentication cards, form layouts, input states, and glowing background decorations.

#### [MODIFY] [page.tsx](file:///c:/Users/Vitumbiko/World%20News%20Center/src/app/admin/dashboard/page.tsx)
#### [MODIFY] [AdminControlPanel.tsx](file:///c:/Users/Vitumbiko/World%20News%20Center/src/components/AdminControlPanel.tsx)
- Port dashboard layout, grid cards, tables, status tags, toggle selectors, and moderator queues to Tailwind.

#### [MODIFY] [page.tsx](file:///c:/Users/Vitumbiko/World%20News%20Center/src/app/reader/dashboard/page.tsx)
#### [MODIFY] [page.tsx](file:///c:/Users/Vitumbiko/World%20News%20Center/src/app/uploader/dashboard/page.tsx)
#### [MODIFY] [UploadForm.tsx](file:///c:/Users/Vitumbiko/World%20News%20Center/src/components/UploadForm.tsx)
- Port reader history grid, uploader forms, and split screen contribution cards to Tailwind.

#### [DELETE] All legacy `.module.css` files
- Remove styling files from component and page folders.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify the Tailwind v4 compilation, PostCSS configuration, and TypeScript builds.

### Manual Verification
- Test Dark/Light/System theme toggles via the new shadcn `ThemeToggle` component.
- Verify that responsive viewport behavior (e.g. hamburger navbar toggle, mobile grid adjustments) matches or exceeds original quality.
- Verify user authentication pages, dashboard routing panels, and admin approval queues render beautifully.
