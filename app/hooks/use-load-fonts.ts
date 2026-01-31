import { useFonts } from "expo-font";

export function useLoadFonts() {
  const [fontsLoaded] = useFonts({
    "Manrope-ExtraLight": require("@/assets/fonts/Manrope-ExtraLight.ttf"),
    "Manrope-Light": require("@/assets/fonts/Manrope-Light.ttf"),
    "Manrope-Regular": require("@/assets/fonts/Manrope-Regular.ttf"),
    "Manrope-Medium": require("@/assets/fonts/Manrope-Medium.ttf"),
    "Manrope-SemiBold": require("@/assets/fonts/Manrope-SemiBold.ttf"),
    "Manrope-Bold": require("@/assets/fonts/Manrope-Bold.ttf"),
    "Manrope-ExtraBold": require("@/assets/fonts/Manrope-ExtraBold.ttf"),
  });
  return fontsLoaded;
}
