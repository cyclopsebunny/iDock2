# Project notes

UX prototype of the iDock Controller 2.0 touchscreen device, built with
Vite + React + TypeScript + Tailwind. Device frame is locked to 480×800 px
and rendered with the `<DeviceFrame>` component. Live demo deploys to
GitHub Pages at https://cyclopsebunny.github.io/iDock2/.

## Prefer existing shared components when adding new pages

When building a new menu / settings / configuration screen, reach for the
shared components in `src/components/` first. Building one-off copies of
these primitives is how the codebase ends up with size, color, or padding
drift across screens.

The components most likely to apply:

| What you need | Component | Notes |
|---|---|---|
| Bottom-anchored modal panel with header (back arrow + title + close X) | `MenuModal` | Pass `title`, `onClose`, optional `onBack`. Use `height={514}` for the top-level main menu, default `768` elsewhere. |
| Standard Save CTA at the bottom of a settings panel | `SaveButton` | Defaults to "Save Settings"; pass `label="Save Configuration"` for camera + motion screens. Brand-primary blue when `enabled`, gray when not. Don't redefine sizing locally. |
| Enabled / Disabled, OFF / ON, or other 2-3 segment switch | `SegmentedToggle` | Per-option `tone: 'positive' \| 'negative' \| 'info' \| 'neutral'`. Disabled / OFF segments use `'negative'` (red `bg-panel-red`); Enabled segments use `'positive'` (green `#6ac449`). |
| List row with right-aligned status / chevron | `MenuRow` | Used in every settings list. Accepts `label`, optional `status`, optional `onClick`. |
| Up/Down paging chevrons at the bottom of a scrolling list | `PagingFooter` | Touchscreen-friendly replacement for scrollbars. |
| 480×800 red / yellow / green device frame | `DeviceFrame` | `theme: 'red' \| 'bypass' \| 'positive'`. |
| Top-of-frame red/yellow/green panel with icon + wifi | `TopGraphic` | Many variants — see the `TopGraphicVariant` union. Pick the existing variant before adding a new one. Dark variants exist for bypass-themed screens. |
| Full-frame status screen with top icon + status text + optional bottom prompt | `UnlockedScreen` | Used for Truck at Dock, Restraint Engaged, Door Open / Operate Leveler, Leveler Deployed, Leveler Stored, Restraint Bypassed, Door Closed. Drive variation via `topGraphic`, `topSubtitle`, `prompt`, `showDoorNumber`. |
| Physical hardware button panel below the device | `PhysicalControls` | Wired with `onEngageRestraint`, `onReleaseRestraint`, `onDoorOpen`, `onDoorClose`, `onDoorStop`, `onLevelerPressDown`, `onLevelerPressUp`, `levelerStored`. |

When something doesn't fit one of the above and you reach for inline
markup, ask whether the new screen will repeat the markup elsewhere. If
yes, extract the new helper into `src/components/` and use it everywhere
from day one — that keeps padding, font sizes, and colors aligned across
screens.

## Other conventions

- All static assets in `public/controls/` are referenced via
  `${import.meta.env.BASE_URL}controls/...` so they resolve correctly on
  GitHub Pages (the site is served from `/iDock2/`, not the root).
- i18n: every user-visible string is wrapped in `t(...)` from the
  `useT()` hook, keyed by the English source. Translations live in
  `src/i18n/translations.ts`.
- App-level state machine for the dock workflow (truck at dock,
  restraint engaged, door open, leveler deployed, bypass mode, etc.)
  lives in `src/App.tsx`. The right-hand "Simulated Sensors" panel
  drives the demo without needing physical hardware.
- Bypass mode (`restraintEngaged && restraintBypassed`) carries a
  distinct yellow theme through every session screen: dark-brown top
  icons (variant ends in `-dark`), dark-brown wifi glyph, "Restraint in
  Bypass" subtitle below the top icon, and `tone: 'alert'` prompt bars.
  Don't ship a new in-session screen without supporting the bypass
  variant.
