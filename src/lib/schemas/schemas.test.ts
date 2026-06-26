import { describe, expect, it } from "vitest"
import {
  appointmentFormSchema,
  profileFormSchema,
  serviceFormSchema,
} from "@/lib/schemas"
import {
  getBlockedSlots,
  getSlotsForDuration,
  hasSlotConflict,
} from "@/utils/appointments/slot-blocking"
import { planFromPriceId } from "@/utils/plan-from-price-id"
import { isActiveSubscriptionStatus } from "@/utils/subscription-status"

describe("appointmentFormSchema", () => {
  it("rejects empty name", () => {
    const result = appointmentFormSchema.safeParse({
      name: "",
      email: "test@example.com",
      phone: "11999999999",
      date: new Date(),
      serviceId: "svc-1",
      time: "09:00",
      clinicId: "clinic-1",
    })
    expect(result.success).toBe(false)
  })

  it("accepts valid payload", () => {
    const result = appointmentFormSchema.safeParse({
      name: "Maria",
      email: "maria@example.com",
      phone: "11999999999",
      date: new Date(),
      serviceId: "svc-1",
      time: "09:00",
      clinicId: "clinic-1",
    })
    expect(result.success).toBe(true)
  })
})

describe("serviceFormSchema", () => {
  it("rejects zero price", () => {
    const result = serviceFormSchema.safeParse({
      name: "Consulta",
      price: 0,
      duration: 60,
    })
    expect(result.success).toBe(false)
  })
})

describe("profileFormSchema", () => {
  it("requires timeZone", () => {
    const result = profileFormSchema.safeParse({
      name: "Clínica",
      status: true,
      timeZone: "",
      times: [],
    })
    expect(result.success).toBe(false)
  })
})

describe("slot-blocking", () => {
  const userTimes = ["09:00", "09:30", "10:00", "10:30"]

  it("blocks slots based on appointment duration", () => {
    const blocked = getBlockedSlots(userTimes, [
      { time: "09:00", service: { duration: 60 } },
    ])
    expect(blocked.has("09:00")).toBe(true)
    expect(blocked.has("09:30")).toBe(true)
    expect(blocked.has("10:00")).toBe(false)
  })

  it("detects slot conflict", () => {
    const blocked = getBlockedSlots(userTimes, [
      { time: "09:00", service: { duration: 30 } },
    ])
    expect(hasSlotConflict(userTimes, blocked, "09:00", 30)).toBe(true)
    expect(hasSlotConflict(userTimes, blocked, "10:00", 30)).toBe(false)
  })

  it("returns slots for duration", () => {
    expect(getSlotsForDuration(userTimes, "09:00", 60)).toEqual([
      "09:00",
      "09:30",
    ])
  })
})

describe("isActiveSubscriptionStatus", () => {
  it("returns true for active and trialing", () => {
    expect(isActiveSubscriptionStatus("active")).toBe(true)
    expect(isActiveSubscriptionStatus("trialing")).toBe(true)
  })

  it("returns false for canceled", () => {
    expect(isActiveSubscriptionStatus("canceled")).toBe(false)
  })
})

describe("planFromPriceId", () => {
  it("maps professional price id", () => {
    process.env.STRIPE_PLAN_PROFESSIONAL = "price_pro"
    expect(planFromPriceId("price_pro")).toBe("PROFESSIONAL")
  })

  it("defaults to BASIC", () => {
    expect(planFromPriceId("price_other")).toBe("BASIC")
  })
})
