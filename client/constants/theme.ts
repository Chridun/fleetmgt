export const Colors = {
  light: {
    text: "#111111",
    textSecondary: "#555555",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    tint: "#2563EB",
    tintDark: "#1D4ED8",
    accent: "#2563EB",
    success: "#16A34A",
    warning: "#CA8A04",
    error: "#DC2626",
    icon: "#555555",
    border: "#E5E5E5",
    buttonText: "#FFFFFF",
    link: "#2563EB",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#FAFAFA",
    backgroundTertiary: "#F5F5F5",
    backgroundRoot: "#FFFFFF",
  },
  dark: {
    text: "#F0F1F2",
    textSecondary: "#9CA3AF",
    background: "#111827",
    surface: "#1F2937",
    tint: "#60A5FA",
    tintDark: "#3B82F6",
    accent: "#FB923C",
    success: "#34D399",
    warning: "#FBBF24",
    error: "#F87171",
    icon: "#9CA3AF",
    border: "#374151",
    buttonText: "#FFFFFF",
    link: "#60A5FA",
    backgroundDefault: "#1F2937",
    backgroundSecondary: "#111827",
    backgroundTertiary: "#374151",
    backgroundRoot: "#111827",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
};

export const Fonts = {
  regular: "Manrope_400Regular",
  medium: "Manrope_500Medium",
  semiBold: "Manrope_600SemiBold",
  bold: "Manrope_700Bold",
  mono: "monospace",
};

export const FontSizes = {
  h1: 28,
  h2: 20,
  h3: 16,
  body: 15,
  caption: 13,
  button: 16,
};

export const Typography = {
  h1: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.h1,
    lineHeight: FontSizes.h1 * 1.2,
    fontWeight: "700" as const,
  },
  h2: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.h2,
    lineHeight: FontSizes.h2 * 1.3,
    fontWeight: "600" as const,
  },
  h3: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.h3,
    lineHeight: FontSizes.h3 * 1.3,
    fontWeight: "600" as const,
  },
  h4: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 14 * 1.3,
    fontWeight: "500" as const,
  },
  body: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.body,
    lineHeight: FontSizes.body * 1.5,
    fontWeight: "400" as const,
  },
  small: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 13 * 1.4,
    fontWeight: "400" as const,
  },
  caption: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.caption,
    lineHeight: FontSizes.caption * 1.4,
    fontWeight: "400" as const,
  },
  link: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.body,
    lineHeight: FontSizes.body * 1.5,
    fontWeight: "500" as const,
  },
};
