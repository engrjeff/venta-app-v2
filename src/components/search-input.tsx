import { SearchIcon, XIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

type SearchInputProps = {
  value: string

  /**
   * Fires immediately on every keystroke.
   */
  onValueChange: (value: string) => void

  /**
   * Fires after the debounce period.
   * Will only fire if the query is empty or has at least 3 characters.
   */
  onChange?: (value: string) => void

  placeholder?: string
  debounceMs?: number
  minLength?: number

  className?: string
}

export function SearchInput({
  value,
  onValueChange,
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
  minLength = 3,
  className,
}: SearchInputProps) {
  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      const query = value.trim()

      if (query.length > 0 && query.length < minLength) {
        return
      }

      onChange?.(query)
    }, debounceMs)

    return () => clearTimeout(timeout)
  }, [value, debounceMs, minLength, onChange])

  return (
    <InputGroup className={cn("max-w-sm", className)}>
      <InputGroupAddon>
        <SearchIcon className="size-4" />
      </InputGroupAddon>

      <InputGroupInput
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      />

      {value.length > 0 && (
        <InputGroupAddon align="inline-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => onValueChange("")}
          >
            <XIcon className="size-4" />
          </Button>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
