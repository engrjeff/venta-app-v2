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
import { AddBranchForm } from "./add-branch-form"

export function AddBranchDialog() {
  const [open, setOpen] = useState(false)

  const store = authClient.useActiveOrganization()

  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button size="sm">
            <PlusIcon /> Add Branch
          </Button>
        }
      />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Branch</SheetTitle>
          <SheetDescription>
            Fill in the form below to add a branch.
          </SheetDescription>
        </SheetHeader>

        {store.data?.id && (
          <AddBranchForm storeId={store.data.id} onAfterSave={close} />
        )}
      </SheetContent>
    </Sheet>
  )
}
