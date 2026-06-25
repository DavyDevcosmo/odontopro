"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation"
import { format } from "date-fns";
import { Prisma } from "../../../../../../prisma/generated/prisma/browser";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { cancelAppointment } from "../../_actions/cancel-appointment";
import { toast } from "sonner";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { DialogAppointment } from "./dialog-appointment";
import { ButtonPickerAppointment } from "./button-date";


export type AppointmentWithService = Prisma.AppointmentGetPayload<{
    include: {
        service: true,
    }
}>

interface AppointmentsListProps {
    times: string[]
}

export function AppointmentsList({ times }: AppointmentsListProps) {

    const searchParams = useSearchParams();
    const date = searchParams.get("date")
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [detailAppointment, setDetailAppointment] = useState<AppointmentWithService | null>(null)


    const { data, isLoading, refetch } = useQuery({
        queryKey: ["get-appointments", date],
        queryFn: async () => {
            let activeDate = date;

            if (!activeDate) {
                const today = format(new Date(), "yyyy-MM-dd");
                activeDate = today;
            }

            const url = `${process.env.NEXT_PUBLIC_URL}/api/clinic/appointments?date=${activeDate}`;

            const response = await fetch(url);

            const json = await response.json();

            console.log(json)

            if (!response.ok) {
                return []
            }

            return json
        },
        staleTime: 20000,
        refetchInterval: 60000,
    })

    const occupantMap: Record<string, AppointmentWithService> = {};

    if (data && data.length > 0) {
        for (const appointment of data) {
            const requireSlots = Math.ceil(appointment.service.duration / 30);

            const startIndex = times.indexOf(appointment.time)

            if (startIndex !== -1) {
                for (let i = 0; i < requireSlots; i++) {
                    const slotsIndex = startIndex + i;

                    if (slotsIndex < times.length) {
                        occupantMap[times[slotsIndex]] = appointment;
                    }
                }
            }
        }
    }

    async function handleCancelAppointment(appointmentId: string) {

        const formData = new FormData()
        formData.append("appointmentId", appointmentId)

        const response = await cancelAppointment(formData)

        if (response.error) {
            toast.error(response.error);
            return;
        }
        queryClient.invalidateQueries({ queryKey: ["get-appointments"] })
        refetch()
        toast.success(response.data);
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl md:text-2xl font-bold">
                        Agendamentos
                    </CardTitle>

                    <ButtonPickerAppointment />
                </CardHeader>

                <CardContent>
                    <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-15rem)] pr-4">
                        {isLoading ? (
                            <p>Carregando agenda...</p>
                        ) : (
                            times.map((slot) => {

                                const occupant = occupantMap[slot]

                                if (occupant) {
                                    return (
                                        <div key={slot} className="flex items-center py-2 border-t border-border last:border-b">
                                            <div className="w-16 text-sm font-semibold">
                                                {slot}
                                            </div>
                                            <div className="flex-1 text-sm">
                                                <div className="font-semibold">{occupant.name}</div>
                                                <div className="text-sm text-content-secondary">{occupant.phone}
                                                </div>
                                            </div>

                                            <div className="ml-auto">
                                                <div className="flex">
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDetailAppointment(occupant)}>
                                                            <Eye className="-4 h-4" />
                                                        </Button>
                                                    </DialogTrigger>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleCancelAppointment(occupant.id)}>
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                return (
                                    <div
                                        key={slot}
                                        className="flex items-center py-2 border-t border-border last:border-b"
                                    >

                                        <div className="w-16 text-sm font-semibold text-content-primary">{slot}</div>
                                        <div className="flex-1 text-sm text-content-secondary">Disponível</div>
                                    </div>
                                )
                            })
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>

            <DialogAppointment appointment={detailAppointment} />
        </Dialog>
    )
}