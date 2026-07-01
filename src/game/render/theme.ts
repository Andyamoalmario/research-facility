/**
 * Palette shared across the Pixi render layer.
 * Kept in sync manually with the CSS custom properties in globals.css —
 * Pixi cannot read CSS variables, so numeric hex values live here.
 */
export const THEME = {
  bgVoid: 0x0b0d10,
  bgPanel: 0x12161c,
  blueNight: 0x16233a,
  blueNightLight: 0x26456e,
  greenMonitor: 0x35d67c,
  yellowWarning: 0xe8b93b,
  redEmergency: 0xe5484d,
  gridLine: 0x1f2731,
  textPrimary: 0xdbe4ee,
  textSecondary: 0x7c8797,
} as const;
