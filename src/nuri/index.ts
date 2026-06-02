/* ──────────────────────────────────────────────────────────────
 * NURI · public barrel · the consumer-facing API surface.
 * Import Nuri from here: `import { Button, NuriThemeProvider } from './src/nuri'`.
 * ────────────────────────────────────────────────────────────── */

export * from './contract';
export * from './theme';

// ── primitives ──
export * from './components/Screen';
export * from './components/Scroll';
export * from './components/Stack';
export * from './components/Box';
export * from './components/Spacer';
export * from './components/Separator';

// ── text ──
export * from './components/Typography';
export * from './components/TypographyStack';

// ── icon ──
export * from './components/Icon';

// ── actions ──
export * from './components/Button';
export * from './components/IconButton';

// ── navigation / chrome ──
export * from './components/Topbar';
export * from './components/TabBar';

// ── list family ──
export * from './components/List';
export * from './components/NavItem';
