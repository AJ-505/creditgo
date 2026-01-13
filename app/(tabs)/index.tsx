import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  ChevronRight,
  Laptop,
  Sun,
  Home,
  GraduationCap,
  TrendingUp,
  Sparkles,
  PiggyBank,
  Plus,
  Building2
} from 'lucide-react-native';
import { useAppStore, useSavings } from '../../src/store';
import { formatNaira } from '../../src/constants';
import { PARTNERS } from '../../src/constants/partners';
import { CreditScoreGauge } from '../../src/components';
import { getCreditTier } from '../../src/utils/creditCalculator';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const financialProfile = useAppStore((state) => state.financialProfile);
  const transactions = useAppStore((state) => state.transactions);
  const { balance: savingsBalance } = useSavings();
  const [refreshing, setRefreshing] = React.useState(false);

  const safeAmount = financialProfile?.safeMonthlyRepayment || 0;
  const creditScore = financialProfile?.creditScore || 0;
  const creditTier = getCreditTier(creditScore);

  // Get matching partners based on safe amount
  const matchingPartners = PARTNERS.filter(
    p => (p.minPayment || 0) <= safeAmount
  ).slice(0, 4);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const quickCategories = [
    { icon: Laptop, label: 'Devices', category: 'devices', color: '#3b82f6' },
    { icon: Sun, label: 'Solar', category: 'solar', color: '#f59e0b' },
    { icon: Home, label: 'Rent', category: 'rent', color: '#8b5cf6' },
    { icon: GraduationCap, label: 'Education', category: 'education', color: '#06b6d4' },
  ];

  // Calculate savings recommendation (suggested monthly save = 10% of income)
  const suggestedSaving = Math.floor((user?.monthlyIncome || 0) * 0.1);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#c8ff00']} />
        }
      >
        {/* Header */}
        <View className="px-5 pt-2 pb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-slate-500 text-sm font-medium">Welcome back 👋</Text>
            <Text className="text-slate-900 text-xl font-bold">
              {user?.firstName || 'Champion'}
            </Text>
          </View>
          <TouchableOpacity className="w-11 h-11 bg-white rounded-full items-center justify-center shadow-sm border border-slate-100">
            <Bell size={20} color="#334155" />
          </TouchableOpacity>
        </View>

        {/* Main Credit Card */}
        <View className="mx-5 mb-5">
          <View className="bg-slate-900 rounded-3xl p-5 overflow-hidden">
            {/* Decorative circles */}
            <View className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-lime-400 opacity-20" />
            <View className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-lime-400 opacity-10" />
            
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1">
                <Text className="text-slate-400 text-sm mb-1">Your Safe Amount</Text>
                <Text className="text-4xl font-bold text-white tracking-tight">
                  {formatNaira(safeAmount)}
                </Text>
                <Text className="text-slate-500 text-xs mt-1">
                  Monthly repayment limit
                </Text>
              </View>
              
              <View className="items-center bg-slate-800 rounded-2xl p-3">
                <View className="w-16 h-16">
                  <CreditScoreGauge score={creditScore} size={64} strokeWidth={6} />
                </View>
                <Text className="text-xs font-medium mt-1" style={{ color: creditTier.color }}>
                  {creditTier.name}
                </Text>
              </View>
            </View>

            {/* Quick Stats Row */}
            <View className="flex-row bg-slate-800 rounded-2xl p-3 mt-2">
              <View className="flex-1 items-center border-r border-slate-700">
                <Text className="text-slate-400 text-xs">Score</Text>
                <Text className="text-white font-bold text-lg">{creditScore}</Text>
              </View>
              <View className="flex-1 items-center border-r border-slate-700">
                <Text className="text-slate-400 text-xs">Income</Text>
                <Text className="text-white font-bold text-sm">
                  {formatNaira(user?.monthlyIncome || 0)}
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-slate-400 text-xs">Saved</Text>
                <Text className="text-lime-400 font-bold text-lg">{formatNaira(savingsBalance)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Save to Finance CTA */}
        <TouchableOpacity 
          className="mx-5 mb-5"
          onPress={() => router.push('/(tabs)/wallet')}
          activeOpacity={0.9}
        >
          <View className="bg-lime-400 rounded-2xl p-4 flex-row items-center">
            <View className="w-12 h-12 bg-slate-900 rounded-xl items-center justify-center mr-3">
              <PiggyBank size={24} color="#c8ff00" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-900 font-bold text-base">Start Saving Today</Text>
              <Text className="text-slate-700 text-sm">
                Save {formatNaira(suggestedSaving)}/month towards your goals
              </Text>
            </View>
            <View className="w-8 h-8 bg-slate-900 rounded-full items-center justify-center">
              <Plus size={18} color="#c8ff00" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Categories */}
        <View className="px-5 mb-5">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-slate-900">
              Browse Categories
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/explore')}
              className="flex-row items-center"
            >
              <Text className="text-slate-500 text-sm font-medium">See all</Text>
              <ChevronRight size={16} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row justify-between">
            {quickCategories.map((cat) => (
              <TouchableOpacity
                key={cat.category}
                onPress={() => router.push({
                  pathname: '/(tabs)/explore',
                  params: { category: cat.category }
                })}
                className="items-center flex-1"
                activeOpacity={0.7}
              >
                <View 
                  className="w-14 h-14 rounded-2xl items-center justify-center mb-2"
                  style={{ backgroundColor: `${cat.color}15` }}
                >
                  <cat.icon size={24} color={cat.color} />
                </View>
                <Text className="text-xs text-slate-600 font-medium">
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Matching Partners */}
        <View className="px-5 mb-5">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Sparkles size={18} color="#c8ff00" />
              <Text className="text-lg font-bold text-slate-900 ml-2">
                Partners For You
              </Text>
            </View>
          </View>

          {matchingPartners.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {matchingPartners.map((partner) => (
                <TouchableOpacity
                  key={partner.id}
                  onPress={() => router.push({
                    pathname: '/(tabs)/explore',
                    params: { partner: partner.id }
                  })}
                  className="bg-white rounded-2xl p-4 mr-3 border border-slate-100 shadow-sm"
                  style={{ width: 200 }}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 bg-slate-100 rounded-xl items-center justify-center mr-3">
                      <Building2 size={20} color="#64748b" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-900 font-bold" numberOfLines={1}>
                        {partner.name}
                      </Text>
                      <Text className="text-slate-500 text-xs capitalize">
                        {partner.category[0]}
                      </Text>
                    </View>
                  </View>
                  
                  <Text className="text-slate-600 text-sm mb-3" numberOfLines={2}>
                    {partner.description}
                  </Text>
                  
                  <View className="flex-row items-center justify-between">
                    <Text className="text-slate-500 text-xs">
                      From {formatNaira(partner.minPayment || 0)}/mo
                    </Text>
                    {partner.rating && (
                      <View className="flex-row items-center">
                        <Text className="text-amber-500 text-xs font-medium">★ {partner.rating}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View className="bg-white rounded-2xl p-6 items-center border border-slate-100">
              <Text className="text-slate-500 text-center">
                Complete your profile to see personalized recommendations.
              </Text>
            </View>
          )}
        </View>

        {/* Recent Activity */}
        {transactions.length > 0 && (
          <View className="px-5 mb-5">
            <Text className="text-lg font-bold text-slate-900 mb-3">
              Recent Activity
            </Text>
            <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              {transactions.slice(0, 3).map((txn, index) => (
                <View 
                  key={txn.id}
                  className={`flex-row items-center p-4 ${index < 2 ? 'border-b border-slate-100' : ''}`}
                >
                  <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                    txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <TrendingUp 
                      size={18} 
                      color={txn.type === 'credit' ? '#22c55e' : '#ef4444'} 
                      style={{ transform: [{ rotate: txn.type === 'credit' ? '0deg' : '180deg' }] }}
                    />
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
                  <Text className={`font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {txn.type === 'credit' ? '+' : '-'}{formatNaira(txn.amount)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tips Section */}
        <View className="mx-5 mb-8 p-4 bg-slate-900 rounded-2xl">
          <View className="flex-row items-start">
            <View className="w-8 h-8 bg-lime-400 rounded-lg items-center justify-center mr-3">
              <Text className="text-lg">💡</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold mb-1">
                Pro Tip
              </Text>
              <Text className="text-slate-400 text-sm leading-5">
                Your safe amount of {formatNaira(safeAmount)}/month means you can comfortably 
                repay financing without stress. This is 15-18% of your verified income.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
