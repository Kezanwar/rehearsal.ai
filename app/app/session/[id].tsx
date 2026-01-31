import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Play, Share2, Download } from "lucide-react-native";

import { useColorScheme } from "@/lib/color-scheme";
import { THEME } from "@/lib/theme";

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useColorScheme();
  const theme = isDark ? THEME.dark : THEME.light;

  // TODO: Fetch session data from API

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="py-4">
          <Text className="text-2xl font-bold text-foreground">
            Band Practice
          </Text>
          <Text className="text-muted-foreground mt-1">45 min • Yesterday</Text>
        </View>

        {/* Player */}
        <View className="bg-card border border-border rounded-lg p-6 items-center mb-6">
          <Pressable className="w-16 h-16 rounded-full bg-primary items-center justify-center mb-4">
            <Play
              color={theme.primaryForeground}
              size={28}
              fill={theme.primaryForeground}
            />
          </Pressable>
          <Text className="text-foreground">00:00 / 45:00</Text>
        </View>

        {/* Actions */}
        <View className="flex-row gap-3 mb-6">
          <Pressable className="flex-1 flex-row items-center justify-center bg-secondary py-3 rounded-lg">
            <Share2 color={theme.secondaryForeground} size={20} />
            <Text className="text-secondary-foreground ml-2 font-medium">
              Share
            </Text>
          </Pressable>
          <Pressable className="flex-1 flex-row items-center justify-center bg-secondary py-3 rounded-lg">
            <Download color={theme.secondaryForeground} size={20} />
            <Text className="text-secondary-foreground ml-2 font-medium">
              Export
            </Text>
          </Pressable>
        </View>

        {/* Summary */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-2">
            Summary
          </Text>
          <View className="bg-card border border-border rounded-lg p-4">
            <Text className="text-foreground leading-6">
              Worked on the bridge section of "New Song". Discussed chord
              progression changes. Need to practice the transition at 2:45. Good
              energy overall.
            </Text>
          </View>
        </View>

        {/* Transcript */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-2">
            Transcript
          </Text>
          <View className="bg-card border border-border rounded-lg p-4">
            <View className="mb-3">
              <Text className="text-muted-foreground text-sm">
                0:00 - Speaker 1
              </Text>
              <Text className="text-foreground mt-1">
                Alright, lets take it from the top...
              </Text>
            </View>
            <View className="mb-3">
              <Text className="text-muted-foreground text-sm">
                0:15 - Speaker 2
              </Text>
              <Text className="text-foreground mt-1">
                Should we try a different tempo?
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
