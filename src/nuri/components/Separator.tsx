/* ══════════════════════════════════════════════════════════════════
 * SEPARATOR · the RN side of <nuri-separator> · N+6.9 · decision 49
 * ──────────────────────────────────────────────────────────────────
 * A generic 1px hairline — author-placed. A 1px-tall View, stretched on
 * the cross axis, filled with the theme's border-subtle chrome token.
 * Horizontal only. Structural divider · accessibilityRole="none".
 *
 * ONE prop: `ySpace` (amendment 49.1) — vertical breathing room above/
 * below, over none + xs–xl (default 'sm'). It is a marginVertical, NOT a
 * thicker fill: the visible hairline stays exactly 1px at every value.
 *
 * ⚠ SPEC-FEEDBACK F-DEMO-4 (latent · the matrix only used Separator in a
 * COLUMN): the web hairline is `inline-size: 100%` — axis-ABSOLUTE
 * horizontal — so flexbox shrinks it to flank correctly in BOTH a column
 * and a row. The mirror's `alignSelf: 'stretch'` is axis-RELATIVE (fills
 * the CROSS axis), which is full-width in a column but collapses to zero
 * width in a row (My-vault's swap affordance flanks the button with two
 * separators IN A ROW). The faithful RN translation of `inline-size:100%`
 * is `width: '100%'` + `flexShrink: 1`: full width in a column, and shrinks
 * to share the row's free space alongside the button. Keeps the 1px height.
 * ══════════════════════════════════════════════════════════════════ */

import * as React from 'react';
import { View } from 'react-native';
import { chrome, space } from '../contract';
import { useNuriTheme } from '../theme';

export type SeparatorProps = {
  ySpace?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export const Separator: React.FC<SeparatorProps> = ({ ySpace = 'sm' }) => {
  const { mode } = useNuriTheme();
  return (
    <View
      accessibilityRole="none"
      style={{
        height: 1,
        width: '100%',
        flexShrink: 1,
        marginVertical: space[ySpace],
        backgroundColor: chrome[mode].borderSubtle,
      }}
    />
  );
};
