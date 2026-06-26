"use client"

import { useCallback, useEffect, useState } from "react"
import type { TimeSlot } from "./schedule-content"

export function useBlockedTimeSlots(
  clinicId: string,
  clinicTimes: string[],
  selectedDate: Date | undefined,
  selectedTime: string,
  onSelectedTimeInvalid: () => void,
) {
  const [blockedTimes, setBlockedTimes] = useState<string[]>([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const fetchBlockedTimes = useCallback(async (date: Date): Promise<string[]> => {
    setLoadingSlots(true)
    try {
      const dateString = date.toISOString().split("T")[0]
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinicId}&date=${dateString}`,
      )
      const json = await response.json()
      return json
    } catch {
      return []
    } finally {
      setLoadingSlots(false)
    }
  }, [clinicId])

  useEffect(() => {
    if (!selectedDate) {
      return
    }

    fetchBlockedTimes(selectedDate).then((blocked) => {
      setBlockedTimes(blocked)

      const times = clinicTimes || []
      const finalSlots = times.map((time) => ({
        time,
        available: !blocked.includes(time),
      }))

      setAvailableTimeSlots(finalSlots)

      const stillAvailable = finalSlots.find(
        (slot) => slot.time === selectedTime && slot.available,
      )

      if (!stillAvailable) {
        onSelectedTimeInvalid()
      }
    })
  }, [selectedDate, clinicTimes, fetchBlockedTimes, selectedTime, onSelectedTimeInvalid])

  return { blockedTimes, availableTimeSlots, loadingSlots }
}
