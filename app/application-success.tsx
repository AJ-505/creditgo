import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircle, ArrowRight, Bell, Clock } from "lucide-react-native";
import { Button } from "../src/components";

export default function ApplicationSuccessScreen() {
  const router = useRouter();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGoHome = () => {
    router.replace("/(tabs)");
  };

  const handleViewApplications = () => {
    router.replace("/(tabs)/wallet");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        {/* Success Icon */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View className="w-28 h-28 bg-primary-100 rounded-full items-center justify-center mb-6">
            <CheckCircle size={64} color="#22c55e" />
          </View>
        </Animated.View>

        {/* Content */}
        <Animated.View
          style={{ opacity: opacityAnim }}
          className="items-center"
        >
          <Text className="text-3xl font-bold text-dark-800 text-center mb-2">
            Application Sent! 🎉
          </Text>
          <Text className="text-base text-dark-500 text-center mb-8">
            Your application has been sent to the financing partner. They'll
            review your CreditGo profile and get back to you.
          </Text>

          {/* What Happens Next */}
          <View className="w-full bg-gray-50 rounded-xl p-5 mb-6">
            <Text className="text-lg font-semibold text-dark-800 mb-4">
              What happens next?
            </Text>

            <View className="space-y-4">
              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-primary-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-primary-600 font-bold text-sm">1</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-dark-700 font-medium">
                    Partner Review
                  </Text>
                  <Text className="text-dark-500 text-sm">
                    The financing partner will review your profile and credit
                    score.
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-primary-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-primary-600 font-bold text-sm">2</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-dark-700 font-medium">
                    Quick Decision
                  </Text>
                  <Text className="text-dark-500 text-sm">
                    Most partners respond within 24-48 hours.
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-primary-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-primary-600 font-bold text-sm">3</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-dark-700 font-medium">
                    Get Your Asset
                  </Text>
                  <Text className="text-dark-500 text-sm">
                    Once approved, you'll receive your asset and start repaying!
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Notification Tip */}
          <View className="w-full flex-row items-center bg-accent-50 rounded-xl p-4 mb-8">
            <Bell size={20} color="#3b82f6" />
            <Text className="flex-1 text-accent-700 text-sm ml-3">
              We'll send you a notification when there's an update on your
              application.
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Actions */}
      <View className="px-6 pb-8">
        <Button
          title="View My Applications"
          onPress={handleViewApplications}
          icon={<Clock size={20} color="#fff" />}
          iconPosition="left"
          size="lg"
          className="mb-3"
        />
        <Button
          title="Explore More Options"
          onPress={handleGoHome}
          variant="outline"
          icon={<ArrowRight size={20} color="#22c55e" />}
          iconPosition="right"
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}
