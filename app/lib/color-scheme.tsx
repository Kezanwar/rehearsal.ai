import { createContext, useContext } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

type ColorScheme = "light" | "dark";

interface ColorSchemeContextType {
  colorScheme: ColorScheme;
  isDark: boolean;
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(
  undefined,
);

export function ColorSchemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemScheme = useSystemColorScheme();
  const colorScheme = systemScheme ?? "light";

  return (
    <ColorSchemeContext.Provider
      value={{
        colorScheme,
        isDark: colorScheme === "dark",
      }}
    >
      {children}
    </ColorSchemeContext.Provider>
  );
}

export function useColorScheme() {
  const context = useContext(ColorSchemeContext);
  if (!context) {
    throw new Error("useColorScheme must be used within ColorSchemeProvider");
  }
  return context;
}
