/* ══════════════════════════════════════════════════════════════════
 * ICON · the RN side of <nuri-icon> · decision 38 · 48
 * ──────────────────────────────────────────────────────────────────
 * API mirrors icon.js:
 *   name   IconName  (the typed registry key from build/icons)
 *   size?  'md' | 'sm'   default 'md'
 *   fill?  boolean       presence forces fill weight
 *   color? string        currentColor analogue · defaults to ambient text
 *
 * ONE registry, TWO readers (decision 48): the web inlines icons.js; this
 * RN side dereferences the SAME emitted path strings (build/icons.ts)
 * through react-native-svg's SvgXml. This is now the REAL renderer (the
 * migration test used a type-only SvgXml shim · F-ICON-RN-1 closed).
 *
 * Weight coupling is identical to the web (decision 38) — NOT a prop:
 *   md + no fill → regular · sm + no fill → bold · any + fill → fill
 * Box dimensions mirror icon.css: md → size.sm (28) · sm → size.xs (18).
 * currentColor → the `color` prop; default ambient text (chrome primary).
 * ══════════════════════════════════════════════════════════════════ */

import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { chrome, icons, size } from '../contract';
import type { IconName, IconWeight } from '../contract';
import { useNuriTheme } from '../theme';

export type IconProps = {
  name: IconName;
  size?: 'md' | 'sm';
  fill?: boolean;
  color?: string;
};

// md → size.sm (28px) · sm → size.xs (18px) — the icon.css box subset.
const ICON_DIMENSION: Record<NonNullable<IconProps['size']>, number> = {
  md: size.sm,
  sm: size.xs,
};

export const Icon: React.FC<IconProps> = ({ name, size: iconSize = 'md', fill, color }) => {
  const { mode } = useNuriTheme();
  // Weight coupling (decision 38) · identical to icon.js #render.
  const weight: IconWeight = fill ? 'fill' : iconSize === 'sm' ? 'bold' : 'regular';
  const dimension = ICON_DIMENSION[iconSize];
  // Re-wrap the registry path in the phosphor viewBox grid (the same <svg>
  // shell icon.js builds) and feed it to SvgXml. fill="currentColor"
  // resolves to the `color` prop (SvgXml's currentColor channel).
  const xml = React.useMemo(
    () =>
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">${icons[name][weight]}</svg>`,
    [name, weight],
  );
  return (
    <SvgXml
      xml={xml}
      width={dimension}
      height={dimension}
      color={color ?? chrome[mode].textPrimary}
    />
  );
};
