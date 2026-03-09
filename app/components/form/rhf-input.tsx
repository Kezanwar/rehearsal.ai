import { View, TextInputProps } from "react-native";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

interface RHFInputProps<T extends FieldValues> extends Omit<
  TextInputProps,
  "value" | "onChangeText"
> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
}

export function RHFInput<T extends FieldValues>({
  control,
  name,
  label,
  className,
  ...props
}: RHFInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View className="gap-1.5">
          {label && (
            <Text className="text-sm font-medium text-foreground">{label}</Text>
          )}
          <Input
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            className={error ? "border-destructive" : ""}
            {...props}
          />
          {error?.message && (
            <Text className="text-sm text-destructive">{error.message}</Text>
          )}
        </View>
      )}
    />
  );
}
