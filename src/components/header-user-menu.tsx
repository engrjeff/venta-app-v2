import { useNavigate } from "@tanstack/react-router"
import { LogOutIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import { getInitials } from "@/lib/utils"

export function HeaderUserMenu() {
  const { data: session } = authClient.useSession()
  const navigate = useNavigate()

  const user = session?.user

  if (!user) return null

  const handleSignOut = async () => {
    await authClient.signOut()
    await navigate({ to: "/sign-in" })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
            <Avatar className="bg-primary">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </button>
        }
      >
        <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
          <Avatar className="bg-primary">
            {user.image && <AvatarImage src={user.image} alt={user.name} />}
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5">
              <Avatar size="sm" className="bg-primary">
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
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
