import { View } from "react-native";
import { Href, Link } from "expo-router";
import { Text } from "@/components/ui/text";

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <Text variant={"h1"}>Rehearsal.AI</Text>
      <Text variant={"muted"}>Sign in to continue</Text>

      {/* TODO: Add login form */}
      <View className="my-8 flex-row items-center gap-2">
        <Text variant={"muted"}>Dont have an account?</Text>
        <Link href={"/register" as Href}>
          <Text>Sign up</Text>
        </Link>
      </View>

      <Text style={{ fontFamily: "Manrope-Bold" }}>This should be BOLD</Text>
      <Text className="font-sans-bold text-foreground">
        Tailwind should be BOLD
      </Text>
      <Text style={{ fontFamily: "InvalidFont" }}>
        This will fallback to system
      </Text>
    </View>
  );
}
