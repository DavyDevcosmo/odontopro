"use client"

import { useState } from "react"

export function generateTimeSlots(): string[] {
  const hours: string[] = []

  for (let i = 8; i <= 24; i++) {
    for (let j = 0; j < 2; j++) {
      const hour = i.toString().padStart(2, "0")
      const minute = (j * 30).toString().padStart(2, "0")
      hours.push(`${hour}:${minute}`)
    }
  }

  return hours
}

export const BRAZIL_TIME_ZONES = Intl.supportedValuesOf("timeZone").filter(
  (zone) =>
    zone.startsWith("America/Sao_Paulo") ||
    zone.startsWith("America/Fortaleza") ||
    zone.startsWith("America/Recife") ||
    zone.startsWith("America/Bahia") ||
    zone.startsWith("America/Belem") ||
    zone.startsWith("America/Manaus") ||
    zone.startsWith("America/Cuiaba") ||
    zone.startsWith("America/Boa_Vista"),
)

export function useTimeSlotPicker(initialTimes: string[]) {
  const [selectedHours, setSelectedHours] = useState<string[]>(initialTimes)

  function toggleHour(hour: string) {
    setSelectedHours((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour].sort(),
    )
  }

  return { selectedHours, toggleHour, hours: generateTimeSlots() }
}
