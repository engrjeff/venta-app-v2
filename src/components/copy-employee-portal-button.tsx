import { LinkIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { authClient } from "@/lib/auth-client"

export function CopyEmployeePortalButton() {
  const store = authClient.useActiveOrganization()

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard) return

      const employeePortalLink = `${window.location.origin}/e/${store.data?.slug}`

      await navigator.clipboard.writeText(employeePortalLink)
      toast.info("Copied to clipboard", { richColors: false })
    } catch (error) {
      console.log("Copy Error: ", error)
      toast.error("Failed to copy")
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      disabled={!store.data || store.isPending}
      onClick={handleCopy}
    >
      Employee Portal <LinkIcon />
    </Button>
  )
}
