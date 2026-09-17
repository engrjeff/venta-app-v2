import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { authClient } from "@/lib/auth-client"
import { getInitials } from "@/lib/utils"
import { useNavigate, useRouter } from "@tanstack/react-router"
import {
  ChevronLeftIcon,
  ClockIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { DeleteEmployeeDialog } from "./delete-employee-dialog"
import { EditEmployeeDialog } from "./edit-employee-dialog"
import type { ExtendedEmployee } from "./employee.types"
import { UpdateEmployeeForm } from "./update-employee-form"

type MobileAction = "edit" | "delete"

export function EmployeeMobileHeader({
  employee,
}: {
  employee: ExtendedEmployee
}) {
  const router = useRouter()
  const navigate = useNavigate()
  const store = authClient.useActiveOrganization()

  const [menuOpen, setMenuOpen] = useState(false)
  const [action, setAction] = useState<MobileAction>()

  function resetAction() {
    setAction(undefined)
  }

  function handleCopyPortalLink() {
    const slug = store.data?.slug
    if (!slug || !navigator.clipboard) return

    navigator.clipboard
      .writeText(`${window.location.origin}/e/${slug}`)
      .then(() => toast.info("Copied to clipboard", { richColors: false }))

    setMenuOpen(false)
  }

  return (
    <>
      <div className="flex items-center gap-2 px-4 py-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Back"
          onClick={() => router.history.back()}
        >
          <ChevronLeftIcon />
        </Button>

        <p className="flex-1 text-lg font-semibold">Employee</p>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Actions"
          onClick={() => setMenuOpen(true)}
        >
          <MoreHorizontalIcon />
        </Button>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="bottom" className="gap-4 rounded-t-2xl">
          <SheetHeader className="border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="text-xs font-semibold">
                  {getInitials(employee.firstName, employee.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle>
                  {employee.firstName} {employee.lastName}
                </SheetTitle>
                <p className="text-sm text-muted-foreground">
                  {employee.username} &middot; {employee.designation.name}
                </p>
              </div>
            </div>
          </SheetHeader>

          <ItemGroup className="gap-0 px-4 pb-4">
            <Item
              size="sm"
              onClick={() => {
                setMenuOpen(false)
                setAction("edit")
              }}
            >
              <ItemMedia variant="icon">
                <PencilIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Edit details</ItemTitle>
              </ItemContent>
            </Item>
            <Item
              size="sm"
              onClick={() => {
                setMenuOpen(false)
                navigate({
                  to: "/timesheet",
                  search: {
                    employees: { operator: "is", value: [employee.id] },
                  },
                })
              }}
            >
              <ItemMedia variant="icon">
                <ClockIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>View timesheet</ItemTitle>
              </ItemContent>
            </Item>
            <Item size="sm" onClick={handleCopyPortalLink}>
              <ItemMedia variant="icon">
                <UserIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Copy portal link</ItemTitle>
              </ItemContent>
            </Item>

            <ItemSeparator />

            <Item
              size="sm"
              className="text-destructive"
              onClick={() => {
                setMenuOpen(false)
                setAction("delete")
              }}
            >
              <ItemMedia variant="icon">
                <TrashIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Delete employee</ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </SheetContent>
      </Sheet>

      <EditEmployeeDialog
        employee={employee}
        open={action === "edit"}
        onOpenChange={(isOpen) => {
          if (!isOpen) resetAction()
        }}
      >
        <UpdateEmployeeForm employee={employee} onAfterSave={resetAction} />
      </EditEmployeeDialog>

      <DeleteEmployeeDialog
        employee={employee}
        open={action === "delete"}
        onOpenChange={(isOpen) => {
          if (!isOpen) resetAction()
        }}
        onAafterSave={() => {
          resetAction()
          navigate({ to: "/employees" })
        }}
      />
    </>
  )
}
