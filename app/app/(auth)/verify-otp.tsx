import { View, Text } from "react-native";

export default function VerifyOTPScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <Text className="text-3xl font-bold text-foreground mb-8">
        Verify Email
      </Text>
      <Text className="text-muted-foreground mb-8">
        Enter the code we sent you
      </Text>

      {/* TODO: Add OTP input */}
    </View>
  );
}
