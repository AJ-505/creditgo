import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import {
  Camera,
  ArrowLeft,
  RefreshCw,
  Check,
  ShieldCheck,
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

  // Camera permissions
  const [permission, requestPermission] = useCameraPermissions();
  const [facing] = useState<CameraType>("front");

  // Photo states
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Countdown for guided capture
  const [countdown, setCountdown] = useState<number | null>(null);

  // Refs
  const cameraRef = useRef<CameraView>(null);

  // Auto-capture with countdown
  const startCountdownCapture = () => {
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      takePicture();
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);

    try {
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        base64: false,
      });

      if (result?.uri) {
        // Crop to center (face area) - assumes face is centered
        const croppedUri = await cropToFaceArea(
          result.uri,
          result.width,
          result.height,
        );
        setPhoto(croppedUri);
      }
    } catch (error) {
      console.error("Capture error:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  // Crop the image to the center area (simulating face crop)
  const cropToFaceArea = async (
    uri: string,
    imageWidth: number,
    imageHeight: number,
  ): Promise<string> => {
    try {
      // Calculate center crop (face area)
      // Crop to center 60% of the image, focused on upper portion (where face typically is)
      const cropWidthRatio = 0.6;
      const cropHeightRatio = 0.5;

      const cropWidth = imageWidth * cropWidthRatio;
      const cropHeight = imageHeight * cropHeightRatio;

      // Center horizontally, but bias towards top for face
      const cropX = (imageWidth - cropWidth) / 2;
      const cropY = imageHeight * 0.1; // Start from 10% from top

      const manipulated = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            crop: {
              originX: Math.round(cropX),
              originY: Math.round(cropY),
              width: Math.round(cropWidth),
              height: Math.round(cropHeight),
            },
          },
          {
            resize: {
              width: 600,
            },
          },
        ],
        {
          compress: 0.85,
          format: ImageManipulator.SaveFormat.JPEG,
        },
      );

      return manipulated.uri;
    } catch (error) {
      console.error("Cropping error:", error);
      return uri;
    }
  };

  // Manual capture
  const takePictureManually = () => {
    if (countdown !== null) return; // Already counting down
    startCountdownCapture();
  };

  // Verify identity after photo is taken
  useEffect(() => {
    if (!photo || isVerified || isVerifying) return;

    const runVerification = async () => {
      setIsVerifying(true);

      const success = await simulateBiometricVerification();

      if (success) {
        setIsVerified(true);
        updateUser({
          selfieUri: photo,
          isIdentityVerified: true,
        });
        updateVerificationStatus({ identity: true });
      }

      setIsVerifying(false);
    };

    runVerification();
  }, [photo, isVerified, isVerifying, updateUser, updateVerificationStatus]);

  // Auto-navigate after verification
  useEffect(() => {
    if (!isVerified) return;

    const timer = setTimeout(() => {
      router.push("/onboarding/employment-type");
    }, 2000);

    return () => clearTimeout(timer);
  }, [isVerified, router]);

  const retakePicture = () => {
    setPhoto(null);
    setIsVerified(false);
    setCountdown(null);
  };

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
          <View className="flex-1">
            <Image
              source={{ uri: photo }}
              className="flex-1"
              resizeMode="cover"
            />

            {isVerifying && (
              <View className="absolute inset-0 bg-black/70 items-center justify-center">
                <ActivityIndicator size="large" color="#22c55e" />
                <Text className="text-white text-lg font-medium mt-4">
                  Verifying your identity...
                </Text>
                <Text className="text-gray-400 text-sm mt-2">
                  This usually takes a few seconds
                </Text>
              </View>
            )}

            {isVerified && !isVerifying && (
              <View className="absolute inset-0 bg-black/70 items-center justify-center">
                <View className="w-24 h-24 bg-primary-500 rounded-full items-center justify-center mb-4">
                  <ShieldCheck size={48} color="#ffffff" />
                </View>
                <Text className="text-white text-2xl font-bold">
                  Identity Verified!
                </Text>
                <Text className="text-gray-300 text-base mt-2 text-center px-8">
                  Redirecting to next step...
                </Text>
                <ActivityIndicator
                  size="small"
                  color="#22c55e"
                  style={{ marginTop: 16 }}
                />
              </View>
            )}
          </View>
        ) : (
          <View className="flex-1">
            <CameraView
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              facing={facing}
            >
              <View className="flex-1 items-center justify-center">
                {/* Face guide oval */}
                <View style={styles.faceOval} />

                {/* Countdown overlay */}
                {countdown !== null && (
                  <View className="absolute inset-0 bg-black/50 items-center justify-center">
                    <View className="w-32 h-32 bg-white/20 rounded-full items-center justify-center">
                      <Text className="text-white text-6xl font-bold">
                        {countdown}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Capturing indicator */}
                {isCapturing && (
                  <View className="absolute inset-0 bg-black/50 items-center justify-center">
                    <ActivityIndicator size="large" color="#fff" />
                    <Text className="text-white text-lg mt-4">
                      Capturing...
                    </Text>
                  </View>
                )}

                {/* Instructions */}
                {countdown === null && !isCapturing && (
                  <Text className="text-white text-center mt-6 px-8 text-base">
                    Position your face within the oval and tap the button
                  </Text>
                )}
              </View>
            </CameraView>
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View className="px-6 py-6 bg-dark-900">
        {!photo ? (
          <View className="items-center">
            <TouchableOpacity
              onPress={takePictureManually}
              className="w-20 h-20 bg-white rounded-full items-center justify-center border-4 border-primary-500"
              activeOpacity={0.8}
              disabled={isCapturing || countdown !== null}
            >
              {countdown !== null ? (
                <Text className="text-primary-500 text-2xl font-bold">
                  {countdown}
                </Text>
              ) : (
                <Camera size={32} color="#22c55e" />
              )}
            </TouchableOpacity>
            <Text className="text-gray-400 text-sm mt-3">
              Tap to start 3-second countdown
            </Text>
          </View>
        ) : isVerified ? (
          <Button
            title="Continue"
            onPress={() => router.push("/onboarding/employment-type")}
            icon={<Check size={20} color="#fff" />}
            iconPosition="left"
            size="lg"
          />
        ) : (
          <View className="flex-row gap-4">
            <Button
              title="Retake"
              onPress={retakePicture}
              variant="outline"
              icon={<RefreshCw size={18} color="#22c55e" />}
              iconPosition="left"
              className="flex-1"
              disabled={isVerifying}
            />
            <Button
              title={isVerifying ? "Verifying…" : "Processing…"}
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

const styles = StyleSheet.create({
  faceOval: {
    width: 256,
    height: 320,
    borderWidth: 4,
    borderRadius: 160,
    borderColor: "rgba(255,255,255,0.6)",
    backgroundColor: "transparent",
  },
});
