import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  PartyPopper,
  ChevronRight,
  ShieldCheck,
  Wallet,
  TrendingUp,
} from "lucide-react-native";
import { Button, CreditScoreGauge, BadgeRow } from "../../src/components";
import { useAppStore } from "../../src/store";
import { formatNaira } from "../../src/utils";

export default function CompleteScreen() {
  const router = useRouter();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const financialProfile = useAppStore((state) => state.financialProfile);
  const user = useAppStore((state) => state.user);

  const handleContinue = () => {
    completeOnboarding();
    router.replace("/(tabs)");
  };

  const safeAmount = financialProfile?.safeMonthlyRepayment || 0;
  const creditScore = financialProfile?.creditScore || 0;
  const badges = financialProfile?.badges || [];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Celebration Header */}
        <View className="items-center pt-8 pb-6 px-6">
          <View className="w-20 h-20 bg-primary-100 rounded-full items-center justify-center mb-4">
            <PartyPopper size={40} color="#22c55e" />
          </View>
          <Text className="text-2xl font-bold text-dark-800 text-center">
            You're All Set! 🎉
          </Text>
          <Text className="text-base text-dark-500 text-center mt-2">
            Your CreditGo profile is ready. Here's what we found.
          </Text>
        </View>

        {/* Credit Score Card */}
        <View
          className="mx-6 bg-gradient-to-b from-primary-500 to-primary-600 rounded-2xl p-6 mb-6"
          style={{ backgroundColor: "#22c55e" }}
        >
          <Text className="text-white text-center font-medium mb-4">
            Your CreditGo Score
          </Text>
          <View className="items-center bg-white rounded-xl py-6">
            <CreditScoreGauge score={creditScore} size={160} />
          </View>
        </View>

        {/* Safe Amount Card */}
        <View className="mx-6 bg-accent-50 rounded-xl p-6 mb-6">
          <View className="flex-row items-center mb-3">
            <Wallet size={20} color="#3b82f6" />
            <Text className="text-accent-700 font-medium ml-2">
              Your Safe Monthly Limit
            </Text>
          </View>
          <Text className="text-4xl font-bold text-accent-800">
            {formatNaira(safeAmount)}
          </Text>
          <Text className="text-sm text-accent-600 mt-2">
            This is the maximum monthly repayment you can afford without
            financial stress.
          </Text>
        </View>

        {/* Verification Badges */}
        {badges.length > 0 && (
          <View className="mx-6 mb-6">
            <Text className="text-lg font-semibold text-dark-800 mb-3">
              Your Achievements
            </Text>
            <BadgeRow badges={badges} />
          </View>
        )}

        {/* Summary Stats */}
        <View className="mx-6 bg-gray-50 rounded-xl p-4">
          <Text className="text-sm font-medium text-dark-700 mb-3">
            Profile Summary
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between py-2 border-b border-gray-200">
              <Text className="text-sm text-dark-500">Monthly Income</Text>
              <Text className="text-sm font-medium text-dark-700">
                {formatNaira(user?.monthlyIncome || 0)}
              </Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-200">
              <Text className="text-sm text-dark-500">Identity</Text>
              <View className="flex-row items-center">
                <ShieldCheck size={14} color="#22c55e" />
                <Text className="text-sm font-medium text-primary-600 ml-1">
                  Verified
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-200">
              <Text className="text-sm text-dark-500">Employment</Text>
              <Text className="text-sm font-medium text-dark-700 capitalize">
                {user?.employmentType || "N/A"}
              </Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-dark-500">Credit Limit</Text>
              <Text className="text-sm font-medium text-primary-600">
                {formatNaira(safeAmount)}/month
              </Text>
            </View>
          </View>
        </View>

        {/* What's Next */}
        <View className="mx-6 mt-6 p-4 bg-secondary-50 rounded-xl">
          <View className="flex-row items-center mb-2">
            <TrendingUp size={18} color="#ca8a04" />
            <Text className="text-sm font-medium text-secondary-800 ml-2">
              What's Next?
            </Text>
          </View>
          <Text className="text-sm text-secondary-700">
            Browse financing options that match your budget. We'll only show you
            products you can actually afford!
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="px-6 pb-6 pt-4 bg-white border-t border-gray-100">
        <Button
          title="Explore Financing Options"
          onPress={handleContinue}
          icon={<ChevronRight size={20} color="#fff" />}
          iconPosition="right"
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}
