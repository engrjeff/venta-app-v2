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
import type { Branch } from "@/generated/prisma/browser"
import { EditIcon, EyeIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react"
import { useState } from "react"
import { DeleteBranchDialog } from "./delete-branch-dialog"
import { EditBranchDialog } from "./edit-branch-dialog"
import { UpdateBranchForm } from "./updated-branch-form"
import { ViewBranchDialog } from "./view-branch-dialog"

type BranchAction = "view" | "edit" | "delete"

export function BranchActions({ branch }: { branch: Branch }) {
  const [action, setAction] = useState<BranchAction>()

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
            <DropdownMenuItem onClick={() => setAction("view")}>
              <EyeIcon /> View
            </DropdownMenuItem>
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

      {/* view dialog */}
      <ViewBranchDialog
        branch={branch}
        open={action === "view"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetAction()
          }
        }}
      />

      {/* edit dialog */}
      <EditBranchDialog
        branch={branch}
        open={action === "edit"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetAction()
          }
        }}
      >
        <UpdateBranchForm branch={branch} onAfterSave={resetAction} />
      </EditBranchDialog>

      {/* delete dialog */}
      <DeleteBranchDialog
        branch={branch}
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
