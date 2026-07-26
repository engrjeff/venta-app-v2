import { authClient } from "@/lib/auth-client"
import { CopyIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "./ui/button"

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
      disabled={!store.data || store.isPending}
      onClick={handleCopy}
    >
      <CopyIcon /> Employee Portal Link
    </Button>
  )
}
