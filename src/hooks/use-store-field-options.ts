import { storeApi } from "@/features/store/store.functions"
import type { Branch, Designation } from "@/generated/prisma/browser"
import { authClient } from "@/lib/auth-client"
import { useServerFn } from "@tanstack/react-start"
import { useEffect, useState } from "react"

export function useStoreFieldOptions() {
  const [loading, setLoading] = useState(false)
  const store = authClient.useActiveOrganization()
  const storeOptions = useServerFn(storeApi.getFieldOptions)

  const [branches, setBranches] = useState<Array<Pick<Branch, "id" | "name">>>(
    []
  )
  const [designations, setDesignations] = useState<
    Array<Pick<Designation, "id" | "name">>
  >([])

  useEffect(() => {
    if (!store.data?.id) return

    setLoading(true)

    storeOptions({ data: { id: store.data?.id } })
      .then((data) => {
        if (!data.data) return
        if (data.error) return

        setBranches(data.data.branches)
        setDesignations(data.data.designations)
      })
      .finally(() => setLoading(false))
  }, [])

  return { branches, designations, loading: store.isPending || loading }
}
