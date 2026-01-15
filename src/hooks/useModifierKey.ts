// src/hooks/useModifierKey.ts
import { useEffect, useState } from "react"

export type ModifierKey = "ctrl" | "meta" | "alt" | null

export function useModifierKey() {
  const [modifier, setModifier] = useState<ModifierKey>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey) setModifier("meta")      // ⌘
      else if (e.ctrlKey) setModifier("ctrl") // Ctrl
      else if (e.altKey) setModifier("alt")   // Alt / Option
    }

    const onKeyUp = () => setModifier(null)

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    window.addEventListener("blur", onKeyUp)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("blur", onKeyUp)
    }
  }, [])

  return modifier
}
