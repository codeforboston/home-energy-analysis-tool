# Case Edit Page — Visual Consistency Normalization

**Issue:** [codeforboston/home-energy-analysis-tool#793](https://github.com/codeforboston/home-energy-analysis-tool/issues/793)
**Date:** 2026-09-21
**Scope:** `heat-stack/app/routes/cases+/$caseId.edit.tsx` and `heat-stack/app/routes/cases+/new.tsx` (both render `SingleCaseForm`), and all section components it composes.

## Problem

The case edit/new page is built from 4 section components (`HomeInformation`, `CurrentHeatingSystem`, `EnergyUseHistory`, `AnalysisHeader`) plus `HeatLoadGrid` and two graph-card components, each of which independently reinvents title/subtitle typography, field markup, spacing, and help-icon placement instead of using the shared `Field`/`ErrorList` primitives already established elsewhere in the app (`app/components/forms.tsx`). This produced:

- The same visual title style (`text-4xl font-bold tracking-wide`) redeclared 4 times under 2 different variable names, on 2 different HTML elements (`<legend>` vs `<h2>`).
- 4 different "subtitle" tiers in practice (`text-2xl font-semibold`, `text-xl font-normal`, bare `font-bold`, and un-styled), where the Figma source design specifies exactly one.
- Inconsistent color tokens for the same semantic role (`text-slate-500` vs `text-slate-700` vs `text-gray-500`).
- Help icons (`HelpButton`) misaligned relative to their labels in most places, because `HelpButton` has no built-in alignment and most call sites place it as a bare sibling of a label with no `flex items-center` wrapper. Only 2 of 9 call sites (the two graph-card headers) get this right today.
- A duplicate `ErrorList` component (`CaseSummaryComponents/ErrorList.tsx`) re-implementing `forms.tsx`'s `ErrorList` byte-for-byte.

Root cause: fragmentation from bypassing existing shared primitives (`Field`, `ErrorList`, `Spacer`), not a missing-primitive problem. ~10 contributors touched these files independently over 2.5 years with no shared token/component to converge on, and there is no Storybook or structural test coverage to catch drift.

This is a **design-language-only** change: no field labels, copy, form behavior, data flow, or validation logic changes. The visual target is the team's Figma design (source-of-truth export supplied by the user), which specifies:

- **Tier 1 (section title):** e.g. "Home information", "Existing heating system" — large bold.
- **Tier 2 (subsection title):** e.g. "Address", "Thermostat settings", "Heat load analysis", "Heating system demand" — smaller bold. Used identically whether it's a fieldset legend, a stat-grid heading, or a graph-card title. Help icons, when present, always attach to a tier-2 title, vertically centered via `flex items-center`.
- **Tier 3 (field label):** e.g. "Street address", "Set point (°F)", stat-tile labels like "Average Indoor Temperature" — small, regular/medium weight, not bold, with a bold value below for stat tiles.
- A thin horizontal divider between major (tier-1) sections only.

## Design

### New/changed components (`heat-stack/app/components/forms.tsx`)

1. **`SectionTitle`** (new) — tier-1 heading. `text-4xl font-bold tracking-wide`. Single source of truth, replacing the 4 duplicated `titleClass`/`titleClassTailwind` constants.

2. **`SubsectionTitle`** (new) — tier-2 heading. `text-2xl font-semibold text-zinc-950`. Props:
   - `as?: 'legend' | 'h3'` (default `'h3'`) — render as `<legend>` when nested inside a `<fieldset>`, for a11y parity with current markup.
   - `help?: { keyName: string }` — when present, wraps the title text and a `HelpButton` in one `flex items-center gap-2` container, guaranteeing vertical centering. This is the pattern already used correctly by `Graphs/HeatLoad.tsx` and `Graphs/WholeHomeUAComparison.tsx`; it becomes the only pattern.

3. **`Field`** (existing, extended) — add the same optional `help?: { keyName: string }` prop. When present, the internal `<Label>` is wrapped with `HelpButton` in a `flex items-center gap-2` row instead of being rendered bare. Also add an optional `description?: React.ReactNode`, rendered between the `<Input>` and the error area — matching the exact visual order every current hand-rolled field already uses (label, input, description, errors). Both props are fully backward compatible — omitting them preserves current behavior for the 14+ other routes using `Field` (auth, settings, notes).

4. Tier-3 field/stat labels get no new component — they use `Field`'s existing default `Label` styling (regular weight, small) as the canonical tier-3 style.

### Migration (visual/structural only, no content changes)

| File | Change |
|---|---|
| `HomeInformation.tsx` | Legend → `SectionTitle`; "Address" and "Living area" legends/labels → `SubsectionTitle` (Living area keeps its `help`); hand-rolled Label+Input+error blocks → `Field`. Remove local `titleClass`/`subtitleClass`/`descriptiveClass`/`componentMargin` constants. |
| `CurrentHeatingSystem.tsx` | Legend → `SectionTitle`; "Heating system efficiency", "Design temperature override", "Thermostat settings" → `SubsectionTitle` (with `help` where applicable). The 3 thermostat field labels (`Set point`, `Setback temperature`, `Setback hours per day`) currently use bare `font-bold` — **demote** to tier-3 (`Field`'s default `Label`), matching the Figma; they are not subsection titles. Hand-rolled field blocks → `Field`. |
| `EnergyUseHistory.tsx` | "Energy Use History" legend → `SectionTitle` (help icon, if any, moves off the tier-1 title per Figma — tier-1 titles don't carry help icons). "Heating fuel usage" → `SubsectionTitle` with `help`. |
| `AnalysisHeader.tsx` | "Heat Load Analysis" `<h2>` → `SectionTitle`. Stat grid labels (`item-title-small text-xl font-normal text-slate-700`) → demote to tier-3, matching `HeatLoadGrid`'s label/value pattern (bold value, regular label, `text-slate-500` not `text-slate-700`). |
| `HeatLoadGrid.tsx` | Fix color token: `text-gray-500` → `text-slate-500` (matches the rest of the app; `gray` and `slate` are different Tailwind scales). |
| `Graphs/HeatLoad.tsx`, `Graphs/WholeHomeUAComparison.tsx` | Swap their already-correct inline `flex items-center gap-2 text-2xl font-semibold` header markup for `SubsectionTitle` (removes the last remaining duplicated class string; no visual change since this is the reference pattern). |
| `CaseSummaryComponents/ErrorList.tsx` | Delete (duplicate of `forms.tsx`'s `ErrorList`); update its one caller to import from `forms.tsx`. |

### Non-goals

- No copy/label text changes (even where current text diverges slightly from the Figma's wording).
- No changes to form validation, data flow, or the Zod schema/action.
- No new design-tokens file or markdown style guide — the standard is enforced by the component API itself (per user preference).
- No changes to routes/pages outside the case edit/new form, even though `Field`/`ErrorList` are shared primitives used elsewhere.

### Testing

- Existing tests (`SingleCaseForm.test.tsx`, `$caseId.edit.test.ts`) assert on `data-testid` and text content on wrapper divs that are not being removed — they should continue to pass unmodified.
- No visual regression tooling exists in this repo; verification is manual: run `npm run dev`, compare each section against the Figma export screenshots captured during design, for both the new-case and edit-case routes.
- `npm run typecheck` and `npm run lint` must pass after migration (prop additions are typed, no `any`).

## Spec self-review

- No placeholders/TBDs remain.
- Scope is bounded to one page's components plus one additive, backward-compatible extension to a shared primitive — appropriately sized for a single implementation plan.
- Ambiguity resolved: tier assignment for every title/label instance in the current code is enumerated above; nothing is left for the implementer to guess.
- Amended during plan-writing (2026-09-21): discovered `Field` had no slot for the description text under nearly every hand-rolled field. Added the `description` prop above rather than dropping content or reordering it — confirmed with user.
