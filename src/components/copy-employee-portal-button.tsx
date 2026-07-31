import { authClient } from "@/lib/auth-client"
import { LinkIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "./ui/button"

export function CopyEmployeePortalButton() {
  const store = authClient.useActiveOrganization()

  const handleCopy = (slug: string) => {
    try {
      if (!navigator.clipboard) return

      const employeePortalLink = `${window.location.origin}/e/${slug}`

      navigator.clipboard.writeText(employeePortalLink).then(() => {
        toast.info("Copied to clipboard", { richColors: false })
      })
    } catch (error) {
      console.log("Copy Error: ", error)
      toast.error("Failed to copy")
    }
  }

  return (
    <Button
      key={store.data?.id}
      type="button"
      variant="secondary"
      size="sm"
      disabled={store.isPending}
      onClick={() => {
        if (store.data?.slug) {
          handleCopy(store.data.slug)
        }
      }}
    >
      Employee Portal <LinkIcon />
    </Button>
  )
}
