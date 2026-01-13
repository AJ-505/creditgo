import { Tabs } from "expo-router";
import { View, Text, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Search, Wallet, User, LucideIcon } from "lucide-react-native";

interface TabIconProps {
  Icon: LucideIcon;
  label: string;
  focused: boolean;
}

const TabIcon = ({ Icon, label, focused }: TabIconProps) => (
  <View className="items-center justify-center pt-2">
    <View className={`p-2 rounded-xl ${focused ? "bg-slate-900" : ""}`}>
      <Icon
        size={20}
        color={focused ? "#c8ff00" : "#94a3b8"}
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
    <Text
      className={`text-[10px] mt-1 ${focused ? "text-slate-900 font-semibold" : "text-slate-400"}`}
    >
      {label}
    </Text>
  </View>
);

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#f1f5f9",
          borderTopWidth: 1,
          height:
            (Platform.OS === "ios" ? 70 : 64) + Math.max(insets.bottom, 8),
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 5,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Home} label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Search} label="Explore" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Wallet} label="Wallet" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={User} label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
