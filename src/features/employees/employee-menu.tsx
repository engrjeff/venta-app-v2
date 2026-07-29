import { useRouter } from "@tanstack/react-router"
import { LogOutIcon, LogsIcon } from "lucide-react"

import { useEmployeeSession } from "./use-employee-session"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
          <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
            <Avatar className="bg-primary">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(
                  employee.employeeFirstName,
                  employee.employeeLastName
                )}
              </AvatarFallback>
            </Avatar>
          </button>
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
          <DropdownMenuItem>
            <LogsIcon /> My Logs
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
