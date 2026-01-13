import React, { useMemo, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  TextInput,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard
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
  Smartphone,
  ExternalLink
} from 'lucide-react-native';
import { useAppStore, useSavings } from '../../src/store';
import { formatNaira, PAYSTACK_CONFIG } from '../../src/constants';

export default function WalletScreen() {
  const financialProfile = useAppStore((state) => state.financialProfile);
  const transactions = useAppStore((state) => state.transactions);
  const user = useAppStore((state) => state.user);
  
  // Use persisted savings from store
  const { balance: savingsBalance, transactions: savingsHistory, addDeposit } = useSavings();

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveAmount, setSaveAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'ussd'>('card');

  const safeAmount = financialProfile?.safeMonthlyRepayment || 0;
  const monthlyIncome = user?.monthlyIncome || 0;
  const monthlyExpenses = user?.monthlyExpenses || 0;
  
  // Suggested saving: 10% of stated income (simple and stable)
  const suggestedSaving = Math.floor(monthlyIncome * 0.10);

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

  const amountToSave = useMemo(() => parseAmount(saveAmount), [saveAmount]);

  const handleSave = async () => {
    const amount = parseAmount(saveAmount);
    if (amount < 1000) {
      Alert.alert('Minimum Amount', 'Minimum saving amount is ₦1,000');
      return;
    }

    setIsProcessing(true);

    // Pitch-friendly flow:
    // 1) Open a real Paystack demo checkout page in the browser
    // 2) User returns and confirms payment
    const reference = `CG_${Date.now()}`;

    try {
      if (paymentMethod === 'card') {
        await Linking.openURL('https://paystack.com/demo/checkout');
      }

      if (paymentMethod === 'bank') {
        await Linking.openURL('https://paystack.com/demo/checkout');
      }

      if (paymentMethod === 'ussd') {
        await Linking.openURL('https://paystack.com/demo/checkout');
      }
    } catch {
      // If opening the browser fails, we still allow user to proceed.
    }

    setIsProcessing(false);

    Alert.alert(
      'Complete Payment',
      `After completing checkout, tap “I’ve Paid”.\n\nAmount: ${formatNaira(amount)}\nReference: ${reference}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: "I've Paid",
          onPress: () => {
            addDeposit(amount, reference);
            setSaveAmount('');
            setShowSaveModal(false);
            Alert.alert('Saved', `${formatNaira(amount)} added to your savings.`);
          },
        },
      ]
    );
  };

  const openPaystackDemo = () => {
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
              {formatNaira(monthlyIncome)}
            </Text>
            {totalCredits > 0 && (
              <Text className="text-slate-400 text-[10px] mt-1">
                From SMS: {formatNaira(totalCredits)}
              </Text>
            )}
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 ml-2 border border-slate-100">
            <View className="flex-row items-center mb-2">
              <View className="w-8 h-8 bg-red-100 rounded-lg items-center justify-center">
                <TrendingDown size={16} color="#ef4444" />
              </View>
            </View>
            <Text className="text-slate-500 text-xs">Expenses</Text>
            <Text className="text-slate-900 font-bold text-lg">
              {formatNaira(monthlyExpenses || totalDebits)}
            </Text>
            {monthlyExpenses > 0 && totalDebits > 0 && (
              <Text className="text-slate-400 text-[10px] mt-1">
                From SMS: {formatNaira(totalDebits)}
              </Text>
            )}
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
              style={{ width: `${suggestedSaving > 0 ? Math.min((savingsBalance / suggestedSaving) * 100, 100) : 0}%` }}
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
                    <Text className="text-slate-900 font-medium">
                      {item.type === 'deposit' ? 'Savings Deposit' : 'Withdrawal'}
                    </Text>
                    <Text className="text-slate-500 text-xs">
                      {new Date(item.createdAt).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <Text className={item.type === 'deposit' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                    {item.type === 'deposit' ? '+' : '-'}{formatNaira(item.amount)}
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
                If you granted SMS permission, check that your bank alerts are in your inbox.
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
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
          >
            <Pressable className="bg-white rounded-t-3xl p-5" onPress={() => {}}>
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
                Suggested: Save {formatNaira(suggestedSaving)}/month to build your savings faster.
              </Text>
            </View>

            {/* Payment Methods */}
            <Text className="text-slate-500 text-sm mb-3">Payment method</Text>
            <View className="flex-row mb-6">
              <TouchableOpacity
                onPress={() => setPaymentMethod('card')}
                className={`flex-1 rounded-xl p-3 mr-2 flex-row items-center justify-center ${paymentMethod === 'card' ? 'bg-slate-900' : 'bg-slate-100'}`}
                activeOpacity={0.8}
              >
                <CreditCard size={16} color={paymentMethod === 'card' ? '#c8ff00' : '#64748b'} />
                <Text className={`${paymentMethod === 'card' ? 'text-white' : 'text-slate-600'} font-medium ml-2`}>Card</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPaymentMethod('bank')}
                className={`flex-1 rounded-xl p-3 mx-1 flex-row items-center justify-center ${paymentMethod === 'bank' ? 'bg-slate-900' : 'bg-slate-100'}`}
                activeOpacity={0.8}
              >
                <Building size={16} color={paymentMethod === 'bank' ? '#c8ff00' : '#64748b'} />
                <Text className={`${paymentMethod === 'bank' ? 'text-white' : 'text-slate-600'} font-medium ml-2`}>Bank</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPaymentMethod('ussd')}
                className={`flex-1 rounded-xl p-3 ml-2 flex-row items-center justify-center ${paymentMethod === 'ussd' ? 'bg-slate-900' : 'bg-slate-100'}`}
                activeOpacity={0.8}
              >
                <Smartphone size={16} color={paymentMethod === 'ussd' ? '#c8ff00' : '#64748b'} />
                <Text className={`${paymentMethod === 'ussd' ? 'text-white' : 'text-slate-600'} font-medium ml-2`}>USSD</Text>
              </TouchableOpacity>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={isProcessing}
              className="bg-lime-400 rounded-xl py-4 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-slate-900 font-bold text-lg">
                {isProcessing ? 'Opening checkout…' : `Continue (${paymentMethod.toUpperCase()}) • ${amountToSave ? formatNaira(amountToSave) : '₦0'}`}
              </Text>
            </TouchableOpacity>

            <View className="h-8" />
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
