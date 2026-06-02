/* ══════════════════════════════════════════════════════════════════
 * LIST FAMILY · primitive / interactive wrapper · N+8 · decision 52
 * ──────────────────────────────────────────────────────────────────
 * Mirrors the web custom elements one-for-one:
 *   List                <nuri-list>                  container · role=list
 *   ListItem            <nuri-list-item>             PRESENTATIONAL row
 *   InteractiveListItem <nuri-list-interactive-item> pressable WRAPPER
 *   NavItem             <nuri-nav-item>              RECIPE (NavItem.tsx)
 *
 * EMIT, not hardcode (decision 52): every fixed value dereferences an
 * emitted component token via resolveToken —
 *   List       density → list.density{Sm,Md,Lg}MinHeight (size.xl/2xl/3xl)
 *   ListItem   guard   → listItem.paddingBlock (space.md) · gutter → listItem.gap (space.md)
 *   Interactive wash   → listInteractiveItem.washPressed (chrome.bgSubtle) · radius (radius.lg)
 *
 * PRESS WASH IS A FLAT FILL (decision 52 · revised N+8.1): a plain
 * backgroundColor that crosses to RN cleanly. Full-bleed comes from a
 * COUNTER-MARGIN (negative marginHorizontal + equal paddingHorizontal =
 * space.md), not by fading the colour. No content scale.
 *
 * PRESENTATIONAL ListItem carries NO interactivity; InteractiveListItem
 * COMPOSES the Pressable around it (the Pressable WRAPS the content, so the
 * content is the button's accessible name · the N+7 single-read fix).
 *
 * a11y deltas (R1): F-LISTITEM-ROLE-1 (no `listitem` role on RN; membership
 * reads from the `list` container) · F-FOCUS-1 (no focus ring on touch).
 * ══════════════════════════════════════════════════════════════════ */

import * as React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';
import { listInteractiveItem, listItem, listTokens, space } from '../contract';
import type { TokenPath } from '../contract';
import { resolveToken, useRuntimeTokens } from '../theme';

export type Density = 'sm' | 'md' | 'lg';

// density → the emitted List min-height TokenPath (decision 52 · EMIT).
const DENSITY_TOKEN: Record<Density, TokenPath> = {
  sm: listTokens.densitySmMinHeight, // 'size.xl'  · 60
  md: listTokens.densityMdMinHeight, // 'size.2xl' · 72 · default
  lg: listTokens.densityLgMinHeight, // 'size.3xl' · 90
};

// List-local ROW density (the <nuri-list density> projection onto rows) —
// NOT the reserved scope theming `density` dimension. Named to avoid collision.
export const RowDensityContext = React.createContext<Density>('md');

export type ListProps = {
  density?: Density;
  children?: React.ReactNode;
};

export const List: React.FC<ListProps> = ({ density = 'md', children }) => (
  // role="list" container. No gap (decision 51) — rhythm is the row
  // min-height + author Separators. density projects via context.
  <RowDensityContext.Provider value={density}>
    <View accessibilityRole="list">{children}</View>
  </RowDensityContext.Provider>
);

export type ListItemProps = {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  children?: React.ReactNode;
};

// Presentational row — NO interactivity (decision 52).
export const ListItem: React.FC<ListItemProps> = ({ leading, trailing, children }) => {
  const tokens = useRuntimeTokens();
  const density = React.useContext(RowDensityContext);

  const rowStyle: ViewStyle = {
    minHeight: resolveToken(tokens, DENSITY_TOKEN[density]) as number,
    flexDirection: 'row',
    alignItems: 'center',
    gap: resolveToken(tokens, listItem.gap) as number,
    paddingVertical: resolveToken(tokens, listItem.paddingBlock) as number,
  };

  return (
    <View style={rowStyle}>
      {leading != null ? <View>{leading}</View> : null}
      <View style={{ flex: 1, minWidth: 0 }}>{children}</View>
      {trailing != null ? <View>{trailing}</View> : null}
    </View>
  );
};

export type InteractiveListItemProps = ListItemProps & {
  onPress?: () => void;
};

// Pressable WRAPPER around a presentational ListItem (decision 52). The
// flat wash bleeds full-width via the counter-margin; content stays flush.
export const InteractiveListItem: React.FC<InteractiveListItemProps> = ({
  onPress,
  leading,
  trailing,
  children,
}) => {
  const tokens = useRuntimeTokens();
  const washPressed = resolveToken(tokens, listInteractiveItem.washPressed) as string;
  const itemRadius = resolveToken(tokens, listInteractiveItem.radius) as number;
  const bleed = space.md;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        { borderRadius: itemRadius, marginHorizontal: -bleed, paddingHorizontal: bleed },
        pressed ? { backgroundColor: washPressed } : null,
      ]}
    >
      <ListItem leading={leading} trailing={trailing}>
        {children}
      </ListItem>
    </Pressable>
  );
};
