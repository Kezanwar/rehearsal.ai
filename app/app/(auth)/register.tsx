import { View } from "react-native";
import { Href, Link } from "expo-router";
import { Text } from "@/components/ui/text";

export default function RegisterScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <Text variant={"h3"}>Create Account</Text>

      {/* TODO: Add register form */}

      <Link href={"/" as Href} className="mt-4">
        <Text variant={"p"}>Already have an account? Sign in</Text>
      </Link>
    </View>
  );
}
