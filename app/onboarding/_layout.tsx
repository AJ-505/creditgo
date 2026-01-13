import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f8fafc' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="nin" />
      <Stack.Screen name="selfie" />
      <Stack.Screen name="employment-type" />
      <Stack.Screen name="employment-verify" />
      <Stack.Screen name="income" />
      <Stack.Screen name="expenses" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
