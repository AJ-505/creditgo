import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import {
  Camera,
  ArrowLeft,
  RefreshCw,
  Check,
  ShieldCheck,
  AlertCircle,
} from "lucide-react-native";
import { Button, SimpleProgress } from "../../src/components";
import { useAppStore } from "../../src/store";
import { simulateBiometricVerification } from "../../src/utils";

export default function SelfieScreen() {
  const router = useRouter();
  const updateUser = useAppStore((state) => state.updateUser);
  const updateVerificationStatus = useAppStore(
    (state) => state.updateVerificationStatus,
  );
  const user = useAppStore((state) => state.user);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("front");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const result = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        if (result) {
          setPhoto(result.uri);
        }
      } catch (error) {
        console.log("Error taking picture:", error);
      }
    }
  };

  // Demo-friendly: auto-run verification after capture.
  useEffect(() => {
    if (!photo) return;
    if (isVerified || isVerifying) return;
    verifyIdentity();
    // eslint-disable-next-line react-hooks/exhaustive_features
  }, [photo]);

  const retakePicture = () => {
    setPhoto(null);
    setIsVerified(false);
  };

  const verifyIdentity = async () => {
    setIsVerifying(true);

    // Simulate biometric verification (2 second delay for demo)
    const success = await simulateBiometricVerification();

    if (success) {
      setIsVerified(true);
      updateUser({
        selfieUri: photo || undefined,
        isIdentityVerified: true,
      });
      updateVerificationStatus({ identity: true });
    }

    setIsVerifying(false);
  };

  const handleContinue = () => {
    router.push("/onboarding/employment-type");
  };

  // Camera permission not granted
  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="text-dark-500 mt-4">Loading camera...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
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
              <SimpleProgress current={2} total={5} />
            </View>
          </View>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 bg-yellow-100 rounded-full items-center justify-center mb-4">
            <Camera size={40} color="#f59e0b" />
          </View>
          <Text className="text-xl font-bold text-dark-800 text-center mb-2">
            Camera Access Required
          </Text>
          <Text className="text-base text-dark-500 text-center mb-6">
            We need camera access to take a selfie for identity verification.
            This helps lenders trust that you are who you say you are.
          </Text>
          <Button
            title="Grant Camera Access"
            onPress={requestPermission}
            size="lg"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      {/* Header */}
      <View className="px-6 py-4 bg-dark-900">
        <View className="flex-row items-center mb-2">
          <Button
            title=""
            variant="ghost"
            onPress={() => router.back()}
            icon={<ArrowLeft size={24} color="#ffffff" />}
            className="p-0 mr-4"
          />
          <View className="flex-1">
            <SimpleProgress current={2} total={6} />
          </View>
        </View>
        <Text className="text-sm text-gray-400">Step 2 of 6</Text>
      </View>

      {/* Camera or Photo Preview */}
      <View className="flex-1">
        {photo ? (
          // Photo Preview
          <View className="flex-1">
            <Image
              source={{ uri: photo }}
              className="flex-1"
              resizeMode="cover"
            />

            {/* Verification Overlay */}
            {isVerifying && (
              <View className="absolute inset-0 bg-black/70 items-center justify-center">
                <ActivityIndicator size="large" color="#22c55e" />
                <Text className="text-white text-lg font-medium mt-4">
                  Verifying your selfie...
                </Text>
                <Text className="text-gray-400 text-sm mt-2">
                  This usually takes a few seconds
                </Text>
              </View>
            )}

            {/* Verified Overlay */}
            {isVerified && !isVerifying && (
              <View className="absolute inset-0 bg-black/70 items-center justify-center">
                <View className="w-24 h-24 bg-primary-500 rounded-full items-center justify-center mb-4">
                  <ShieldCheck size={48} color="#ffffff" />
                </View>
                <Text className="text-white text-2xl font-bold">
                  Identity Verified!
                </Text>
                <Text className="text-gray-300 text-base mt-2 text-center px-8">
                  Verified. You can continue.
                </Text>
              </View>
            )}
          </View>
        ) : (
          // Camera View
          <View className="flex-1">
            <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
              {/* Face Guide Overlay */}
              <View className="flex-1 items-center justify-center">
                <View className="w-64 h-80 border-4 border-white/50 rounded-[100px]" />
                <Text className="text-white text-center mt-4 px-8">
                  Position your face within the oval
                </Text>
              </View>
            </CameraView>
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View className="px-6 py-6 bg-dark-900">
        {!photo ? (
          // Capture Button
          <TouchableOpacity
            onPress={takePicture}
            className="w-20 h-20 bg-white rounded-full items-center justify-center self-center border-4 border-primary-500"
            activeOpacity={0.8}
          >
            <Camera size={32} color="#22c55e" />
          </TouchableOpacity>
        ) : isVerified ? (
          // Continue Button
          <Button
            title="Continue"
            onPress={handleContinue}
            icon={<Check size={20} color="#fff" />}
            iconPosition="left"
            size="lg"
          />
        ) : (
          // Verify/Retake Buttons
          <View className="flex-row gap-4">
            <Button
              title="Retake"
              onPress={retakePicture}
              variant="outline"
              icon={<RefreshCw size={18} color="#22c55e" />}
              iconPosition="left"
              className="flex-1"
            />
            <Button
              title={isVerifying ? "Verifying…" : "Verifying…"}
              onPress={() => {}}
              loading={isVerifying}
              disabled={true}
              icon={<ShieldCheck size={18} color="#fff" />}
              iconPosition="left"
              className="flex-1"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
