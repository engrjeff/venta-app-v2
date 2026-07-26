import { Map, useMapsLibrary } from "@vis.gl/react-google-maps"

export function GoogleMap() {
  const placesLib = useMapsLibrary("places")

  console.log(placesLib)

  return (
    <Map
      className="aspect-square"
      defaultCenter={{ lat: 14.5995, lng: 120.9842 }}
      defaultZoom={12}
      gestureHandling="greedy"
    />
  )
}
