"use client"
import { useState } from 'react'
import { profileFormData, useProfileForm } from './profile-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Prisma } from '../../../../../../prisma/generated/prisma/browser'
import { updateProfile } from '../_actions/update-profile'
import { toast } from 'sonner'
import { formatPhone } from "@/utils/formatPhone"
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { AvatarProfile } from './profile-avatar'
import { useTimeSlotPicker } from './use-time-slot-picker'
import { TimeZoneSelect } from './time-zone-select'

type UserWithSubscriptions = Prisma.UserGetPayload<{
    include: {
        subscription: true
    }
}>

interface ProfileContentProsps {
    user: UserWithSubscriptions;
}

export function ProfileContent({ user }: ProfileContentProsps) {
    const router = useRouter();
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const { update } = useSession();

    const { selectedHours, toggleHour, hours } = useTimeSlotPicker(
        Array.isArray(user.times) ? (user.times as string[]) : []
    )

    const form = useProfileForm(
        {
            name: user.name,
            address: user.address,
            phone: user.phone,
            status: user.status,
            timeZone: user.timeZone
        }
    );


    async function onSubmit(values: profileFormData) {

        const response = await updateProfile({
            name: values.name,
            address: values.address,
            phone: values.phone,
            status: values.status === "active" ? true : false,
            timeZone: values.timeZone,
            times: selectedHours || [],

        })
        if (response.error) {
            toast.error(response.error)
            return;
        }
        toast.success(response.data)

    }

    async function handleLogout() {
        await signOut();
        await update();
        router.replace("/")
    }

    return (
        <div className='mx-auto'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Meu Perfil</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='flex justify-center'>
                                <AvatarProfile
                                    avatarUrl={user.image}
                                    userId={user.id} />
                            </div>

                            <div className='space-y-4'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>Nome completo</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='Digite o nome da clinica...'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>
                                                Endereço completo:
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='Digite o endereço da clinica...'
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
                                        <FormItem>
                                            <FormLabel className='font-semibold'>
                                                Telefone
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='(99) 993234-5678'
                                                    onChange={(e) => {
                                                        const formattedPhone = formatPhone(e.target.value);
                                                        field.onChange(formattedPhone);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>
                                                Status da clinica
                                            </FormLabel>
                                            <FormControl >

                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value ? "active" : "inactive"}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o status da clincia" />
                                                    </SelectTrigger>
                                                    <SelectContent className='bg-surface-card border-border'>
                                                        <SelectItem value="active">ATIVO (clinica aberta)</SelectItem>
                                                        <SelectItem value="inactive">INATIVO (clinica fechada)</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className='space-y-2'>
                                    <Label className='font-semibold'>
                                        Configurar horários da clinica
                                    </Label>

                                    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen} >
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className='w-full justify-between'>
                                                Clique aqui para selecionar horários
                                                <ArrowRight className='w-5 h-5' />
                                            </Button>
                                        </DialogTrigger>

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Horários da clinica</DialogTitle>
                                                <DialogDescription>
                                                    Selecione abaixo os horários de funcionamento da clinica:
                                                </DialogDescription>
                                            </DialogHeader>

                                            <section className='py-4'>
                                                <p className='text-sm text-content-secondary mb-2'>
                                                    Clique nos horários abaixo para marcar ou desmcar:
                                                </p>

                                                <div className='grid grid-cols-5 gap-2'>
                                                    {hours.map((hour) => (
                                                        <Button
                                                            key={hour}
                                                            variant="outline"
                                                            className={cn('h-10', selectedHours.includes(hour) && 'border-2 border-accent-primary text-content-primary')}
                                                            onClick={() => toggleHour(hour)}
                                                        >
                                                            {hour}
                                                        </Button>
                                                    ))}
                                                </div>

                                            </section >

                                            <Button
                                                className='w-full'
                                                onClick={() => setDialogIsOpen(false)}
                                            >
                                                Fechar modal
                                            </Button>

                                        </DialogContent>
                                    </Dialog>

                                </div>


                                <FormField
                                    control={form.control}
                                    name="timeZone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-semibold'>
                                                Selecione o fuso horário
                                            </FormLabel>
                                            <FormControl>
                                                <TimeZoneSelect
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className='w-full'
                                >
                                    Salvar alterações
                                </Button>

                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>

            <section className='mt-4'>
                <Button className='bg-red-500 hover:bg-red-400' variant="destructive" onClick={handleLogout}>
                    Sair da conta
                </Button>
            </section>
        </div>
    )
}