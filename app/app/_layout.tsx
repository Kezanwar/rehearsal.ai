import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@react-navigation/native";
import { View } from "react-native";

import { ColorSchemeProvider, useColorScheme } from "@/lib/color-scheme";
import { NAV_THEME } from "@/lib/theme";
import { AuthInitializer } from "@/components/auth-initializer";
import { useLoadFonts } from "@/hooks/use-load-fonts";

function RootLayoutNav() {
  const { colorScheme, isDark } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View className={`flex-1 ${isDark ? "dark" : ""}`}>
        <AuthInitializer>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="session" />
          </Stack>
        </AuthInitializer>
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const fontsLoaded = useLoadFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ColorSchemeProvider>
      <RootLayoutNav />
    </ColorSchemeProvider>
  );
}
