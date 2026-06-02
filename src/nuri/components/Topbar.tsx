/* ══════════════════════════════════════════════════════════════════
 * TOPBAR · the RN side of <nuri-topbar> + wrappers · N+6.6 · decision 46
 * ──────────────────────────────────────────────────────────────────
 * API mirrors topbar.js (the light-DOM compound shell):
 *   Topbar:  center?  inset? · insetStart? · insetEnd? ('xs'|'sm'|'lg')
 *            children: TopbarStart? · centre nodes · TopbarEnd?
 *   TopbarStart / TopbarEnd: children (leading / trailing region)
 *
 * Layout primitive (decision 46) — reads the semantic chrome vocabulary
 * directly: size.xl (height), chrome.bgCanvas (surface), chrome.textPrimary
 * (composed title colour — RN has no inherited color, so the centre carries
 * a Text layer bare title text inherits), space.sm (gap), space.xs/sm/lg
 * (edge padding · base → occupancy → center → inset · decision 46.1).
 *
 * The shell inspects children for the region marker types and routes them;
 * everything else is the centre (the RN analogue of the web reparenting).
 * ══════════════════════════════════════════════════════════════════ */

import * as React from 'react';
import { Text, View } from 'react-native';
import { chrome, size, space } from '../contract';
import { typeStyle, useNuriTheme } from '../theme';

type TopbarRegionProps = { children?: React.ReactNode };

// Region markers · presentational pass-throughs Topbar routes by `type`.
export const TopbarStart: React.FC<TopbarRegionProps> = ({ children }) => <>{children}</>;
export const TopbarEnd: React.FC<TopbarRegionProps> = ({ children }) => <>{children}</>;

type Inset = 'xs' | 'sm' | 'lg';
export type TopbarProps = {
  center?: boolean;
  inset?: Inset;
  insetStart?: Inset;
  insetEnd?: Inset;
  children?: React.ReactNode;
};

export const Topbar: React.FC<TopbarProps> = ({
  center = false,
  inset,
  insetStart,
  insetEnd,
  children,
}) => {
  const { mode } = useNuriTheme();
  const chromeSlice = chrome[mode];

  // Route the named region markers; everything else is the centre.
  let startNode: React.ReactNode = null;
  let endNode: React.ReactNode = null;
  const centreNodes: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === TopbarStart) {
        startNode = child;
        return;
      }
      if (child.type === TopbarEnd) {
        endNode = child;
        return;
      }
    }
    centreNodes.push(child);
  });

  const leadingFilled = startNode != null;
  const trailingFilled = endNode != null;

  // Edge padding · base → occupancy → center → inset (decision 46.1).
  const startInset = insetStart ?? inset;
  const endInset = insetEnd ?? inset;
  const paddingStart = startInset
    ? space[startInset]
    : center
      ? space.xs
      : leadingFilled
        ? space.sm
        : space.lg;
  const paddingEnd = endInset
    ? space[endInset]
    : center
      ? space.xs
      : trailingFilled
        ? space.sm
        : space.lg;

  // center=true → equal side regions (flex:1) keep the centre optically
  // centred; default → centre absorbs slack.
  const sideFlex = center ? 1 : 0;

  return (
    <View
      accessibilityRole="header"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: size.xl,
        backgroundColor: chromeSlice.bgCanvas,
        gap: space.sm,
        paddingStart,
        paddingEnd,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, flex: sideFlex }}>
        {startNode}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: space.sm,
          flexGrow: center ? 0 : 1,
          flexShrink: 1,
          justifyContent: center ? 'center' : 'flex-start',
        }}
      >
        {/* Default title type · lg-em from the shared scale. The centre
            carries a Text layer that bare title text inherits — the
            analogue of the web .nuri-topbar__center type block. */}
        <Text style={{ ...typeStyle('lgEm'), color: chromeSlice.textPrimary }}>{centreNodes}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: space.sm,
          flex: sideFlex,
          justifyContent: 'flex-end',
        }}
      >
        {endNode}
      </View>
    </View>
  );
};
