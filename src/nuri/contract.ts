/* ──────────────────────────────────────────────────────────────
 * NURI · DS CONTRACT · the single seam into the read-only spec
 * ──────────────────────────────────────────────────────────────
 * This is the ONLY file in the consumer that reaches into the
 * DesignSystemSpec snapshot. Everything else imports the contract
 * from here — so if the spec ever moves, exactly one path changes.
 *
 * "The emit IS the contract" — we import the generated build/*
 * artifacts (decision 35: build/ is generated, never re-derived
 * from styles/ or the CSS). We do NOT touch lib/ or styles/.
 *
 *   build/tokens.ts            runtime sets: chrome · accent · space
 *                              · size · radius · type (+ Accent/Theme)
 *   build/token-paths.ts       the TokenPath discriminated union
 *   build/icons.ts             IconName × weight SVG registry
 *   build/components/<name>.ts per-component numerics + TokenPath refs
 * ────────────────────────────────────────────────────────────── */

import {
  chrome,
  accent as accentTokens,
  space,
  size,
  radius,
  type as typeScale,
} from '../../DesignSystemSpec/build/tokens';
import type { Accent, Theme, TypeSize, TypeWeight, TypeStep } from '../../DesignSystemSpec/build/tokens';
import type { TokenPath } from '../../DesignSystemSpec/build/token-paths';
import { icons } from '../../DesignSystemSpec/build/icons';
import type { IconName, IconWeight } from '../../DesignSystemSpec/build/icons';

// Per-component specs (the literal numerics + TokenPath references the
// pipeline emits · decision 34). Imported, never re-typed.
import { button } from '../../DesignSystemSpec/build/components/button';
import { iconButton } from '../../DesignSystemSpec/build/components/icon-button';
import { tabBar as tabBarTokens } from '../../DesignSystemSpec/build/components/tab-bar';
import { list as listTokens } from '../../DesignSystemSpec/build/components/list';
import { listItem } from '../../DesignSystemSpec/build/components/list-item';
import { listInteractiveItem } from '../../DesignSystemSpec/build/components/list-interactive-item';
import { switchTokens } from '../../DesignSystemSpec/build/components/switch';
import { tabs as tabsTokens } from '../../DesignSystemSpec/build/components/tabs';

export {
  chrome,
  accentTokens,
  space,
  size,
  radius,
  typeScale,
  icons,
  button,
  iconButton,
  tabBarTokens,
  listTokens,
  listItem,
  listInteractiveItem,
  switchTokens,
  tabsTokens,
};

export type { Accent, Theme, TypeSize, TypeWeight, TypeStep, TokenPath, IconName, IconWeight };
