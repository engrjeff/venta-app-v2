import { useRouter } from "@tanstack/react-router"
import { LogOutIcon, MoreVerticalIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { getInitials } from "@/lib/utils"
import { useEmployeeSession } from "./use-employee-session"

export function EmployeeMenu() {
  const employeeSession = useEmployeeSession()
  const router = useRouter()

  if (!employeeSession.data) return null

  const employee = employeeSession.data

  const handleSignOut = async () => {
    await employeeSession.clear()
    await router.invalidate()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button size="icon" variant="secondary" aria-label="Employee menu">
            <MoreVerticalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5">
              <Avatar size="sm" className="bg-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(
                    employee.employeeFirstName,
                    employee.employeeLastName
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {employee.employeeFirstName} {employee.employeeLastName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  @{employee.employeeUsername}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
