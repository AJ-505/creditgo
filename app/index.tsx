import React, { useEffect } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../src/store";

export default function SplashScreen() {
  const router = useRouter();
  const isOnboardingComplete = useAppStore(
    (state) => state.isOnboardingComplete,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOnboardingComplete) {
        router.replace("/(tabs)");
      } else {
        router.replace("/onboarding");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isOnboardingComplete]);

  return (
    <SafeAreaView className="flex-1 bg-primary-500">
      <View className="flex-1 items-center justify-center px-8">
        {/* Logo */}
        <View className="w-24 h-24 bg-white rounded-3xl items-center justify-center mb-6 shadow-lg">
          <Text className="text-4xl font-inter-bold text-primary-500">C</Text>
        </View>

        {/* App Name */}
        <Text className="text-4xl font-inter-bold text-white mb-2">
          CreditGo
        </Text>
        <Text className="text-lg text-primary-100 text-center">
          Smart Credit for Smart Africans
        </Text>

        {/* Loading Indicator */}
        <View className="mt-12">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </View>

      {/* Footer */}
      <View className="pb-8 items-center">
        <Text className="text-primary-200 text-sm">
          Bridging Nigeria's Credit Gap
        </Text>
      </View>
    </SafeAreaView>
  );
}
