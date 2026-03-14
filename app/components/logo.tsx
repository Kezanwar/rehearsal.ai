import { View } from "react-native";
import { Text } from "@/components/ui/text";
import Svg, { Rect } from "react-native-svg";
import { ACCENT, ACCENT_LIGHT } from "@/lib/theme";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizes = {
  sm: { container: 32, icon: 20, text: "text-lg" },
  md: { container: 40, icon: 24, text: "text-xl" },
  lg: { container: 56, icon: 50, text: "text-4xl" },
};

export function Logo({ size = "lg", showText = true }: LogoProps) {
  const { container, icon, text } = sizes[size];

  return (
    <View className=" items-center gap-1">
      <View
        className="items-center justify-center rounded-lg bg-accent/30"
        style={{ width: container, height: container }}
      >
        <Svg width={icon} height={icon} viewBox="0 0 26 22">
          <Rect x="2" y="9" width="2" height="6" rx="1" fill={ACCENT_LIGHT} />
          <Rect x="6" y="6" width="2" height="12" rx="1" fill={ACCENT} />
          <Rect x="10" y="4" width="2" height="16" rx="1" fill={ACCENT_LIGHT} />
          <Rect x="14" y="7" width="2" height="10" rx="1" fill={ACCENT} />
          <Rect x="18" y="5" width="2" height="14" rx="1" fill={ACCENT_LIGHT} />
          <Rect x="22" y="8" width="2" height="8" rx="1" fill={ACCENT} />
        </Svg>
      </View>
      {showText && (
        <View className="flex-row">
          <Text className={`${text} font-bold tracking-tight`}>Rehearsal</Text>
          <Text
            className={`${text} font-bold tracking-tight`}
            style={{ color: ACCENT }}
          >
            .AI
          </Text>
        </View>
      )}
    </View>
  );
}
