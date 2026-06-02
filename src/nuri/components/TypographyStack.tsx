/* ══════════════════════════════════════════════════════════════════
 * TYPOGRAPHY-STACK · the RN side of <nuri-typography-stack> · decision 53
 * ──────────────────────────────────────────────────────────────────
 * Single-element rhythm container. Wraps plain Typography lines and owns
 * ONLY the inter-line rhythm (decision 47):
 *   direction? 'column' | 'row'   default 'column'
 *   children   Typography lines
 *
 * column → tight 2xs leading; row → wider xs gutter + baseline alignment
 * so mixed-size lines share a text baseline. The gap is OWNED, not a prop.
 * ══════════════════════════════════════════════════════════════════ */

import * as React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { space } from '../contract';

export type TypographyStackProps = {
  direction?: 'column' | 'row';
  children?: React.ReactNode;
  // off-contract passthrough (lets a row stack host a Spacer that grows to
  // fill — the My-vault balance lines · align stays baseline).
  style?: StyleProp<ViewStyle>;
};

export const TypographyStack: React.FC<TypographyStackProps> = ({ direction = 'column', children, style }) => (
  <View
    style={[
      {
        flexDirection: direction,
        gap: direction === 'row' ? space.xs : space['2xs'],
        ...(direction === 'row' ? { alignItems: 'baseline' as const } : null),
      },
      style,
    ]}
  >
    {children}
  </View>
);
