"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Reminder } from "@/prisma/client"
import { Plus, Trash } from "lucide-react"
import { deleteReminder } from "../../_actions/delete-reminder"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ReminderContent } from "./reminder-content"
import { useState } from "react"

interface RemindersListProps {
    reminder: Reminder[]
}

export function ReminderList({ reminder }: RemindersListProps) {

    const router = useRouter()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    async function handleDeleteReminder(id: string) {
        const response = await deleteReminder({ reminderId: id })

        if (response.error) {
            toast.error(response.error)
            return;
        }

        toast.success(response.data);
        router.refresh();
    }

    return (
        <div className="flex flex-col gap-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl md:text-2xl font-bold">
                        Lembretes
                    </CardTitle>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="w-9 h-9">
                                <Plus className="w-5 h-5" />
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Novo Lembrete</DialogTitle>
                                <DialogDescription>Criar um novo lembrete para sua lista</DialogDescription>
                            </DialogHeader>

                            <ReminderContent
                                closeDialog={() => setIsDialogOpen(false)} />
                        </DialogContent>

                    </Dialog>
                </CardHeader>

                <CardContent>
                    {reminder.length === 0 && (
                        <p className="text-sm text-content-muted">Nenhum lembrete cadastrado</p>
                    )}

                    <ScrollArea className="h-[340px] lg:max-h-[calc(100vh-15rem)] pr-0 w-full flex-1" >


                        {reminder.map((item) => (
                            <article
                                key={item.id}
                                className="flex flex-wrap flex-row items-center justify-between py-2 bg-surface-slot-hover border border-border mb-2 px-2 rounded-md">
                                <p className="text-sm lg:text-base">{item.description}</p>

                                <Button className="bg-red-500 hover:bg-red-400 shadow-none rounded-full p-4"
                                    size="sm"
                                    onClick={() => handleDeleteReminder(item.id)}>
                                    <Trash className="w-4 h-4 text-white" />
                                </Button>
                            </article>
                        ))}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}