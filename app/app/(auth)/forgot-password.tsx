import { View, Text } from "react-native";
import { Href, Link } from "expo-router";

export default function ForgotPasswordScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <Text className="text-3xl font-bold text-foreground mb-8">
        Reset Password
      </Text>
      <Text className="text-muted-foreground mb-8">
        Enter your email to reset your password
      </Text>

      {/* TODO: Add forgot password form */}

      <Link href={"/" as Href} className="mt-4">
        <Text className="text-primary">Back to sign in</Text>
      </Link>
    </View>
  );
}
