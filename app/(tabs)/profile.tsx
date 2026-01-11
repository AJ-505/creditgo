import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User,
  ShieldCheck,
  Building2,
  Wallet,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Settings,
  Edit3,
  X,
  RefreshCw
} from 'lucide-react-native';
import { useAppStore } from '../../src/store';
import { formatNaira } from '../../src/constants';
import { CreditScoreGauge } from '../../src/components';
import { getCreditTier, calculateCreditLimit } from '../../src/utils/creditCalculator';
import { buildFinancialProfile } from '../../src/utils';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const financialProfile = useAppStore((state) => state.financialProfile);
  const verificationStatus = useAppStore((state) => state.verificationStatus);
  const updateUser = useAppStore((state) => state.updateUser);
  const setFinancialProfile = useAppStore((state) => state.setFinancialProfile);
  const resetState = useAppStore((state) => state.resetState);
  const isDemoMode = useAppStore((state) => state.isDemoMode);
  const toggleDemoMode = useAppStore((state) => state.toggleDemoMode);

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [newIncome, setNewIncome] = useState('');

  const creditScore = financialProfile?.creditScore || 0;
  const creditTier = getCreditTier(creditScore);
  const badges = financialProfile?.badges || [];

  const formatIncomeInput = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned) {
      return parseInt(cleaned).toLocaleString('en-NG');
    }
    return '';
  };

  const parseIncome = (formatted: string): number => {
    return parseInt(formatted.replace(/\D/g, '')) || 0;
  };

  const handleUpdateIncome = () => {
    const incomeValue = parseIncome(newIncome);
    
    if (incomeValue < 50000) {
      Alert.alert('Invalid Amount', 'Minimum income for our services is ₦50,000/month');
      return;
    }

    // Update user income
    updateUser({ monthlyIncome: incomeValue });

    // Recalculate financial profile
    const profile = buildFinancialProfile(
      incomeValue,
      user?.isIdentityVerified || false,
      user?.isEmploymentVerified || false,
      user?.employmentType || null,
      undefined
    );
    setFinancialProfile(profile);

    setShowIncomeModal(false);
    setNewIncome('');
    
    Alert.alert(
      '✅ Income Updated',
      `Your monthly income has been updated to ${formatNaira(incomeValue)}.\n\nNew safe amount: ${formatNaira(profile.safeMonthlyRepayment)}/month`
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Reset App',
      'This will clear all your data and restart the onboarding. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            resetState();
            router.replace('/');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <View className="px-5 pt-2 pb-4">
          <Text className="text-2xl font-bold text-slate-900">
            Profile
          </Text>
        </View>

        {/* Profile Card */}
        <View className="mx-5 bg-white rounded-2xl p-5 border border-slate-100 mb-5">
          <View className="flex-row items-center mb-4">
            <View className="w-16 h-16 bg-slate-900 rounded-2xl items-center justify-center">
              <User size={32} color="#c8ff00" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-xl font-bold text-slate-900">
                {user?.firstName || 'CreditGo User'}
              </Text>
              <Text className="text-slate-500 text-sm">
                {user?.email || user?.workEmail || 'Member since 2026'}
              </Text>
            </View>
          </View>

          {/* Score Summary */}
          <View className="flex-row items-center justify-between pt-4 border-t border-slate-100">
            <View className="items-center flex-1">
              <View className="w-12 h-12">
                <CreditScoreGauge score={creditScore} size={48} strokeWidth={5} />
              </View>
              <Text className="text-xs text-slate-500 mt-1">Score</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-lg font-bold text-slate-900">
                {formatNaira(financialProfile?.safeMonthlyRepayment || 0)}
              </Text>
              <Text className="text-xs text-slate-500">Safe Amount</Text>
            </View>
            <View className="items-center flex-1">
              <Text 
                className="text-lg font-bold"
                style={{ color: creditTier.color }}
              >
                {creditTier.name}
              </Text>
              <Text className="text-xs text-slate-500">Tier</Text>
            </View>
          </View>
        </View>

        {/* Income Update Section */}
        <View className="mx-5 mb-5">
          <Text className="text-lg font-bold text-slate-900 mb-3">
            Income & Verification
          </Text>
          
          <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {/* Monthly Income - Editable */}
            <TouchableOpacity 
              onPress={() => {
                setNewIncome(user?.monthlyIncome?.toString() || '');
                setShowIncomeModal(true);
              }}
              className="flex-row items-center p-4 border-b border-slate-100"
            >
              <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center">
                <Wallet size={20} color="#22c55e" />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-slate-900 font-medium">Monthly Income</Text>
                <Text className="text-green-600 font-bold">
                  {formatNaira(user?.monthlyIncome || 0)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Edit3 size={16} color="#64748b" />
                <Text className="text-slate-500 text-sm ml-1">Update</Text>
              </View>
            </TouchableOpacity>
            
            {/* Identity Verification */}
            <View className="flex-row items-center p-4 border-b border-slate-100">
              <View className={`w-10 h-10 rounded-xl items-center justify-center ${
                verificationStatus.identity ? 'bg-green-100' : 'bg-slate-100'
              }`}>
                <ShieldCheck 
                  size={20} 
                  color={verificationStatus.identity ? '#22c55e' : '#94a3b8'} 
                />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-slate-900 font-medium">Identity (NIN)</Text>
                <Text className="text-slate-500 text-sm">
                  {verificationStatus.identity ? 'Verified' : 'Pending verification'}
                </Text>
              </View>
              <View className={`px-2 py-1 rounded-full ${
                verificationStatus.identity ? 'bg-green-100' : 'bg-amber-100'
              }`}>
                <Text className={`text-xs font-medium ${
                  verificationStatus.identity ? 'text-green-700' : 'text-amber-700'
                }`}>
                  {verificationStatus.identity ? '✓ Verified' : 'Pending'}
                </Text>
              </View>
            </View>
            
            {/* Employment */}
            <View className="flex-row items-center p-4 border-b border-slate-100">
              <View className={`w-10 h-10 rounded-xl items-center justify-center ${
                verificationStatus.employment ? 'bg-green-100' : 'bg-slate-100'
              }`}>
                <Building2 
                  size={20} 
                  color={verificationStatus.employment ? '#22c55e' : '#94a3b8'} 
                />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-slate-900 font-medium">Employment</Text>
                <Text className="text-slate-500 text-sm capitalize">
                  {user?.employmentType || 'Not specified'}
                </Text>
              </View>
              <View className={`px-2 py-1 rounded-full ${
                verificationStatus.employment ? 'bg-green-100' : 'bg-amber-100'
              }`}>
                <Text className={`text-xs font-medium ${
                  verificationStatus.employment ? 'text-green-700' : 'text-amber-700'
                }`}>
                  {verificationStatus.employment ? '✓ Verified' : 'Pending'}
                </Text>
              </View>
            </View>

            {/* Demo Mode Toggle */}
            <TouchableOpacity 
              onPress={toggleDemoMode}
              className="flex-row items-center p-4"
            >
              <View className={`w-10 h-10 rounded-xl items-center justify-center ${
                isDemoMode ? 'bg-violet-100' : 'bg-slate-100'
              }`}>
                <RefreshCw size={20} color={isDemoMode ? '#8b5cf6' : '#94a3b8'} />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-slate-900 font-medium">Demo Mode</Text>
                <Text className="text-slate-500 text-sm">
                  {isDemoMode ? 'Using sample SMS data' : 'Using real SMS data'}
                </Text>
              </View>
              <View className={`w-12 h-6 rounded-full p-1 ${
                isDemoMode ? 'bg-violet-500' : 'bg-slate-300'
              }`}>
                <View className={`w-4 h-4 rounded-full bg-white ${
                  isDemoMode ? 'ml-auto' : ''
                }`} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings */}
        <View className="mx-5 mb-5">
          <Text className="text-lg font-bold text-slate-900 mb-3">
            Settings
          </Text>
          
          <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <TouchableOpacity className="flex-row items-center p-4 border-b border-slate-100">
              <View className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center">
                <Settings size={20} color="#64748b" />
              </View>
              <Text className="flex-1 ml-3 text-slate-900 font-medium">
                Account Settings
              </Text>
              <ChevronRight size={20} color="#94a3b8" />
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center p-4 border-b border-slate-100">
              <View className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center">
                <Bell size={20} color="#64748b" />
              </View>
              <Text className="flex-1 ml-3 text-slate-900 font-medium">
                Notifications
              </Text>
              <ChevronRight size={20} color="#94a3b8" />
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center p-4 border-b border-slate-100">
              <View className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center">
                <HelpCircle size={20} color="#64748b" />
              </View>
              <Text className="flex-1 ml-3 text-slate-900 font-medium">
                Help & Support
              </Text>
              <ChevronRight size={20} color="#94a3b8" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleLogout}
              className="flex-row items-center p-4"
            >
              <View className="w-10 h-10 bg-red-100 rounded-xl items-center justify-center">
                <LogOut size={20} color="#ef4444" />
              </View>
              <Text className="flex-1 ml-3 text-red-600 font-medium">
                Reset App
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Credit Tier Info */}
        <View className="mx-5 mb-8 p-4 bg-slate-900 rounded-2xl">
          <View className="flex-row items-center mb-3">
            <View 
              className="w-8 h-8 rounded-lg items-center justify-center mr-3"
              style={{ backgroundColor: creditTier.color + '30' }}
            >
              <Text className="text-lg">🏆</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold">
                {creditTier.name} Tier Benefits
              </Text>
            </View>
          </View>
          <View className="flex-row flex-wrap">
            {creditTier.benefits.map((benefit, index) => (
              <View 
                key={index}
                className="bg-slate-800 rounded-lg px-3 py-1 mr-2 mb-2"
              >
                <Text className="text-slate-300 text-sm">✓ {benefit}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Update Income Modal */}
      <Modal
        visible={showIncomeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowIncomeModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-slate-900">Update Income</Text>
              <TouchableOpacity 
                onPress={() => setShowIncomeModal(false)}
                className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center"
              >
                <X size={18} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text className="text-slate-500 text-sm mb-4">
              Update your monthly income to recalculate your safe repayment amount. 
              This affects which financing options are available to you.
            </Text>

            {/* Amount Input */}
            <View className="mb-6">
              <Text className="text-slate-500 text-sm mb-2">New monthly income</Text>
              <View className="flex-row items-center bg-slate-100 rounded-xl px-4 py-3">
                <Text className="text-slate-900 text-2xl font-bold mr-2">₦</Text>
                <TextInput
                  className="flex-1 text-2xl font-bold text-slate-900"
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  keyboardType="number-pad"
                  value={newIncome}
                  onChangeText={(text) => setNewIncome(formatIncomeInput(text))}
                />
              </View>
            </View>

            {/* Preview */}
            {parseIncome(newIncome) >= 50000 && (
              <View className="bg-green-50 rounded-xl p-4 mb-6">
                <Text className="text-green-800 font-medium mb-1">
                  New Safe Amount Preview
                </Text>
                <Text className="text-green-700 text-sm">
                  With {formatNaira(parseIncome(newIncome))}/month income, 
                  your new safe repayment would be approximately{' '}
                  <Text className="font-bold">
                    {formatNaira(Math.floor(parseIncome(newIncome) * 0.15))}-{formatNaira(Math.floor(parseIncome(newIncome) * 0.18))}
                  </Text>
                  /month
                </Text>
              </View>
            )}

            {/* Update Button */}
            <TouchableOpacity
              onPress={handleUpdateIncome}
              className="bg-slate-900 rounded-xl py-4 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-lg">
                Update Income
              </Text>
            </TouchableOpacity>

            <View className="h-8" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
