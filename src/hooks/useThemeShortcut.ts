// src/hooks/useThemeShortcut.ts
import { useEffect } from "react"
import { useTheme } from "./useTheme"

export function useThemeShortcut() {
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "j") {
        e.preventDefault()
        setTheme(theme === "dark" ? "light" : "dark")
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [theme, setTheme])
}