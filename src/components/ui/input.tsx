import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  leftSectionWidth?: number;
  rightSectionWidth?: number;
};

function Input({ className, type, leftSection, rightSection, leftSectionWidth = 36, rightSectionWidth = 36, ...props }: InputProps) {
  return (
    <span className="relative inline-flex w-full items-center">
      {leftSection && (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center text-muted-foreground" style={{ width: leftSectionWidth }}>
          {leftSection}
        </span>
      )}

      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
          "dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border dark:border-border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          leftSection && `pl-[${leftSectionWidth}px]`,
          rightSection && `pr-[${rightSectionWidth}px]`,
          className
        )}
        {...props}
      />

      {rightSection && (
        <span className="absolute inset-y-0 right-0 flex items-center justify-center text-muted-foreground" style={{ width: rightSectionWidth }}>
          {rightSection}
        </span>
      )}
    </span>
  );
}

export { Input };
