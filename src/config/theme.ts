// Brand palette + semantic theme tokens, mirrored as TypeScript constants.
//
// Source of truth = `src/app/globals.css`. Keep these values in sync.
// Use these in non-CSS contexts only (Three.js shaders, dynamic styles, charts,
// canvas drawing). For everything else use Tailwind utility classes
// (`bg-background`, `text-foreground`, `bg-primary`, ...).

export const brand = {
  red: "#DA291C",
  redHover: "#B8221A",
  yellow: "#FBE122",
  yellowSoft: "#FFD93D",
  black: "#000000",
  white: "#FFFFFF",
} as const;

export const lightTheme = {
  background: "#FFFFFF",
  surface: "#F5F5F5",
  surfaceElevated: "#FAFAFA",
  foreground: "#1A1A1A",
  mutedForeground: "#4A4A4A",
  primary: "#DA291C",
  primaryHover: "#B8221A",
  primaryForeground: "#FFFFFF",
  accent: "#FBE122",
  accentForeground: "#000000",
  border: "#E5E5E5",
  destructive: "#DC2626",
  warning: "#D97706",
} as const;

export const darkTheme = {
  background: "#0F0F0F",
  surface: "#1A1A1A",
  surfaceElevated: "#242424",
  foreground: "#F5F5F5",
  mutedForeground: "#B8B8B8",
  primary: "#FF3B2D",
  primaryHover: "#FF5A4F",
  primaryForeground: "#FFFFFF",
  accent: "#FFD93D",
  accentForeground: "#000000",
  border: "#2E2E2E",
  destructive: "#F87171",
  warning: "#FBBF24",
} as const;

export type ThemeMode = "light" | "dark";
// String widening so darkTheme literals stay assignable to the same shape
export type ThemeTokens = Record<keyof typeof lightTheme, string>;

export const themes: Record<ThemeMode, ThemeTokens> = {
  light: lightTheme,
  dark: darkTheme,
};
