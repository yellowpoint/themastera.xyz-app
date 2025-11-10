import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
  label?: string;
};

// A simple, shadcn-style spinner using the Loader2 icon
// Defaults to muted foreground color and includes an accessible label
export function Spinner({ className, label = "Loading..." }: SpinnerProps) {
  return (
    <span role="progressbar" aria-label={label} className="inline-flex items-center">
      <Loader2 className={cn("animate-spin text-muted-foreground", className)} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default Spinner;