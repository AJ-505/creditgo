// CreditGo Design System - Theme & Design Tokens

export const theme = {
  colors: {
    // Primary - Lime Green (Brand Color)
    primary: {
      50: "#f0fee2",
      100: "#dafdc4",
      200: "#c0fb96",
      300: "#a3f858",
      400: "#c8ff00", // Main brand color
      500: "#a3d900",
      600: "#8ab800",
      700: "#6f9600",
      800: "#5a7800",
      900: "#4a6500",
    },
    // Secondary - Dark Navy
    secondary: {
      50: "#f5f5f7",
      100: "#e5e5ea",
      200: "#d1d1d6",
      300: "#b3b3bc",
      400: "#8e8e93",
      500: "#636366",
      600: "#48484a",
      700: "#3a3a3c",
      800: "#1c1c1e",
      900: "#000000",
    },
    // Accent - Purple/Indigo
    accent: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
    // Semantic Colors
    success: {
      light: "#dcfce7",
      main: "#22c55e",
      dark: "#15803d",
    },
    warning: {
      light: "#fef9c3",
      main: "#eab308",
      dark: "#a16207",
    },
    error: {
      light: "#fee2e2",
      main: "#ef4444",
      dark: "#b91c1c",
    },
    info: {
      light: "#dbeafe",
      main: "#3b82f6",
      dark: "#1d4ed8",
    },
    // Neutrals
    background: "#f8fafc",
    surface: "#ffffff",
    surfaceAlt: "#f1f5f9",
    // Text Colors
    text: {
      primary: "#0f172a",
      secondary: "#475569",
      muted: "#94a3b8",
      inverse: "#ffffff",
    },
    // Borders
    border: {
      light: "#f1f5f9",
      main: "#e2e8f0",
      dark: "#cbd5e1",
    },
  },
  typography: {
    fontFamily: {
      sans: "Inter",
      mono: "JetBrains Mono",
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      "2xl": 24,
      "3xl": 30,
      "4xl": 36,
      "5xl": 48,
    },
    fontWeight: {
      normal: "400" as const,
      medium: "500" as const,
      semibold: "600" as const,
      bold: "700" as const,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
    "3xl": 64,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
    "2xl": 32,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: "#0f172a",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    md: {
      shadowColor: "#0f172a",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    lg: {
      shadowColor: "#0f172a",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    xl: {
      shadowColor: "#0f172a",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
  },
  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    popover: 400,
    tooltip: 500,
    toast: 600,
  },
};

// Credit Tier Colors
export const creditTiers = {
  platinum: {
    color: "#6366f1",
    bgLight: "#eef2ff",
    name: "Platinum",
    benefits: ["Lowest interest rates", "Priority processing", "Higher limits"],
  },
  gold: {
    color: "#eab308",
    bgLight: "#fef9c3",
    name: "Gold",
    benefits: ["Low interest rates", "Fast processing", "Good limits"],
  },
  silver: {
    color: "#94a3b8",
    bgLight: "#f1f5f9",
    name: "Silver",
    benefits: ["Standard rates", "Regular processing", "Standard limits"],
  },
  bronze: {
    color: "#d97706",
    bgLight: "#fff7ed",
    name: "Bronze",
    benefits: ["Entry-level access", "Build your score", "Limited options"],
  },
};

// Export color helper functions
export const getTierColor = (score: number): string => {
  if (score >= 85) return creditTiers.platinum.color;
  if (score >= 70) return creditTiers.gold.color;
  if (score >= 55) return creditTiers.silver.color;
  return creditTiers.bronze.color;
};

export const getTierInfo = (score: number) => {
  if (score >= 85) return creditTiers.platinum;
  if (score >= 70) return creditTiers.gold;
  if (score >= 55) return creditTiers.silver;
  return creditTiers.bronze;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default theme;
