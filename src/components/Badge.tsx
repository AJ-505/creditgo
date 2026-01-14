import React from "react";
import { View, Text } from "react-native";
import {
  ShieldCheck,
  Building2,
  UserCheck,
  TrendingUp,
  Wallet,
  Coins,
  LucideIcon,
} from "lucide-react-native";
import { CreditBadge } from "../types";

const iconMap: Record<string, LucideIcon> = {
  "shield-check": ShieldCheck,
  building: Building2,
  "user-check": UserCheck,
  "trending-up": TrendingUp,
  wallet: Wallet,
  coins: Coins,
};

interface BadgeDisplayProps {
  badge: CreditBadge;
  size?: "sm" | "md" | "lg";
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badge,
  size = "md",
}) => {
  const Icon = iconMap[badge.icon] || ShieldCheck;

  const sizeStyles = {
    sm: {
      container: "p-2",
      icon: 16,
      text: "text-xs",
    },
    md: {
      container: "p-3",
      icon: 20,
      text: "text-sm",
    },
    lg: {
      container: "p-4",
      icon: 24,
      text: "text-base",
    },
  };

  return (
    <View
      className={`bg-primary-50 rounded-xl ${sizeStyles[size].container} items-center`}
    >
      <View className="bg-primary-100 rounded-full p-2 mb-2">
        <Icon size={sizeStyles[size].icon} color="#16a34a" />
      </View>
      <Text
        className={`text-primary-700 font-inter-medium text-center ${sizeStyles[size].text}`}
      >
        {badge.name}
      </Text>
    </View>
  );
};

interface BadgeRowProps {
  badges: CreditBadge[];
}

export const BadgeRow: React.FC<BadgeRowProps> = ({ badges }) => {
  if (badges.length === 0) return null;

  return (
    <View className="flex-row flex-wrap gap-3">
      {badges.map((badge) => (
        <View key={badge.id} className="flex-1 min-w-[100px]">
          <BadgeDisplay badge={badge} size="sm" />
        </View>
      ))}
    </View>
  );
};
