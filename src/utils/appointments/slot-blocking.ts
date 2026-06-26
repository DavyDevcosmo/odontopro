export interface AppointmentWithDuration {
  time: string
  service: { duration: number }
}

export function getBlockedSlots(
  userTimes: string[],
  appointments: AppointmentWithDuration[],
): Set<string> {
  const blockedSlots = new Set<string>()

  for (const apt of appointments) {
    const requiredSlots = Math.ceil(apt.service.duration / 30)
    const startIndex = userTimes.indexOf(apt.time)

    if (startIndex !== -1) {
      for (let i = 0; i < requiredSlots; i++) {
        const blockedSlot = userTimes[startIndex + i]
        if (blockedSlot) {
          blockedSlots.add(blockedSlot)
        }
      }
    }
  }

  return blockedSlots
}

export function getSlotsForDuration(
  userTimes: string[],
  startTime: string,
  durationMinutes: number,
): string[] {
  const requiredSlots = Math.ceil(durationMinutes / 30)
  const startIndex = userTimes.indexOf(startTime)

  if (startIndex === -1) {
    return []
  }

  const slots: string[] = []
  for (let i = 0; i < requiredSlots; i++) {
    const slot = userTimes[startIndex + i]
    if (slot) {
      slots.push(slot)
    }
  }

  return slots
}

export function hasSlotConflict(
  userTimes: string[],
  blockedSlots: Set<string>,
  startTime: string,
  durationMinutes: number,
): boolean {
  const requiredSlots = getSlotsForDuration(userTimes, startTime, durationMinutes)

  if (requiredSlots.length === 0) {
    return true
  }

  return requiredSlots.some((slot) => blockedSlots.has(slot))
}

export function parseAppointmentDate(date: Date): Date {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
}

export function getDayRange(appointmentDate: Date): { startDate: Date; endDate: Date } {
  const year = appointmentDate.getUTCFullYear()
  const month = appointmentDate.getUTCMonth()
  const day = appointmentDate.getUTCDate()

  return {
    startDate: new Date(Date.UTC(year, month, day, 0, 0, 0, 0)),
    endDate: new Date(Date.UTC(year, month, day, 23, 59, 59, 999)),
  }
}
