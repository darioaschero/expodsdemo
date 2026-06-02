/* ══════════════════════════════════════════════════════════════════
 * TAB-BAR · the RN side of <nuri-tab-bar> + <nuri-tab-bar-item> · N+9 · decision 56
 * ──────────────────────────────────────────────────────────────────
 * API mirrors tab-bar.js (the compound web custom-elements):
 *   TabBar:      value · onChange? · label? · children: TabBarItem[]
 *   TabBarItem:  value · name (IconName) · label?
 *
 * The icon-only BOTTOM destination switcher — DISTINCT from Tabs. Selection
 * lives in TabBar; each item is presentational, told its active state via
 * React.cloneElement (F-SELECTED-VALUE-1).
 *
 * EMIT (decision 52): the ONE baked structural decision is the bar height
 * (tabBarTokens.height → 'size.xl' → number). Everything else is direct-
 * semantic: selected → chrome.textPrimary + filled glyph, rest →
 * chrome.borderStrong + regular glyph, pressed → chrome.textMuted + the
 * shared press-scale (button.pressScale). Selected is chrome, NOT accent.
 *
 * a11y · F-TABBAR-ROLE-1: RN has no role for web's <nav>/aria-current, so
 * this APPROXIMATES with accessibilityRole="tab" + state.selected.
 * ══════════════════════════════════════════════════════════════════ */

import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Icon } from './Icon';
import { button, chrome, tabBarTokens } from '../contract';
import { resolveToken, runtimeTokens, useNuriTheme } from '../theme';
import type { IconName } from '../contract';

export type TabBarItemProps = {
  value: string;
  name: IconName;
  label?: string;
  // Injected by TabBar (not author-set).
  active?: boolean;
  onSelect?: (value: string) => void;
};

export const TabBarItem: React.FC<TabBarItemProps> = ({ value, name, label, active, onSelect }) => {
  const { mode } = useNuriTheme();
  const chromeSlice = chrome[mode];

  // Direct-semantic item colours (no per-item token · decision 56).
  const restFg = chromeSlice.borderStrong; // not selected · recedes
  const selectedFg = chromeSlice.textPrimary; // selected · NOT accent
  const pressedFg = chromeSlice.textMuted; // pressed · transient

  return (
    <Pressable
      onPress={() => onSelect?.(value)}
      accessibilityRole="tab"
      accessibilityState={{ selected: !!active }}
      accessibilityLabel={label ?? name.replace(/-/g, ' ')}
      style={({ pressed }) => [
        { flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
        pressed ? { transform: [{ scale: button.pressScale }] } : null,
      ]}
    >
      {({ pressed }) => (
        <Icon
          name={name}
          size="md"
          fill={!!active}
          color={pressed ? pressedFg : active ? selectedFg : restFg}
        />
      )}
    </Pressable>
  );
};

export type TabBarProps = {
  value: string;
  onChange?: (value: string) => void;
  label?: string;
  children: React.ReactElement<TabBarItemProps> | React.ReactElement<TabBarItemProps>[];
};

export const TabBar: React.FC<TabBarProps> = ({ value, onChange, label, children }) => {
  const { mode, accent } = useNuriTheme();
  // The ONE baked token: bar height (accent-invariant; slice accent is moot).
  const height = resolveToken(runtimeTokens(accent, mode), tabBarTokens.height) as number;

  return (
    <View
      accessibilityLabel={label}
      style={{
        flexDirection: 'row',
        alignItems: 'stretch',
        height,
        backgroundColor: chrome[mode].bgCanvas,
      }}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          active: child.props.value === value,
          onSelect: onChange,
        }),
      )}
    </View>
  );
};
