/* ══════════════════════════════════════════════════════════════════
 * ICON-BUTTON · the RN side of <nuri-icon-button> · N+6.4 · N+6.8
 * ──────────────────────────────────────────────────────────────────
 * API mirrors icon-button.js:
 *   name      IconName
 *   variant?  'solid' | 'soft' | 'ghost'   default 'soft' (decision 39)
 *   accent?   Accent                        overrides ambient (Tier 2)
 *   disabled? boolean
 *   label?    string   (explicit a11y name; else derived from `name`)
 *   onPress?  () => void
 *   fill?     boolean  (selects the filled glyph weight · amendment 40.1)
 *   — NO `size` prop · single-size-locked md=48px (decision 40)
 *   — icon-only, no text children
 *
 * Geometry DEREFERENCES the emitted iconButton.size/.radius (D4 · decision
 * 52); the variant COLOUR funnel reuses the shared button.* tokens (the
 * decision 39/40 funnel the web .nuri-icon-button shares with .nuri-button).
 * The glyph is a real composed <Icon> (F-ICON-RN-1 closed).
 *
 * a11y · F-ARIA-LABEL-1 (icon-only ⇒ accessible name required) ·
 * F-TOUCH-TARGET-1 (48×48 clears iOS 44pt / Android 48dp). Behavioural
 * deltas: F-PRESSED-1 / F-FOCUS-1 / F-DISABLED-1 (same budget as Button).
 * ══════════════════════════════════════════════════════════════════ */

import * as React from 'react';
import { Pressable } from 'react-native';
import { Icon } from './Icon';
import { button, iconButton } from '../contract';
import type { Accent, IconName } from '../contract';
import { resolveToken, runtimeTokens, useNuriTheme } from '../theme';
import type { RuntimeTokens } from '../theme';

export type IconButtonVariant = 'solid' | 'soft' | 'ghost';

export type IconButtonProps = {
  name: IconName;
  variant?: IconButtonVariant;
  accent?: Accent;
  disabled?: boolean;
  label?: string;
  onPress?: () => void;
  fill?: boolean;
};

// Ghost adds a chrome-only, accent-invariant transparent rest state
// (decision 39). ghostBg is the literal 'transparent' (NOT a TokenPath),
// so it bypasses resolveToken.
function iconButtonBg(tokens: RuntimeTokens, variant: IconButtonVariant, pressed: boolean): string {
  if (variant === 'ghost') {
    return pressed ? (resolveToken(tokens, button.ghostBgPressed) as string) : button.ghostBg;
  }
  if (variant === 'solid') {
    return resolveToken(tokens, pressed ? button.solidBgPressed : button.solidBg) as string;
  }
  return resolveToken(tokens, pressed ? button.softBgPressed : button.softBg) as string;
}

// Glyph colour per variant — reuses button.*Fg (same funnel · decision 39/40).
function iconButtonFg(tokens: RuntimeTokens, variant: IconButtonVariant): string {
  if (variant === 'solid') return resolveToken(tokens, button.solidFg) as string;
  if (variant === 'ghost') return resolveToken(tokens, button.ghostFg) as string;
  return resolveToken(tokens, button.softFg) as string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  variant = 'soft',
  accent: accentProp,
  disabled,
  label,
  onPress,
  fill,
}) => {
  const { mode, accent: ambientAccent } = useNuriTheme();
  const accent: Accent = accentProp ?? ambientAccent;

  const { dimension, borderRadius, fg } = React.useMemo(() => {
    const tokens = runtimeTokens(accent, mode);
    return {
      // size/radius are cascade-invariant, but resolved through the
      // standard funnel anyway (48px = size.lg · 9999 = radius.full).
      dimension: resolveToken(tokens, iconButton.size) as number,
      borderRadius: resolveToken(tokens, iconButton.radius) as number,
      fg: iconButtonFg(tokens, variant),
    };
  }, [accent, mode, variant]);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      // F-ARIA-LABEL-1 · explicit label wins; else derive from kebab name.
      accessibilityLabel={label ?? name.replace(/-/g, ' ')}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        {
          width: dimension,
          height: dimension,
          borderRadius,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: iconButtonBg(runtimeTokens(accent, mode), variant, pressed),
        },
        pressed && !disabled ? { transform: [{ scale: button.pressScale }] } : null,
        disabled ? { opacity: button.disabledOpacity } : null,
      ]}
    >
      <Icon name={name} fill={fill} color={fg} />
    </Pressable>
  );
};
