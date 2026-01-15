// src/components/common/KbdPro.tsx
import { cn } from "@/lib/utils"
import { useModifierKey } from "@/hooks/useModifierKey"

type KeyToken = "ctrl" | "alt" | "meta" | "shift" | string

type KbdProps = {
  /** Example: ["alt", "S", "A"] */
  keys: KeyToken[]
  className?: string
}

export function KbdPro({ keys, className }: KbdProps) {
  const activeModifier = useModifierKey()
  const isMac = navigator.platform.toUpperCase().includes("MAC")

  const modifierMap: Record<string, string> = {
    ctrl: isMac ? "⌘" : "Ctrl",
    meta: "⌘",
    alt: isMac ? "⌥" : "Alt",
    shift: isMac ? "⇧" : "Shift",
  }

  return (
    <div
      className={cn(
        "ml-auto flex items-center gap-1 opacity-0 transition-opacity",
        // "group-hover:opacity-100",
        activeModifier && "opacity-100",
        className
      )}
    >
      {keys.map((key, index) => (
        <kbd
          key={index}
          className="inline-flex items-center rounded border bg-muted px-1.5 text-[10px] font-mono text-muted-foreground"
        >
          {modifierMap[key.toLowerCase()] ?? key.toUpperCase()}
        </kbd>
      ))}
    </div>
  )
}
