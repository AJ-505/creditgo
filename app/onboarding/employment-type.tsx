import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Building2, 
  Laptop, 
  Briefcase,
  ArrowLeft,
  ChevronRight
} from 'lucide-react-native';
import { Button, SimpleProgress } from '../../src/components';
import { useAppStore } from '../../src/store';

type EmploymentType = 'salaried' | 'freelancer' | 'business';

interface EmploymentOption {
  type: EmploymentType;
  title: string;
  description: string;
  icon: React.ElementType;
  examples: string[];
  color: string;
}

const employmentOptions: EmploymentOption[] = [
  {
    type: 'salaried',
    title: 'Salaried Employee',
    description: 'I work for a company and receive a monthly salary.',
    icon: Building2,
    examples: ['Banks', 'Tech companies', 'Government', 'NGOs'],
    color: '#3b82f6',
  },
  {
    type: 'freelancer',
    title: 'Freelancer / Gig Worker',
    description: 'I work independently and have multiple clients.',
    icon: Laptop,
    examples: ['Developers', 'Designers', 'Writers', 'Consultants'],
    color: '#8b5cf6',
  },
  {
    type: 'business',
    title: 'Business Owner / SME',
    description: 'I run my own business or startup.',
    icon: Briefcase,
    examples: ['Shop owners', 'Service providers', 'Entrepreneurs'],
    color: '#10b981',
  },
];

export default function EmploymentTypeScreen() {
  const router = useRouter();
  const updateUser = useAppStore((state) => state.updateUser);
  const user = useAppStore((state) => state.user);

  const handleSelect = (type: EmploymentType) => {
    updateUser({ employmentType: type });
    router.push('/onboarding/employment-verify');
  };

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
            <SimpleProgress current={3} total={6} />
          </View>
        </View>
        <Text className="text-sm text-dark-500">Step 3 of 6</Text>
      </View>

      <ScrollView 
        className="flex-1 px-6" 
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View className="py-6">
          <Text className="text-2xl font-bold text-dark-800">
            How do you earn income?
          </Text>
          <Text className="text-base text-dark-500 mt-2">
            Select the option that best describes your employment situation.
          </Text>
        </View>

        {/* Options */}
        {employmentOptions.map((option) => (
          <TouchableOpacity
            key={option.type}
            onPress={() => handleSelect(option.type)}
            className={`
              p-4 rounded-xl mb-4 border-2
              ${user?.employmentType === option.type 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 bg-white'
              }
            `}
            activeOpacity={0.7}
          >
            <View className="flex-row items-start">
              <View 
                className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: `${option.color}15` }}
              >
                <option.icon size={24} color={option.color} />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-dark-800">
                    {option.title}
                  </Text>
                  <ChevronRight size={20} color="#94a3b8" />
                </View>
                <Text className="text-sm text-dark-500 mt-1">
                  {option.description}
                </Text>
                <View className="flex-row flex-wrap mt-3 gap-2">
                  {option.examples.map((example, idx) => (
                    <View 
                      key={idx}
                      className="bg-gray-100 px-2 py-1 rounded-md"
                    >
                      <Text className="text-xs text-dark-600">{example}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
