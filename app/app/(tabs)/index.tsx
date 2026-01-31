import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Href, router } from "expo-router";

export default function HomeScreen() {
  // TODO: Fetch sessions from API

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-4">
        <Text className="text-3xl font-bold text-foreground">Sessions</Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* TODO: Replace with real session list */}
        <Pressable
          onPress={() => router.push("/session/123" as Href)}
          className="bg-card border border-border rounded-lg p-4 mb-3 active:opacity-70"
        >
          <Text className="text-foreground font-semibold text-lg">
            Band Practice
          </Text>
          <Text className="text-muted-foreground mt-1">45 min • Yesterday</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/session/456" as Href)}
          className="bg-card border border-border rounded-lg p-4 mb-3 active:opacity-70"
        >
          <Text className="text-foreground font-semibold text-lg">
            Songwriting Session
          </Text>
          <Text className="text-muted-foreground mt-1">
            1h 20min • 3 days ago
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
