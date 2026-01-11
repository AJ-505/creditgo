import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Linking, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
  X, 
  Star,
  ExternalLink,
  Laptop,
  Sun,
  Home,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Building2,
  Check,
  Lock
} from 'lucide-react-native';
import { useAppStore } from '../../src/store';
import { formatNaira } from '../../src/constants';
import { PARTNERS, ASSET_CATEGORIES } from '../../src/constants/partners';
import { Partner, AssetCategory } from '../../src/types';

const iconMap: Record<string, any> = {
  'laptop': Laptop,
  'sun': Sun,
  'home': Home,
  'graduation-cap': GraduationCap,
  'heart-pulse': HeartPulse,
  'briefcase': Briefcase,
};

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string; partner?: string }>();
  const financialProfile = useAppStore((state) => state.financialProfile);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>(
    (params.category as AssetCategory) || 'all'
  );

  const safeAmount = financialProfile?.safeMonthlyRepayment || 0;

  // Update category when params change
  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category as AssetCategory);
    }
  }, [params.category]);

  // Filter partners
  const filteredPartners = PARTNERS.filter((partner) => {
    // Category filter
    if (selectedCategory !== 'all' && !partner.category.includes(selectedCategory)) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = partner.name.toLowerCase().includes(query);
      const matchesDescription = partner.description.toLowerCase().includes(query);
      if (!matchesName && !matchesDescription) {
        return false;
      }
    }
    
    return true;
  });

  // Sort: affordable first
  const sortedPartners = [...filteredPartners].sort((a, b) => {
    const aAffordable = (a.minPayment || 0) <= safeAmount;
    const bAffordable = (b.minPayment || 0) <= safeAmount;
    if (aAffordable && !bAffordable) return -1;
    if (!aAffordable && bAffordable) return 1;
    return (a.minPayment || 0) - (b.minPayment || 0);
  });

  const affordableCount = filteredPartners.filter(p => (p.minPayment || 0) <= safeAmount).length;

  const handleVisitPartner = (url: string) => {
    Linking.openURL(url);
  };

  const allCategories = [
    { id: 'all' as const, name: 'All', icon: null, color: '#64748b' },
    ...ASSET_CATEGORIES,
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="px-5 pt-2 pb-4">
        <Text className="text-2xl font-bold text-slate-900 mb-4">
          Explore Partners
        </Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 border border-slate-200">
          <Search size={20} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-3 text-base text-slate-900"
            placeholder="Search partners..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category Filter - Small Pill Style */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="max-h-10 mb-3"
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {allCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const Icon = category.icon ? iconMap[category.icon] : null;
          
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id as AssetCategory | 'all')}
              className={`
                flex-row items-center px-3 py-2 rounded-full mr-2
                ${isSelected ? 'bg-slate-900' : 'bg-white border border-slate-200'}
              `}
              activeOpacity={0.7}
            >
              {Icon && (
                <Icon 
                  size={14} 
                  color={isSelected ? '#c8ff00' : category.color} 
                  style={{ marginRight: 4 }}
                />
              )}
              <Text 
                className={`
                  font-medium text-xs
                  ${isSelected ? 'text-white' : 'text-slate-600'}
                `}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Stats Bar */}
      <View className="px-5 py-2 flex-row items-center justify-between">
        <Text className="text-slate-500 text-sm">
          {sortedPartners.length} partners • {affordableCount} matching your budget
        </Text>
      </View>

      {/* Partner List */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {sortedPartners.length > 0 ? (
          sortedPartners.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              safeAmount={safeAmount}
              onVisit={() => handleVisitPartner(partner.website)}
            />
          ))
        ) : (
          <View className="py-12 items-center">
            <Text className="text-slate-400 text-center">
              No partners found.
              {searchQuery && '\nTry a different search term.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Partner Card Component
interface PartnerCardProps {
  partner: Partner;
  safeAmount: number;
  onVisit: () => void;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner, safeAmount, onVisit }) => {
  const isAffordable = (partner.minPayment || 0) <= safeAmount;
  
  // Get category icon
  const primaryCategory = partner.category[0];
  const categoryInfo = ASSET_CATEGORIES.find(c => c.id === primaryCategory);
  const Icon = categoryInfo ? iconMap[categoryInfo.icon] : Building2;

  return (
    <View 
      className={`
        bg-white rounded-2xl mb-3 border overflow-hidden
        ${isAffordable ? 'border-slate-100' : 'border-slate-200 opacity-80'}
      `}
    >
      {/* Header with status badge */}
      <View className="flex-row items-center justify-between p-4 border-b border-slate-100">
        <View className="flex-row items-center flex-1">
          <View 
            className="w-12 h-12 rounded-xl items-center justify-center mr-3"
            style={{ backgroundColor: categoryInfo ? `${categoryInfo.color}15` : '#f1f5f9' }}
          >
            <Icon size={24} color={categoryInfo?.color || '#64748b'} />
          </View>
          <View className="flex-1">
            <Text className="text-slate-900 font-bold text-lg">{partner.name}</Text>
            <View className="flex-row items-center">
              {partner.rating && (
                <View className="flex-row items-center mr-2">
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                  <Text className="text-slate-600 text-xs ml-1">{partner.rating}</Text>
                </View>
              )}
              <Text className="text-slate-500 text-xs capitalize">
                {partner.category.join(' • ')}
              </Text>
            </View>
          </View>
        </View>
        
        <View 
          className={`
            px-2 py-1 rounded-full flex-row items-center
            ${isAffordable ? 'bg-green-100' : 'bg-slate-100'}
          `}
        >
          {isAffordable ? (
            <Check size={12} color="#22c55e" />
          ) : (
            <Lock size={12} color="#94a3b8" />
          )}
          <Text className={`text-xs font-medium ml-1 ${isAffordable ? 'text-green-700' : 'text-slate-500'}`}>
            {isAffordable ? 'Affordable' : 'Locked'}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-4">
        <Text className="text-slate-600 text-sm mb-4 leading-5">
          {partner.description}
        </Text>

        {/* Payment Range */}
        <View className="flex-row items-center justify-between mb-4 bg-slate-50 rounded-xl p-3">
          <View>
            <Text className="text-slate-500 text-xs">Monthly from</Text>
            <Text className="text-slate-900 font-bold">
              {formatNaira(partner.minPayment || 0)}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-slate-500 text-xs">Up to</Text>
            <Text className="text-slate-900 font-bold">
              {formatNaira(partner.maxPayment || 0)}
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          onPress={onVisit}
          disabled={!isAffordable}
          className={`
            flex-row items-center justify-center py-3 rounded-xl
            ${isAffordable ? 'bg-slate-900' : 'bg-slate-200'}
          `}
          activeOpacity={0.8}
        >
          <Text className={`font-semibold mr-2 ${isAffordable ? 'text-white' : 'text-slate-400'}`}>
            {isAffordable ? 'Visit Website' : 'Not Available'}
          </Text>
          {isAffordable && <ExternalLink size={16} color="#c8ff00" />}
        </TouchableOpacity>
      </View>
    </View>
  );
};
