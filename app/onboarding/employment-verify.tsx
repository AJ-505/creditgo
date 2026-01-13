import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Mail, 
  Link as LinkIcon,
  ArrowLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Building2,
  Globe,
  Info
} from 'lucide-react-native';
import { Button, Input, SimpleProgress } from '../../src/components';
import { useAppStore } from '../../src/store';
import { validateCorporateEmail, validateFreelanceLink, validateEmailFormat } from '../../src/utils';
import { useDebounce } from '../../src/hooks';

export default function EmploymentVerifyScreen() {
  const router = useRouter();
  const updateUser = useAppStore((state) => state.updateUser);
  const updateVerificationStatus = useAppStore((state) => state.updateVerificationStatus);
  const user = useAppStore((state) => state.user);
  
  // Salaried employee fields
  const [workEmail, setWorkEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifiedCompany, setVerifiedCompany] = useState<string | null>(null);
  const [domainNotVerified, setDomainNotVerified] = useState(false);
  
  // Debounced email for validation
  const debouncedEmail = useDebounce(workEmail, 400);
  
  // Validate email format when debounced value changes
  useEffect(() => {
    if (!debouncedEmail) {
      setIsValidEmail(false);
      setEmailError('');
      return;
    }
    
    const result = validateEmailFormat(debouncedEmail);
    setIsValidEmail(result.isValid);
    
    // Only show error if user has typed something and it's invalid
    if (!result.isValid && result.error && debouncedEmail.length > 0) {
      setEmailError(result.error);
    } else {
      setEmailError('');
    }
  }, [debouncedEmail]);
  
  // Freelancer fields
  const [businessName, setBusinessName] = useState('');
  const [profileLink, setProfileLink] = useState('');
  const [linkError, setLinkError] = useState('');
  const [isVerifyingLink, setIsVerifyingLink] = useState(false);
  const [linkVerified, setLinkVerified] = useState(false);
  const [verifiedPlatform, setVerifiedPlatform] = useState<string | null>(null);

  const isSalaried = user?.employmentType === 'salaried';
  const isFreelancer = user?.employmentType === 'freelancer';
  const isBusiness = user?.employmentType === 'business';

  const handleVerifyEmail = async () => {
    // First validate email format
    const formatResult = validateEmailFormat(workEmail);
    if (!formatResult.isValid) {
      setEmailError(formatResult.error || 'Please enter a valid email address');
      return;
    }
    
    setEmailError('');
    setIsVerifyingEmail(true);
    setDomainNotVerified(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = validateCorporateEmail(workEmail);
    
    if (result.isValid) {
      setEmailVerified(true);
      setVerifiedCompany(result.company);
      updateUser({ 
        workEmail,
        isEmploymentVerified: true 
      });
      updateVerificationStatus({ employment: true });
    } else {
      // Domain not in verified list - but this is NOT an error!
      // User can still continue, we just note it's not a verified employer
      setDomainNotVerified(true);
      updateUser({ workEmail });
    }
    
    setIsVerifyingEmail(false);
  };

  const handleVerifyLink = async () => {
    setLinkError('');
    setIsVerifyingLink(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = validateFreelanceLink(profileLink);
    
    if (result.isValid) {
      setLinkVerified(true);
      setVerifiedPlatform(result.platform);
      updateUser({ 
        professionalProfileLink: profileLink,
        businessName: businessName || undefined,
        isEmploymentVerified: true 
      });
      updateVerificationStatus({ employment: true });
    } else {
      setLinkError('Please provide a link from LinkedIn, Upwork, Fiverr, or similar platforms.');
    }
    
    setIsVerifyingLink(false);
  };

  const handleContinue = () => {
    if (isBusiness) {
      updateUser({ 
        businessName: businessName || undefined,
        isEmploymentVerified: true 
      });
      updateVerificationStatus({ employment: true });
    }
    router.push('/onboarding/income');
  };

  // Key fix: Allow continuation when email format is valid OR domain is verified
  // Salaried: valid email format is enough (domain verification is optional)
  // Freelancer: link must be verified
  // Business: always allowed to continue
  const canContinue = 
    (isSalaried && (isValidEmail || emailVerified)) || 
    (isFreelancer && linkVerified) || 
    isBusiness;

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
              {isSalaried && 'Verify Your Employment'}
              {isFreelancer && 'Verify Your Freelance Profile'}
              {isBusiness && 'Tell Us About Your Business'}
            </Text>
            <Text className="text-base text-dark-500 mt-2">
              {isSalaried && 'Use your work email to verify your employer.'}
              {isFreelancer && 'Link your professional profile to verify your work.'}
              {isBusiness && 'Provide your business details for verification.'}
            </Text>
          </View>

          {/* Salaried Employee Form */}
          {isSalaried && (
            <View>
              <Input
                label="Work Email Address"
                placeholder="your.name@company.com"
                value={workEmail}
                onChangeText={(text) => {
                  setWorkEmail(text);
                  setEmailVerified(false);
                  setDomainNotVerified(false);
                  // Don't clear emailError here - let debounced validation handle it
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={emailError}
                icon={<Mail size={20} color={emailError ? "#ef4444" : isValidEmail ? "#16a34a" : "#64748b"} />}
              />

              {emailVerified && verifiedCompany && (
                <View className="bg-primary-50 p-4 rounded-xl mb-4 flex-row items-center">
                  <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
                    <Check size={20} color="#16a34a" />
                  </View>
                  <View>
                    <Text className="text-primary-700 font-medium">
                      Employment Verified!
                    </Text>
                    <Text className="text-primary-600 text-sm">
                      Employee at {verifiedCompany}
                    </Text>
                  </View>
                </View>
              )}

              {/* Domain not in verified list - informational only */}
              {domainNotVerified && !emailVerified && (
                <View className="bg-blue-50 p-4 rounded-xl mb-4 flex-row items-start">
                  <Info size={20} color="#3b82f6" style={{ marginTop: 2 }} />
                  <View className="ml-3 flex-1">
                    <Text className="text-blue-800 font-medium">
                      Email saved
                    </Text>
                    <Text className="text-blue-700 text-sm mt-1">
                      Your employer isn't in our verified list yet — no problem.
                      We'll still calculate your Safe Amount from your income and spending.
                    </Text>
                  </View>
                </View>
              )}

              {!emailVerified && !domainNotVerified && (
                <Button
                  title={isVerifyingEmail ? 'Verifying...' : 'Verify Email (Optional)'}
                  onPress={handleVerifyEmail}
                  disabled={!isValidEmail || isVerifyingEmail}
                  loading={isVerifyingEmail}
                  variant="outline"
                  className="mb-4"
                />
              )}

              <View className="bg-gray-50 p-4 rounded-xl">
                <View className="flex-row items-center mb-2">
                  <Building2 size={18} color="#64748b" />
                  <Text className="text-sm font-medium text-dark-700 ml-2">
                    Verified Employers
                  </Text>
                </View>
                <Text className="text-xs text-dark-500">
                  MTN, Dangote, GTBank, Access Bank, Flutterwave, Paystack, 
                  Andela, Shell, Chevron, and 200+ more.
                </Text>
              </View>
            </View>
          )}

          {/* Freelancer Form */}
          {isFreelancer && (
            <View>
              <Input
                label="Business/Brand Name (Optional)"
                placeholder="e.g., Ade Designs"
                value={businessName}
                onChangeText={setBusinessName}
                icon={<Building2 size={20} color="#64748b" />}
              />

              <Input
                label="Professional Profile Link"
                placeholder="https://linkedin.com/in/yourname"
                value={profileLink}
                onChangeText={(text) => {
                  setProfileLink(text);
                  setLinkError('');
                  setLinkVerified(false);
                }}
                keyboardType="url"
                autoCapitalize="none"
                error={linkError}
                icon={<LinkIcon size={20} color="#64748b" />}
              />

              {linkVerified && verifiedPlatform && (
                <View className="bg-primary-50 p-4 rounded-xl mb-4 flex-row items-center">
                  <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
                    <Check size={20} color="#16a34a" />
                  </View>
                  <View>
                    <Text className="text-primary-700 font-medium">
                      Freelancer Verified!
                    </Text>
                    <Text className="text-primary-600 text-sm">
                      Profile on {verifiedPlatform}
                    </Text>
                  </View>
                </View>
              )}

              {!linkVerified && (
                <Button
                  title={isVerifyingLink ? 'Verifying...' : 'Verify Profile'}
                  onPress={handleVerifyLink}
                  disabled={!profileLink || isVerifyingLink}
                  loading={isVerifyingLink}
                  variant="outline"
                  className="mb-4"
                />
              )}

              <View className="bg-gray-50 p-4 rounded-xl">
                <View className="flex-row items-center mb-2">
                  <Globe size={18} color="#64748b" />
                  <Text className="text-sm font-medium text-dark-700 ml-2">
                    Accepted Platforms
                  </Text>
                </View>
                <Text className="text-xs text-dark-500">
                  LinkedIn, Upwork, Fiverr, Toptal, Freelancer, GitHub, 
                  Behance, Dribbble, and more.
                </Text>
              </View>
            </View>
          )}

          {/* Business Owner Form */}
          {isBusiness && (
            <View>
              <Input
                label="Business Name"
                placeholder="e.g., Ade & Sons Enterprises"
                value={businessName}
                onChangeText={setBusinessName}
                icon={<Building2 size={20} color="#64748b" />}
              />

              <View className="bg-yellow-50 p-4 rounded-xl mt-4">
                <View className="flex-row items-start">
                  <AlertCircle size={20} color="#f59e0b" style={{ marginTop: 2 }} />
                  <View className="ml-3 flex-1">
                    <Text className="text-sm font-medium text-yellow-800 mb-1">
                      Business Verification
                    </Text>
                    <Text className="text-sm text-yellow-700">
                      We'll verify your business through your transaction history. 
                      Make sure to grant SMS access in the next step.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom CTA */}
        <View className="px-6 pb-6 pt-4 bg-white border-t border-gray-100">
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!canContinue}
            icon={<ChevronRight size={20} color={canContinue ? "#fff" : "#94a3b8"} />}
            iconPosition="right"
            size="lg"
          />
          {!canContinue && isSalaried && (
            <Text className="text-center text-xs text-dark-400 mt-3">
              Please enter a valid work email to continue
            </Text>
          )}
          {!canContinue && isFreelancer && (
            <Text className="text-center text-xs text-dark-400 mt-3">
              Please verify your professional profile to continue
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
