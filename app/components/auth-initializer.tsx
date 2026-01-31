import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { restoreSession } from "@/api/api";
import { initialize } from "@/api/auth";
import { useAuthStore } from "@/stores/auth";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  const { isAuthenticated, isInitialized, setUser, setInitialized } =
    useAuthStore();

  // Restore session on mount
  useEffect(() => {
    const init = async () => {
      try {
        const token = await restoreSession();

        if (!token) {
          setInitialized(true);
          setIsLoading(false);
          return;
        }

        const { user } = await initialize();

        setUser(user);
      } catch (error) {
        // Token invalid or expired - just continue to login
        setInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isInitialized) {
      const inAuthGroup = segments[0] === "(auth)";

      if (isAuthenticated && inAuthGroup) {
        // Logged in but on auth screen - go to tabs
        router.replace("/(tabs)");
      } else if (!isAuthenticated && !inAuthGroup) {
        // Not logged in and not on auth screen - go to login
        router.replace("/(auth)");
      }
    }
  }, [isAuthenticated, isInitialized, segments]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
}
