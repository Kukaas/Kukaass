/**
 * Editor color themes. "Filament Dark" is the house theme (graphite + amber,
 * the One Voice accent). The rest are authentic VS Code-style alternates that
 * only swap the base mode and the single accent hue — never a rainbow.
 */
export interface Theme {
  id: string;
  name: string;
  mode: 'dark' | 'light';
  /** oklch value for --brand (the accent). */
  brand: string;
  /** Slightly deeper accent for hovers/gradients (--brand-deep). */
  brandDeep: string;
  /** A small swatch color for the picker (any CSS color). */
  swatch: string;
}

export const THEMES: Theme[] = [
  {
    id: 'filament-dark',
    name: 'Filament Dark',
    mode: 'dark',
    brand: 'oklch(0.78 0.145 75)',
    brandDeep: 'oklch(0.7 0.15 70)',
    swatch: 'oklch(0.78 0.145 75)',
  },
  {
    id: 'filament-light',
    name: 'Filament Light',
    mode: 'light',
    brand: 'oklch(0.72 0.15 70)',
    brandDeep: 'oklch(0.66 0.16 65)',
    swatch: 'oklch(0.72 0.15 70)',
  },
  {
    id: 'ember',
    name: 'Ember',
    mode: 'dark',
    brand: 'oklch(0.7 0.19 35)',
    brandDeep: 'oklch(0.63 0.2 32)',
    swatch: 'oklch(0.7 0.19 35)',
  },
  {
    id: 'mint',
    name: 'Mint',
    mode: 'dark',
    brand: 'oklch(0.78 0.14 165)',
    brandDeep: 'oklch(0.71 0.15 163)',
    swatch: 'oklch(0.78 0.14 165)',
  },
  {
    id: 'iris',
    name: 'Iris',
    mode: 'dark',
    brand: 'oklch(0.72 0.15 285)',
    brandDeep: 'oklch(0.65 0.17 285)',
    swatch: 'oklch(0.72 0.15 285)',
  },
];

export const DEFAULT_THEME_ID = 'filament-dark';
const STORAGE_KEY = 'kukaass.theme';

export const themeById = (id: string): Theme =>
  THEMES.find((t) => t.id === id) ?? THEMES[0];

/** Apply a theme to the document root by toggling mode + overriding the accent. */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme.mode === 'dark');
  root.style.setProperty('--brand', theme.brand);
  root.style.setProperty('--brand-deep', theme.brandDeep);
  root.style.setProperty('--ring', theme.brand);
}

export function loadThemeId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME_ID;
  } catch {
    return DEFAULT_THEME_ID;
  }
}

export function saveThemeId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}
