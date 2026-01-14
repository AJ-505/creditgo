import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  X,
  Check,
  Lock,
  Clock,
  Percent,
  Calendar,
  Shield,
  ChevronRight,
  ExternalLink,
} from "lucide-react-native";
import { useAppStore } from "../../src/store";
import { FINANCING_OPTIONS, PARTNERS, formatNaira } from "../../src/constants";
import { Button } from "../../src/components";
import { generateId } from "../../src/utils";

export default function AssetDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const financialProfile = useAppStore((state) => state.financialProfile);
  const user = useAppStore((state) => state.user);
  const addApplication = useAppStore((state) => state.addApplication);

  const [isApplying, setIsApplying] = useState(false);

  const asset = FINANCING_OPTIONS.find((a) => a.id === id);
  const partner = asset
    ? PARTNERS.find((p) => p.name === asset.provider)
    : null;

  const safeAmount = financialProfile?.safeMonthlyRepayment || 0;
  const creditScore = financialProfile?.creditScore || 0;
  const isAffordable = asset ? asset.monthlyPayment <= safeAmount : false;

  const handleApply = async () => {
    if (!asset || !isAffordable) return;

    setIsApplying(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Add application
    addApplication({
      id: generateId(),
      userId: user?.id || "demo-user",
      assetId: asset.id,
      status: "pending",
      appliedAt: new Date(),
      creditScore,
      safeAmount,
    });

    setIsApplying(false);
    router.push("/application-success");
  };

  if (!asset) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-dark-500">Asset not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          variant="outline"
          className="mt-4"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
        >
          <X size={20} color="#334155" />
        </TouchableOpacity>
        <View
          className={`px-3 py-1 rounded-full flex-row items-center ${
            isAffordable ? "bg-primary-100" : "bg-gray-100"
          }`}
        >
          {isAffordable ? (
            <>
              <Check size={14} color="#16a34a" />
              <Text className="text-primary-700 text-sm font-inter-medium ml-1">
                Within Budget
              </Text>
            </>
          ) : (
            <>
              <Lock size={14} color="#64748b" />
              <Text className="text-dark-500 text-sm font-inter-medium ml-1">
                Above Budget
              </Text>
            </>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Image */}
        <View className="h-60 bg-gray-100">
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
        </View>

        {/* Content */}
        <View className="px-6 pt-6">
          {/* Title & Price */}
          <View className="mb-4">
            <Text className="text-2xl font-inter-bold text-dark-800">
              {asset.name}
            </Text>
            <Text className="text-dark-500 mt-1">via {asset.provider}</Text>
          </View>

          {/* Price Cards */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-primary-50 rounded-xl p-4">
              <Text className="text-primary-600 text-sm">Monthly</Text>
              <Text className="text-2xl font-inter-bold text-primary-700">
                {formatNaira(asset.monthlyPayment)}
              </Text>
            </View>
            <View className="flex-1 bg-gray-50 rounded-xl p-4">
              <Text className="text-dark-500 text-sm">Total Price</Text>
              <Text className="text-2xl font-inter-bold text-dark-700">
                {formatNaira(asset.totalPrice)}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-dark-600 leading-relaxed mb-6">
            {asset.description}
          </Text>

          {/* Features */}
          <View className="mb-6">
            <Text className="text-lg font-inter-semibold text-dark-800 mb-3">
              Features
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {asset.features.map((feature, index) => (
                <View
                  key={index}
                  className="bg-primary-50 px-3 py-2 rounded-lg flex-row items-center"
                >
                  <Check size={14} color="#16a34a" />
                  <Text className="text-primary-700 text-sm ml-1">
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Details */}
          <View className="bg-gray-50 rounded-xl p-4 mb-6">
            <Text className="text-lg font-inter-semibold text-dark-800 mb-3">
              Payment Details
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-center justify-between py-2 border-b border-gray-200">
                <View className="flex-row items-center">
                  <Clock size={16} color="#64748b" />
                  <Text className="text-dark-600 ml-2">Duration</Text>
                </View>
                <Text className="text-dark-800 font-inter-medium">
                  {asset.duration} months
                </Text>
              </View>
              <View className="flex-row items-center justify-between py-2 border-b border-gray-200">
                <View className="flex-row items-center">
                  <Percent size={16} color="#64748b" />
                  <Text className="text-dark-600 ml-2">Interest Rate</Text>
                </View>
                <Text
                  className={`font-inter-medium ${asset.interestRate === 0 ? "text-primary-600" : "text-dark-800"}`}
                >
                  {asset.interestRate === 0
                    ? "No Interest!"
                    : `${asset.interestRate}%`}
                </Text>
              </View>
              <View className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center">
                  <Calendar size={16} color="#64748b" />
                  <Text className="text-dark-600 ml-2">Monthly Payment</Text>
                </View>
                <Text className="text-primary-600 font-inter-bold">
                  {formatNaira(asset.monthlyPayment)}
                </Text>
              </View>
            </View>
          </View>

          {/* Partner Info */}
          {partner && (
            <View className="bg-accent-50 rounded-xl p-4 mb-6">
              <Text className="text-lg font-inter-semibold text-dark-800 mb-2">
                About {partner.name}
              </Text>
              <Text className="text-dark-600 text-sm mb-3">
                {partner.description}
              </Text>
              <TouchableOpacity className="flex-row items-center">
                <ExternalLink size={14} color="#3b82f6" />
                <Text className="text-accent-600 text-sm font-inter-medium ml-1">
                  Visit Website
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Your Eligibility */}
          <View className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-inter-semibold text-dark-800">
                Your Eligibility
              </Text>
              <View
                className={`px-2 py-1 rounded-full ${isAffordable ? "bg-primary-100" : "bg-red-100"}`}
              >
                <Text
                  className={`text-xs font-inter-medium ${isAffordable ? "text-primary-700" : "text-red-700"}`}
                >
                  {isAffordable ? "Eligible" : "Not Eligible"}
                </Text>
              </View>
            </View>

            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-dark-500">Your Safe Amount</Text>
                <Text className="text-dark-800 font-inter-medium">
                  {formatNaira(safeAmount)}/mo
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-dark-500">Required Monthly</Text>
                <Text
                  className={`font-inter-medium ${isAffordable ? "text-primary-600" : "text-red-600"}`}
                >
                  {formatNaira(asset.monthlyPayment)}/mo
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-dark-500">Your Credit Score</Text>
                <Text className="text-dark-800 font-inter-medium">
                  {creditScore}/100
                </Text>
              </View>
            </View>

            {!isAffordable && (
              <View className="mt-3 pt-3 border-t border-gray-200">
                <Text className="text-red-600 text-sm">
                  This item requires{" "}
                  {formatNaira(asset.monthlyPayment - safeAmount)} more than
                  your safe limit.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-white border-t border-gray-100">
        <Button
          title={
            isApplying
              ? "Submitting Application..."
              : "Apply with CreditGo Score"
          }
          onPress={handleApply}
          disabled={!isAffordable || isApplying}
          loading={isApplying}
          icon={
            isAffordable ? (
              <ChevronRight size={20} color="#fff" />
            ) : (
              <Lock size={20} color="#9ca3af" />
            )
          }
          iconPosition="right"
          size="lg"
        />
        {isAffordable && (
          <View className="flex-row items-center justify-center mt-3">
            <Shield size={14} color="#22c55e" />
            <Text className="text-primary-600 text-xs ml-1">
              Pre-approved based on your profile
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
