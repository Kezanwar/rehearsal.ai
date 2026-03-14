import { useState } from "react";
import {
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/otp-input";
import { verifyOTP, resendOTP } from "@/api/auth";
import { ApiError } from "@/api/api";
import { useAuthStore } from "@/stores/auth";

export default function VerifyOTPScreen() {
  const params = useLocalSearchParams();
  const email = params.email as string;

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { user, access_token } = await verifyOTP({ email, otp });
      setUser(user);
      router.replace("/(tabs)");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError(null);
    setOtp("");

    try {
      await resendOTP({ email });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to resend code");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 py-12 px-6 justify-between">
        <View className="gap-8 mt-4">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Check your email
            </Text>
            <Text className="text-muted-foreground">
              We sent a verification code to {email}
            </Text>
          </View>

          <View className="gap-4">
            <OTPInput value={otp} onChange={setOtp} error={!!error} />

            {error && (
              <View className="rounded-lg bg-destructive/10 p-3">
                <Text className="text-center text-destructive">{error}</Text>
              </View>
            )}

            <Button
              variant="ghost"
              onPress={handleResend}
              disabled={isResending}
            >
              {isResending ? <ActivityIndicator /> : <Text>Resend code</Text>}
            </Button>
          </View>
        </View>

        <View className="gap-2">
          <Button variant="ghost" onPress={() => router.back()}>
            <Text>Go Back</Text>
          </Button>
          <Button
            onPress={handleVerify}
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-semi-bold text-primary-foreground">
                Continue
              </Text>
            )}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
