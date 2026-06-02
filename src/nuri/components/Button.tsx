/* ══════════════════════════════════════════════════════════════════
 * BUTTON · the RN side of <nuri-button>
 * ──────────────────────────────────────────────────────────────────
 * API mirrors button.js:
 *   variant?  'solid' | 'soft'      default 'soft'
 *   accent?   Accent                overrides ambient context (Tier 2)
 *   size?     'lg' | 'md' | 'sm'    default 'md'  (decision 41 · 55)
 *   disabled? boolean
 *   onPress?  () => void
 *   children  string (label only — Button is text-only · see SPEC-FEEDBACK F-DEMO-1)
 *
 * SIZE (decision 41/55): per-size geometry triple from button.ts; the
 * label type tracks size (sm → smEm; md/lg → mdEm).
 *
 * PRODUCTIONIZED STYLING (vs the mirror's inline resolve): the static flex
 * box lives in StyleSheet.create; the theme-dependent geometry + variant
 * fills + label colour are resolved ONCE per (accent × mode × variant ×
 * size) via a memoised style factory, then the press render-prop just
 * indexes pressed. Token paths are resolved through the contract's
 * resolveToken exactly as the spec dictates — only the structure is ours.
 *
 * Behavioural deltas (budgeted · R1):
 *   F-PRESSED-1  · Pressable `pressed` render-prop drives the variant swap
 *                  (web fires :active via CSS).
 *   F-FOCUS-1    · no focus ring (RN has no DOM focus model).
 *   F-DISABLED-1 · opacity 0.4 + accessibilityState.disabled (web also shows
 *                  cursor:not-allowed — web-only, no RN analogue).
 *
 * Note · NO `flex: 1` here (SPEC-FEEDBACK F-DEMO-2): the web .nuri-button is
 * display:inline-flex (content-sized). A column parent's default
 * alignItems:'stretch' gives full-width buttons; a row keeps them content-width.
 * ══════════════════════════════════════════════════════════════════ */

import * as React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { button } from '../contract';
import type { Accent, Theme, TokenPath } from '../contract';
import { resolveToken, runtimeTokens, typeStyle, useNuriTheme } from '../theme';
import type { RuntimeTokens, TypeKey } from '../theme';

export type ButtonVariant = 'solid' | 'soft';
export type ButtonSize = 'lg' | 'md' | 'sm';

export type ButtonProps = {
  variant?: ButtonVariant;
  accent?: Accent;
  size?: ButtonSize;
  disabled?: boolean;
  onPress?: () => void;
  children: string;
};

// Per-size geometry triple (button.ts emits one per size · decision 41) +
// the label type key decision 55 couples to size (sm → smEm; md/lg → mdEm).
const GEOMETRY: Record<ButtonSize, { minHeight: TokenPath; paddingX: TokenPath; radius: TokenPath }> = {
  lg: { minHeight: button.lgMinHeight, paddingX: button.lgPaddingX, radius: button.lgRadius },
  md: { minHeight: button.mdMinHeight, paddingX: button.mdPaddingX, radius: button.mdRadius },
  sm: { minHeight: button.smMinHeight, paddingX: button.smPaddingX, radius: button.smRadius },
};
const LABEL_KEY: Record<ButtonSize, TypeKey> = { lg: 'mdEm', md: 'mdEm', sm: 'smEm' };

// Variant + pressed → background TokenPath. solid is accent-driven; soft is
// chrome-only / accent-invariant (P7). The same funnel button.css encodes.
function variantBg(tokens: RuntimeTokens, variant: ButtonVariant, pressed: boolean): string {
  if (variant === 'solid') {
    return resolveToken(tokens, pressed ? button.solidBgPressed : button.solidBg) as string;
  }
  return resolveToken(tokens, pressed ? button.softBgPressed : button.softBg) as string;
}

export type ButtonStyleSet = {
  geometry: { minHeight: number; paddingHorizontal: number; borderRadius: number };
  bg: string;
  bgPressed: string;
  labelColor: string;
  labelKey: TypeKey;
};

function makeButtonStyleSet(
  accent: Accent,
  mode: Theme,
  variant: ButtonVariant,
  size: ButtonSize,
): ButtonStyleSet {
  const tokens = runtimeTokens(accent, mode);
  const g = GEOMETRY[size];
  return {
    geometry: {
      minHeight: resolveToken(tokens, g.minHeight) as number,
      paddingHorizontal: resolveToken(tokens, g.paddingX) as number,
      borderRadius: resolveToken(tokens, g.radius) as number,
    },
    bg: variantBg(tokens, variant, false),
    bgPressed: variantBg(tokens, variant, true),
    labelColor: resolveToken(tokens, variant === 'solid' ? button.solidFg : button.softFg) as string,
    labelKey: LABEL_KEY[size],
  };
}

// useButtonStyleSet · the resolved (geometry · variant fills · label) set
// for a (variant × size), self-scoped by an optional accent. Exposed so a
// consumer that needs richer button content than the text-only `children`
// contract allows (e.g. the My-vault Apple-Pay action · SPEC-FEEDBACK
// F-DEMO-1) can compose a Pressable with the REAL Button resolution rather
// than re-deriving the tokens. Button itself consumes this.
export function useButtonStyleSet(
  variant: ButtonVariant,
  size: ButtonSize,
  accentProp?: Accent,
): ButtonStyleSet {
  const { mode, accent: ambientAccent } = useNuriTheme();
  const accent: Accent = accentProp ?? ambientAccent;
  return React.useMemo(
    () => makeButtonStyleSet(accent, mode, variant, size),
    [accent, mode, variant, size],
  );
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'soft',
  accent: accentProp,
  size = 'md',
  disabled,
  onPress,
  children,
}) => {
  // Tier 2 self-scope · the `accent` prop wins over ambient context.
  const s = useButtonStyleSet(variant, size, accentProp);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.base,
        s.geometry,
        { backgroundColor: pressed ? s.bgPressed : s.bg },
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <Text style={[typeStyle(s.labelKey), { color: s.labelColor }]}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  pressed: { transform: [{ scale: button.pressScale }] },
  disabled: { opacity: button.disabledOpacity },
});
