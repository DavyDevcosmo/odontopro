"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import DoctorImg from "../../../../public/doctor-hero.png";

export function Hero() {
    return (
        <section className="bg-white">
            <div className="container mx-auto px-4 pt-20 sm:px-6 lg:px-8">

                <main className="flex items-center justify-center ">
                    <article className="flex-[2] max-w-3xl space-y-8 flex flex-col justify-center">
                        <h1 className="text-4xl lg:text-5xl font-bold max-w-2xl">
                            Encontre os melhores profissionais em um único local!
                        </h1>
                        <p className="text-base md:text-lg text-gray-600">Nós somos uma plataforma para proficionais da saúde com foco em agilizar seu atendimeto de forma simplificada e organizada.</p>

                        <Button className="bg-emerald-500  hover:bg-emerald-400 w-fit">
                            Encontar uma clinica
                        </Button>
                    </article>

                    <div className="hidden lg:block">
                        <Image
                            src={DoctorImg}
                            alt="Foto ilustrativa de um proficional de saúde"
                            width={340}
                            height={400}
                            className="object-container"
                            quality={100}
                            priority
                        />
                    </div>

                </main>

            </div>
        </section>
    )
}