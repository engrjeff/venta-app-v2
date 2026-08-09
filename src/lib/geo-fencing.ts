import { useCallback, useEffect, useMemo, useState } from "react"

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */
export type GeolocationPermission = "unknown" | "prompt" | "granted" | "denied"

export type Coordinates = {
  latitude: number
  longitude: number
}

export type GpsQuality = "excellent" | "good" | "fair" | "poor"

export type CurrentLocation = {
  location: Coordinates
  accuracy: number | null
  quality: GpsQuality
  source: "gps" | "ip"
  city?: string
  country?: string
}

export type GetCurrentLocationOptions = {
  targetAccuracy?: number
  timeout?: number
  fallbackToIp?: boolean
}

export interface IpWhoIsResponse {
  success: boolean
  ip: string

  continent: string
  continent_code: string

  country: string
  country_code: string

  region: string
  region_code: string

  city: string

  latitude: number
  longitude: number

  is_eu: boolean

  postal: string
  calling_code: string
  capital: string
  borders: string

  flag: {
    img: string
    emoji: string
    emoji_unicode: string
  }

  connection: {
    asn: number
    org: string
    isp: string
    domain: string
  }

  timezone: {
    id: string
    abbr: string
    is_dst: boolean
    offset: number
    utc: string
    current_time: string
  }
}

type LocationState = {
  loading: boolean
  error: Error | null
  permission: GeolocationPermission
  current: CurrentLocation | null
}

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */
const TIMEOUT = 5000

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

/**
 * Returns the distance in meters between two coordinates.
 */
export function distanceBetween(a: Coordinates, b: Coordinates): number {
  const R = 6371000

  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(b.latitude - a.latitude)
  const dLon = toRad(b.longitude - a.longitude)

  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)

  const hav =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2

  return 2 * R * Math.atan2(Math.sqrt(hav), Math.sqrt(1 - hav))
}

function getGpsQuality(accuracy: number | null): GpsQuality {
  if (accuracy == null) return "poor"

  if (accuracy <= 10) return "excellent"

  if (accuracy <= 20) return "good"

  if (accuracy <= 50) return "fair"

  return "poor"
}

/* -------------------------------------------------------------------------- */
/*                           Geolocation Permissions                          */
/* -------------------------------------------------------------------------- */

async function getGeolocationPermission(): Promise<GeolocationPermission> {
  if (!navigator.permissions) {
    return "unknown"
  }

  try {
    const result = await navigator.permissions.query({
      name: "geolocation",
    })

    return result.state
  } catch {
    return "unknown"
  }
}

/**
 * Attempts to request geolocation permission.
 *
 * Browsers only show the prompt if permission has not yet been decided.
 * If permission was previously denied, this will reject immediately.
 */
async function requestGeolocationPermission(): Promise<GeolocationPermission> {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported.")
  }

  try {
    await new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(),
        (err) => reject(new Error(err.message)),
        {
          enableHighAccuracy: false,
          timeout: TIMEOUT,
          maximumAge: 0,
        }
      )
    })
  } catch {
    // ignored
  }

  return getGeolocationPermission()
}

/* -------------------------------------------------------------------------- */
/*                              IP Location Fallback                          */
/* -------------------------------------------------------------------------- */

async function getLocationFromIp(): Promise<CurrentLocation> {
  const response = await fetch("https://ipwho.is/")

  if (!response.ok) {
    throw new Error("Unable to determine IP location.")
  }

  const data: IpWhoIsResponse = await response.json()

  if (!data.success) {
    throw new Error("Unable to determine IP location.")
  }

  return {
    source: "ip",
    accuracy: null,
    quality: "poor",

    city: data.city,
    country: data.country,

    location: {
      latitude: data.latitude,
      longitude: data.longitude,
    },
  }
}

/* -------------------------------------------------------------------------- */
/*                             GPS (Best Location)                            */
/* -------------------------------------------------------------------------- */

