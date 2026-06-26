import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getBlockedSlots, getDayRange } from '@/utils/appointments/slot-blocking'

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const userId = searchParams.get('userId')
    const dateParam = searchParams.get('date')

    if (!userId || userId === "null" || !dateParam || dateParam === "null") {
        return NextResponse.json({
            error: "Parâmetros ausentes ou inválidos"
        }, { status: 400 })
    }

    try {
        const [year, month, day] = dateParam.split("-").map(Number)
        const { startDate, endDate } = getDayRange(
            new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
        )

        const user = await prisma.user.findFirst({
            where: { id: userId }
        })

        if (!user) {
            return NextResponse.json({
                error: "Usuário não encontrado"
            }, { status: 400 })
        }

        const userTimes = (user.times as string[]) ?? [];

        const appointments = await prisma.appointment.findMany({
            where: {
                userId: userId,
                appointmentDate: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                service: true,
            }
        })

        const blockedtimes = Array.from(getBlockedSlots(userTimes, appointments));

        return NextResponse.json(blockedtimes)

    } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
        return NextResponse.json({
            error: "Erro interno no servidor ao processar horários"
        }, { status: 500 })
    }
}
