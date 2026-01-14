import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions,
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
      // Crop to center 70% width and 60% height, focused on upper-center portion
      const cropWidthRatio = 0.7;
      const cropHeightRatio = 0.6;

      const cropWidth = imageWidth * cropWidthRatio;
      const cropHeight = imageHeight * cropHeightRatio;

      // Center horizontally, bias towards top for face
      const cropX = (imageWidth - cropWidth) / 2;
      const cropY = imageHeight * 0.08; // Start from 8% from top

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
    if (countdown !== null) return;
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
          <Text className="text-xl font-inter-bold text-dark-800 text-center mb-2">
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
          // Photo Preview - Fixed layout
          <View style={styles.photoPreviewContainer}>
            <Image
              source={{ uri: photo }}
              style={styles.photoPreview}
              resizeMode="contain"
            />

            {/* Verification Overlay */}
            {isVerifying && (
              <View style={styles.overlay}>
                <ActivityIndicator size="large" color="#22c55e" />
                <Text className="text-white text-lg font-inter-medium mt-4">
                  Verifying your identity...
                </Text>
                <Text className="text-gray-400 text-sm mt-2">
                  This usually takes a few seconds
                </Text>
              </View>
            )}

            {/* Verified Overlay */}
            {isVerified && !isVerifying && (
              <View style={styles.overlay}>
                <View className="w-24 h-24 bg-primary-500 rounded-full items-center justify-center mb-4">
                  <ShieldCheck size={48} color="#ffffff" />
                </View>
                <Text className="text-white text-2xl font-inter-bold">
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
          // Camera View - Fixed to not use children
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              facing={facing}
            />

            {/* Overlay elements - Positioned absolutely OUTSIDE CameraView */}
            <View style={styles.cameraOverlay} pointerEvents="box-none">
              {/* Face guide oval */}
              <View style={styles.faceGuideContainer}>
                <View style={styles.faceOval} />

                {/* Instructions */}
                {countdown === null && !isCapturing && (
                  <Text style={styles.instructionText}>
                    Position your face within the oval and tap the button
                  </Text>
                )}
              </View>

              {/* Countdown overlay */}
              {countdown !== null && (
                <View style={styles.countdownOverlay}>
                  <View style={styles.countdownCircle}>
                    <Text style={styles.countdownText}>{countdown}</Text>
                  </View>
                </View>
              )}

              {/* Capturing indicator */}
              {isCapturing && (
                <View style={styles.countdownOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                  <Text style={styles.capturingText}>Capturing...</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View className="px-6 py-6 bg-dark-900">
        {!photo ? (
          <View className="items-center">
            <TouchableOpacity
              onPress={takePictureManually}
              style={styles.captureButton}
              activeOpacity={0.8}
              disabled={isCapturing || countdown !== null}
            >
              {countdown !== null ? (
                <Text style={styles.captureButtonCountdown}>{countdown}</Text>
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
  // Camera container
  cameraContainer: {
    flex: 1,
    position: "relative",
  },

  // Camera overlay - sits on top of camera but outside CameraView component
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },

  // Face guide positioning
  faceGuideContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  faceOval: {
    width: 256,
    height: 320,
    borderWidth: 4,
    borderRadius: 160,
    borderColor: "rgba(255,255,255,0.6)",
    backgroundColor: "transparent",
  },

  instructionText: {
    color: "#ffffff",
    textAlign: "center",
    marginTop: 24,
    paddingHorizontal: 32,
    fontSize: 16,
  },

  // Countdown overlay
  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },

  countdownCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  countdownText: {
    color: "#ffffff",
    fontSize: 64,
    fontWeight: "bold",
  },

  capturingText: {
    color: "#ffffff",
    fontSize: 18,
    marginTop: 16,
  },

  // Photo preview
  photoPreviewContainer: {
    flex: 1,
    backgroundColor: "#000",
    position: "relative",
  },

  photoPreview: {
    flex: 1,
    width: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Capture button
  captureButton: {
    width: 80,
    height: 80,
    backgroundColor: "#ffffff",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#22c55e",
  },

  captureButtonCountdown: {
    color: "#22c55e",
    fontSize: 24,
    fontWeight: "bold",
  },
});
