import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

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
        // Converte a data recebida (YYYY-MM-DD) em um objeto Date
        const [year, month, day] = dateParam.split("-").map(Number)
        const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0))
        const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))

        const user = await prisma.user.findFirst({
            where: { id: userId }
        })

        if (!user) {
            return NextResponse.json({
                error: "Usuário não encontrado"
            }, { status: 400 })
        }

        // CORREÇÃO DE TIPAGEM: Força o reconhecimento do array de horários
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

        const blockedSlots = new Set<string>()

        for (const apt of appointments) {
            // Calcula quantos slots de 30min o serviço ocupa
            const requiredSlots = Math.ceil(apt.service.duration / 30)

            // Busca o índice do horário de início no array do usuário
            const startIndex = userTimes.indexOf(apt.time)

            if (startIndex !== -1) {
                // Bloqueia o slot inicial e os subsequentes baseados na duração
                for (let i = 0; i < requiredSlots; i++) {
                    const blockedSlot = userTimes[startIndex + i]
                    if (blockedSlot) {
                        blockedSlots.add(blockedSlot)
                    }
                }
            }
        }

        const blockedtimes = Array.from(blockedSlots);

        console.log("Horários bloqueados encontrados: ", blockedtimes)

        return NextResponse.json(blockedtimes)

    } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
        return NextResponse.json({
            error: "Erro interno no servidor ao processar horários"
        }, { status: 500 })
    }
}