import { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Href, Link, router } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Text } from "@/components/ui/text";
import { Logo } from "@/components/logo";
import { RHFInput } from "@/components/form/rhf-input";
import { login } from "@/api/auth";
import { ApiError } from "@/api/api";
import { useAuthStore } from "@/stores/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function EmailScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user } = await login(data);
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

  return (
    <View className="flex-1 bg-background p-6">
      <View className="flex-1 justify-center gap-4">
        <View className="items-center mb-8">
          <Logo size="lg" />
        </View>
        <Card className="w-full max-w-sm">
          <CardHeader className="flex-row">
            <View className="flex-1 gap-1.5">
              <CardTitle className="text-center">Welcome back</CardTitle>
              <CardDescription>
                <View className="flex-row items-center justify-center gap-2">
                  <Text className="text-muted-foreground">
                    Don't have an account?
                  </Text>
                  <Link href={"/register" as Href}>
                    <Text className="font-semi-bold">Sign up</Text>
                  </Link>
                </View>
              </CardDescription>
            </View>
          </CardHeader>
          <CardContent>
            <View className="w-full justify-center gap-4">
              <View className="gap-2">
                <RHFInput
                  control={control}
                  name="email"
                  label="Email"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <View className="gap-2">
                <RHFInput
                  control={control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  secureTextEntry
                />
              </View>
            </View>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            {error && (
              <View className="rounded-lg bg-destructive/10 p-3">
                <Text className="text-center text-destructive">{error}</Text>
              </View>
            )}
          </CardFooter>
        </Card>
        <Button
          className="w-full max-w-sm"
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-semi-bold text-primary-foreground">
              Sign in
            </Text>
          )}
        </Button>

        <Link href={"/forgot-password" as Href} className="self-center mt-8">
          <Text className="text-muted-foreground">Forgot password?</Text>
        </Link>
      </View>
    </View>
  );
}
