import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import {
  Laptop,
  Sun,
  Home,
  GraduationCap,
  HeartPulse,
  Briefcase,
  LucideIcon,
} from "lucide-react-native";
import { AssetCategory, AssetCategoryInfo } from "../types";
import { ASSET_CATEGORIES } from "../constants/partners";

const iconMap: Record<string, LucideIcon> = {
  laptop: Laptop,
  sun: Sun,
  home: Home,
  "graduation-cap": GraduationCap,
  "heart-pulse": HeartPulse,
  briefcase: Briefcase,
};

interface CategoryFilterProps {
  selectedCategory: AssetCategory | "all";
  onSelectCategory: (category: AssetCategory | "all") => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const allCategories: (
    | AssetCategoryInfo
    | { id: "all"; name: string; icon: string; color: string }
  )[] = [
    { id: "all", name: "All", icon: "grid", color: "#64748b" },
    ...ASSET_CATEGORIES,
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="max-h-10"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 2 }}
    >
      {allCategories.map((category) => {
        const isSelected = selectedCategory === category.id;
        const Icon = iconMap[category.icon];

        return (
          <TouchableOpacity
            key={category.id}
            onPress={() =>
              onSelectCategory(category.id as AssetCategory | "all")
            }
            className={`
              flex-row items-center px-3 py-1.5 rounded-full mr-2
              ${isSelected ? "bg-slate-900" : "bg-white border border-slate-200"}
            `}
            activeOpacity={0.7}
          >
            {Icon && (
              <Icon
                size={12}
                color={isSelected ? "#c8ff00" : category.color}
                style={{ marginRight: 4 }}
              />
            )}
            <Text
              className={`
                font-medium text-xs
                ${isSelected ? "text-white" : "text-slate-600"}
              `}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
