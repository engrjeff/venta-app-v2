import { AppLogo } from "@/components/app-logo"
import { HeaderUserMenu } from "@/components/header-user-menu"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { employeesApi } from "@/features/employees/employees.functions"
import { getSession } from "@/lib/auth.functions"
import { Link, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  loader: async () => {
    const [session, employeeSession] = await Promise.all([
      getSession(),
      employeesApi.getSession(),
    ])

    return { session, employeeSession }
  },
  component: App,
})

function App() {
  const { session, employeeSession } = Route.useLoaderData()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex max-w-6xl items-center gap-4 p-6">
        <Link to="/" className="flex w-max items-center gap-3">
          <AppLogo size={36} />{" "}
          <span className="text-2xl font-semibold">{siteConfig.title}</span>
        </Link>

        <nav className="ml-auto flex items-center gap-4">
          {employeeSession.data?.employeeId &&
          employeeSession.data.storeSlug ? (
            <Button
              variant="secondary"
              nativeButton={false}
              render={
                <Link
                  to="/e/$storeSlug"
                  params={{ storeSlug: employeeSession.data.storeSlug }}
                >
                  Employee Portal
                </Link>
              }
            />
          ) : null}
          {session?.user ? (
            <>
              <Button
                variant="secondary"
                nativeButton={false}
                render={<Link to="/dashboard">Dashboard</Link>}
              />
              <HeaderUserMenu />
            </>
          ) : (
            <>
              <Button
                nativeButton={false}
                render={<Link to="/sign-in">Sign In</Link>}
              />
              <Button
                nativeButton={false}
                variant="outline"
                render={<Link to="/sign-up">Sign Up</Link>}
              />
            </>
          )}
        </nav>
      </header>

      <main className="grid flex-1">
        <section
          data-section="tn-hero"
          className="container mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-8 px-6"
        >
          <AppLogo />
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold lg:text-6xl">
              Run your store
              <br />
              with less paperwork.
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage branches, employees, attendance, and payroll in one simple
              app.
            </p>
          </div>

          <div className="flex w-full max-w-sm flex-col gap-4 lg:flex-row lg:items-center">
            <Button
              size="xl"
              className="shrink-0 lg:flex-1"
              nativeButton={false}
              render={<Link to="/sign-up">Start Free</Link>}
            />
            <Button
              variant="outline"
              size="xl"
              className="shrink-0 lg:flex-1"
              nativeButton={false}
              render={<a href="#explore">Explore</a>}
            />
          </div>
        </section>
      </main>

      <footer className="mt-auto py-10">
        <div className="container mx-auto flex max-w-6xl items-center justify-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()}. Made by{" "}
            <a
              href="https://jeffsegovia.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jeff Segovia
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}
