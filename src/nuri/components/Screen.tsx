/* ══════════════════════════════════════════════════════════════════
 * SCREEN · the RN side of <nuri-screen> · decision 58 · N+11
 * ──────────────────────────────────────────────────────────────────
 * The full-height column. NOT the navigator: the bottom TabBar is a
 * SIBLING, and safe-area is owned upstream (React Navigation), so Screen
 * stays inset-agnostic. On RN, Screen renders a flex:1 View.
 * ══════════════════════════════════════════════════════════════════ */

import * as React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

export type ScreenProps = { children?: React.ReactNode; style?: StyleProp<ViewStyle> };

export const Screen: React.FC<ScreenProps> = ({ children, style }) => (
  <View style={[styles.screen, style]}>{children}</View>
);

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
