import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { authClient } from "@/lib/auth-client"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { CreateEmployeeForm } from "./create-employee-form"

export function AddEmployeeDialog() {
  const [open, setOpen] = useState(false)

  const store = authClient.useActiveOrganization()

  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button size="sm">
            <PlusIcon /> Add Employee
          </Button>
        }
      />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Employee</SheetTitle>
          <SheetDescription>
            Fill in the form below to add an employee.
          </SheetDescription>
        </SheetHeader>
        <CreateEmployeeForm
          storeId={store.data?.id as string}
          onAfterSave={close}
        />
      </SheetContent>
    </Sheet>
  )
}
