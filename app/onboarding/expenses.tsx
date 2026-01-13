import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  ChevronRight,
  Home,
  Zap,
  Wifi,
  Bus,
  UtensilsCrossed,
  ShoppingBag,
  Info,
  Check,
} from "lucide-react-native";
import { Button, Input, SimpleProgress } from "../../src/components";
import { useAppStore } from "../../src/store";
import { formatNaira } from "../../src/utils";

interface ExpenseCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  placeholder: string;
  hint: string;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: "rent",
    label: "Rent / Housing",
    icon: Home,
    color: "#8b5cf6",
    placeholder: "e.g., 50,000",
    hint: "Monthly rent or housing payment",
  },
  {
    id: "utilities",
    label: "Utilities",
    icon: Zap,
    color: "#f59e0b",
    placeholder: "e.g., 15,000",
    hint: "Electricity, water, gas bills",
  },
  {
    id: "internet",
    label: "Internet / Phone",
    icon: Wifi,
    color: "#3b82f6",
    placeholder: "e.g., 10,000",
    hint: "Data, airtime, subscriptions",
  },
  {
    id: "transport",
    label: "Transport",
    icon: Bus,
    color: "#10b981",
    placeholder: "e.g., 20,000",
    hint: "Fuel, Uber, bus fares",
  },
  {
    id: "food",
    label: "Food & Groceries",
    icon: UtensilsCrossed,
    color: "#ef4444",
    placeholder: "e.g., 40,000",
    hint: "Market, restaurants, meals",
  },
  {
    id: "other",
    label: "Other Expenses",
    icon: ShoppingBag,
    color: "#64748b",
    placeholder: "e.g., 20,000",
    hint: "Shopping, entertainment, etc.",
  },
];

