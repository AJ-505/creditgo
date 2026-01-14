import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  CheckCircle,
  Sparkles,
  TrendingUp as TrendingUpIcon,
  Flame,
} from "lucide-react-native";
import { useAppStore, useSavings } from "../../src/store";
import { formatNaira } from "../../src/constants";
import { getCreditTier } from "../../src/utils/creditCalculator";

const SuccessAnimation: React.FC<{ visible: boolean }> = ({ visible }) => {
  const [animation] = useState(() => new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(500),
        Animated.timing(animation, {
          toValue: 2,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      animation.setValue(0);
    }
  }, [visible, animation]);

  const scale = animation.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1.2, 1],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 0.5, 1, 1.5, 2],
    outputRange: [0, 0.5, 1, 1, 0],
  });

  return (
    <Animated.View
      style={[
        {
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: "#22c55e",
          alignItems: "center",
          justifyContent: "center",
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <CheckCircle size={50} color="#ffffff" />
    </Animated.View>
  );
};

export default function WalletScreen() {
  const financialProfile = useAppStore((state) => state.financialProfile);
  const transactions = useAppStore((state) => state.transactions);
  const user = useAppStore((state) => state.user);

  const {
    balance: savingsBalance,
    transactions: savingsHistory,
    addDeposit,
    getTotalSessions,
  } = useSavings();

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveAmount, setSaveAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "ussd">(
    "card",
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showGamificationModal, setShowGamificationModal] = useState(false);

  const safeAmount = financialProfile?.safeMonthlyRepayment || 0;
  const monthlyIncome = user?.monthlyIncome || 0;
  const monthlyExpenses = user?.monthlyExpenses || 0;
  const creditScore = financialProfile?.creditScore || 0;
  const creditTier = getCreditTier(creditScore);

  const suggestedSaving = Math.floor(monthlyIncome * 0.1);
  const maxSavableAmount = safeAmount;

  const totalCredits = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "credit")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions],
  );

  const totalDebits = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "debit")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions],
  );

  const formatAmountInput = useCallback((text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned) {
      return parseInt(cleaned).toLocaleString("en-NG");
    }
    return "";
  }, []);

  const parseAmount = useCallback((formatted: string): number => {
    return parseInt(formatted.replace(/\D/g, "")) || 0;
  }, []);

  const amountToSave = useMemo(
    () => parseAmount(saveAmount),
    [saveAmount, parseAmount],
  );

  const handleSave = useCallback(async () => {
    const amount = parseAmount(saveAmount);

    if (amount < 1000) {
      Alert.alert(
        "Minimum Amount",
        "Minimum saving amount is ₦1,000. Please enter a higher amount.",
      );
      return;
    }

    if (amount > maxSavableAmount) {
      Alert.alert(
        "Amount Too High",
        `Your safe monthly limit is ${formatNaira(safeAmount)}. Please enter an amount within your limit.`,
      );
      return;
    }

    setIsProcessing(true);
    const reference = `CG_${Date.now()}`;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    addDeposit(amount, reference);
    setSaveAmount("");
    setIsProcessing(false);
    setShowSaveModal(false);
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
      setShowGamificationModal(true);
    }, 1500);
  }, [saveAmount, parseAmount, maxSavableAmount, safeAmount, addDeposit]);

  const closeGamification = useCallback(() => {
    setShowGamificationModal(false);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="px-5 pt-2 pb-4">
          <Text className="text-2xl font-inter-bold text-slate-900">
            Wallet
          </Text>
        </View>

        <View className="mx-5 bg-slate-900 rounded-3xl p-5 mb-5 overflow-hidden">
          <View className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-lime-400 opacity-20" />

          <View className="flex-row items-center mb-2">
            <PiggyBank size={20} color="#c8ff00" />
            <Text className="text-slate-400 text-sm ml-2">Your Savings</Text>
          </View>
          <Text className="text-4xl font-inter-bold text-white mb-1">
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
            <Text className="text-slate-900 font-inter-bold ml-2">
              Add Money
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row mx-5 mb-5">
          <View className="flex-1 bg-white rounded-2xl p-4 mr-2 border border-slate-100">
            <View className="flex-row items-center mb-2">
              <View className="w-8 h-8 bg-green-100 rounded-lg items-center justify-center">
                <TrendingUp size={16} color="#22c55e" />
              </View>
            </View>
            <Text className="text-slate-500 text-xs">Monthly Income</Text>
            <Text className="text-slate-900 font-inter-bold text-lg">
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
            <Text className="text-slate-900 font-inter-bold text-lg">
              {formatNaira(monthlyExpenses || totalDebits)}
            </Text>
            {monthlyExpenses > 0 && totalDebits > 0 && (
              <Text className="text-slate-400 text-[10px] mt-1">
                From SMS: {formatNaira(totalDebits)}
              </Text>
            )}
          </View>
        </View>

        <View className="mx-5 bg-white rounded-2xl p-4 mb-5 border border-slate-100">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-violet-100 rounded-xl items-center justify-center mr-3">
                <Target size={20} color="#8b5cf6" />
              </View>
              <View>
                <Text className="text-slate-900 font-inter-bold">
                  Savings Goal
                </Text>
                <Text className="text-slate-500 text-xs">
                  Save {formatNaira(suggestedSaving)}/month
                </Text>
              </View>
            </View>
            <View className="bg-violet-100 px-3 py-1 rounded-full">
              <Text className="text-violet-700 text-xs font-inter-medium">
                {savingsBalance >= suggestedSaving ? "✓ Hit" : "Active"}
              </Text>
            </View>
          </View>

          <View className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
            <View
              className="h-full bg-violet-500 rounded-full"
              style={{
                width: `${suggestedSaving > 0 ? Math.min((savingsBalance / suggestedSaving) * 100, 100) : 0}%`,
              }}
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

        <View className="mx-5 mb-5">
          <Text className="text-lg font-inter-bold text-slate-900 mb-3">
            Savings History
          </Text>

          {savingsHistory.length > 0 ? (
            <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              {savingsHistory.slice(0, 5).map((item, index) => (
                <View
                  key={item.id}
                  className={`flex-row items-center p-4 ${
                    index < savingsHistory.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  <View className="w-10 h-10 bg-green-100 rounded-xl items-center justify-center mr-3">
                    <ArrowDownLeft size={18} color="#22c55e" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-900 font-inter-medium">
                      {item.type === "deposit"
                        ? "Savings Deposit"
                        : "Withdrawal"}
                    </Text>
                    <Text className="text-slate-500 text-xs">
                      {new Date(item.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                  <Text
                    className={
                      item.type === "deposit"
                        ? "text-green-600 font-inter-bold"
                        : "text-red-600 font-inter-bold"
                    }
                  >
                    {item.type === "deposit" ? "+" : "-"}
                    {formatNaira(item.amount)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-6 items-center border border-slate-100">
              <PiggyBank size={40} color="#cbd5e1" />
              <Text className="text-slate-500 text-center mt-3">
                No savings yet.{"\n"}Start saving towards your goals!
              </Text>
            </View>
          )}
        </View>

        <View className="mx-5 mb-8">
          <Text className="text-lg font-inter-bold text-slate-900 mb-3">
            SMS Transactions
          </Text>

          {transactions.length > 0 ? (
            <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              {transactions.slice(0, 5).map((txn, index) => (
                <View
                  key={txn.id}
                  className={`flex-row items-center p-4 ${
                    index < Math.min(transactions.length, 5) - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  <View
                    className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                      txn.type === "credit" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {txn.type === "credit" ? (
                      <ArrowDownLeft size={18} color="#22c55e" />
                    ) : (
                      <ArrowUpRight size={18} color="#ef4444" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-slate-900 font-inter-medium"
                      numberOfLines={1}
                    >
                      {txn.source || txn.description}
                    </Text>
                    <Text className="text-slate-500 text-xs">
                      {new Date(txn.date).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                      })}
                    </Text>
                  </View>
                  <Text
                    className={`font-inter-bold ${
                      txn.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {txn.type === "credit" ? "+" : "-"}
                    {formatNaira(txn.amount)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-6 items-center border border-slate-100">
              <Text className="text-slate-500 text-center">
                No SMS transactions found.{"\n"}
                If you granted SMS permission, check that your bank alerts are
                in your inbox.
              </Text>
            </View>
          )}
        </View>

        <View className="mx-5 mb-8 p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl">
          <View className="flex-row items-start">
            <View className="w-10 h-10 bg-white/20 rounded-lg items-center justify-center mr-3">
              <Sparkles size={20} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-inter-bold mb-1">
                Credit Score: {creditScore}
              </Text>
              <Text className="text-white/80 text-sm leading-5">
                {creditTier.name} tier • {creditTier.benefits[0]}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showSaveModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSaveModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => Keyboard.dismiss()}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
          >
            <Pressable
              className="bg-white rounded-t-3xl p-5"
              onPress={() => {}}
            >
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-inter-bold text-slate-900">
                  Add Money
                </Text>
                <TouchableOpacity
                  onPress={() => setShowSaveModal(false)}
                  className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center"
                >
                  <X size={18} color="#64748b" />
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <Text className="text-slate-500 text-sm mb-2">
                  Amount to save (max: {formatNaira(maxSavableAmount)})
                </Text>
                <View className="flex-row items-center bg-slate-100 rounded-xl px-4 py-3">
                  <Text className="text-slate-900 text-2xl font-inter-bold mr-2">
                    ₦
                  </Text>
                  <TextInput
                    className="flex-1 text-2xl font-inter-bold text-slate-900"
                    placeholder="0"
                    placeholderTextColor="#94a3b8"
                    keyboardType="number-pad"
                    value={saveAmount}
                    onChangeText={(text) =>
                      setSaveAmount(formatAmountInput(text))
                    }
                  />
                </View>
                <View className="flex-row justify-between mt-2">
                  <Text className="text-slate-400 text-xs">
                    Max: {formatNaira(maxSavableAmount)}
                  </Text>
                  <Text className="text-slate-400 text-xs">Min: ₦1,000</Text>
                </View>
              </View>

              <View className="flex-row mb-4">
                {[5000, 10000, 20000, 50000].map((amount) => {
                  const isDisabled = amount > maxSavableAmount;
                  return (
                    <TouchableOpacity
                      key={amount}
                      onPress={() =>
                        setSaveAmount(amount.toLocaleString("en-NG"))
                      }
                      disabled={isDisabled}
                      className={`flex-1 rounded-xl py-2 mx-1 items-center ${
                        isDisabled ? "bg-slate-100 opacity-50" : "bg-slate-100"
                      }`}
                    >
                      <Text
                        className={`text-sm font-inter-medium ${
                          isDisabled ? "text-slate-400" : "text-slate-700"
                        }`}
                      >
                        {formatNaira(amount)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View className="bg-lime-50 rounded-xl p-3 mb-6">
                <Text className="text-lime-800 text-sm">
                  Save {formatNaira(suggestedSaving)}/month to build your
                  savings and boost your credit score.
                </Text>
              </View>

              <Text className="text-slate-500 text-sm mb-3">
                Payment method
              </Text>
              <View className="flex-row mb-6">
                <TouchableOpacity
                  onPress={() => setPaymentMethod("card")}
                  className={`flex-1 rounded-xl p-3 mr-2 flex-row items-center justify-center ${paymentMethod === "card" ? "bg-slate-900" : "bg-slate-100"}`}
                  activeOpacity={0.8}
                >
                  <CreditCard
                    size={16}
                    color={paymentMethod === "card" ? "#c8ff00" : "#64748b"}
                  />
                  <Text
                    className={`${paymentMethod === "card" ? "text-white" : "text-slate-600"} font-inter-medium ml-2`}
                  >
                    Card
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPaymentMethod("bank")}
                  className={`flex-1 rounded-xl p-3 mx-1 flex-row items-center justify-center ${paymentMethod === "bank" ? "bg-slate-900" : "bg-slate-100"}`}
                  activeOpacity={0.8}
                >
                  <Building
                    size={16}
                    color={paymentMethod === "bank" ? "#c8ff00" : "#64748b"}
                  />
                  <Text
                    className={`${paymentMethod === "bank" ? "text-white" : "text-slate-600"} font-inter-medium ml-2`}
                  >
                    Bank
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPaymentMethod("ussd")}
                  className={`flex-1 rounded-xl p-3 ml-2 flex-row items-center justify-center ${paymentMethod === "ussd" ? "bg-slate-900" : "bg-slate-100"}`}
                  activeOpacity={0.8}
                >
                  <Smartphone
                    size={16}
                    color={paymentMethod === "ussd" ? "#c8ff00" : "#64748b"}
                  />
                  <Text
                    className={`${paymentMethod === "ussd" ? "text-white" : "text-slate-600"} font-inter-medium ml-2`}
                  >
                    USSD
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleSave}
                disabled={isProcessing || amountToSave < 1000}
                className={`rounded-xl py-4 items-center ${
                  isProcessing || amountToSave < 1000
                    ? "bg-slate-300"
                    : "bg-lime-400"
                }`}
                activeOpacity={0.8}
              >
                {isProcessing ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#0f172a" />
                    <Text className="text-slate-900 font-inter-bold ml-2">
                      Processing...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-slate-900 font-inter-bold text-lg">
                    {`Pay ${amountToSave ? formatNaira(amountToSave) : "₦0"}`}
                  </Text>
                )}
              </TouchableOpacity>

              <View className="h-8" />
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="items-center">
            <SuccessAnimation visible={showSuccessModal} />
            <Text className="text-slate-900 font-inter-bold text-xl mt-6">
              Payment Successful!
            </Text>
            <Text className="text-slate-500 text-center mt-2">
              Your savings have been updated
            </Text>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showGamificationModal}
        transparent
        animationType="fade"
        onRequestClose={closeGamification}
      >
        <View className="flex-1 bg-black/60 items-center justify-center">
          <View className="bg-white rounded-3xl p-6 w-80 items-center">
            <View className="w-20 h-20 bg-lime-100 rounded-full items-center justify-center mb-4">
              <TrendingUpIcon size={40} color="#65a30d" />
            </View>

            <Text className="text-lime-600 font-inter-bold text-sm uppercase tracking-wide mb-2">
              Credit Score Improved!
            </Text>

            <Text className="text-4xl font-inter-bold text-slate-900">
              +{Math.max(1, Math.floor(amountToSave / 1000))}
            </Text>

            <Text className="text-slate-500 text-center mt-2 mb-4">
              Your consistent saving habits are building your financial
              reputation. Keep it up!
            </Text>

            {getTotalSessions() > 1 && (
              <View className="bg-slate-900 rounded-xl p-4 w-full mb-4">
                <View className="flex-row items-center justify-center">
                  <Flame size={18} color="#fbbf24" />
                  <Text className="text-lime-400 font-inter-bold text-center ml-2">
                    {getTotalSessions()} savings sessions
                  </Text>
                </View>
                <Text className="text-white/80 text-center text-sm mt-1">
                  Building your streak! Keep saving.
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={closeGamification}
              className="bg-slate-900 rounded-xl py-3 px-8 w-full"
              activeOpacity={0.9}
            >
              <Text className="text-lime-400 font-inter-bold text-center">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
