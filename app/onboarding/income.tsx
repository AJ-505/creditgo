import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Wallet,
  Calendar,
  ArrowLeft,
  ChevronRight,
  Info,
  Smartphone,
  CheckCircle2
} from 'lucide-react-native';
import { Button, Input, SimpleProgress } from '../../src/components';
import { useAppStore } from '../../src/store';
import { 
  formatNaira, 
  getDemoSMSData, 
  parseSMSTransactions, 
  analyzeSMSTransactions,
  buildFinancialProfile 
} from '../../src/utils';
import {
  isSmsReadingAvailable,
  analyzeRealSms,
  requestSmsPermission,
  hasSmsPermission
} from '../../src/services/smsService';

export default function IncomeScreen() {
  const router = useRouter();
  const updateUser = useAppStore((state) => state.updateUser);
  const updateVerificationStatus = useAppStore((state) => state.updateVerificationStatus);
  const setFinancialProfile = useAppStore((state) => state.setFinancialProfile);
  const setTransactions = useAppStore((state) => state.setTransactions);
  const user = useAppStore((state) => state.user);
  
  const [income, setIncome] = useState('');
  const [payDay, setPayDay] = useState('');
  const [incomeError, setIncomeError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [smsAvailable, setSmsAvailable] = useState(false);
  const [smsPermissionGranted, setSmsPermissionGranted] = useState(false);

  // Check if real SMS reading is available on mount
  useEffect(() => {
    const checkSmsAvailability = async () => {
      const available = await isSmsReadingAvailable();
      setSmsAvailable(available);
      
      if (available) {
        const hasPermission = await hasSmsPermission();
        setSmsPermissionGranted(hasPermission);
      }
    };
    checkSmsAvailability();
  }, []);

  const handleRequestSmsPermission = async () => {
    const granted = await requestSmsPermission();
    setSmsPermissionGranted(granted);
    if (granted) {
      Alert.alert('Permission Granted', 'SMS access enabled. Your bank alerts will be analyzed for a more accurate credit score.');
    }
  };

  const formatIncomeInput = (text: string) => {
    // Remove non-digits
    const cleaned = text.replace(/\D/g, '');
    // Format with commas
    if (cleaned) {
      return parseInt(cleaned).toLocaleString('en-NG');
    }
    return '';
  };

  const parseIncomeValue = (formatted: string): number => {
    return parseInt(formatted.replace(/\D/g, '')) || 0;
  };

  const handleContinue = async () => {
    const incomeValue = parseIncomeValue(income);
    
    if (incomeValue < 50000) {
      setIncomeError('Minimum income for our services is ₦50,000/month');
      return;
    }

    setIsAnalyzing(true);

    let smsAnalysis;
    let transactions: any[] = [];

    // Try real SMS first if available and permission granted
    if (smsAvailable && smsPermissionGranted) {
      const result = await analyzeRealSms();
      if (result.success && result.transactions.length > 0) {
        transactions = result.transactions;
        smsAnalysis = analyzeSMSTransactions(transactions);
        setTransactions(transactions);
      } else {
        // Fall back to manual if SMS reading fails
        Alert.alert(
          'SMS Analysis',
          result.error || 'Could not read SMS. Using your stated income for calculations.'
        );
      }
    } else {
      // No SMS available - just use stated income
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Build financial profile
    const profile = buildFinancialProfile(
      incomeValue,
      user?.isIdentityVerified || false,
      user?.isEmploymentVerified || false,
      user?.employmentType || null,
      smsAnalysis
    );

    // Update state
    updateUser({ 
      monthlyIncome: incomeValue,
      payDate: parseInt(payDay) || undefined,
    });
    updateVerificationStatus({ 
      income: true,
      smsPermission: smsPermissionGranted
    });
    setFinancialProfile(profile);

    setIsAnalyzing(false);
    router.push('/onboarding/expenses');
  };

  const incomeValue = parseIncomeValue(income);
  const isValid = incomeValue >= 50000;

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
            <SimpleProgress current={4} total={6} />
          </View>
        </View>
        <Text className="text-sm text-dark-500">Step 4 of 6</Text>
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
          <View className="py-6">
            <Text className="text-2xl font-bold text-dark-800">
              Your Income Details
            </Text>
            <Text className="text-base text-dark-500 mt-2">
              This helps us calculate your safe repayment limit.
            </Text>
          </View>

          {/* Real SMS Permission - Only available on Android builds with SMS capability */}
          {smsAvailable && (
            <TouchableOpacity
              onPress={handleRequestSmsPermission}
              disabled={smsPermissionGranted}
              className={`
                flex-row items-center justify-between p-4 rounded-xl mb-6
                ${smsPermissionGranted ? 'bg-primary-50 border-2 border-primary-200' : 'bg-accent-50 border-2 border-accent-200'}
              `}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                {smsPermissionGranted ? (
                  <CheckCircle2 size={20} color="#16a34a" />
                ) : (
                  <Smartphone size={20} color="#3b82f6" />
                )}
                <View className="ml-3 flex-1">
                  <Text className={`font-medium ${smsPermissionGranted ? 'text-primary-700' : 'text-accent-700'}`}>
                    {smsPermissionGranted ? 'SMS Access Enabled ✓' : 'Enable SMS Analysis'}
                  </Text>
                  <Text className={`text-xs ${smsPermissionGranted ? 'text-primary-600' : 'text-accent-600'}`}>
                    {smsPermissionGranted 
                      ? 'Your bank alerts will be analyzed automatically' 
                      : 'Tap to allow reading bank SMS alerts for better accuracy'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Income Input */}
          <Input
            label="Monthly Income"
            placeholder="e.g., 300,000"
            value={income}
            onChangeText={(text) => {
              setIncome(formatIncomeInput(text));
              setIncomeError('');
            }}
            keyboardType="numeric"
            error={incomeError}
            hint={incomeValue > 0 ? `₦${income} per month` : 'Enter your average monthly earnings'}
            icon={<Wallet size={20} color="#64748b" />}
          />

          {/* Pay Day Input */}
          <Input
            label="Pay Day (Optional)"
            placeholder="e.g., 25"
            value={payDay}
            onChangeText={(text) => {
              const cleaned = text.replace(/\D/g, '');
              if (parseInt(cleaned) <= 31 || !cleaned) {
                setPayDay(cleaned);
              }
            }}
            keyboardType="numeric"
            maxLength={2}
            hint="Which day of the month do you usually get paid?"
            icon={<Calendar size={20} color="#64748b" />}
          />

          {/* Info Box */}
          <View className="bg-blue-50 rounded-xl p-4 mt-4">
            <View className="flex-row items-start">
              <Info size={20} color="#3b82f6" style={{ marginTop: 2 }} />
              <View className="ml-3 flex-1">
                <Text className="text-sm font-medium text-blue-800 mb-1">
                  How we calculate your Safe Amount
                </Text>
                <Text className="text-sm text-blue-700 leading-relaxed">
                  We analyze your income pattern and estimate expenses to find the 
                  maximum amount you can repay monthly without financial stress.
                </Text>
              </View>
            </View>
          </View>

          {/* Income Range Info */}
          {isValid && (
            <View className="bg-slate-900 rounded-xl p-4 mt-4">
              <Text className="text-sm font-medium text-white mb-2">
                Based on {formatNaira(incomeValue)}/month:
              </Text>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-xs text-slate-400">Est. Expenses</Text>
                  <Text className="text-sm font-medium text-white">
                    {formatNaira(Math.floor(incomeValue * 0.65))}
                  </Text>
                </View>
                <View>
                  <Text className="text-xs text-slate-400">Disposable</Text>
                  <Text className="text-sm font-medium text-white">
                    {formatNaira(Math.floor(incomeValue * 0.35))}
                  </Text>
                </View>
                <View>
                  <Text className="text-xs text-slate-400">Safe Limit</Text>
                  <Text className="text-sm font-bold text-lime-400">
                    {formatNaira(Math.floor(incomeValue * 0.15))}-{formatNaira(Math.floor(incomeValue * 0.18))}
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-slate-400 mt-2">
                💡 15-18% of income is the Nigerian fintech standard for safe repayment
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom CTA */}
        <View className="px-6 pb-6 pt-4 bg-white border-t border-gray-100">
          <Button
            title={isAnalyzing ? 'Analyzing...' : 'Calculate My Safe Amount'}
            onPress={handleContinue}
            disabled={!isValid || isAnalyzing}
            loading={isAnalyzing}
            icon={<ChevronRight size={20} color="#fff" />}
            iconPosition="right"
            size="lg"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
