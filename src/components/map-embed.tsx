import { clientEnv } from "@/config/clientEnv"
import { cn } from "@/lib/utils"

const MAP_EMBED_SRC = `https://www.google.com/maps/embed/v1/place?key=${clientEnv.VITE_GOOGLE_MAPS_API_KEY}&region=PH&zoom=15&q=LOCATION`

export function MapEmbed({
  location,
  className,
}: {
  location: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "aspect-video overflow-hidden rounded-md border",
        className
      )}
    >
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={MAP_EMBED_SRC.replace("LOCATION", encodeURIComponent(location))}
      ></iframe>
    </div>
  )
}

// ;<iframe
//   width="100%"
//   height="320"
//   frameborder="0"
//   scrolling="no"
//   marginheight="0"
//   marginwidth="0"
//   src="https://maps.google.com/maps?q=14.492097557485067,121.21855243875024&z=18&output=embed"
// ></iframe>
