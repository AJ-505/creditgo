import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Shield,
  Lock,
  Eye,
  MessageSquare,
  Check,
  X,
  ArrowLeft,
} from "lucide-react-native";
import { Button } from "../../src/components";

export default function PrivacyScreen() {
  const router = useRouter();

  const whatWeDo = [
    {
      icon: MessageSquare,
      text: "Analyze bank transaction alerts to calculate your score",
    },
    {
      icon: Shield,
      text: "Verify your identity with NIN for lender confidence",
    },
    {
      icon: Lock,
      text: "Keep all your data encrypted and secure",
    },
  ];

  const whatWeDont = [
    "Read your personal messages or chats",
    "Access your OTPs or passwords",
    "Share your data without consent",
    "Sell your information to third parties",
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4">
        <Button
          title=""
          variant="ghost"
          onPress={() => router.back()}
          icon={<ArrowLeft size={24} color="#334155" />}
          className="p-0 mr-4"
        />
        <Text className="text-lg font-inter-semibold text-dark-800">
          Your Privacy
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View className="items-center py-6">
          <View className="w-20 h-20 bg-primary-100 rounded-full items-center justify-center mb-4">
            <Shield size={40} color="#22c55e" />
          </View>
          <Text className="text-2xl font-inter-bold text-dark-800 text-center">
            We Respect Your Privacy
          </Text>
          <Text className="text-base text-dark-500 text-center mt-2">
            Your trust is everything to us. Here's exactly how we handle your
            data.
          </Text>
        </View>

        {/* What We Do */}
        <View className="bg-primary-50 rounded-xl p-4 mb-4">
          <Text className="text-base font-inter-semibold text-dark-800 mb-3">
            What We Do
          </Text>
          {whatWeDo.map((item, index) => (
            <View key={index} className="flex-row items-start mb-3 last:mb-0">
              <View className="w-8 h-8 bg-primary-100 rounded-lg items-center justify-center mr-3">
                <item.icon size={16} color="#16a34a" />
              </View>
              <Text className="flex-1 text-sm text-dark-700 pt-1">
                {item.text}
              </Text>
            </View>
          ))}
        </View>

        {/* What We Don't Do */}
        <View className="bg-red-50 rounded-xl p-4 mb-4">
          <Text className="text-base font-inter-semibold text-dark-800 mb-3">
            What We NEVER Do
          </Text>
          {whatWeDont.map((item, index) => (
            <View
              key={index}
              className="flex-row items-center mb-2.5 last:mb-0"
            >
              <View className="w-6 h-6 bg-red-100 rounded-full items-center justify-center mr-3">
                <X size={12} color="#dc2626" />
              </View>
              <Text className="flex-1 text-sm text-dark-700">{item}</Text>
            </View>
          ))}
        </View>

        {/* Permission Details */}
        <View className="bg-gray-50 rounded-xl p-4">
          <View className="flex-row items-center mb-3">
            <Eye size={20} color="#64748b" />
            <Text className="text-base font-inter-semibold text-dark-800 ml-2">
              SMS Permission
            </Text>
          </View>
          <Text className="text-sm text-dark-600 leading-relaxed">
            We ONLY analyze transaction alerts from banks (e.g., "Credit Alert:
            NGN..."). We filter for financial keywords and ignore all other
            messages. Your personal SMS, WhatsApp, and OTPs are never read or
            stored.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="px-6 pb-6 pt-4 bg-white border-t border-gray-100">
        <Button
          title="I Understand & Agree"
          onPress={() => router.push("/onboarding/nin")}
          icon={<Check size={20} color="#fff" />}
          iconPosition="left"
          size="lg"
        />
        <Text className="text-center text-xs text-dark-400 mt-3">
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}
