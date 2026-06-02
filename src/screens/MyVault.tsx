/* ══════════════════════════════════════════════════════════════════
 * MY VAULT · the playground screen (pages/playground/my-vault.html) rebuilt
 * from Nuri components — the proof that the DS contract composes a real
 * screen. Row-for-row faithful to the HTML composition map:
 *
 *   Screen
 *     Topbar            "My vault" + help (question) + settings (gear)
 *     Scroll
 *       Box pX=lg pT=md fill
 *         Stack column gap=sm fill
 *           Bitcoin line   typography-stack row: name · sats · €value
 *           Swap           IconButton(arrows-down-up · solid · neutral)
 *                          flanked by two separators
 *           Euro line      typography-stack row: name · €value
 *           Spacer grow=1
 *           Total          Typography 3xl align=end
 *           Activation     List(md): NavItem ×2 between separators
 *           Spacer grow=2
 *           Add crypto funds   Button soft lg
 *           Buy Bitcoin w/ Pay Button solid lg + apple-logo (F-DEMO-1 compose)
 *   TabBar (SIBLING of Screen · navigator chrome · decision 58)
 *     vault · coin · activity — vault active
 *
 * TabBar is a SIBLING of Screen (RN navigation norm); the device frame
 * plays navigator and owns safe-area.
 * ══════════════════════════════════════════════════════════════════ */

import * as React from 'react';
import { Pressable } from 'react-native';
import {
  Box,
  Button,
  Icon,
  IconButton,
  List,
  NavItem,
  Screen,
  Scroll,
  Separator,
  Spacer,
  Stack,
  TabBar,
  TabBarItem,
  Topbar,
  TopbarEnd,
  Typography,
  TypographyStack,
  button,
  useButtonStyleSet,
} from '../nuri';

// ── Apple-Pay action · SPEC-FEEDBACK F-DEMO-1 workaround ──────────────
// The text-only Button contract (`children: string`) can't host the
// "Buy Bitcoin with  Pay" icon row the web <nuri-button> slot expresses.
// We compose it from primitives, reusing the REAL Button resolution via
// useButtonStyleSet (so the geometry / fills / label colour are identical
// to a `<Button variant="solid" size="lg">`), and paint the in-button Icon
// + Text with the resolved on-solid label colour explicitly (RN has no
// currentColor inheritance · the same coupling as F-BOX-FG-1).
const ApplePayButton: React.FC<{ onPress?: () => void }> = ({ onPress }) => {
  const s = useButtonStyleSet('solid', 'lg');
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Buy Bitcoin with Apple Pay"
      style={({ pressed }) => [
        {
          minHeight: s.geometry.minHeight,
          paddingHorizontal: s.geometry.paddingHorizontal,
          borderRadius: s.geometry.borderRadius,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          backgroundColor: pressed ? s.bgPressed : s.bg,
        },
        pressed ? { transform: [{ scale: button.pressScale }] } : null,
      ]}
    >
      <Stack direction="row" gap="xs" align="center">
        <Typography size="md" emphasis style={{ color: s.labelColor }}>
          Buy Bitcoin with
        </Typography>
        <Icon name="apple-logo" size="sm" fill color={s.labelColor} />
        <Typography size="md" emphasis style={{ color: s.labelColor }}>
          Pay
        </Typography>
      </Stack>
    </Pressable>
  );
};

export type MyVaultProps = {
  // Demo-only: clicking the swap affordance toggles the theme (so the
  // screen can flip light/dark without any harness chrome).
  onSwap?: () => void;
};

export const MyVault: React.FC<MyVaultProps> = ({ onSwap }) => {
  const [tab, setTab] = React.useState('vault');

  return (
    <>
      <Screen>
        {/* ── Topbar ── */}
        <Topbar>
          My vault
          <TopbarEnd>
            <IconButton name="question" variant="ghost" label="Help" onPress={() => {}} />
            <IconButton name="gear" variant="ghost" label="Settings" onPress={() => {}} />
          </TopbarEnd>
        </Topbar>

        {/* ── Scrollable body ── */}
        <Scroll>
          <Box paddingX="lg" paddingTop="md" fill>
            <Stack direction="column" gap="sm" fill>
              {/* Bitcoin line */}
              <TypographyStack direction="row">
                <Typography size="md" emphasis>
                  Bitcoin
                </Typography>
                <Typography size="sm" muted>
                  Sats 72.077
                </Typography>
                <Spacer />
                <Typography size="sm" emphasis>
                  € 47,50
                </Typography>
              </TypographyStack>

              {/* Swap · button flanked by hairlines */}
              <Stack direction="row" gap="sm" align="center">
                <Separator ySpace="none" />
                <IconButton
                  name="arrows-down-up"
                  variant="solid"
                  accent="neutral"
                  label="Swap Bitcoin and Euro"
                  onPress={onSwap}
                />
                <Separator ySpace="none" />
              </Stack>

              {/* Euro line */}
              <TypographyStack direction="row">
                <Typography size="md" emphasis>
                  Euro
                </Typography>
                <Spacer />
                <Typography size="sm" emphasis>
                  € 50,00
                </Typography>
              </TypographyStack>

              {/* Total · pushed down by a grow-1 spacer (1:2 with the grow-2 below) */}
              <Spacer grow={1} />
              <Typography size="3xl" align="end">
                € 97.50
              </Typography>

              {/* Activation rows */}
              <List density="md">
                <Separator />
                <NavItem onPress={() => {}}>Activate credit card</NavItem>
                <Separator />
                <NavItem onPress={() => {}}>Activate IBAN</NavItem>
              </List>

              {/* Fund actions · pushed to the bottom by a grow-2 spacer */}
              <Spacer grow={2} />
              <Button variant="soft" size="lg" onPress={() => {}}>
                Add crypto funds
              </Button>
              <ApplePayButton onPress={() => {}} />
            </Stack>
          </Box>
        </Scroll>
      </Screen>

      {/* ── TabBar · SIBLING of Screen (navigator chrome · decision 58) ── */}
      <TabBar value={tab} onChange={setTab} label="Vault navigation">
        <TabBarItem value="vault" name="vault" label="My vault" />
        <TabBarItem value="coin" name="coin-vertical" label="Coin" />
        <TabBarItem value="activity" name="clock" label="Activity" />
      </TabBar>
    </>
  );
};
