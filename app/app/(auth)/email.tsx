import { useState } from "react";
import {
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Href, router } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Text } from "@/components/ui/text";
import { RHFInput } from "@/components/form/rhf-input";
import { Button } from "@/components/ui/button";
import { sendEmailOTP } from "@/api/auth";
import { ApiError } from "@/api/api";

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

export default function EmailScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await sendEmailOTP({ email: data.email });
      router.push(
        `/otp?email=${encodeURIComponent(res.email)}&is_new_user=${res.is_new_user}` as Href,
      );
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

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 py-12 px-6 justify-between">
        <View className="gap-8 mt-4">
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Hello</Text>
            <Text className="text-muted-foreground">
              Please enter your email address
            </Text>
          </View>

          <RHFInput
            control={control}
            name="email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View className="gap-2">
          {error && (
            <View className="rounded-lg bg-destructive/10 p-3">
              <Text className="text-center text-destructive">{error}</Text>
            </View>
          )}
          <Button variant="ghost" onPress={() => router.back()}>
            <Text>Go Back</Text>
          </Button>
          <Button onPress={handleSubmit(onSubmit)} disabled={isLoading}>
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
