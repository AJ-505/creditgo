import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Check, Lock, ChevronRight } from "lucide-react-native";
import { FinancingOption } from "../types";
import { formatNaira } from "../constants";

interface AssetCardProps {
  asset: FinancingOption;
  safeAmount: number;
  onPress: () => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  safeAmount,
  onPress,
}) => {
  const isAffordable = asset.monthlyPayment <= safeAmount;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!isAffordable}
      className={`
        bg-white rounded-2xl overflow-hidden mb-4 border-2
        ${isAffordable ? "border-transparent shadow-sm" : "border-gray-200 opacity-75"}
      `}
      activeOpacity={0.8}
    >
      {/* Image */}
      <View className="h-40 bg-gray-100">
        {asset.imageUrl ? (
          <Image
            source={{ uri: asset.imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <Text className="text-gray-400">No Image</Text>
          </View>
        )}

        {/* Affordability Badge */}
        <View
          className={`
            absolute top-3 right-3 px-3 py-1 rounded-full flex-row items-center
            ${isAffordable ? "bg-primary-500" : "bg-gray-500"}
          `}
        >
          {isAffordable ? (
            <>
              <Check size={14} color="#fff" />
              <Text className="text-white text-xs font-inter-medium ml-1">
                Affordable
              </Text>
            </>
          ) : (
            <>
              <Lock size={14} color="#fff" />
              <Text className="text-white text-xs font-inter-medium ml-1">
                Locked
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Content */}
      <View className="p-4">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-2">
            <Text
              className="text-lg font-inter-bold text-dark-800"
              numberOfLines={1}
            >
              {asset.name}
            </Text>
            <Text className="text-sm text-dark-500 mt-0.5">
              via {asset.provider}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-lg font-inter-bold text-primary-600">
              {formatNaira(asset.monthlyPayment)}
            </Text>
            <Text className="text-xs text-dark-400">/month</Text>
          </View>
        </View>

        <Text className="text-sm text-dark-500 mt-2" numberOfLines={2}>
          {asset.description}
        </Text>

        {/* Features */}
        <View className="flex-row flex-wrap mt-3 gap-2">
          {asset.features.slice(0, 3).map((feature, index) => (
            <View key={index} className="bg-primary-50 px-2 py-1 rounded-md">
              <Text className="text-xs text-primary-700">{feature}</Text>
            </View>
          ))}
        </View>

        {/* Total Price & CTA */}
        <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <View>
            <Text className="text-xs text-dark-400">Total Price</Text>
            <Text className="text-base font-inter-semibold text-dark-700">
              {formatNaira(asset.totalPrice)}
            </Text>
          </View>
          <View
            className={`
              flex-row items-center px-4 py-2 rounded-lg
              ${isAffordable ? "bg-primary-500" : "bg-gray-300"}
            `}
          >
            <Text
              className={`font-inter-medium mr-1 ${isAffordable ? "text-white" : "text-gray-500"}`}
            >
              {isAffordable ? "Apply Now" : "Locked"}
            </Text>
            {isAffordable && <ChevronRight size={16} color="#fff" />}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
