import { Button } from "@/components/ui/button"
import { Link, Outlet, createFileRoute } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"

export const Route = createFileRoute("/(auth)")({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Button
        nativeButton={false}
        variant="link"
        size="sm"
        className="fixed top-4 left-8 px-0 text-foreground"
        render={
          <Link to="/">
            <ArrowLeftIcon /> Back
          </Link>
        }
      />
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  )
}
