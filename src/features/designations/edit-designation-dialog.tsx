import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Designation } from "@/generated/prisma/browser"
import type { ComponentProps, PropsWithChildren } from "react"

interface EditDesignationDialogProps extends PropsWithChildren<
  ComponentProps<typeof Sheet>
> {
  designation: Designation
}

export function EditDesignationDialog({
  designation,
  children,
  ...sheetProps
}: EditDesignationDialogProps) {
  return (
    <Sheet {...sheetProps}>
      <SheetContent className="gap-0">
        <SheetHeader>
          <SheetTitle>Update {designation.name}</SheetTitle>
          <SheetDescription>Make sure to save your changes.</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}
