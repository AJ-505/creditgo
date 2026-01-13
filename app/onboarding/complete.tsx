import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  PartyPopper,
  ChevronRight,
  ShieldCheck,
  Wallet,
  TrendingUp,
  CheckCircle,
} from "lucide-react-native";
import { Button, CreditScoreGauge, BadgeRow } from "../../src/components";
import { useAppStore } from "../../src/store";
import { formatNaira } from "../../src/utils";
import { getTierColor, creditTiers } from "../../src/theme";

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
  const tierColor = getTierColor(creditScore);
  const tierInfo =
    creditTiers[
      creditScore >= 85
        ? "platinum"
        : creditScore >= 70
          ? "gold"
          : creditScore >= 55
            ? "silver"
            : "bronze"
    ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm text-slate-500 font-medium">
              CreditGo Score
            </Text>
            <View className="flex-row items-center">
              <Text className="text-xs text-slate-400">Powered by </Text>
              <Text className="text-xs font-semibold text-lime-600">
                CreditGo
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6">
          <View
            className="bg-slate-900 rounded-3xl p-6 overflow-hidden"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <View className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-lime-400 opacity-10" />
            <View className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-lime-400 opacity-5" />

            <View className="items-center mb-6">
              <View className="bg-white/10 rounded-2xl px-4 py-2 mb-4">
                <Text
                  className="text-lime-400 font-semibold text-sm uppercase tracking-wider"
                  style={{ color: "#c8ff00" }}
                >
                  {tierInfo.name} Member
                </Text>
              </View>

              <View className="bg-slate-800/50 rounded-2xl p-4 mb-4">
                <CreditScoreGauge
                  score={creditScore}
                  size={140}
                  strokeWidth={12}
                  variant="dark"
                />
              </View>

              <Text className="text-slate-400 text-sm">
                Based on your financial profile
              </Text>
            </View>

            <View
              className="flex-row items-center justify-center py-3 px-4 bg-slate-800/50 rounded-xl"
              style={{ borderColor: tierColor, borderWidth: 1 }}
            >
              <TrendingUp size={18} color={tierColor} />
              <Text className="ml-2 font-medium" style={{ color: tierColor }}>
                {tierInfo.benefits[0]} • {tierInfo.benefits[1]}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 mt-6">
          <View className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-lime-100 rounded-xl items-center justify-center mr-4">
                <Wallet size={24} color="#65a30d" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                  Your Safe Amount
                </Text>
                <Text className="text-3xl font-bold text-slate-900">
                  {formatNaira(safeAmount)}
                </Text>
                <Text className="text-slate-400 text-sm">per month</Text>
              </View>
            </View>

            <View className="flex-row items-center py-3 border-t border-slate-100">
              <View className="flex-1">
                <Text className="text-slate-500 text-xs">Monthly Income</Text>
                <Text className="text-slate-900 font-semibold">
                  {formatNaira(user?.monthlyIncome || 0)}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-slate-500 text-xs">Repayment Ratio</Text>
                <Text className="text-slate-900 font-semibold">15-20%</Text>
              </View>
              <View className="flex-1 items-end">
                <Text className="text-slate-500 text-xs">Status</Text>
                <View className="flex-row items-center">
                  <CheckCircle size={14} color="#22c55e" />
                  <Text className="text-green-600 font-semibold ml-1">
                    Approved
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {badges.length > 0 && (
          <View className="px-6 mt-6">
            <Text className="text-lg font-bold text-slate-900 mb-3">
              Your Achievements
            </Text>
            <BadgeRow badges={badges} />
          </View>
        )}

        <View className="px-6 mt-6">
          <View className="bg-lime-50 rounded-xl p-4 border border-lime-100">
            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-lime-100 rounded-lg items-center justify-center mr-3 mt-0.5">
                <TrendingUp size={16} color="#65a30d" />
              </View>
              <View className="flex-1">
                <Text className="text-lime-800 font-semibold mb-1">
                  What's Next?
                </Text>
                <Text className="text-lime-700 text-sm leading-5">
                  Start saving to boost your credit score. Every on-time
                  repayment builds your financial reputation!
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-6 mt-6 mb-4">
          <View className="bg-white rounded-xl p-4 border border-slate-100">
            <View className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center">
                <ShieldCheck size={16} color="#22c55e" />
                <Text className="text-slate-600 text-sm ml-2">Identity</Text>
              </View>
              <Text className="text-green-600 text-sm font-medium">
                Verified
              </Text>
            </View>
            <View className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center">
                <ShieldCheck size={16} color="#22c55e" />
                <Text className="text-slate-600 text-sm ml-2">Employment</Text>
              </View>
              <Text className="text-green-600 text-sm font-medium">
                Verified
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-6 pb-8 pt-4 bg-slate-50 border-t border-slate-200">
        <TouchableOpacity
          onPress={handleContinue}
          className="bg-slate-900 rounded-2xl py-4 flex-row items-center justify-center"
          activeOpacity={0.9}
        >
          <Text className="text-lime-400 font-bold text-lg mr-2">
            Explore Financing
          </Text>
          <ChevronRight size={20} color="#c8ff00" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
