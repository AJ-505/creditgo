import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  CreditCard, 
  ArrowLeft,
  ChevronRight,
  Info
} from 'lucide-react-native';
import { Button, Input, SimpleProgress } from '../../src/components';
import { useAppStore } from '../../src/store';
import { validateNIN, formatNIN } from '../../src/utils';

export default function NINScreen() {
  const router = useRouter();
  const updateUser = useAppStore((state) => state.updateUser);
  
  const [nin, setNin] = useState('');
  const [error, setError] = useState('');

  const handleNINChange = (text: string) => {
    // Only allow digits
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 11) return;
    setNin(cleaned);
    setError('');
  };

  const handleContinue = () => {
    if (!validateNIN(nin)) {
      setError('Please enter a valid 11-digit NIN');
      return;
    }
    
    updateUser({ nin });
    router.push('/onboarding/selfie');
  };

  const isValid = validateNIN(nin);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4">
        <View className="flex-row items-center mb-4">
          <Button
            title=""
            variant="ghost"
            onPress={() => router.back()}
            icon={<ArrowLeft size={24} color="#334155" />}
            className="p-0 mr-4"
          />
          <View className="flex-1">
            <SimpleProgress current={1} total={6} />
          </View>
        </View>
        <Text className="text-sm text-dark-500">Step 1 of 6</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1 px-6" 
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero */}
          <View className="items-center py-8">
            <View className="w-20 h-20 bg-accent-100 rounded-full items-center justify-center mb-4">
              <CreditCard size={40} color="#3b82f6" />
            </View>
            <Text className="text-2xl font-bold text-dark-800 text-center">
              Identity Verification
            </Text>
            <Text className="text-base text-dark-500 text-center mt-2">
              Enter your National Identification Number (NIN) to verify your identity.
            </Text>
          </View>

          {/* NIN Input */}
          <Input
            label="National Identification Number (NIN)"
            placeholder="Enter your 11-digit NIN"
            value={formatNIN(nin)}
            onChangeText={handleNINChange}
            keyboardType="numeric"
            // Formatted output is XXX-XXXX-XXXX => 13 chars
            maxLength={13}
            error={error}
            hint={isValid ? '✓ Valid NIN format' : 'NIN is 11 digits (e.g., 123-4567-8901)'}
            icon={<CreditCard size={20} color="#64748b" />}
          />

          {/* Info Box */}
          <View className="bg-blue-50 rounded-xl p-4 mt-4">
            <View className="flex-row items-start">
              <Info size={20} color="#3b82f6" style={{ marginTop: 2 }} />
              <View className="ml-3 flex-1">
                <Text className="text-sm font-medium text-blue-800 mb-1">
                  Why we need your NIN
                </Text>
                <Text className="text-sm text-blue-700 leading-relaxed">
                  Your NIN helps lenders verify you're a real person. This increases 
                  your chances of approval and protects against fraud. Your NIN is 
                  encrypted and never shared without your consent.
                </Text>
              </View>
            </View>
          </View>

          {/* Don't have NIN? */}
          <View className="mt-6 p-4 bg-gray-50 rounded-xl">
            <Text className="text-sm font-medium text-dark-700 mb-1">
              Don't have your NIN?
            </Text>
            <Text className="text-sm text-dark-500">
              Dial *346# on any phone to retrieve your NIN instantly.
            </Text>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View className="px-6 pb-6 pt-4 bg-white border-t border-gray-100">
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!isValid}
            icon={<ChevronRight size={20} color="#fff" />}
            iconPosition="right"
            size="lg"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
