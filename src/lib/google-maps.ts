import { clientEnv } from "@/config/clientEnv"
// src/lib/google-maps.ts

import { importLibrary, setOptions } from "@googlemaps/js-api-loader"

setOptions({
  key: clientEnv.VITE_GOOGLE_MAPS_API_KEY,
  v: "weekly",
})

export async function geoCodeAddress(address: string) {
  try {
    const GeoCoding = await importLibrary("geocoding")

    console.log(GeoCoding)
  } catch (error) {
    console.log(`Error Geocoding address: `, address)
  }
}
