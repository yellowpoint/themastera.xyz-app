import * as React from "react"

import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input"> & {
  debounceDelay?: number
  onDebouncedValueChange?: (value: string) => void
}

function Input({
  className,
  type,
  debounceDelay = 400,
  onDebouncedValueChange,
  onChange,
  ...rest
}: InputProps) {
  const timerRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
    if (onDebouncedValueChange) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
      const value = e.target.value
      timerRef.current = window.setTimeout(() => {
        onDebouncedValueChange(value)
      }, debounceDelay)
    }
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      onChange={handleChange}
      {...rest}
    />
  )
}

export { Input }
