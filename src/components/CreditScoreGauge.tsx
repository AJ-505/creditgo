import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CreditScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({
  score,
  maxScore = 100,
  size = 180,
  strokeWidth = 15,
  showLabel = false,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / maxScore) * circumference;
  const offset = circumference - progress;

  const getScoreColor = (score: number): string => {
    if (score >= 85) return '#c8ff00'; // Lime - Platinum
    if (score >= 70) return '#eab308'; // Gold
    if (score >= 55) return '#94a3b8'; // Silver
    return '#d97706'; // Bronze
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 85) return 'Platinum';
    if (score >= 70) return 'Gold';
    if (score >= 55) return 'Silver';
    return 'Bronze';
  };

  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  // Calculate font size based on gauge size
  const fontSize = size < 80 ? 'text-lg' : size < 120 ? 'text-2xl' : 'text-4xl';
  const labelSize = size < 80 ? 'text-[8px]' : 'text-xs';

  return (
    <View className="items-center justify-center">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#334155"
            strokeWidth={strokeWidth}
            fill="transparent"
            opacity={0.3}
          />
          {/* Progress Circle */}
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
        {/* Center Content */}
        <View 
          className="absolute inset-0 items-center justify-center"
          style={{ width: size, height: size }}
        >
          <Text className={`${fontSize} font-bold text-white`}>{score}</Text>
        </View>
      </View>
      {showLabel && (
        <Text className="text-xs text-slate-400 mt-2">CreditGo Score</Text>
      )}
    </View>
  );
};
