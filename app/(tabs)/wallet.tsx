import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  TextInput,
  Alert,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Target,
  X,
  CreditCard,
  Building,
  Smartphone
} from 'lucide-react-native';
import { useAppStore } from '../../src/store';
import { formatNaira } from '../../src/constants';

// Demo Paystack configuration
const PAYSTACK_PUBLIC_KEY = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx';

export default function WalletScreen() {
  const financialProfile = useAppStore((state) => state.financialProfile);
  const transactions = useAppStore((state) => state.transactions);
  const user = useAppStore((state) => state.user);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveAmount, setSaveAmount] = useState('');
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [savingsHistory, setSavingsHistory] = useState<Array<{
    id: string;
    amount: number;
    date: Date;
    status: 'successful' | 'pending';
  }>>([]);

  const safeAmount = financialProfile?.safeMonthlyRepayment || 0;
  const monthlyIncome = user?.monthlyIncome || 0;
  
  // Suggested saving is 10% of safe amount (to build towards financing)
  const suggestedSaving = Math.floor(safeAmount * 0.5);

  // Calculate totals from transactions
  const totalCredits = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDebits = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatAmountInput = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned) {
      return parseInt(cleaned).toLocaleString('en-NG');
    }
    return '';
  };

  const parseAmount = (formatted: string): number => {
    return parseInt(formatted.replace(/\D/g, '')) || 0;
  };

  const handleSave = () => {
    const amount = parseAmount(saveAmount);
    if (amount < 1000) {
      Alert.alert('Minimum Amount', 'Minimum saving amount is ₦1,000');
      return;
    }

    // In production, this would open Paystack checkout
    // For demo, we simulate the flow
    Alert.alert(
      'Paystack Payment',
      `You're about to save ${formatNaira(amount)} via Paystack.\n\nIn production, this opens the Paystack payment page.\n\nFor demo, we'll simulate a successful payment.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Simulate Payment',
          onPress: () => {
            // Simulate successful payment
            setSavingsBalance(prev => prev + amount);
            setSavingsHistory(prev => [{
              id: `sav_${Date.now()}`,
              amount,
              date: new Date(),
              status: 'successful',
            }, ...prev]);
            setSaveAmount('');
            setShowSaveModal(false);
            Alert.alert(
              '✅ Saved Successfully!',
              `${formatNaira(amount)} has been added to your savings.\n\nTotal savings: ${formatNaira(savingsBalance + amount)}`
            );
          },
        },
      ]
    );
  };

  const openPaystackDemo = () => {
    // In production: integrate react-native-paystack-webview
    // For demo, show info about how it would work
    Linking.openURL('https://paystack.com/demo/checkout');
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
            Wallet
          </Text>
        </View>

        {/* Savings Card */}
        <View className="mx-5 bg-slate-900 rounded-3xl p-5 mb-5 overflow-hidden">
          {/* Decorative */}
          <View className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-lime-400 opacity-20" />
          
          <View className="flex-row items-center mb-2">
            <PiggyBank size={20} color="#c8ff00" />
            <Text className="text-slate-400 text-sm ml-2">
              Your Savings
            </Text>
          </View>
          <Text className="text-4xl font-bold text-white mb-1">
            {formatNaira(savingsBalance)}
          </Text>
          <Text className="text-slate-500 text-sm mb-4">
            Save towards your financing goals
          </Text>

          <TouchableOpacity
            onPress={() => setShowSaveModal(true)}
            className="bg-lime-400 rounded-xl py-3 flex-row items-center justify-center"
            activeOpacity={0.8}
          >
            <Plus size={20} color="#0f172a" />
            <Text className="text-slate-900 font-bold ml-2">Add Money</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View className="flex-row mx-5 mb-5">
          <View className="flex-1 bg-white rounded-2xl p-4 mr-2 border border-slate-100">
            <View className="flex-row items-center mb-2">
              <View className="w-8 h-8 bg-green-100 rounded-lg items-center justify-center">
                <TrendingUp size={16} color="#22c55e" />
              </View>
            </View>
            <Text className="text-slate-500 text-xs">Monthly Income</Text>
            <Text className="text-slate-900 font-bold text-lg">
              {formatNaira(totalCredits || monthlyIncome)}
            </Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 ml-2 border border-slate-100">
            <View className="flex-row items-center mb-2">
              <View className="w-8 h-8 bg-red-100 rounded-lg items-center justify-center">
                <TrendingDown size={16} color="#ef4444" />
              </View>
            </View>
            <Text className="text-slate-500 text-xs">Expenses</Text>
            <Text className="text-slate-900 font-bold text-lg">
              {formatNaira(totalDebits)}
            </Text>
          </View>
        </View>

        {/* Savings Goal Card */}
        <View className="mx-5 bg-white rounded-2xl p-4 mb-5 border border-slate-100">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-violet-100 rounded-xl items-center justify-center mr-3">
                <Target size={20} color="#8b5cf6" />
              </View>
              <View>
                <Text className="text-slate-900 font-bold">Savings Goal</Text>
                <Text className="text-slate-500 text-xs">
                  Save {formatNaira(suggestedSaving)}/month
                </Text>
              </View>
            </View>
            <View className="bg-violet-100 px-3 py-1 rounded-full">
              <Text className="text-violet-700 text-xs font-medium">
                {savingsBalance >= suggestedSaving ? '✓ Hit' : 'Active'}
              </Text>
            </View>
          </View>
          
          {/* Progress Bar */}
          <View className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
            <View 
              className="h-full bg-violet-500 rounded-full"
              style={{ width: `${Math.min((savingsBalance / suggestedSaving) * 100, 100)}%` }}
            />
          </View>
          <View className="flex-row justify-between">
            <Text className="text-slate-500 text-xs">
              {formatNaira(savingsBalance)} saved
            </Text>
            <Text className="text-slate-500 text-xs">
              {formatNaira(suggestedSaving)} goal
            </Text>
          </View>
        </View>

        {/* Savings History */}
        <View className="mx-5 mb-5">
          <Text className="text-lg font-bold text-slate-900 mb-3">
            Savings History
          </Text>
          
          {savingsHistory.length > 0 ? (
            <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              {savingsHistory.slice(0, 5).map((item, index) => (
                <View 
                  key={item.id}
                  className={`flex-row items-center p-4 ${
                    index < savingsHistory.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-3">
                    <ArrowDownLeft size={18} color="#22c55e" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-900 font-medium">Savings Deposit</Text>
                    <Text className="text-slate-500 text-xs">
                      {item.date.toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <Text className="text-green-600 font-bold">
                    +{formatNaira(item.amount)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-6 items-center border border-slate-100">
              <PiggyBank size={40} color="#cbd5e1" />
              <Text className="text-slate-500 text-center mt-3">
                No savings yet.{'\n'}Start saving towards your goals!
              </Text>
            </View>
          )}
        </View>

        {/* Recent Transactions from SMS */}
        <View className="mx-5 mb-5">
          <Text className="text-lg font-bold text-slate-900 mb-3">
            SMS Transactions
          </Text>
          
          {transactions.length > 0 ? (
            <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              {transactions.slice(0, 5).map((txn, index) => (
                <View 
                  key={txn.id}
                  className={`flex-row items-center p-4 ${
                    index < Math.min(transactions.length, 5) - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <View 
                    className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                      txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {txn.type === 'credit' ? (
                      <ArrowDownLeft size={18} color="#22c55e" />
                    ) : (
                      <ArrowUpRight size={18} color="#ef4444" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-900 font-medium" numberOfLines={1}>
                      {txn.source || txn.description}
                    </Text>
                    <Text className="text-slate-500 text-xs">
                      {new Date(txn.date).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </Text>
                  </View>
                  <Text 
                    className={`font-bold ${
                      txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {txn.type === 'credit' ? '+' : '-'}{formatNaira(txn.amount)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-6 items-center border border-slate-100">
              <Text className="text-slate-500 text-center">
                No SMS transactions found.{'\n'}
                Enable Demo Mode in your profile to see sample data.
              </Text>
            </View>
          )}
        </View>

        {/* Paystack Info */}
        <View className="mx-5 mb-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <View className="flex-row items-start">
            <View className="w-8 h-8 bg-blue-500 rounded-lg items-center justify-center mr-3">
              <CreditCard size={16} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="text-blue-900 font-bold mb-1">
                Powered by Paystack
              </Text>
              <Text className="text-blue-700 text-sm leading-5">
                Your savings are secured with bank-level encryption. 
                Deposit via card, bank transfer, or USSD.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Money Modal */}
      <Modal
        visible={showSaveModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-slate-900">Add Money</Text>
              <TouchableOpacity 
                onPress={() => setShowSaveModal(false)}
                className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center"
              >
                <X size={18} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Amount Input */}
            <View className="mb-6">
              <Text className="text-slate-500 text-sm mb-2">Amount to save</Text>
              <View className="flex-row items-center bg-slate-100 rounded-xl px-4 py-3">
                <Text className="text-slate-900 text-2xl font-bold mr-2">₦</Text>
                <TextInput
                  className="flex-1 text-2xl font-bold text-slate-900"
                  placeholder="0"
                  placeholderTextColor="#94a3b8"
                  keyboardType="number-pad"
                  value={saveAmount}
                  onChangeText={(text) => setSaveAmount(formatAmountInput(text))}
                />
              </View>
            </View>

            {/* Quick Amount Buttons */}
            <View className="flex-row mb-6">
              {[5000, 10000, 20000, 50000].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  onPress={() => setSaveAmount(amount.toLocaleString('en-NG'))}
                  className="flex-1 bg-slate-100 rounded-xl py-2 mx-1 items-center"
                >
                  <Text className="text-slate-700 font-medium text-sm">
                    {formatNaira(amount)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Suggested Amount */}
            <View className="bg-lime-50 rounded-xl p-3 mb-6">
              <Text className="text-lime-800 text-sm">
                💡 Suggested: Save {formatNaira(suggestedSaving)}/month to build your credit faster!
              </Text>
            </View>

            {/* Payment Methods */}
            <Text className="text-slate-500 text-sm mb-3">Payment method</Text>
            <View className="flex-row mb-6">
              <View className="flex-1 bg-slate-900 rounded-xl p-3 mr-2 flex-row items-center justify-center">
                <CreditCard size={16} color="#c8ff00" />
                <Text className="text-white font-medium ml-2">Card</Text>
              </View>
              <View className="flex-1 bg-slate-100 rounded-xl p-3 mx-1 flex-row items-center justify-center">
                <Building size={16} color="#64748b" />
                <Text className="text-slate-600 font-medium ml-2">Bank</Text>
              </View>
              <View className="flex-1 bg-slate-100 rounded-xl p-3 ml-2 flex-row items-center justify-center">
                <Smartphone size={16} color="#64748b" />
                <Text className="text-slate-600 font-medium ml-2">USSD</Text>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              className="bg-lime-400 rounded-xl py-4 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-slate-900 font-bold text-lg">
                Save {saveAmount ? formatNaira(parseAmount(saveAmount)) : '₦0'}
              </Text>
            </TouchableOpacity>

            <View className="h-8" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
