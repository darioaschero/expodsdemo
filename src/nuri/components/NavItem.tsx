/* ══════════════════════════════════════════════════════════════════
 * NAV-ITEM · the RN side of <nuri-nav-item> · N+8 · decision 52
 * ──────────────────────────────────────────────────────────────────
 * API mirrors nav-item.js:
 *   onPress?  () => void
 *   leading?  React.ReactNode   optional leading book-end
 *   children  the row label
 *
 * RECIPE (decision 52) — a named composition over the primitives:
 * InteractiveListItem ∘ ListItem ∘ auto-filled muted caret. NO recipe
 * tokens of its own. The caret is muted via chrome.borderStrong (the RN
 * analogue of the web trailing's color → Icon currentColor; NO `muted`
 * prop on Icon · decision 38). Label is <Typography size="md" emphasis>.
 * ══════════════════════════════════════════════════════════════════ */

import * as React from 'react';
import { InteractiveListItem } from './List';
import { Icon } from './Icon';
import { Typography } from './Typography';
import { resolveToken, useRuntimeTokens } from '../theme';
import type { TokenPath } from '../contract';

export type NavItemProps = {
  onPress?: () => void;
  leading?: React.ReactNode;
  children?: React.ReactNode;
};

export const NavItem: React.FC<NavItemProps> = ({ onPress, leading, children }) => {
  const tokens = useRuntimeTokens();
  const caretColor = resolveToken(tokens, 'chrome.borderStrong' as const satisfies TokenPath) as string;

  return (
    <InteractiveListItem
      onPress={onPress}
      leading={leading}
      trailing={<Icon name="caret-right" size="md" color={caretColor} />}
    >
      <Typography size="md" emphasis>
        {children}
      </Typography>
    </InteractiveListItem>
  );
};
