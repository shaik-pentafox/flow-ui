// src/hooks/useTheme.ts
import { ThemeProviderContext } from "@/components/config/theme-context";
import { useContext, useEffect, useState } from "react";

type ResolvedTheme = "dark" | "light";

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (!context) throw new Error("useTheme must be used within a ThemeProvider");

  const getSystemTheme = (): ResolvedTheme => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  // React to OS theme changes
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => setSystemTheme(getSystemTheme());

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  // THIS is the processed value
  const resolvedTheme: ResolvedTheme = context.theme === "system" ? systemTheme : context.theme;

  return {
    ...context,

    // processed values
    resolvedTheme,
    isDarkMode: resolvedTheme === "dark",
    isLightMode: resolvedTheme === "light",
  };
};
