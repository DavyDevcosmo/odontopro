"use client"

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import clsx from "clsx";
import { Banknote, CalendarCheck2, Folder, List, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";


export function SidebarDasboard({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();
    const [inCollapse, setInCollapse] = useState(false);


    return (

        <div className="flex min-h-screen w-full">
            <div className={clsx("flex  flex-1 flex-col transition-all duation-300", {
                "md:ml-20": inCollapse,
                "md:ml-64": !inCollapse
            })}>

                <header className="md:hidden flex items-center justify-between border-b px-2 md:px-6 h-14 z-10 sticky top-0 bg-white">
                    <Sheet>
                        <div className="flex items-center gap-4">
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="md:hidden">
                                    <List className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>

                            <h3 className="text-base md:text-lg font-semibold">
                                Menu OadontoPRO
                            </h3>
                        </div>

                        <SheetContent side="left" className="sm:max-w-xs text-black">
                            <SheetTitle>
                                OdontoPRO
                            </SheetTitle>
                            <SheetDescription>
                                Menu adiminitrativo
                            </SheetDescription>

                            <nav
                                className="grid gap-2 text-base pt-5">
                                <SidebarLink
                                    href="/dasboard"
                                    label="Agendamentos"
                                    pathname={pathname}
                                    inCollapse={inCollapse}
                                    icon={<CalendarCheck2 className="w-6 h-6" />}
                                />

                                <SidebarLink
                                    href="/dasboard/services"
                                    label="Serviços"
                                    pathname={pathname}
                                    inCollapse={inCollapse}
                                    icon={<Folder className="w-6 h-6" />}
                                />

                                <SidebarLink
                                    href="/dasboard/profile"
                                    label="Meu perfil"
                                    pathname={pathname}
                                    inCollapse={inCollapse}
                                    icon={<Settings className="w-6 h-6" />}
                                />

                                <SidebarLink
                                    href="/dasboard/plans"
                                    label="Serviços"
                                    pathname={pathname}
                                    inCollapse={inCollapse}
                                    icon={<Banknote className="w-6 h-6" />}
                                />
                            </nav>
                        </SheetContent>
                    </Sheet>
                </header>

                <main className="flex-1 py-4 px-2 md:p-8">
                    {children}
                </main>

            </div>
        </div>
    )
}

interface SidebarItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    inCollapse: boolean;
    pathname: string;
}

function SidebarLink({ href, icon, label, inCollapse, pathname }: SidebarItemProps) {
    return (
        <Link
            href={href}
        >
            <div className={clsx("flex items-center gap-2 px-3 py-2 rounded-md transition-colors", {
                "text-white bg-blue-500": pathname === href,
                "text-gray-700 hover:bg-gray-100": pathname !== href,
            })}>
                <span className="w-6 h-6">{icon}</span>
                {!inCollapse && <span>{label}</span>}
            </div>
        </Link>

    )
}
