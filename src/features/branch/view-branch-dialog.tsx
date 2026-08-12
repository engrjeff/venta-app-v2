import { MapEmbed } from "@/components/map-embed"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Branch } from "@/generated/prisma/browser"
import { formatScheduleTimeRange } from "@/lib/utils"
import { ClockIcon } from "lucide-react"

import type { ComponentProps } from "react"

interface ViewBranchDialogProps extends ComponentProps<typeof Sheet> {
  branch: Branch
}

export function ViewBranchDialog({
  branch,
  ...sheetProps
}: ViewBranchDialogProps) {
  return (
    <Sheet {...sheetProps}>
      <SheetContent className="gap-0">
        <SheetHeader className="border-b">
          <SheetTitle>{branch.name}</SheetTitle>
          <SheetDescription>Branch details for {branch.name}</SheetDescription>
        </SheetHeader>
        <div className="space-y-2 p-4">
          <MapEmbed location={branch.address} className="border" />
          <div className="divide-y rounded-md border bg-card">
            <div className="p-3">
              <p className="text-sm font-semibold">{branch.name}</p>
              <p className="text-xs text-muted-foreground">{branch.address}</p>
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold">Coordinates</p>
              <p className="text-xs text-muted-foreground">
                Lat: {branch.latitude}, Lng: {branch.longitude}
              </p>
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold">Google Map Address</p>
              <p className="text-xs text-muted-foreground">
                {branch.gmFormattedAddress}
              </p>
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold">Schedule</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ClockIcon className="size-3" />
                <span>
                  {
                    formatScheduleTimeRange(
                      branch.scheduleStartTime,
                      branch.scheduleEndTime
                    ).formatted
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose render={<Button type="button">Close</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
