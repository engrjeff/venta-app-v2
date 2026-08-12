import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Branch } from "@/generated/prisma/browser"
import type { ComponentProps, PropsWithChildren } from "react"

interface EditBranchDialogProps extends PropsWithChildren<
  ComponentProps<typeof Sheet>
> {
  branch: Branch
}

export function EditBranchDialog({
  branch,
  children,
  ...sheetProps
}: EditBranchDialogProps) {
  return (
    <Sheet {...sheetProps}>
      <SheetContent className="gap-0">
        <SheetHeader>
          <SheetTitle>Update {branch.name}</SheetTitle>
          <SheetDescription>Make sure to save your changes.</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}
