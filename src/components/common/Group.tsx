// src/components/common/Group.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

type GroupProps = React.HTMLAttributes<HTMLDivElement> & {
  gap?: "xs" | "sm" | "md" | "lg" | number
  position?: "left" | "center" | "right" | "apart"
  align?: "start" | "center" | "end"
  wrap?: boolean
  grow?: boolean
}

const gapMap = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
}

const positionMap = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
  apart: "justify-between",
}

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
}

export const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  (
    {
      className,
      gap = "md",
      position = "left",
      align = "center",
      wrap = true,
      grow = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          wrap ? "flex-wrap" : "flex-nowrap",
          positionMap[position],
          alignMap[align],
          typeof gap === "number" ? undefined : gapMap[gap],
          grow && "[&>*]:flex-1",
          className
        )}
        style={typeof gap === "number" ? { gap } : undefined}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Group.displayName = "Group"
