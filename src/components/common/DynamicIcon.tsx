// src/components/common/DynamicIcon.tsx
import * as LucideIcons from "lucide-react";
import * as TablerIcons from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type LucideIconName = keyof typeof LucideIcons;
type TablerIconName = keyof typeof TablerIcons;

interface DynamicIconProps {
  name: LucideIconName | TablerIconName | string;
  size?: number;
  stroke?: number;
  strokeWidth?: number;
  className?: string;
}

export function DynamicIcon({
  name,
  size = 20,
  stroke = 1.8,
  strokeWidth = 1.8,
  className,
}: DynamicIconProps) {
  const isTabler = String(name).startsWith("Icon");

  const IconComponent = isTabler
    ? TablerIcons[name as TablerIconName]
    : LucideIcons[name as LucideIconName];


  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return isTabler ? (
    <IconComponent
      size={size}
      stroke={stroke}
      className={cn(className)}
    />
  ) : (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      className={cn(className)}
    />
  );
}
