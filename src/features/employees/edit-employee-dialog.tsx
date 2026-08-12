import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { ComponentProps, PropsWithChildren } from "react"
import type { ExtendedEmployee } from "./employee.types"

interface EditEmployeeDialogProps extends PropsWithChildren<
  ComponentProps<typeof Sheet>
> {
  employee: ExtendedEmployee
}

export function EditEmployeeDialog({
  employee,
  children,
  ...sheetProps
}: EditEmployeeDialogProps) {
  return (
    <Sheet {...sheetProps}>
      <SheetContent className="gap-0">
        <SheetHeader>
          <SheetTitle>
            Update {employee.firstName} {employee.lastName}
          </SheetTitle>
          <SheetDescription>Make sure to save your changes.</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}
