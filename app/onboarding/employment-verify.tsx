import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Mail,
  Link as LinkIcon,
  ArrowLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Building2,
  Globe,
  Info,
  X,
  University,
  Sparkles,
} from "lucide-react-native";
import { Button, Input, SimpleProgress } from "../../src/components";
import { useAppStore } from "../../src/store";
import {
  validateCorporateEmail,
  validateFreelanceLink,
  validateEmailFormat,
  detectInstitutionFromEmail,
} from "../../src/utils";
import { useDebounce } from "../../src/hooks";

interface InstitutionBadgeProps {
  institution: {
    name: string;
    displayName: string;
    type: string;
    isVerified: boolean;
  };
}

const InstitutionBadge: React.FC<InstitutionBadgeProps> = ({ institution }) => {
  if (institution.type === "university") {
    return (
      <View className="flex-row items-center">
        <View className="w-8 h-8 bg-indigo-100 rounded-lg items-center justify-center mr-2">
          <University size={16} color="#6366f1" />
        </View>
        <View>
          <Text className="text-indigo-700 font-inter-semibold text-sm">
            {institution.displayName}
          </Text>
          <Text className="text-indigo-500 text-xs">University Detected</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-center">
      <View
        className={`w-8 h-8 rounded-lg items-center justify-center mr-2 ${
          institution.isVerified ? "bg-green-100" : "bg-slate-100"
        }`}
      >
        <Building2
          size={16}
          color={institution.isVerified ? "#22c55e" : "#64748b"}
        />
      </View>
      <View>
        <Text
          className={`font-inter-semibold text-sm ${
            institution.isVerified ? "text-green-700" : "text-slate-700"
          }`}
        >
          {institution.displayName}
        </Text>
        <Text
          className={`text-xs ${
            institution.isVerified ? "text-green-500" : "text-slate-500"
          }`}
        >
          {institution.isVerified
            ? "Verified Organization"
            : "Organization Detected"}
        </Text>
      </View>
    </View>
  );
};

export default function EmploymentVerifyScreen() {
  const router = useRouter();
  const updateUser = useAppStore((state) => state.updateUser);
  const updateVerificationStatus = useAppStore(
    (state) => state.updateVerificationStatus,
  );
  const user = useAppStore((state) => state.user);

  const [workEmail, setWorkEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifiedCompany, setVerifiedCompany] = useState<string | null>(null);
  const [detectedInstitution, setDetectedInstitution] = useState<any>(null);
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);

  const debouncedEmail = useDebounce(workEmail, 400);

  useEffect(() => {
    if (!debouncedEmail) {
      setIsValidEmail(false);
      setEmailError("");
      setDetectedInstitution(null);
      return;
    }

    const result = validateEmailFormat(debouncedEmail);
    setIsValidEmail(result.isValid);

    if (!result.isValid && result.error && debouncedEmail.length > 0) {
      setEmailError(result.error);
    } else {
      setEmailError("");
    }

    // Detect institution from email
    if (result.isValid) {
      const institution = detectInstitutionFromEmail(debouncedEmail);
      setDetectedInstitution(institution);
    }
  }, [debouncedEmail]);

  const [businessName, setBusinessName] = useState("");
  const [profileLink, setProfileLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [isVerifyingLink, setIsVerifyingLink] = useState(false);
  const [linkVerified, setLinkVerified] = useState(false);
  const [verifiedPlatform, setVerifiedPlatform] = useState<string | null>(null);

  const isSalaried = user?.employmentType === "salaried";
  const isFreelancer = user?.employmentType === "freelancer";
  const isBusiness = user?.employmentType === "business";

  const handleVerifyEmail = async () => {
    const formatResult = validateEmailFormat(workEmail);
    if (!formatResult.isValid) {
      setEmailError(formatResult.error || "Please enter a valid email address");
      return;
    }

    setEmailError("");
    setIsVerifyingEmail(true);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const result = validateCorporateEmail(workEmail);

    if (result.isValid) {
      setEmailVerified(true);
      setVerifiedCompany(result.company);
      updateUser({
        workEmail,
        isEmploymentVerified: true,
      });
      updateVerificationStatus({ employment: true });
    } else {
      // Check if it's a known institution (like PAU)
      const institution = detectInstitutionFromEmail(workEmail);
      if (institution) {
        setDetectedInstitution(institution);
        // Show institution verification modal
        setShowInstitutionModal(true);
      }
      updateUser({ workEmail });
    }

    setIsVerifyingEmail(false);
  };

  const confirmInstitutionVerification = () => {
    if (detectedInstitution) {
      setEmailVerified(true);
      setVerifiedCompany(detectedInstitution.name);
      updateUser({
        workEmail,
        isEmploymentVerified: true,
        institutionName: detectedInstitution.displayName,
      });
      updateVerificationStatus({ employment: true });
    }
    setShowInstitutionModal(false);
  };

  const handleVerifyLink = async () => {
    setLinkError("");
    setIsVerifyingLink(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = validateFreelanceLink(profileLink);

    if (result.isValid) {
      setLinkVerified(true);
      setVerifiedPlatform(result.platform);
      updateUser({
        professionalProfileLink: profileLink,
        businessName: businessName || undefined,
        isEmploymentVerified: true,
      });
      updateVerificationStatus({ employment: true });
    } else {
      setLinkError(
        "Please provide a link from LinkedIn, Upwork, Fiverr, or similar platforms.",
      );
    }

    setIsVerifyingLink(false);
  };

  const handleContinue = () => {
    if (isBusiness) {
      updateUser({
        businessName: businessName || undefined,
        isEmploymentVerified: true,
      });
      updateVerificationStatus({ employment: true });
    }
    router.push("/onboarding/income");
  };

  const canContinue =
    (isSalaried && (isValidEmail || emailVerified)) ||
    (isFreelancer && linkVerified) ||
    isBusiness;

  return (
    <SafeAreaView className="flex-1 bg-white">
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
        <Text className="text-sm text-slate-500">Step 3 of 6</Text>
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
          <View className="py-6">
            <Text className="text-2xl font-inter-bold text-slate-900">
              {isSalaried && "Verify Your Employment"}
              {isFreelancer && "Verify Your Freelance Profile"}
              {isBusiness && "Tell Us About Your Business"}
            </Text>
            <Text className="text-base text-slate-500 mt-2">
              {isSalaried &&
                "Enter your work email to automatically detect your organization."}
              {isFreelancer &&
                "Link your professional profile to verify your work."}
              {isBusiness && "Provide your business details for verification."}
            </Text>
          </View>

          {isSalaried && (
            <View>
              <Input
                label="Work Email Address"
                placeholder="your.name@company.edu.ng"
                value={workEmail}
                onChangeText={(text) => {
                  setWorkEmail(text);
                  setEmailVerified(false);
                  setDetectedInstitution(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={emailError}
                icon={
                  <Mail
                    size={20}
                    color={
                      emailError
                        ? "#ef4444"
                        : isValidEmail
                          ? "#22c55e"
                          : "#64748b"
                    }
                  />
                }
              />

              {detectedInstitution && !emailVerified && (
                <View className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-4">
                  <View className="flex-row items-center justify-between">
                    <InstitutionBadge institution={detectedInstitution} />
                    <View className="bg-indigo-100 px-2 py-1 rounded-full">
                      <Text className="text-indigo-700 text-xs font-inter-medium">
                        Detected
                      </Text>
                    </View>
                  </View>
                  <Text className="text-indigo-600 text-sm mt-2">
                    {detectedInstitution.isVerified
                      ? "This organization is verified. Tap verify to confirm."
                      : "We'll calculate your credit limit based on this information."}
                  </Text>
                </View>
              )}

              {emailVerified && verifiedCompany && (
                <View className="bg-green-50 border border-green-100 p-4 rounded-xl mb-4 flex-row items-center">
                  <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                    <Check size={20} color="#22c55e" />
                  </View>
                  <View>
                    <Text className="text-green-700 font-inter-semibold">
                      Employment Verified!
                    </Text>
                    <Text className="text-green-600 text-sm">
                      {detectedInstitution?.type === "university"
                        ? `Verified as ${detectedInstitution.displayName} member`
                        : `Employee at ${verifiedCompany}`}
                    </Text>
                  </View>
                </View>
              )}

              {!detectedInstitution && (
                <View className="bg-slate-50 p-4 rounded-xl">
                  <View className="flex-row items-center mb-2">
                    <Info size={18} color="#64748b" />
                    <Text className="text-sm font-inter-medium text-slate-700 ml-2">
                      Smart Detection
                    </Text>
                  </View>
                  <Text className="text-xs text-slate-500">
                    We automatically detect Nigerian universities (.edu.ng) and
                    major organizations. Your credit limit will be calculated
                    based on your institution's profile.
                  </Text>
                </View>
              )}
            </View>
          )}

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
                  setLinkError("");
                  setLinkVerified(false);
                }}
                keyboardType="url"
                autoCapitalize="none"
                error={linkError}
                icon={<LinkIcon size={20} color="#64748b" />}
              />

              {linkVerified && verifiedPlatform && (
                <View className="bg-green-50 border border-green-100 p-4 rounded-xl mb-4 flex-row items-center">
                  <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                    <Check size={20} color="#22c55e" />
                  </View>
                  <View>
                    <Text className="text-green-700 font-inter-semibold">
                      Freelancer Verified!
                    </Text>
                    <Text className="text-green-600 text-sm">
                      Profile on {verifiedPlatform}
                    </Text>
                  </View>
                </View>
              )}

              {!linkVerified && (
                <Button
                  title={isVerifyingLink ? "Verifying..." : "Verify Profile"}
                  onPress={handleVerifyLink}
                  disabled={!profileLink || isVerifyingLink}
                  loading={isVerifyingLink}
                  variant="outline"
                  className="mb-4"
                />
              )}

              <View className="bg-slate-50 p-4 rounded-xl">
                <View className="flex-row items-center mb-2">
                  <Globe size={18} color="#64748b" />
                  <Text className="text-sm font-inter-medium text-slate-700 ml-2">
                    Accepted Platforms
                  </Text>
                </View>
                <Text className="text-xs text-slate-500">
                  LinkedIn, Upwork, Fiverr, Toptal, Freelancer, GitHub, Behance,
                  Dribbble, and more.
                </Text>
              </View>
            </View>
          )}

          {isBusiness && (
            <View>
              <Input
                label="Business Name"
                placeholder="e.g., Ade & Sons Enterprises"
                value={businessName}
                onChangeText={setBusinessName}
                icon={<Building2 size={20} color="#64748b" />}
              />

              <View className="bg-amber-50 p-4 rounded-xl mt-4">
                <View className="flex-row items-start">
                  <AlertCircle
                    size={20}
                    color="#f59e0b"
                    style={{ marginTop: 2 }}
                  />
                  <View className="ml-3 flex-1">
                    <Text className="text-sm font-inter-medium text-amber-800 mb-1">
                      Business Verification
                    </Text>
                    <Text className="text-sm text-amber-700">
                      We'll verify your business through your transaction
                      history. Make sure to grant SMS access in the next step.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View className="px-6 pb-6 pt-4 bg-white border-t border-slate-100">
          <Button
            title={detectedInstitution ? "Verify & Continue" : "Continue"}
            onPress={handleContinue}
            disabled={!canContinue}
            icon={
              detectedInstitution ? (
                <Sparkles size={20} color="#fff" />
              ) : (
                <ChevronRight
                  size={20}
                  color={canContinue ? "#fff" : "#94a3b8"}
                />
              )
            }
            iconPosition="right"
            size="lg"
          />
          {!canContinue && isSalaried && (
            <Text className="text-center text-xs text-slate-400 mt-3">
              {detectedInstitution
                ? "Tap 'Verify & Continue' to confirm your membership"
                : "Please enter a valid email to continue"}
            </Text>
          )}
          {!canContinue && isFreelancer && (
            <Text className="text-center text-xs text-slate-400 mt-3">
              Please verify your professional profile to continue
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={showInstitutionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInstitutionModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-indigo-100 rounded-full items-center justify-center mb-3">
                <University size={32} color="#6366f1" />
              </View>
              <Text className="text-xl font-inter-bold text-slate-900 text-center">
                {detectedInstitution?.displayName}
              </Text>
              <Text className="text-sm text-slate-500 text-center mt-1">
                Institution Detected
              </Text>
            </View>

            <Text className="text-slate-600 text-center mb-6">
              We detected that you're affiliated with{" "}
              {detectedInstitution?.displayName}. Would you like to verify your
              membership?
            </Text>

            <TouchableOpacity
              onPress={confirmInstitutionVerification}
              className="bg-indigo-600 rounded-xl py-3.5 items-center mb-3"
              activeOpacity={0.9}
            >
              <Text className="text-white font-inter-semibold">
                Yes, Verify My Membership
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowInstitutionModal(false)}
              className="py-3.5 items-center"
              activeOpacity={0.7}
            >
              <Text className="text-slate-500 font-inter-medium">
                Skip for Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
