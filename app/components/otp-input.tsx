import { useRef, useState } from "react";
import { View, TextInput, Pressable } from "react-native";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  error = false,
}: OTPInputProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChange = (text: string, index: number) => {
    // Only allow numbers
    const sanitized = text.replace(/[^0-9]/g, "");

    if (sanitized.length > 1) {
      // Handle paste - fill from the beginning
      const chars = sanitized.slice(0, length).split("");
      const newValue = Array(length).fill("");
      chars.forEach((char, i) => {
        newValue[i] = char;
      });
      onChange(newValue.join(""));

      // Focus last filled input
      const nextIndex = Math.min(chars.length - 1, length - 1);
      inputRefs.current[nextIndex]?.focus();
    } else if (sanitized.length === 1) {
      // Single character input
      const newValue = value.split("");
      while (newValue.length < length) {
        newValue.push("");
      }
      newValue[index] = sanitized;
      onChange(newValue.join(""));

      // Move to next input
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      const newValue = value.split("");
      if (newValue[index]) {
        newValue[index] = "";
        onChange(newValue.join(""));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleBoxPress = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  return (
    <View className="flex-row gap-3">
      {Array.from({ length }).map((_, index) => {
        const isFocused = focusedIndex === index;
        const hasValue = !!value[index];

        return (
          <Pressable
            key={index}
            onPress={() => handleBoxPress(index)}
            className="flex-1"
          >
            <Input
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              value={value[index] || ""}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              keyboardType="number-pad"
              maxLength={length}
              selectTextOnFocus
              className={cn(
                "h-14 pb-2 items-center border px-0 text-center text-2xl font-semibold",
                isFocused && "border-primary",
                !isFocused && !error && "border-input",
                error && "border-destructive",
                hasValue && !isFocused && !error && "border-foreground/20",
              )}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
