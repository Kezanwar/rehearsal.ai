import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mic } from "lucide-react-native";

import { useColorScheme } from "@/lib/color-scheme";
import { THEME } from "@/lib/theme";

export default function RecordScreen() {
  const { isDark } = useColorScheme();
  const theme = isDark ? THEME.dark : THEME.light;

  // TODO: Implement recording with expo-audio

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-bold text-foreground mb-4">Record</Text>
        <Text className="text-muted-foreground mb-12 text-center">
          Tap the button to start recording your rehearsal
        </Text>

        <Pressable
          className="w-24 h-24 rounded-full bg-primary items-center justify-center active:opacity-70"
          onPress={() => {
            // TODO: Start/stop recording
          }}
        >
          <Mic color={theme.primaryForeground} size={40} />
        </Pressable>

        <Text className="text-muted-foreground mt-8">00:00:00</Text>
      </View>
    </SafeAreaView>
  );
}
