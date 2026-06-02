# Nuri · Expo DS demo

A standalone **Expo / React Native** app that *consumes* the **Nuri design-system spec**
(`./DesignSystemSpec/`, a read-only snapshot). It is the **first real render** of the spec's
React-Native side — the spec ships migration tests, but those are type-only (`tsc --noEmit`, they
never render). This app builds a custom Nuri theme provider + low-level primitives, then rebuilds
the **My-vault** playground screen from them, in light **and** dark.

## What's here

```
DesignSystemSpec/            read-only spec snapshot (the contract — we consume build/*, never edit)
src/nuri/
  contract.ts                the ONE seam into DesignSystemSpec/build/* (tokens, icons, component specs)
  theme.tsx                  NuriThemeProvider · NuriScope · useNuriTheme · useRuntimeTokens
                             · resolveToken · typeStyle  (productionized from _shared.tsx)
  components/                Box · Stack · Screen · Scroll · Spacer · Separator · Typography
                             · TypographyStack · Icon · IconButton · Button · Topbar · TabBar
                             · List/ListItem/InteractiveListItem · NavItem
  index.ts                   public barrel
src/screens/
  MyVault.tsx                the playground screen, rebuilt from Nuri components
App.tsx                      mounts MyVault full-screen (tap the swap button to toggle light/dark)
SPEC-FEEDBACK.md             findings fed back to the DS team (the highest-value output)
```

## Architecture (how it stays faithful to the spec)

- **The emit IS the contract.** `contract.ts` re-exports the generated `build/*` artifacts
  (`tokens.ts`, `token-paths.ts`, `icons.ts`, `components/<name>.ts`). Nothing re-derives values
  from the CSS or `styles/`.
- **Theming is a single orthogonal context** `{ mode, accent }` (decision 27/62). `NuriThemeProvider`
  sets the root; `NuriScope` is merge-on-override for subtrees; the token slice is *derived* via
  `useRuntimeTokens()` — never stored in context.
- **`resolveToken(tokens, path)`** dereferences a `TokenPath` → `string` (colour) | `number`
  (dimension). **`typeStyle(key)`** is the one relative→absolute type conversion.
- **Styling is productionized** (`StyleSheet.create` for static, memoized factories for theme-
  dependent) — the structure is ours; the token paths are the spec's.
- **Behavioural deltas are budgeted, not hidden** (R1): Pressable render-prop for press
  (F-PRESSED-1), no focus ring (F-FOCUS-1), opacity+a11yState for disabled (F-DISABLED-1),
  explicit a11y labels on icon-only controls (F-ARIA-LABEL-1), etc.

## Run it

```bash
npm install
npm run web        # Expo Web → http://localhost:8081  (also: npm run ios / npm run android)
npx tsc --noEmit   # typecheck the app + the imported build/* contract
```

The app is the My-vault screen, full-screen (no harness chrome). There are no controls — **tap the
swap affordance** (the `arrows-down-up` IconButton between the balances) to flip the theme between
light and dark. That swap `IconButton` (`accent="neutral"` solid) **inverts** with the theme — black
in light, white in dark — the spec's N+15 lesson, rendered for real.

## Feedback loop

Building real components against the contract surfaced four mirror-level findings (all invisible to
the type-only migration test) and confirmed two positive controls. See **[SPEC-FEEDBACK.md](SPEC-FEEDBACK.md)**
— that list, not the demo itself, is the deliverable back to the Nuri team.
