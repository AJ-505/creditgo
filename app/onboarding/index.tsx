import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Target,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ChevronRight,
} from "lucide-react-native";
import { Button } from "../../src/components";

// TODO: Fix warning about deprecated use of <SafeAreaView />

export default function WelcomeScreen() {
  const router = useRouter();

  const features = [
    {
      icon: Target,
      title: "Discover Your Limit",
      description: "Find out how much you can safely borrow without stress.",
      color: "#3b82f6",
    },
    {
      icon: ShieldCheck,
      title: "Build Credit History",
      description: "Every repayment improves your credit profile.",
      color: "#22c55e",
    },
    {
      icon: TrendingUp,
      title: "Access Real Financing",
      description: "Laptops, solar, rent, education - not predatory loans.",
      color: "#f59e0b",
    },
    {
      icon: Sparkles,
      title: "Smart Matching",
      description: "We'll connect you to financing you can actually afford.",
      color: "#8b5cf6",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View className="px-6 pt-8 pb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-primary-500 rounded-xl items-center justify-center mr-3">
              <Text className="text-2xl font-inter-bold text-white">C</Text>
            </View>
            <Text className="text-2xl font-inter-bold text-dark-800">
              CreditGo
            </Text>
          </View>

          <Text className="text-3xl font-inter-bold text-dark-800 leading-tight">
            Access Credit That{"\n"}
            <Text className="text-primary-500">Builds You Up</Text>
          </Text>

          <Text className="text-base text-dark-500 mt-4 leading-relaxed">
            Nigeria's first credit intelligence platform. We help you discover
            what you can afford and connect you to productive financing - not
            toxic cash loans.
          </Text>
        </View>

        {/* Features Grid */}
        <View className="px-6">
          {features.map((feature, index) => (
            <View
              key={index}
              className="flex-row items-start bg-gray-50 p-4 rounded-xl mb-3"
            >
              <View
                className="w-10 h-10 rounded-lg items-center justify-center mr-4"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon size={20} color={feature.color} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-inter-semibold text-dark-800">
                  {feature.title}
                </Text>
                <Text className="text-sm text-dark-500 mt-0.5">
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Stats Section */}
        <View className="mx-6 mt-6 p-4 bg-primary-50 rounded-xl">
          <Text className="text-sm text-primary-700 font-inter-medium text-center">
            🇳🇬 Trusted by professionals earning ₦300k - ₦1.5M/month
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="px-6 pb-6 pt-4 bg-white border-t border-gray-100">
        <Button
          title="Get Started"
          onPress={() => router.push("/onboarding/privacy")}
          icon={<ChevronRight size={20} color="#fff" />}
          iconPosition="right"
          size="lg"
        />
        <Text className="text-center text-xs text-dark-400 mt-3">
          Takes less than 3 minutes to complete
        </Text>
      </View>
    </SafeAreaView>
  );
}