/**
 * Uses watchPosition instead of getCurrentPosition.
 *
 * Waits until:
 *
 * - desired accuracy is achieved
 * OR
 * - timeout expires
 *
 * Returns the best reading collected.
 */
export async function getCurrentLocation(
  options: GetCurrentLocationOptions = {}
): Promise<CurrentLocation> {
  const {
    targetAccuracy = 20,
    timeout = TIMEOUT,
    fallbackToIp = true,
  } = options

  if (!navigator.geolocation) {
    if (fallbackToIp) {
      return getLocationFromIp()
    }

    throw new Error("Geolocation is not supported.")
  }

  try {
    const positionResult = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        let finished = false
        let bestPosition: GeolocationPosition | null = null

        const finish = (position?: GeolocationPosition, error?: Error) => {
          if (finished) return

          finished = true

          navigator.geolocation.clearWatch(watchId)

          if (position) {
            resolve(position)
          } else {
            reject(error ?? new Error("Unable to determine location."))
          }
        }

        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            if (
              !bestPosition ||
              position.coords.accuracy < bestPosition.coords.accuracy
            ) {
              bestPosition = position
            }

            if (position.coords.accuracy <= targetAccuracy) {
              finish(position)
            }
          },
          (error) => {
            finish(undefined, new Error(error.message))
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout,
          }
        )

        setTimeout(() => {
          if (bestPosition) {
            finish(bestPosition)
          } else {
            finish(undefined, new Error("Timed out getting location."))
          }
        }, timeout)
      }
    )

    return {
      source: "gps",

      accuracy: positionResult.coords.accuracy,

      quality: getGpsQuality(positionResult.coords.accuracy),

      location: {
        latitude: positionResult.coords.latitude,
        longitude: positionResult.coords.longitude,
      },
    }
  } catch (err) {
    if (!fallbackToIp) {
      throw err
    }

    return getLocationFromIp()
  }
}

/* -------------------------------------------------------------------------- */
/*                               React Hook State                             */
/* -------------------------------------------------------------------------- */

type UseGeofenceResult = {
  loading: boolean
  error: Error | null

  permission: GeolocationPermission

  location?: Coordinates

  distance: number | null

  accuracy: number | null

  quality: GpsQuality | null

  source: "gps" | "ip" | null

  city?: string

  country?: string

  isWithinRadius: boolean | null

  canClockIn: boolean

  /**
   * Performs a fresh location lookup
   * and recalculates the geofence.
   */
  check: () => Promise<GeofenceResult>

  /**
   * Explicitly asks for location permission again.
   */
  requestPermission: () => Promise<GeolocationPermission>
}

/* -------------------------------------------------------------------------- */
/*                               useGeofence Hook                             */
/* -------------------------------------------------------------------------- */

