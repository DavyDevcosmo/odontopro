"use server"

import { Session } from "next-auth";
import { ResultPermissionProp } from "./canPermission";
import { addDays, isAfter } from "date-fns";
import { TRIAL_DAYS } from "./trial-limits";
import prisma from "@/lib/prisma";


export async function checkSubscriptionExpired(session: Session): Promise<ResultPermissionProp> {
    if (!session?.user?.id) {
        return {
            hasPermission: false,
            planId: "EXPIRED",
            expired: true,
            plan: null,
        }
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { createdAt: true },
    })

    if (!user) {
        return {
            hasPermission: false,
            planId: "EXPIRED",
            expired: true,
            plan: null,
        }
    }

    const trailEndDate = addDays(user.createdAt, TRIAL_DAYS)

    if (isAfter(new Date(), trailEndDate)) {
        return {
            hasPermission: false,
            planId: "EXPIRED",
            expired: true,
            plan: null,
        }
    }

    return {
        hasPermission: true,
        planId: "TRIAL",
        expired: false,
        plan: null,
    }
}
