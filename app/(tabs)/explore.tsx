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
  Lock,
  ChevronRight
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
  const [expandedCategory, setExpandedCategory] = useState<AssetCategory | null>(
    (params.category as AssetCategory) || null
  );

  const safeAmount = financialProfile?.safeMonthlyRepayment || 0;

  // Update expanded category when params change
  useEffect(() => {
    if (params.category) {
      setExpandedCategory(params.category as AssetCategory);
    }
  }, [params.category]);

  // Group partners by category
  const partnersByCategory = ASSET_CATEGORIES.reduce((acc, category) => {
    const categoryPartners = PARTNERS.filter((partner) => 
      partner.category.includes(category.id as AssetCategory)
    );
    
    // Apply search filter
    const filteredPartners = searchQuery 
      ? categoryPartners.filter(partner => {
          const query = searchQuery.toLowerCase();
          return partner.name.toLowerCase().includes(query) ||
                 partner.description.toLowerCase().includes(query);
        })
      : categoryPartners;
    
    // Sort: affordable first
    const sortedPartners = [...filteredPartners].sort((a, b) => {
      const aAffordable = (a.minPayment || 0) <= safeAmount;
      const bAffordable = (b.minPayment || 0) <= safeAmount;
      if (aAffordable && !bAffordable) return -1;
      if (!aAffordable && bAffordable) return 1;
      return (a.minPayment || 0) - (b.minPayment || 0);
    });
    
    acc[category.id] = sortedPartners;
    return acc;
  }, {} as Record<string, Partner[]>);

  const handleVisitPartner = (url: string) => {
    Linking.openURL(url);
  };

  const toggleCategory = (categoryId: AssetCategory) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const totalAffordable = PARTNERS.filter(p => (p.minPayment || 0) <= safeAmount).length;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="px-5 pt-2 pb-4">
        <Text className="text-2xl font-bold text-slate-900 mb-1">
          Explore Partners
        </Text>
        <Text className="text-sm text-slate-500 mb-4">
          {totalAffordable} partners match your budget of {formatNaira(safeAmount)}/month
        </Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-slate-200">
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

      {/* Categories with Partners */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {ASSET_CATEGORIES.map((category) => {
          const Icon = iconMap[category.icon] || Building2;
          const partners = partnersByCategory[category.id] || [];
          const affordableCount = partners.filter(p => (p.minPayment || 0) <= safeAmount).length;
          const isExpanded = expandedCategory === category.id;
          
          // Skip empty categories in search results
          if (searchQuery && partners.length === 0) return null;

          return (
            <View key={category.id} className="mb-3">
              {/* Category Header */}
              <TouchableOpacity
                onPress={() => toggleCategory(category.id as AssetCategory)}
                className={`
                  bg-white rounded-xl p-4 flex-row items-center justify-between
                  border ${isExpanded ? 'border-slate-300' : 'border-slate-100'}
                `}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center flex-1">
                  <View 
                    className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                    style={{ backgroundColor: `${category.color}15` }}
                  >
                    <Icon size={20} color={category.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-900 font-semibold text-base">
                      {category.name}
                    </Text>
                    <Text className="text-slate-500 text-xs">
                      {partners.length} partners • {affordableCount} affordable
                    </Text>
                  </View>
                </View>
                <View 
                  className={`
                    w-8 h-8 rounded-full items-center justify-center
                    ${isExpanded ? 'bg-slate-900' : 'bg-slate-100'}
                  `}
                >
                  <ChevronRight 
                    size={16} 
                    color={isExpanded ? '#c8ff00' : '#64748b'} 
                    style={{ 
                      transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] 
                    }}
                  />
                </View>
              </TouchableOpacity>

              {/* Expanded Partner List */}
              {isExpanded && partners.length > 0 && (
                <View className="mt-2 ml-2">
                  {partners.map((partner, index) => (
                    <CompactPartnerCard
                      key={partner.id}
                      partner={partner}
                      safeAmount={safeAmount}
                      onVisit={() => handleVisitPartner(partner.website)}
                      isLast={index === partners.length - 1}
                    />
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

// Compact Partner Card for grouped view
interface CompactPartnerCardProps {
  partner: Partner;
  safeAmount: number;
  onVisit: () => void;
  isLast: boolean;
}

const CompactPartnerCard: React.FC<CompactPartnerCardProps> = ({ 
  partner, 
  safeAmount, 
  onVisit,
  isLast 
}) => {
  const isAffordable = (partner.minPayment || 0) <= safeAmount;

  return (
    <View 
      className={`
        bg-white rounded-xl p-3 flex-row items-center
        ${!isLast ? 'mb-2' : ''}
        ${!isAffordable && 'opacity-60'}
      `}
    >
      {/* Partner Info */}
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-slate-900 font-medium text-sm flex-1">
            {partner.name}
          </Text>
          {partner.rating && (
            <View className="flex-row items-center">
              <Star size={10} color="#f59e0b" fill="#f59e0b" />
              <Text className="text-slate-500 text-xs ml-0.5">{partner.rating}</Text>
            </View>
          )}
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-slate-500 text-xs">
            {formatNaira(partner.minPayment || 0)} - {formatNaira(partner.maxPayment || 0)}/mo
          </Text>
          {isAffordable ? (
            <View className="flex-row items-center">
              <Check size={10} color="#22c55e" />
              <Text className="text-green-600 text-xs ml-0.5">Affordable</Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <Lock size={10} color="#94a3b8" />
              <Text className="text-slate-400 text-xs ml-0.5">Locked</Text>
            </View>
          )}
        </View>
      </View>

      {/* Visit Button */}
      <TouchableOpacity
        onPress={onVisit}
        disabled={!isAffordable}
        className={`
          ml-3 px-3 py-2 rounded-lg
          ${isAffordable ? 'bg-slate-900' : 'bg-slate-200'}
        `}
        activeOpacity={0.8}
      >
        <ExternalLink size={14} color={isAffordable ? '#c8ff00' : '#94a3b8'} />
      </TouchableOpacity>
    </View>
  );
};
