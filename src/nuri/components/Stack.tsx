/* ══════════════════════════════════════════════════════════════════
 * STACK · the RN side of <nuri-stack> · decision 37
 * ──────────────────────────────────────────────────────────────────
 * Layout primitive · flex container. Operator-locked API:
 *   direction? 'column' | 'row'                  default 'column'
 *   gap?       SpaceLeaf ('xs'..'xl')             subset of space
 *   align?     'start'|'center'|'end'|'stretch'|'baseline'
 *   justify?   'start'|'center'|'end'|'between'|'around'
 *   wrap?      boolean
 *   fill?      boolean  → grow to fill the parent's main axis (decision 60)
 *
 * No component-token aliasing (decision 37): `gap` reads space[gap] at the
 * call site. `fill` maps the web `flex: 1 0 auto` to RN's precise twin
 * { flexGrow: 1, flexShrink: 0 } (grow when short, keep content height when
 * tall so a Scroll scrolls instead of clipping).
 * ══════════════════════════════════════════════════════════════════ */

import * as React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { space } from '../contract';
import type { SpaceLeaf } from '../theme';

export type StackProps = {
  direction?: 'column' | 'row';
  gap?: SpaceLeaf;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  fill?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const ALIGN_MAP: Record<NonNullable<StackProps['align']>, ViewStyle['alignItems']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const JUSTIFY_MAP: Record<NonNullable<StackProps['justify']>, ViewStyle['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
};

export const Stack: React.FC<StackProps> = ({
  direction = 'column',
  gap,
  align,
  justify,
  wrap,
  fill,
  children,
  style,
}) => {
  const layout = React.useMemo<ViewStyle>(
    () => ({
      flexDirection: direction,
      ...(gap ? { gap: space[gap] } : null),
      ...(align ? { alignItems: ALIGN_MAP[align] } : null),
      ...(justify ? { justifyContent: JUSTIFY_MAP[justify] } : null),
      ...(wrap ? { flexWrap: 'wrap' } : null),
      ...(fill ? { flexGrow: 1, flexShrink: 0 } : null),
    }),
    [direction, gap, align, justify, wrap, fill],
  );
  return <View style={[layout, style]}>{children}</View>;
};
