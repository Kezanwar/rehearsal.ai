import { View, Text, Pressable, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Moon, Sun, LogOut, User, CreditCard } from "lucide-react-native";

import { useColorScheme } from "@/lib/color-scheme";
import { THEME } from "@/lib/theme";

export default function SettingsScreen() {
  const { isDark } = useColorScheme();
  const theme = isDark ? THEME.dark : THEME.light;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-4">
        <Text className="text-3xl font-bold text-foreground">Settings</Text>
      </View>

      <View className="px-6">
        {/* Profile */}
        <Pressable className="flex-row items-center py-4 border-b border-border">
          <User color={theme.foreground} size={24} />
          <View className="ml-4 flex-1">
            <Text className="text-foreground font-medium">Profile</Text>
            <Text className="text-muted-foreground text-sm">
              Manage your account
            </Text>
          </View>
        </Pressable>

        {/* Credits */}
        <Pressable className="flex-row items-center py-4 border-b border-border">
          <CreditCard color={theme.foreground} size={24} />
          <View className="ml-4 flex-1">
            <Text className="text-foreground font-medium">Credits</Text>
            <Text className="text-muted-foreground text-sm">
              3 credits remaining
            </Text>
          </View>
        </Pressable>

        {/* Dark Mode */}
        {/* <View className="flex-row items-center py-4 border-b border-border">
          {isDark ? (
            <Moon color={theme.foreground} size={24} />
          ) : (
            <Sun color={theme.foreground} size={24} />
          )}
          <View className="ml-4 flex-1">
            <Text className="text-foreground font-medium">Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleColorScheme}
            trackColor={{ false: theme.muted, true: theme.primary }}
          />
        </View> */}

        {/* Logout */}
        <Pressable className="flex-row items-center py-4">
          <LogOut color={theme.destructive} size={24} />
          <Text className="ml-4 text-destructive font-medium">Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