export function useGeofence(
  center: Coordinates,
  radiusMeters: number
): UseGeofenceResult {
  const [state, setState] = useState<LocationState>({
    loading: false,
    error: null,
    current: null,
    permission: "unknown",
  })

  const setLoading = useCallback(() => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }))
  }, [])

  const setSuccess = useCallback(
    (current: CurrentLocation, permission: GeolocationPermission) => {
      setState({
        loading: false,
        error: null,
        current,
        permission,
      })
    },
    []
  )

  const setFailure = useCallback(
    (error: Error, permission: GeolocationPermission) => {
      setState((prev) => ({
        ...prev,
        loading: false,
        error,
        permission,
      }))
    },
    []
  )

  const requestPermission = useCallback(async () => {
    const permission = await requestGeolocationPermission()

    setState((prev) => ({
      ...prev,
      permission,
    }))

    return permission
  }, [])

  const check = useCallback(async () => {
    setLoading()

    try {
      const result = await performGeofenceCheck(center, radiusMeters)

      const permission = await getGeolocationPermission()

      setSuccess(result.current, permission)

      return result
    } catch (err) {
      const permission = await getGeolocationPermission()

      setFailure(err as Error, permission)

      throw err
    }
  }, [center, radiusMeters, setLoading, setFailure, setSuccess])

  useEffect(() => {
    let mounted = true

    ;(async () => {
      const permission = await getGeolocationPermission()

      if (!mounted) return

      setState((prev) => ({
        ...prev,
        permission,
      }))

      /**
       * First visit.
       *
       * Immediately ask permission.
       */
      if (permission === "prompt") {
        try {
          const updated = await requestGeolocationPermission()

          if (!mounted) return

          setState((prev) => ({
            ...prev,
            permission: updated,
            loading: false,
          }))
        } catch {
          if (!mounted) return

          setState((prev) => ({
            ...prev,
            loading: false,
          }))
        }

        return
      }

      /**
       * Already granted or denied.
       *
       * We don't automatically fetch GPS.
       */
      setState((prev) => ({
        ...prev,
        loading: false,
      }))
    })()

    return () => {
      mounted = false
    }
  }, [])

  /**
   * Everything below is derived state.
   * No additional React state is needed.
   */
  const distance = useMemo(() => {
    if (!state.current) {
      return null
    }

    return distanceBetween(state.current.location, center)
  }, [center, state.current])

  const isWithinRadius = useMemo(() => {
    if (distance == null) {
      return null
    }

    return distance <= radiusMeters
  }, [distance, radiusMeters])

  /**
   * Example rule for clock in.
   *
   * Can be changed to make this stricter later.
   */
  const canClockIn = useMemo(() => {
    if (!state.current) {
      return false
    }

    if (!isWithinRadius) {
      return false
    }

    return state.current.source === "gps" && state.current.quality !== "poor"
  }, [state.current, isWithinRadius])

  return {
    loading: state.loading,

    error: state.error,

    permission: state.permission,

    location: state.current?.location,

    distance,

    accuracy: state.current?.accuracy ?? null,

    quality: state.current?.quality ?? null,

    source: state.current?.source ?? null,

    city: state.current?.city,

    country: state.current?.country,

    isWithinRadius,

    canClockIn,

    check,

    requestPermission,
  }
}

/* -------------------------------------------------------------------------- */
/*                            Utility Functions                               */
/* -------------------------------------------------------------------------- */

export async function checkGeofence(center: Coordinates, radiusMeters: number) {
  const current = await getCurrentLocation()

  const distance = distanceBetween(current.location, center)

  const accuracyAllowance =
    current.accuracy == null ? 0 : Math.min(current.accuracy, 30)

  const effectiveRadius = radiusMeters + accuracyAllowance

  const inside = distance <= effectiveRadius

  const canClockIn =
    inside && current.source === "gps" && current.quality !== "poor"

  return {
    isWithinRadius: inside,
    distance,
    effectiveRadius,
    canClockIn,
    ...current,
  }
}

export async function isUserWithinRadius(
  center: Coordinates,
  radiusMeters: number
) {
  const result = await checkGeofence(center, radiusMeters)

  return result.isWithinRadius
}

// imperative version

export type GeofenceResult = {
  current: CurrentLocation

  distance: number

  effectiveRadius: number

  isWithinRadius: boolean

  canClockIn: boolean
}

export async function performGeofenceCheck(
  center: Coordinates,
  radiusMeters: number,
  options: GetCurrentLocationOptions = {}
): Promise<GeofenceResult> {
  const current = await getCurrentLocation({
    targetAccuracy: 20,
    timeout: TIMEOUT,
    fallbackToIp: false,
    ...options,
  })

  const distance = distanceBetween(current.location, center)

  const accuracyAllowance =
    current.accuracy == null ? 0 : Math.min(current.accuracy, 30)

  const effectiveRadius = radiusMeters + accuracyAllowance

  const isWithinRadius = distance <= effectiveRadius

  return {
    current,

    distance,

    effectiveRadius,

    isWithinRadius,

    canClockIn:
      isWithinRadius && current.source === "gps" && current.quality !== "poor",
  }
}
