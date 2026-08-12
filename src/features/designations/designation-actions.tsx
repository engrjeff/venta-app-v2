import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Designation } from "@/generated/prisma/browser"
import { EditIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react"
import { useState } from "react"
import { DeleteDesignationDialog } from "./delete-designation-dialog"
import { EditDesignationDialog } from "./edit-designation-dialog"
import { UpdateDesignationForm } from "./update-designation-form"

type DesignationAction = "edit" | "delete"

export function DesignationActions({
  designation,
}: {
  designation: Designation
}) {
  const [action, setAction] = useState<DesignationAction>()

  function resetAction() {
    setAction(undefined)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              aria-label="Actions"
              variant="ghost"
              size="icon-sm"
            >
              <MoreHorizontalIcon />
            </Button>
          }
        />
        <DropdownMenuContent className="min-w-max" side="left">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setAction("edit")}>
              <EditIcon /> Update
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setAction("delete")}
            >
              <TrashIcon /> Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* edit dialog */}
      <EditDesignationDialog
        designation={designation}
        open={action === "edit"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetAction()
          }
        }}
      >
        <UpdateDesignationForm
          designation={designation}
          onAfterSave={resetAction}
        />
      </EditDesignationDialog>

      {/* delete dialog */}
      <DeleteDesignationDialog
        designation={designation}
        open={action === "delete"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetAction()
          }
        }}
        onAafterSave={resetAction}
      />
    </>
  )
}
