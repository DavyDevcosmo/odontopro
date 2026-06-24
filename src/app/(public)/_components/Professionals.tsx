import {
    Card,
    CardContent,

} from "@/components/ui/card"
import Image from "next/image"
import fotoImg from '../../../../public/foto1.png'
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { PremiumCardBedge } from "./Premium-badge"
import { Prisma } from "../../../../prisma/generated/prisma/client"

type UserWithSubscription = Prisma.UserGetPayload<{
    include: {
        subscription: true,
    }
}>

interface ProfessionalsProps {
    professionals: UserWithSubscription[]
}

export function Professionals({ professionals }: ProfessionalsProps) {

    console.log("professionals:", professionals)
    return (
        <section className="bg-surface-page py-16" id="Profissionais">

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl text-center mb-12 font-bold text-content-primary">
                    Clinicas disponíveis
                </h2>

                <section
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >

                    {(professionals ?? []).map((clinic) => (
                        <Card className="overflow-hidden hover:shadow-lg duration-300" key={clinic.id}>
                            <CardContent className="p-0">
                                <div>
                                    <div className="relative h-48">
                                        <Image
                                            src={clinic.image ?? fotoImg}
                                            alt="Foto da clinica"
                                            fill
                                            className="object-cover"
                                        />

                                        {clinic?.subscription?.status === "active" && clinic?.subscription?.plan === "PROFESSIONAL" && <PremiumCardBedge />}
                                    </div>
                                </div>

                                <div className="p-4 space-y-4 min-h-[40] flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold">
                                                {clinic.name}
                                            </h3>
                                            <p className="text-sm text-content-secondary line-clamp-2">
                                                {clinic.address ?? "Endereço não informado."}
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/clinica/${clinic.id}`}
                                        target="_blank"
                                        className="w-full bg-accent-dark hover:bg-sidebar-text-muted-dark text-white flex items-center justify-center py-2 rounded-md text-sm md:text-base font-medium transition-colors"
                                    >
                                        Agendar horário
                                        <ArrowRight className="ml-2" />
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            </div>
        </section>
    )
} 