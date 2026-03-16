# Admin Global Theme Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the application theme into a global admin-managed setting and remove all user-side color customization from `/settings`.

**Architecture:** The app will keep a single runtime theme provider, but its source of truth will be Convex `app_settings` managed from `/admin`. User-local color overrides in `localStorage` will be removed from the read path, and the settings UI will stop exposing theme color controls. A follow-up normalization pass will migrate hardcoded visual values to semantic tokens so the admin theme actually propagates across the product.

**Tech Stack:** Next.js 16, React 19, Convex, Clerk, Tailwind v4, CSS custom properties

---

## File Map

- Modify: `convex/settings.ts`
  Purpose: lock down writes to global app settings and keep theme reads centralized.
- Modify: `src/components/providers/DynamicThemeProvider.tsx`
  Purpose: stop honoring user-local color overrides and always apply the global admin theme.
- Modify: `src/lib/theme-colors.ts`
  Purpose: remove dead user-theme persistence paths or reduce them to admin/global helpers only.
- Modify: `src/app/settings/page.tsx`
  Purpose: remove all theme color state and wiring from user settings.
- Modify: `src/components/settings/SettingsManagementSection.tsx`
  Purpose: remove preset palette UI, custom pickers, preview block, and any remaining user color actions.
- Modify: `src/app/admin/page.tsx`
  Purpose: keep `/admin` as the only editable theme surface and tighten copy around “global theme”.
- Modify: `docs/TECHNICAL_REFERENCE.md`
  Purpose: document the decision that theme colors are global and admin-only.
- Test: manual browser verification on `/admin`, `/settings`, `/`, `/sign-in`, `/studio`

## Chunk 1: Freeze Theme Governance

### Task 1: Protect global settings writes in Convex

**Files:**
- Modify: `convex/settings.ts`

- [ ] **Step 1: Add admin authorization to the generic settings mutation**

Make `saveAppSetting` require `admin_email` and validate it using the same admin rule already used in other Convex admin modules.

- [ ] **Step 2: Update admin callers to pass the admin identity explicitly**

Keep `/admin` working after the mutation contract changes.

- [ ] **Step 3: Verify no non-admin caller still uses the old mutation signature**

Run:
```powershell
rg -n "saveAppSetting" src convex
```

Expected: only admin-controlled paths remain.

### Task 2: Remove user-local theme override precedence

**Files:**
- Modify: `src/components/providers/DynamicThemeProvider.tsx`
- Modify: `src/lib/theme-colors.ts`

- [ ] **Step 1: Change the provider so it always resolves theme from Convex defaults**

Remove `localStorage` precedence from the runtime path.

- [ ] **Step 2: Keep only the helpers still needed by admin/global theme application**

Delete or deprecate `readThemeColors` and `writeThemeColors` if they no longer serve a valid flow.

- [ ] **Step 3: Verify that refreshing the app keeps the same palette for every user**

Manual check:
1. open `/`
2. open `/sign-in`
3. open `/settings`
4. confirm all surfaces use the same admin-defined theme

## Chunk 2: Remove Theme Controls From User Settings

### Task 3: Strip theme color state from the settings page

**Files:**
- Modify: `src/app/settings/page.tsx`

- [ ] **Step 1: Remove queries and local state that only exist for user theme editing**

Delete theme-default query usage, scheme detection logic, and color state.

- [ ] **Step 2: Keep only real user settings**

Preserve panel position, assistance toggle, billing, and profile/logout flows.

- [ ] **Step 3: Verify the page still renders cleanly on mobile and desktop**

Manual check:
1. `/settings` mobile
2. `/settings` desktop
3. confirm there is no palette UI and spacing still feels intentional

### Task 4: Simplify the management section component

**Files:**
- Modify: `src/components/settings/SettingsManagementSection.tsx`

- [ ] **Step 1: Remove palette presets, custom color pickers, and theme preview card**

