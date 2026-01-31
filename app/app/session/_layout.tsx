import { Stack } from "expo-router";

export default function SessionLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          headerTitle: "Session",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
