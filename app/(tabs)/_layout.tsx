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
  <View className="items-center justify-center px-2 py-1 min-w-[64px]">
    <View
      className={`p-2.5 rounded-xl mb-1 ${focused ? "bg-lime-400/20" : ""}`}
    >
      <Icon
        size={22}
        color={focused ? "#c8ff00" : "#94a3b8"}
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
    <Text
      className={`text-[11px] font-medium leading-tight ${
        focused ? "text-lime-600" : "text-slate-400"
      }`}
      numberOfLines={1}
      adjustsFontSizeToFit={true}
      minimumFontScale={0.8}
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
          height: Platform.OS === "ios" ? 88 : 72,
          paddingBottom: Math.max(insets.bottom, 12),
          paddingTop: 8,
          paddingHorizontal: 8,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 4,
        },
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
