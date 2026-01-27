"use client";

import Image from "next/image";
import imgTest from "../../../../../../public/foto1.png";
import { MapPin } from "lucide-react";
import { Prisma } from "@prisma/client";
import { useAppointmentForm, AppointmentFormData } from "./schedule-form";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { formatPhone } from "@/utils/formatPhone";
import { DateTimePicker } from "./date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useCallback, useEffect } from "react";

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
    include: {
        subscription: true;
        services: true;
    }
}>

interface ScheduleContentProps {
    clinic: UserWithServiceAndSubscription
}

interface TimeSlot {
    time: string;
    available: boolean;
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {

    const form = useAppointmentForm();
    const { watch } = form;

    const selectDate = watch("date")
    const selectServiceId = watch("serviceId")

    const [selectedTime, setSelectTime] = useState("");
    const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
    const [loadingSlots, setLoadinSlots] = useState(false);

    const [blockedTimes, setBlockedTimes] = useState<string[]>([]);

    const fetchBlockedTimes = useCallback(async (date: Date): Promise<string[]> => {
        setLoadinSlots(true);
        try {
            const dateString = date.toISOString().split("T")[0]
            const response = await fetch(` ${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}`)

            const json = await response.json();
            setLoadinSlots(false);
            return json;

        } catch (err) {
            setLoadinSlots(false);
            return [];
        }
    }, [clinic.id])

    useEffect(() => {

        if (selectDate) {
            fetchBlockedTimes(selectDate).then((blocked) => {
                setBlockedTimes(blocked)

                const times = clinic.times || [];

                const finalSlots = times.map((time) => ({
                    time: time,
                    available: !blocked.includes(time)
                }))
                setAvailableTimeSlots(finalSlots)
            })
        }

    }, [selectDate, clinic.times, fetchBlockedTimes, selectedTime])

    async function handleRegisterAppointment(formData: AppointmentFormData) {

    }


    return (
        <div className="min-h-screen flex flex-col">
            <div className="h-32 bg-emerald-500" />

            <section className="container mx-auto px-4 -mt-16">
                <div className="max-w-2xl mx-auto">
                    <article className="flex flex-col items-center">
                        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white mb-8">
                            <Image
                                src={clinic.image ? clinic.image : imgTest}
                                alt="Foto da clinica"
                                className="object-cover"
                                fill
                            />
                        </div>

                        <h1 className="text-2xl font-bold mb-2">{clinic.name}</h1>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-5 h-5" />
                            <span>{clinic.address ? clinic.address : " Endereço não informado"}</span>
                        </div>
                    </article>
                </div>
            </section>

            <section className="max-w-2xl mx-auto w-full">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleRegisterAppointment)}
                        className="mx-2 space-y-6 p-6 bg-white border rounded-md shadow-sm">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="my-2">

                                    <FormLabel>Nome completo:</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="name"
                                            placeholder="Digite seu nome completo..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel>Email:</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="email"
                                            placeholder="Digite seu email..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel>Telefone:</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="phone"
                                            placeholder="(xx) xxxxx-xxxx"
                                            {...field}
                                            onChange={(e) => {
                                                const formattedValue = formatPhone(e.target.value)
                                                field.onChange(formattedValue)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2 space-y-1">
                                    <FormLabel>Data do agendamento</FormLabel>
                                    <FormControl>
                                        <DateTimePicker
                                            initialDate={new Date()}
                                            className="w-full rounded border p-2"
                                            onChange={(date) => {
                                                if (date) {
                                                    field.onChange(date)
                                                }
                                            }}
                                        />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="serviceId"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel className="font-semibold">Selecione o serviço:</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um serviço" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                {clinic.services.map((service) => (
                                                    <SelectItem key={service.id} value={service.id}>
                                                        {service.name} - {Math.floor(service.duration / 60)}h {service.duration % 60}min
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {clinic.status ? (
                            <Button
                                type="submit"
                                className="w-full bg-emerald-500 hover:bg-emerald-400"
                                disabled={!watch("name") || !watch("email") || !watch("phone") || !watch("date")}>
                                Realizar agendamento
                            </Button>
                        ) : (
                            <p className="bg-red-500 text-white text-center px-4 py-2 rounded-md">A clinica está fechada no momento.</p>
                        )}

                    </form>
                </Form>
            </section>
        </div >
    )
}