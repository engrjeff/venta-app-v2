import { CheckIcon, MoreHorizontalIcon, XIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AttendanceRequestStatus } from "@/generated/prisma/enums"
import { ApproveRequestDialog } from "./approve-request-dialog"
import { DeclineRequestDialog } from "./decline-request-dialog"
import type { AttendanceRequestWithRelations } from "./request.types"

type RequestAction = "approve" | "decline"

export function RequestActions({
  request,
}: {
  request: AttendanceRequestWithRelations
}) {
  const [action, setAction] = useState<RequestAction>()

  function resetAction() {
    setAction(undefined)
  }

  if (request.status !== AttendanceRequestStatus.PENDING) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              aria-label="Request actions"
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
            <DropdownMenuItem onClick={() => setAction("approve")}>
              <CheckIcon /> Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setAction("decline")}
            >
              <XIcon /> Decline
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ApproveRequestDialog
        request={request}
        open={action === "approve"}
        onOpenChange={(isOpen) => {
          if (!isOpen) resetAction()
        }}
      />

      <DeclineRequestDialog
        request={request}
        open={action === "decline"}
        onOpenChange={(isOpen) => {
          if (!isOpen) resetAction()
        }}
      />
    </>
  )
}
