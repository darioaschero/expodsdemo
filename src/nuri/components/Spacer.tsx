/* ══════════════════════════════════════════════════════════════════
 * SPACER · the RN side of <nuri-spacer> · decision 59 / 61 · N+11
 * ──────────────────────────────────────────────────────────────────
 * A flexible gap. API mirrors spacer.css:
 *   direction? 'row' | 'column'        default 'row'
 *   size?      SpaceLeaf ('xs'..'xl')  fixed extent · omitted → grow
 *   grow?      1 | 2 | 3 | 4           proportional grow share · default 1
 *
 * Grow (no size) → flex: grow (a positive RN `flex` IS proportional
 * flexGrow · decision 61). Fixed (size) → a definite extent on the chosen
 * axis. `direction` only picks which dimension a fixed size fills; grow
 * follows the parent's main axis regardless.
 * ══════════════════════════════════════════════════════════════════ */

import * as React from 'react';
import { View, type ViewStyle } from 'react-native';
import { space } from '../contract';
import type { SpaceLeaf } from '../theme';

export type SpacerProps = {
  direction?: 'row' | 'column';
  size?: SpaceLeaf;
  grow?: 1 | 2 | 3 | 4;
};

export const Spacer: React.FC<SpacerProps> = ({ direction = 'row', size, grow = 1 }) => {
  const style: ViewStyle = size
    ? direction === 'column'
      ? { height: space[size] }
      : { width: space[size] }
    : { flex: grow };
  return <View style={style} />;
};