export default function ExpensesScreen() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const updateUser = useAppStore((state) => state.updateUser);

  const [expenses, setExpenses] = useState<Record<string, string>>({
    rent: "",
    utilities: "",
    internet: "",
    transport: "",
    food: "",
    other: "",
  });

  const formatExpenseInput = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned) {
      return parseInt(cleaned).toLocaleString("en-NG");
    }
    return "";
  };

  const parseExpenseValue = (formatted: string): number => {
    return parseInt(formatted.replace(/\D/g, "")) || 0;
  };

  const handleExpenseChange = (id: string, value: string) => {
    setExpenses((prev) => ({
      ...prev,
      [id]: formatExpenseInput(value),
    }));
  };

  const totalExpenses = Object.values(expenses).reduce(
    (sum, val) => sum + parseExpenseValue(val),
    0,
  );

  const monthlyIncome = user?.monthlyIncome || 0;
  const disposableIncome = monthlyIncome - totalExpenses;
  const expenseRatio =
    monthlyIncome > 0 ? (totalExpenses / monthlyIncome) * 100 : 0;

  const handleContinue = () => {
    // Store expenses in user state
    updateUser({
      monthlyExpenses: totalExpenses,
      expenseBreakdown: {
        rent: parseExpenseValue(expenses.rent),
        utilities: parseExpenseValue(expenses.utilities),
        internet: parseExpenseValue(expenses.internet),
        transport: parseExpenseValue(expenses.transport),
        food: parseExpenseValue(expenses.food),
        other: parseExpenseValue(expenses.other),
      },
    });

    router.push("/onboarding/complete");
  };

  // At least one expense should be filled out
  const hasAnyExpense = totalExpenses > 0;

  // Warning if expenses are too high
  const isExpensesTooHigh = expenseRatio > 85;

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
            <SimpleProgress current={5} total={6} />
          </View>
        </View>
        <Text className="text-sm text-dark-500">Step 5 of 6</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero */}
          <View className="py-4">
            <Text className="text-2xl font-bold text-dark-800">
              Monthly Expenses
            </Text>
            <Text className="text-base text-dark-500 mt-2">
              Help us understand your spending to calculate a truly safe
              repayment limit.
            </Text>
          </View>

          {/* Income Context */}
          <View className="bg-slate-100 rounded-xl p-4 mb-6">
            <Text className="text-sm text-slate-600">
              Your stated monthly income:
            </Text>
            <Text className="text-xl font-bold text-slate-900">
              {formatNaira(monthlyIncome)}
            </Text>
          </View>

          {/* Expense Inputs */}
          <View className="space-y-4">
            {EXPENSE_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const value = expenses[category.id];
              const hasValue = parseExpenseValue(value) > 0;

              return (
                <View key={category.id} className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <View
                      className="w-8 h-8 rounded-lg items-center justify-center mr-2"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <Icon size={16} color={category.color} />
                    </View>
                    <Text className="font-medium text-slate-800 flex-1">
                      {category.label}
                    </Text>
                    {hasValue && <Check size={16} color="#16a34a" />}
                  </View>
                  <Input
                    placeholder={category.placeholder}
                    value={value}
                    onChangeText={(text) =>
                      handleExpenseChange(category.id, text)
                    }
                    keyboardType="numeric"
                    hint={category.hint}
                  />
                </View>
              );
            })}
          </View>

          {/* Summary Card */}
          {totalExpenses > 0 && (
            <View
              className={`rounded-xl p-4 mt-4 ${isExpensesTooHigh ? "bg-red-50 border-2 border-red-200" : "bg-slate-900"}`}
            >
              <Text
                className={`text-sm font-medium mb-3 ${isExpensesTooHigh ? "text-red-800" : "text-white"}`}
              >
                Expense Summary
              </Text>

              <View className="flex-row justify-between mb-3">
                <View className="flex-1">
                  <Text
                    className={`text-xs ${isExpensesTooHigh ? "text-red-600" : "text-slate-400"}`}
                  >
                    Total Expenses
                  </Text>
                  <Text
                    className={`text-lg font-bold ${isExpensesTooHigh ? "text-red-700" : "text-white"}`}
                  >
                    {formatNaira(totalExpenses)}
                  </Text>
                </View>
                <View className="flex-1 items-center">
                  <Text
                    className={`text-xs ${isExpensesTooHigh ? "text-red-600" : "text-slate-400"}`}
                  >
                    % of Income
                  </Text>
                  <Text
                    className={`text-lg font-bold ${isExpensesTooHigh ? "text-red-700" : expenseRatio > 70 ? "text-yellow-400" : "text-lime-400"}`}
                  >
                    {expenseRatio.toFixed(0)}%
                  </Text>
                </View>
                <View className="flex-1 items-end">
                  <Text
                    className={`text-xs ${isExpensesTooHigh ? "text-red-600" : "text-slate-400"}`}
                  >
                    Remaining
                  </Text>
                  <Text
                    className={`text-lg font-bold ${disposableIncome < 0 ? "text-red-500" : isExpensesTooHigh ? "text-red-700" : "text-lime-400"}`}
                  >
                    {formatNaira(Math.max(0, disposableIncome))}
                  </Text>
                </View>
              </View>

              {isExpensesTooHigh && (
                <View className="flex-row items-start mt-2 p-2 bg-red-100 rounded-lg">
                  <Info size={16} color="#dc2626" style={{ marginTop: 2 }} />
                  <Text className="text-xs text-red-700 ml-2 flex-1">
                    Your expenses seem very high. This may limit your credit
                    options. Consider if all amounts are accurate.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Info Box */}
          <View className="bg-blue-50 rounded-xl p-4 mt-4">
            <View className="flex-row items-start">
              <Info size={20} color="#3b82f6" style={{ marginTop: 2 }} />
              <View className="ml-3 flex-1">
                <Text className="text-sm font-medium text-blue-800 mb-1">
                  Why we ask about expenses
                </Text>
                <Text className="text-sm text-blue-700 leading-relaxed">
                  Nigerian fintech standards recommend keeping loan repayments
                  under 15-22% of disposable income. Your expense info helps us
                  calculate a truly safe limit.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View className="px-6 pb-6 pt-4 bg-white border-t border-gray-100">
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!hasAnyExpense}
            icon={<ChevronRight size={20} color="#fff" />}
            iconPosition="right"
            size="lg"
          />
          {!hasAnyExpense && (
            <Text className="text-xs text-center text-slate-400 mt-2">
              Enter at least one expense to continue
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
