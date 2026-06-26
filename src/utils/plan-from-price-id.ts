import type { Plan } from "../../prisma/generated/prisma/enums"

export function planFromPriceId(priceId: string): Plan {
  if (priceId === process.env.STRIPE_PLAN_PROFESSIONAL) {
    return "PROFESSIONAL"
  }

  return "BASIC"
}
