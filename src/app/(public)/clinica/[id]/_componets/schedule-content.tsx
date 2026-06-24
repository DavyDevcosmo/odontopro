
"use client"

import { useState, useCallback, useEffect } from 'react'
import Image from "next/image"
import imgTest from '../../../../../../public/foto1.png'
import { MapPin } from "lucide-react"

import { useAppointmentForm, AppointmentFormData } from './schedule-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { formatPhone } from '@/utils/formatPhone'
import { DateTimePicker } from "./date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScheduleTimeList } from './schedule-time-list'
import { toast } from 'sonner'
import { createNewAppointment } from '../_actions/create-appointments'
import { Prisma } from '../../../../../../prisma/generated/prisma/client'

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
    include: {
        subscription: true,
        services: true,
    }
}>


interface ScheduleContentProps {
    clinic: UserWithServiceAndSubscription
}

export interface TimeSlot {
    time: string;
    available: boolean;
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {

    const form = useAppointmentForm();
    const { watch } = form;


    const selectedDate = watch("date")
    const selectedServiceId = watch("serviceId")

    const [selectedTime, setSelectedTime] = useState("");
    const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const [blockedTimes, setBlockedTimes] = useState<string[]>([])

    const fetchBlockedTimes = useCallback(async (date: Date): Promise<string[]> => {
        setLoadingSlots(true);
        try {
            const dateString = date.toISOString().split("T")[0]
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`)

            const json = await response.json();
            setLoadingSlots(false);
            return json;

        } catch (err) {
            console.log(err)
            setLoadingSlots(false);
            return [];
        }
    }, [clinic.id])
    console.log("Horários brutos da clínica:", clinic.times);

    useEffect(() => {

        if (selectedDate) {
            fetchBlockedTimes(selectedDate).then((blocked) => {
                setBlockedTimes(blocked)

                const times = (clinic.times as string[]) || [];

                const finalSlots = times.map((time) => ({
                    time: time,
                    available: !blocked.includes(time)
                }))


                setAvailableTimeSlots(finalSlots)

                const stillAvailable = finalSlots.find(
                    (slot) => slot.time === selectedTime && slot.available
                )

                if (!stillAvailable) {
                    setSelectedTime("");
                }
            })
        }

    }, [selectedDate, clinic.times, fetchBlockedTimes, selectedTime])


    async function handleRegisterAppointmnent(formData: AppointmentFormData) {
        // ✅ Validação explícita com feedback melhor
        if (!selectedTime) {
            toast.error("Por favor, selecione um horário disponível")
            return;
        }

        if (!formData.date) {
            toast.error("Por favor, selecione uma data")
            return;
        }

        if (!formData.serviceId) {
            toast.error("Por favor, selecione um serviço")
            return;
        }

        // ✅ Log para debug
        console.log("Enviando agendamento:", {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            date: formData.date,
            serviceId: formData.serviceId,
            time: selectedTime,
            clinicId: clinic.id
        })

        const response = await createNewAppointment({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            date: formData.date, // ✅ Isso agora será string (YYYY-MM-DD)
            serviceId: formData.serviceId,
            time: selectedTime,
            clinicId: clinic.id
        });

        if (response.error) {
            console.error("Erro na resposta:", response.error)
            toast.error(response.error)
            return;
        }

        toast.success("Consulta agendada com sucesso!")
        form.reset();
        setSelectedTime("")
    }
    console.log({
        service: selectedServiceId,
        slots: availableTimeSlots.length,
        loading: loadingSlots
    });
    return (
        <div className="min-h-screen flex flex-col bg-surface-page">
            <div className="h-32 bg-accent-primary" />

            <section className="contianer mx-auto px-4 -mt-16">
                <div className="max-w-2xl mx-auto">
                    <article className="flex flex-col items-center">
                        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-surface-card mb-8">
                            <Image
                                src={clinic.image ? clinic.image : imgTest}
                                alt="Foto da clinica"
                                className="object-cover"
                                fill
                            />
                        </div>

                        <h1 className="text-2xl font-bold mb-2 text-content-primary">
                            {clinic.name}
                        </h1>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-5 h-5" />
                            <span>
                                {clinic.address ? clinic.address : "Endereço não informado"}
                            </span>
                        </div>
                    </article>

                </div>
            </section>


            <section className="max-w-2xl mx-auto w-full mt-6">

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleRegisterAppointmnent)}
                        className="mx-2 space-y-6 bg-surface-card p-6 border border-border rounded-md shadow-sm"
                    >

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">Nome completo:</FormLabel>
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
                                    <FormLabel className="font-semibold">Email:</FormLabel>
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
                                    <FormLabel className="font-semibold">Telefone:</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="phone"
                                            placeholder="(XX) XXXXX-XXXX"
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
                                    <FormLabel className="font-semibold">Data do agendamento:</FormLabel>
                                    <FormControl>
                                        <DateTimePicker
                                            initialDate={new Date()}
                                            className="w-full rounded border p-2"
                                            onChange={(date) => {
                                                if (date) {
                                                    field.onChange(date)
                                                    setSelectedTime("")
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
                                        <Select
                                            value={field.value}
                                            onValueChange={(value => {
                                                field.onChange(value)
                                                setSelectedTime("")
                                            })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um serviço" />
                                            </SelectTrigger>
                                            <SelectContent>
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

                        {selectedServiceId && (
                            <div className='space-y-2'>
                                <Label className="font-semibold">Horários disponíveis:</Label>
                                <div className='bg-surface-slot-hover border border-border p-4 rounded-lg'>
                                    {loadingSlots ? (
                                        <p>Carregando horários...</p>
                                    ) : availableTimeSlots.length === 0 ? (
                                        <p>Nenhum horário disponível</p>
                                    ) : (
                                        <ScheduleTimeList
                                            onSelectTime={(time) => setSelectedTime(time)}
                                            clinicTimes={(clinic.times as string[]) ?? []}
                                            blockedTimes={blockedTimes}
                                            availableTimeSlots={availableTimeSlots}
                                            selectedTime={selectedTime}
                                            selectedDate={selectedDate}
                                            requiredSlots={
                                                clinic.services.find(service => service.id === selectedServiceId) ? Math.ceil(clinic.services.find(service => service.id === selectedServiceId)!.duration / 30) : 1
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {clinic.status ? (
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={!watch("name") || !watch("email") || !watch("phone") || !watch("date") || !watch("serviceId") || !selectedTime}
                            >
                                Realizar agendamento
                            </Button>
                        ) : (
                            <p className="bg-red-500 text-white text-center px-4 py-2 rounded-md">
                                A clinica está fechada nesse momento.
                            </p>
                        )}

                    </form>
                </Form>
            </section>

        </div>
    )
}