import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface CreditScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  variant?: "dark" | "light";
}

export const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({
  score,
  maxScore = 100,
  size = 180,
  strokeWidth = 15,
  showLabel = false,
  variant = "dark",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / maxScore) * circumference;
  const offset = circumference - progress;

  const getScoreColor = (score: number): string => {
    if (score >= 85) return "#c8ff00";
    if (score >= 70) return "#eab308";
    if (score >= 55) return "#94a3b8";
    return "#d97706";
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 85) return "Platinum";
    if (score >= 70) return "Gold";
    if (score >= 55) return "Silver";
    return "Bronze";
  };

  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  const fontSize = size < 80 ? "text-lg" : size < 120 ? "text-2xl" : "text-4xl";
  const labelSize = size < 80 ? "text-[8px]" : "text-xs";

  return (
    <View className="items-center justify-center">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={variant === "dark" ? "#334155" : "#e2e8f0"}
            strokeWidth={strokeWidth}
            fill="transparent"
            opacity={0.3}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View
          className="absolute inset-0 items-center justify-center"
          style={{ width: size, height: size }}
        >
          <Text
            className={`${fontSize} font-inter-bold ${
              variant === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            {score}
          </Text>
        </View>
      </View>
      {showLabel && (
        <Text
          className={`${labelSize} mt-2 ${
            variant === "dark" ? "text-slate-400" : "text-slate-500"
          }`}
        >
          CreditGo Score
        </Text>
      )}
    </View>
  );
};
