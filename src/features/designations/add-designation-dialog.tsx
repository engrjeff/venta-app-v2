import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
// import { authClient } from "@/lib/auth-client"
import { PlusIcon } from "lucide-react"
import { useState } from "react"

export function AddDesignationDialog() {
  const [open, setOpen] = useState(false)

  //   const store = authClient.useActiveOrganization()

  //   const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button size="sm">
            <PlusIcon /> Add Designation
          </Button>
        }
      />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Designation</SheetTitle>
          <SheetDescription>
            Fill in the form below to add a designation.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
