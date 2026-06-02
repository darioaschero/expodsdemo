/* ══════════════════════════════════════════════════════════════════
 * TYPOGRAPHY · the RN side of <nuri-typography> · decision 53 · 54
 * ──────────────────────────────────────────────────────────────────
 * The text primitive (the strategy's "Text"). API mirrors typography.js:
 *   size?     'xs'|'sm'|'md'|'lg'|'xl'|'3xl'      default 'md'
 *   emphasis? boolean   regular → semibold
 *   muted?    boolean   text-primary → text-muted
 *   align?    'start'|'center'|'end'   logical (mapped to physical · LTR)
 *   children  the line
 *
 * Metrics come from the emitted `type` namespace via typeStyle(key) — the
 * ONE relative→absolute conversion (decision 54). Colour is on the runtime
 * chrome surface: default → text-primary, muted → text-muted, both from
 * chrome[mode] (RN has no currentColor; the web default-inherit maps to
 * text-primary here · decision 42/53). `fontFamily` is parked (F-FONT-1):
 * RN uses the platform system font.
 * ══════════════════════════════════════════════════════════════════ */

import * as React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { chrome } from '../contract';
import type { TypeSize } from '../contract';
import { typeStyle, useNuriTheme } from '../theme';
import type { TypeKey } from '../theme';

export type TypographyProps = {
  size?: TypeSize;
  emphasis?: boolean;
  muted?: boolean;
  align?: 'start' | 'center' | 'end';
  children?: React.ReactNode;
  // Optional escape hatch for one-off overrides (e.g. a colour the spec
  // doesn't model). Kept off the contract surface — used sparingly.
  style?: StyleProp<TextStyle>;
};

// Web `align` is logical start|center|end (RTL-aware). RN textAlign has no
// logical start/end — map to PHYSICAL left/right for the LTR case
// (decision 59 · F-TEXTALIGN-RTL logged, not solved: true RTL would flip
// end↔left via I18nManager.isRTL).
const TEXT_ALIGN_MAP: Record<NonNullable<TypographyProps['align']>, TextStyle['textAlign']> = {
  start: 'left',
  center: 'center',
  end: 'right',
};

export const Typography: React.FC<TypographyProps> = ({
  size = 'md',
  emphasis = false,
  muted = false,
  align,
  children,
  style,
}) => {
  const { mode } = useNuriTheme();

  const textStyle = React.useMemo<TextStyle>(() => {
    const key: TypeKey = emphasis ? `${size}Em` : size;
    return {
      ...typeStyle(key),
      color: muted ? chrome[mode].textMuted : chrome[mode].textPrimary,
      ...(align ? { textAlign: TEXT_ALIGN_MAP[align] } : null),
    };
  }, [size, emphasis, muted, align, mode]);

  return <Text style={[textStyle, style]}>{children}</Text>;
};
