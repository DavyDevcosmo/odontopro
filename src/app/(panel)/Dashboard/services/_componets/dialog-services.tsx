"use client"

import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DialogServiceFormData, useDialogServiceForm } from "./dialog-services-form"
import { FormProvider } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { convertRealToCents } from "@/utils/convertCurrent"
import { createNewService } from "../_actions/create-servicer"
import { updateService } from "../_actions/update-serve"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { set } from "zod"


interface DialogServiceProsps {
    closeModal: () => void;
    serviceId?: string;
    initialValues?: {
        name: string;
        price: string;
        hours: string;
        minutes: string;
    }
}

export function DialogServices({ closeModal, initialValues, serviceId }: DialogServiceProsps) {

    const form = useDialogServiceForm({ initialValues: initialValues })
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function onSubmit(values: DialogServiceFormData) {
        setLoading(true);
        const priceInCents = convertRealToCents(values.price)
        const hours = parseInt(values.hours) || 0;
        const minutes = parseInt(values.minutes) || 0;

        //converte as horas e minutos paraduração total em minutos;
        const duration = (hours * 60) + minutes;

        if (serviceId) {
            await editServiceById({
                serviceId: serviceId,
                name: values.name,
                priceInCents: priceInCents,
                duration: duration
            })

            return;
        }

        const response = await createNewService({
            name: values.name,
            price: priceInCents,
            duration: duration,
        })

        setLoading(false);

        if (response.error) {
            toast.error(response.error)
            return;
        }

        toast.success("Serviço cadastrado com sucesso")
        handleCloseModal();
        router.refresh();
    }


    async function editServiceById({
        serviceId,
        name,
        priceInCents,
        duration }: {
            serviceId: string,
            name: string,
            priceInCents: number,
            duration: number
        }) {

        const response = await updateService({
            serviceId: serviceId,
            name: name,
            price: priceInCents,
            duration: duration
        })

        setLoading(false);

        if (response.error) {
            toast(response.error)
            return;
        }

        toast(response.data)
        handleCloseModal();

    }

    function handleCloseModal() {
        form.reset();
        closeModal();
    }

    function changeCurrenvy(event: React.ChangeEvent<HTMLInputElement>) {
        let { value } = event.target;
        value = value.replace(/\D/g, "");

        if (value) {
            value = (parseInt(value, 10) / 100).toFixed(2);
            value = value.replace('.', ',')

            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        event.target.value = value;
        form.setValue("price", value)
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Novo Serviço </DialogTitle>
                <DialogDescription>
                    Adicione um novo serviço
                </DialogDescription>
            </DialogHeader>

            <FormProvider  {...form}>
                <form className="space-y-2"
                    onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">
                                        Nome do Serviço:
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome do Serviço" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">
                                        Valor do Serviço:
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="39,99" {...field}
                                            onChange={changeCurrenvy} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <p className="font-semibold">Tempo de duração de serviço:</p>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="hours"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">
                                        Horas:
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="1"
                                            min="0"
                                            type="number"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="minutes"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">
                                        Minutos:
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="0"
                                            min="0"
                                            type="number"
                                            {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full font-semibold text-white bg-black"
                        disabled={loading}>
                        {loading ? "Carregando..." : `${serviceId ? "Atualizar serviço" : "Cadastrar serviço"}`}
                    </Button>

                </form>
            </FormProvider >
        </>
    )
}