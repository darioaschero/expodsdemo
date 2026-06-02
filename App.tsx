/* ══════════════════════════════════════════════════════════════════
 * APP · the My-vault screen, full-screen — no harness chrome.
 * ──────────────────────────────────────────────────────────────────
 * The whole app IS the playground's My-vault page (the contents that
 * used to sit inside the device frame). It's wrapped in a single
 * <NuriThemeProvider> pinned to the brand accent (lilac), exactly like
 * the DS playground which pins light + cream + lilac.
 *
 * SAFE-AREA · THE NAVIGATOR ROLE (decision 58). The spec's model is
 * "safe-area is owned in ONE place — the navigator/frame — so Screen /
 * Topbar / TabBar stay inset-agnostic; the consuming app applies insets
 * upstream (SafeAreaProvider + insets), the primitives never bake them
 * in." Stripping the device frame removed the thing that played that
 * role, so THIS app now owns it: one place, top inset above the Topbar
 * and bottom inset below the TabBar. The Nuri components are unchanged.
 *
 * DEMO TOGGLE: there are no controls — clicking the swap affordance
 * (arrows-down-up IconButton) flips the theme between light and dark.
 * ══════════════════════════════════════════════════════════════════ */

import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { NuriThemeProvider, chrome, type Theme } from './src/nuri';
import { MyVault } from './src/screens/MyVault';

function VaultScreen() {
  const [mode, setMode] = React.useState<Theme>('light');
  const toggleTheme = React.useCallback(
    () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
    [],
  );

  // The ONE place safe-area is owned (decision 58 · navigator role): the
  // canvas-coloured root pads the status-bar inset above the Topbar and the
  // home-indicator inset below the TabBar. Insets are 0 on web (no notch).
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: chrome[mode].bgCanvas,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <NuriThemeProvider mode={mode} accent="lilac">
        <MyVault onSwap={toggleTheme} />
      </NuriThemeProvider>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <VaultScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
