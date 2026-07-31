import { storeApi } from "@/features/store/store.functions"
import { authMiddleware } from "@/lib/auth.functions"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/api/resources/$storeId/field-options")({
  server: {
    middleware: [authMiddleware],
    handlers: {
      GET: async ({ params }) => {
        const response = await storeApi.getFieldOptions({
          data: { id: params.storeId },
        })
        return Response.json(response)
      },
    },
  },
})
