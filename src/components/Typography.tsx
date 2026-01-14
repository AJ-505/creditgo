import React from "react";
import { Text as RNText, TextStyle, StyleSheet } from "react-native";

interface TypographyProps {
  children: React.ReactNode;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  weight?: "regular" | "medium" | "semibold" | "bold";
  color?: string;
  style?: TextStyle;
  className?: string;
}

// Size mapping
const sizes: Record<string, { fontSize: number; lineHeight: number }> = {
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  base: { fontSize: 16, lineHeight: 24 },
  lg: { fontSize: 18, lineHeight: 28 },
  xl: { fontSize: 20, lineHeight: 28 },
  "2xl": { fontSize: 24, lineHeight: 32 },
  "3xl": { fontSize: 30, lineHeight: 36 },
  "4xl": { fontSize: 36, lineHeight: 40 },
  "5xl": { fontSize: 48, lineHeight: 1 },
};

export function Text({
  children,
  size = "base",
  weight = "regular",
  color = "#0f172a",
  style,
  className = "",
}: TypographyProps) {
  // Use explicit fontFamily - this is REQUIRED for NativeWind
  const fontFamilyMap: Record<string, string> = {
    regular: "Inter",
    medium: "Inter-Medium",
    semibold: "Inter-SemiBold",
    bold: "Inter-Bold",
  };

  const fontFamily = fontFamilyMap[weight];
  const { fontSize, lineHeight } = sizes[size];

  return (
    <RNText
      className={className}
      style={StyleSheet.flatten([
        {
          fontFamily,
          fontSize,
          lineHeight,
          color,
        },
        style,
      ])}
    >
      {children}
    </RNText>
  );
}

export function Heading1({
  children,
  color = "#0f172a",
  style,
}: {
  children: React.ReactNode;
  color?: string;
  style?: TextStyle;
}) {
  return (
    <RNText
      style={StyleSheet.flatten([
        {
          fontFamily: "Inter-Bold",
          fontSize: 48,
          lineHeight: 1,
          color,
        },
        style,
      ])}
    >
      {children}
    </RNText>
  );
}

export function Heading2({
  children,
  color = "#0f172a",
  style,
}: {
  children: React.ReactNode;
  color?: string;
  style?: TextStyle;
}) {
  return (
    <RNText
      style={StyleSheet.flatten([
        {
          fontFamily: "Inter-Bold",
          fontSize: 36,
          lineHeight: 40,
          color,
        },
        style,
      ])}
    >
      {children}
    </RNText>
  );
}

export function Heading3({
  children,
  color = "#0f172a",
  style,
}: {
  children: React.ReactNode;
  color?: string;
  style?: TextStyle;
}) {
  return (
    <RNText
      style={StyleSheet.flatten([
        {
          fontFamily: "Inter-Bold",
          fontSize: 30,
          lineHeight: 36,
          color,
        },
        style,
      ])}
    >
      {children}
    </RNText>
  );
}

export function BodyText({
  children,
  color = "#475569",
  weight = "regular",
  style,
}: {
  children: React.ReactNode;
  color?: string;
  weight?: "regular" | "medium" | "semibold";
  style?: TextStyle;
}) {
  const fontFamilyMap: Record<string, string> = {
    regular: "Inter",
    medium: "Inter-Medium",
    semibold: "Inter-SemiBold",
  };

  return (
    <RNText
      style={StyleSheet.flatten([
        {
          fontFamily: fontFamilyMap[weight],
          fontSize: 16,
          lineHeight: 24,
          color,
        },
        style,
      ])}
    >
      {children}
    </RNText>
  );
}

export function Caption({
  children,
  color = "#94a3b8",
  style,
}: {
  children: React.ReactNode;
  color?: string;
  style?: TextStyle;
}) {
  return (
    <RNText
      style={StyleSheet.flatten([
        {
          fontFamily: "Inter",
          fontSize: 12,
          lineHeight: 16,
          color,
        },
        style,
      ])}
    >
      {children}
    </RNText>
  );
}