The section should only contain legitimate user-facing preferences.

- [ ] **Step 2: Rebalance layout after removing the right-side preview column**

Collapse to a simpler single-column or cleaner two-block composition.

- [ ] **Step 3: Clean imports and props**

Remove unused theme-related props and helpers.

## Chunk 3: Clarify Admin As The Only Theme Surface

### Task 5: Adjust admin copy and UX around the theme block

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: Update copy to state that theme colors are global**

Make it explicit that the admin theme affects the whole app.

- [ ] **Step 2: Check if two colors are enough for the current system**

If keeping only `primary` and `secondary`, the copy should reflect that it controls the global accent palette, not the full design system.

- [ ] **Step 3: Verify save behavior**

Manual check:
1. change both colors in `/admin`
2. save
3. refresh `/`, `/sign-in`, `/settings`
4. confirm the new theme is applied globally

## Chunk 4: Normalize Theme Usage

### Task 6: Remove the most visible hardcoded color violations

**Files:**
- Modify: `src/components/auth/AuthShell.tsx`
- Modify: `src/components/ui/spinner.tsx`
- Modify: other high-visibility surfaces discovered during pass

- [ ] **Step 1: Replace obvious hardcoded brand blues, whites, slates, and fills with semantic tokens**

Start with auth and shared primitives, because they shape first impression.

- [ ] **Step 2: Keep exceptions only where product content genuinely needs literal color**

Example: brand logos or third-party identity marks.

- [ ] **Step 3: Run a targeted grep to measure remaining debt**

Run:
```powershell
rg -n "bg-white|#[0-9A-Fa-f]{6}|rgba\\(|border-slate|text-black|text-white" src/app src/components
```

Expected: the count drops meaningfully, especially in shared/layout/auth files.

### Task 7: Verify visual coherence against the SaaS direction

**Files:**
- No direct file edits

- [ ] **Step 1: Review key routes visually**

Check:
1. `/`
2. `/sign-in`
3. `/settings`
4. `/admin`
5. `/studio`

- [ ] **Step 2: Confirm the app reads as one system**

Look for:
- same accent family
- same border softness
- same surface logic
- no orphan hardcoded blue blocks

- [ ] **Step 3: Log follow-up debt separately**

Anything not fixed in this pass should become a second normalization ticket, not an endless scope creep loop.

## Chunk 5: Documentation And Verification

### Task 8: Document the theme governance decision

**Files:**
- Modify: `docs/TECHNICAL_REFERENCE.md`

- [ ] **Step 1: Add a short section describing the new rule**

State that theme colors are global, live in `app_settings`, and are editable only from `/admin`.

- [ ] **Step 2: Mention migration behavior**

State that user-local color customization is deprecated and should not be reintroduced.

### Task 9: Final verification

**Files:**
- No direct file edits

- [ ] **Step 1: Run UTF-8/mojibake scan**

Run:
```powershell
rg -n -P "\\u00C3|\\u00C2|\\uFFFD" src
```

- [ ] **Step 2: Run targeted lint or type checks for touched files**

Use the lightest command that gives confidence without opening unrelated debt.

- [ ] **Step 3: Browser verification**

Use the isolated debug browser and confirm:
- no theme controls in `/settings`
- admin theme saves correctly
- no visual regressions on first-impression screens

## Risks

- Existing users may still have stale theme values in `localStorage`; the new provider path must ignore them completely.
- Tightening `saveAppSetting` may break hidden callers if any non-admin surface still uses it.
- Removing the theme block from settings may leave awkward spacing if the layout is not recomposed.
- Because the design system still contains many hardcoded values, the admin theme may feel weaker than expected until the normalization pass is done.

## Recommended Commit Sequence

1. `refactor: centralize theme governance in admin`
2. `refactor: remove user theme controls from settings`
3. `style: normalize shared surfaces to semantic theme tokens`
4. `docs: document admin-managed global theme`

