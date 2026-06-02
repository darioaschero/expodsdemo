/* ══════════════════════════════════════════════════════════════════
 * SCROLL · the RN side of <nuri-scroll> · decision 59 · N+11
 * ──────────────────────────────────────────────────────────────────
 * The growing, scrolling body. Scrolling is a COMPONENT in RN (not a
 * View style) — which is why it's its own primitive and `overflow` is
 * never a Box prop (R1). Padding for the content goes on a <Box fill>
 * CHILD (the contentContainerStyle analogue).
 *
 * ⚠ SPEC-FEEDBACK F-DEMO-3 (latent · the matrix never rendered): a bare
 * <ScrollView style={{flex:1}}> is NOT enough for a `Box fill` child to
 * fill the viewport. RN's ScrollView lays children out in a separate
 * content container that is content-sized by default, so a flexGrow child
 * has no free space to grow into and the My-vault grow-spacers can't push
 * content to the bottom. The faithful RN realization of the web (`flex:1`
 * scroll holding a `flex:1 0 auto` box) is contentContainerStyle.flexGrow:1.
 * Baked in here as the default; overridable via the prop.
 * ══════════════════════════════════════════════════════════════════ */

import * as React from 'react';
import { ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

export type ScrollProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export const Scroll: React.FC<ScrollProps> = ({ children, style, contentContainerStyle }) => (
  <ScrollView
    style={[styles.scroll, style]}
    contentContainerStyle={[styles.content, contentContainerStyle]}
  >
    {children}
  </ScrollView>
);

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  // flexGrow:1 → the content container is at least viewport-tall, so a
  // `Box fill` child fills it and scrolls when content exceeds it.
  content: { flexGrow: 1 },
});
