"use client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ReminderFormData, useReminderForm } from "./reminder-form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createReminder } from "../../_actions/create-reminder"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface RemindersContentProps {
    closeDialog: () => void;
}

export function ReminderContent({ closeDialog }: RemindersContentProps) {

    const form = useReminderForm()
    const router = useRouter();

    async function onSubmit(formData: ReminderFormData) {

        const response = await createReminder({ description: formData.description })

        if (response.error) {
            toast.error(response.error)
            return;
        }

        toast.success(response.data)
        router.refresh();
        closeDialog();
    }
    return (
        <div className="grid gap-4 py-4">
            <Form {...form}>
                <form className="flex flex-col gap-4"
                    onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-semibold">
                                    Nome do lembrete
                                </FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="Digite o nome do lembrete" className="max-h-52" />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button type="submit"
                        disabled={!form.watch("description")}>
                        Cadastrar lembrete
                    </Button>
                </form>

            </Form>

        </div>
    )
}