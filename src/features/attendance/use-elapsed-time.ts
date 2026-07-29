import { useEffect, useMemo, useState } from "react"

type ElapsedTime = {
  totalMilliseconds: number
  totalSeconds: number
  hours: number
  minutes: number
  seconds: number
  formatted: string
}

export function useElapsedTime(startDate: string | Date): ElapsedTime {
  const getElapsed = () => {
    const start =
      startDate instanceof Date
        ? startDate.getTime()
        : new Date(startDate).getTime()

    return Math.max(0, Date.now() - start)
  }

  const [elapsed, setElapsed] = useState(getElapsed)

  useEffect(() => {
    setElapsed(getElapsed())

    const interval = setInterval(() => {
      setElapsed(getElapsed())
    }, 1000)

    return () => clearInterval(interval)
  }, [startDate])

  return useMemo(() => {
    const totalSeconds = Math.floor(elapsed / 1000)

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return {
      totalMilliseconds: elapsed,
      totalSeconds,
      hours,
      minutes,
      seconds,
      formatted: [
        String(hours).padStart(2, "0"),
        String(minutes).padStart(2, "0"),
        String(seconds).padStart(2, "0"),
      ].join(":"),
    }
  }, [elapsed])
}
