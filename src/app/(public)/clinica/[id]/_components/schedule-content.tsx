
"use client"

import { useState, useCallback } from 'react'

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
import { ClinicHeader } from './clinic-header'
import { useBlockedTimeSlots } from './use-blocked-time-slots'

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
    const clearSelectedTime = useCallback(() => setSelectedTime(""), [])

    const clinicTimes = (clinic.times as string[]) || []
    const { blockedTimes, availableTimeSlots, loadingSlots } = useBlockedTimeSlots(
        clinic.id,
        clinicTimes,
        selectedDate,
        selectedTime,
        clearSelectedTime,
    )

    async function handleRegisterAppointmnent(formData: AppointmentFormData) {
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

        const response = await createNewAppointment({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            date: formData.date,
            serviceId: formData.serviceId,
            time: selectedTime,
            clinicId: clinic.id
        });

        if (response.error) {
            toast.error(response.error)
            return;
        }

        toast.success("Consulta agendada com sucesso!")
        form.reset();
        setSelectedTime("")
    }

    const selectedService = clinic.services.find(service => service.id === selectedServiceId)

    return (
        <div className="min-h-screen flex flex-col bg-surface-page">
            <div className="h-32 bg-accent-primary" />

            <ClinicHeader
                name={clinic.name}
                image={clinic.image}
                address={clinic.address}
            />

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
                                            clinicTimes={clinicTimes}
                                            blockedTimes={blockedTimes}
                                            availableTimeSlots={availableTimeSlots}
                                            selectedTime={selectedTime}
                                            selectedDate={selectedDate}
                                            requiredSlots={
                                                selectedService ? Math.ceil(selectedService.duration / 30) : 1
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
                                A clinica está fechada nesse momento.
                            </p>
                        )}

                    </form>
                </Form>
            </section>

        </div>
    )
}
