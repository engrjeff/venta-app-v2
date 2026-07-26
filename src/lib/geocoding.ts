import { serverEnv } from "@/config/serverEnv"

export class GeocodingError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message)
    this.name = "GeocodingError"
  }
}

const BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json"

export async function geocodeAddress(address: string, signal?: AbortSignal) {
  if (!serverEnv.VITE_GOOGLE_MAPS_API_KEY) {
    throw new GeocodingError("Google Maps API key is not configured.")
  }

  if (!address.trim()) {
    throw new GeocodingError("Address is required.")
  }

  const url = new URL(BASE_URL)
  url.searchParams.set("key", serverEnv.VITE_GOOGLE_MAPS_API_KEY)
  url.searchParams.set("address", address)

  let response: Response

  try {
    response = await fetch(url, {
      signal,
      headers: {
        Accept: "application/json",
      },
    })
  } catch (error) {
    throw new GeocodingError(
      error instanceof Error
        ? error.message
        : "Unable to reach Google Geocoding API."
    )
  }

  if (!response.ok) {
    let message = `Geocoding request failed (${response.status}).`

    try {
      const body = await response.json()

      if (typeof body.error?.message === "string") {
        message = body.error.message
      }
    } catch {
      // Ignore invalid JSON
    }

    throw new GeocodingError(message, response.status)
  }

  const data = (await response.json()) as google.maps.GeocoderResponse

  if (!data.results.length) {
    throw new GeocodingError("No matching address found.")
  }

  return data.results[0]
}
