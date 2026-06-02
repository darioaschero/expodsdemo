/* ══════════════════════════════════════════════════════════════════
 * BOX · the RN side of <nuri-box> · decision 37 · 42 · 60
 * ──────────────────────────────────────────────────────────────────
 * Padding family + visual surface. Operator-locked API:
 *   padding / paddingX / paddingY / paddingStart / paddingEnd /
 *   paddingTop / paddingBottom : SpaceLeaf ('xs'..'xl')
 *   background? : 'canvas'|'subtle'|'strong'|'accent-solid'|'accent-subtle'
 *   radius?     : 'sm'|'md'|'lg'|'full'
 *   center?     : boolean   · fill? : boolean   · style? passthrough
 *
 * On RN, Box renders a <View> (no `as` — that was web host-element
 * resolution). `padding*` read space[leaf] directly (decision 37, no
 * component-token aliasing). `background` resolves a chrome/accent surface
 * token at render time (context-aware · useRuntimeTokens). `fill` →
 * { flexGrow: 1, flexShrink: 0 } (web `flex: 1 0 auto`; an RN View is
 * already a flex column, so only the grow part is needed).
 *
 * ⚠ F-BOX-FG-1 (budgeted · R1): on web, background="accent-solid" ALSO
 * sets color:var(--nuri-accent-on-solid) so descendant text inherits the
 * on-solid foreground. RN has no colour inheritance View→Text, so this
 * sets ONLY backgroundColor — text on an accent-solid Box must set its
 * colour explicitly (read accent.onSolid). Props stay 1:1; only the
 * coupled-foreground inheritance mechanism differs.
 * ══════════════════════════════════════════════════════════════════ */

import * as React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { space, radius as radiusScale } from '../contract';
import type { TokenPath } from '../contract';
import type { SpaceLeaf } from '../theme';
import { resolveToken, useNuriTheme, runtimeTokens } from '../theme';

export type BoxBackground = 'canvas' | 'subtle' | 'strong' | 'accent-solid' | 'accent-subtle';
export type BoxRadius = 'sm' | 'md' | 'lg' | 'full';

// background enum → the surface TokenPath box.css dispatches to. The
// accent-solid foreground twin (accent.onSolid) is web-only (F-BOX-FG-1).
const BACKGROUND_PATH: Record<BoxBackground, TokenPath> = {
  canvas: 'chrome.bgCanvas',
  subtle: 'chrome.bgSubtle',
  strong: 'chrome.bgStrong',
  'accent-solid': 'accent.solid',
  'accent-subtle': 'accent.bgSubtle',
};

export type BoxProps = {
  padding?: SpaceLeaf;
  paddingX?: SpaceLeaf;
  paddingY?: SpaceLeaf;
  paddingStart?: SpaceLeaf;
  paddingEnd?: SpaceLeaf;
  paddingTop?: SpaceLeaf;
  paddingBottom?: SpaceLeaf;
  background?: BoxBackground;
  radius?: BoxRadius;
  center?: boolean;
  fill?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const Box: React.FC<BoxProps> = ({
  padding,
  paddingX,
  paddingY,
  paddingStart,
  paddingEnd,
  paddingTop,
  paddingBottom,
  background,
  radius,
  center,
  fill,
  children,
  style,
}) => {
  const { mode, accent } = useNuriTheme();

  // Edge-specific wins over axis wins over uniform — same precedence the
  // CSS encodes in selector ordering. The background colour is the only
  // context-dependent leaf, so the slice only enters the deps via mode/accent.
  const layout = React.useMemo<ViewStyle>(() => {
    const bg = background
      ? (resolveToken(runtimeTokens(accent, mode), BACKGROUND_PATH[background]) as string)
      : undefined;
    return {
      ...(padding ? { padding: space[padding] } : null),
      ...(paddingX ? { paddingHorizontal: space[paddingX] } : null),
      ...(paddingY ? { paddingVertical: space[paddingY] } : null),
      ...(paddingStart ? { paddingStart: space[paddingStart] } : null),
      ...(paddingEnd ? { paddingEnd: space[paddingEnd] } : null),
      ...(paddingTop ? { paddingTop: space[paddingTop] } : null),
      ...(paddingBottom ? { paddingBottom: space[paddingBottom] } : null),
      ...(bg ? { backgroundColor: bg } : null),
      ...(radius ? { borderRadius: radiusScale[radius] } : null),
      // `center` centres the Box ITSELF in its parent (web margin-inline:auto),
      // NOT its children — faithful to box.css (decision 42).
      ...(center ? { marginHorizontal: 'auto' as const } : null),
      ...(fill ? { flexGrow: 1, flexShrink: 0 } : null),
    };
  }, [
    padding, paddingX, paddingY, paddingStart, paddingEnd, paddingTop, paddingBottom,
    background, radius, center, fill, mode, accent,
  ]);

  return <View style={[layout, style]}>{children}</View>;
};
