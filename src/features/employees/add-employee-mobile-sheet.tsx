import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { authClient } from "@/lib/auth-client"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { CreateEmployeeForm } from "./create-employee-form"

export function AddEmployeeMobileSheet() {
  const store = authClient.useActiveOrganization()

  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="fab"
            size="xl"
            aria-label="Add employee"
            className="fixed right-4 bottom-24 z-20"
          >
            <PlusIcon /> Add
          </Button>
        }
      />
      <SheetContent className="gap-0 data-[side=right]:w-full">
        <SheetHeader className="border-b">
          <SheetTitle className="text-base">New employee</SheetTitle>
        </SheetHeader>
        <CreateEmployeeForm
          storeId={store.data?.id as string}
          onAfterSave={() => setOpen(false)}
          submitLabel="Create employee"
          hideCancelButton
        />
      </SheetContent>
    </Sheet>
  )
}
