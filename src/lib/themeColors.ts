export const THEME_COLORS: Record<string, string[]> = {
  // core
  light: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"],
  dark: ["#1f2937", "#374151", "#4b5563", "#6b7280"],

  // seasons & holidays
  halloween: ["#ff6600", "#000000", "#9333ea", "#15803d"],
  christmas: ["#dc2626", "#15803d", "#fbbf24", "#f8fafc"],
  valentine: ["#ec4899", "#f43f5e", "#fda4af", "#fecdd3"],
  autumn: ["#7c2d12", "#c2410c", "#f97316", "#fef3c7"],

  // nature & scenes
  ocean: ["#0ea5e9", "#06b6d4", "#0891b2", "#164e63"],
  sunset: ["#f97316", "#fb923c", "#fbbf24", "#fef3c7"],
  forest: ["#166534", "#22c55e", "#84cc16", "#bef264"],
  aurora: ["#00b894", "#6c5ce7", "#00cec9", "#ffeaa7"],
  desert: ["#c2410c", "#fb923c", "#fef3c7", "#a16207"],
  earth: ["#7c3f00", "#b45309", "#a3e635", "#65a30d"],
  space: ["#0b1020", "#1b2a41", "#374785", "#9bd1ff"],
  midnight: ["#0b1220", "#071233", "#2b2d42", "#8d99ae"],

  // palettes
  rainbow: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"],
  pastel: ["#fbbf24", "#86efac", "#93c5fd", "#ddd6fe"],
  neon: ["#ff6ec7", "#00fff0", "#ffd300", "#00ff7f", "#7c4dff", "#ff4d4d"],
  monochrome: ["#111827", "#374151", "#6b7280", "#9ca3af"],
  vibrant: ["#ff3b30", "#ff9500", "#ffcc00", "#34c759", "#5ac8fa"],

  // materials & tones
  minimal: ["#0f172a", "#f8fafc", "#94a3b8", "#e2e8f0"],
  steel: ["#0b132b", "#1f2937", "#3f4b66", "#94a3b8"],
  coral: ["#ff6b6b", "#ff9472", "#ffd6a5", "#ffe3e3"],
  gold: ["#d4af37", "#ffd700", "#ffec99", "#fff7cc"],
  silver: ["#c0c0c0", "#a3a3a3", "#6b7280", "#f3f4f6"],

  // flavors
  candy: ["#ff6bcb", "#ffd166", "#6bffb3", "#9be7ff"],
  lemon: ["#fde68a", "#fef08a", "#facc15", "#a3e635"],
  mint: ["#98ff98", "#6ee7b7", "#34d399", "#bffcf4"],
  berry: ["#831843", "#e11d48", "#fb7185", "#fda4af"],

  // purples & friends
  lavender: ["#7c3aed", "#a78bfa", "#e9d5ff", "#f3e8ff"],
  lilac: ["#c4b5fd", "#d8b4fe", "#f5d0fe", "#fdf2f8"],

  // extras from menubar
  teal: ["#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4"],
  magma: ["#ff4e00", "#ec9f05", "#fc913a", "#ff6e7f"],
  // note: 'biege' is intentionally misspelled to match existing usage
  biege: ["#f5f5dc", "#f3e9dc", "#e4d8c3", "#c8bfae"],
};

export function getThemePalette(theme?: string): string[] {
  const key = (theme || "light").toLowerCase();
  return THEME_COLORS[key] || THEME_COLORS.light;
}
