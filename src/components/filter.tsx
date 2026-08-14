import { ListFilterIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

interface FilterOption {
  value: string
  label: string
}

interface FilterProps {
  label?: string
  options: FilterOption[]
}

export function Filter({ label = "Filter", options }: FilterProps) {
  const [selectedValues, setSelectedValues] = useState(() => new Set<string>())

  function handleSelection(filterValue: string) {
    const currentValues = new Set(selectedValues)
    if (currentValues.has(filterValue)) {
      currentValues.delete(filterValue)
    } else {
      currentValues.add(filterValue)
    }
    setSelectedValues(currentValues)
  }

  return (
    <div className="flex flex-col gap-4">
      <Popover>
        <PopoverTrigger
          render={
            <Button aria-label={label} size="sm" variant="outline">
              <ListFilterIcon aria-hidden="true" size={16} className="mr-1" />
              <span>{label}</span>
            </Button>
          }
        />
        <PopoverContent className="w-max p-0" side="bottom" align="start">
          <div>
            <div className="p-3 pb-0 text-xs font-medium text-muted-foreground">
              {label}
            </div>
            <div className="space-y-1 p-2">
              {options.map((option) => (
                <Label
                  key={option.value}
                  className="flex items-center gap-2 rounded-sm p-1 font-normal hover:bg-accent"
                  htmlFor={option.value}
                  onClick={() => handleSelection(option.value)}
                >
                  <Checkbox
                    id={option.value}
                    name={option.value}
                    checked={selectedValues.has(option.value)}
                  />
                  {option.label}
                </Label>
              ))}
            </div>
            <div className="flex justify-between gap-2 border-t p-2">
              <Button
                type="button"
                className="h-7 px-2"
                size="sm"
                variant="outline"
              >
                Clear
              </Button>
              <Button type="button" className="h-7 px-2" size="sm">
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
