"use client"

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import clsx from "clsx";
import { Banknote, CalendarCheck2, ChevronLeft, ChevronRight, Folder, List, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";


export function SidebarDashboard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isCollapse, setIsCollapse] = useState(false);


    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);


    if (!isMounted) {
        return null;
    }

    return (

        <div className="flex min-h-screen w-full bg-surface-page">

            <aside className={clsx("flex flex-col border-r border-sidebar-divider bg-sidebar-bg transition-all duration-300 p-4 h-full", {
                "w-20": isCollapse,
                "w-64": !isCollapse,
                "hidden md:flex md:fixed": true
            })}
            >

                <div className="mb-6 mt-4">
                    {!isCollapse && (
                        <h1 className="font-bold text-sidebar-text-primary text-xl">Psico<span className="text-accent-primary">Pro</span></h1>
                    )}
                </div>
                <Button
                    variant="outline"
                    className="border-sidebar-divider bg-sidebar-item-active text-sidebar-text-primary hover:bg-sidebar-text-muted-dark/30 self-end mb-2"
                    onClick={() => setIsCollapse(!isCollapse)}
                >
                    {!isCollapse ? <ChevronLeft className="w-12 h-12" /> : <ChevronRight className="w-12 h-12" />}
                </Button>

                {isCollapse && (
                    <nav className="flex flex-col gap-1 mt-2 overflow-hidden  ">
                        <SidebarLink
                            href="/dashboard"
                            label="Agendamentos"
                            pathname={pathname}
                            isCollapse={isCollapse}
                            icon={<CalendarCheck2 className="w-6 h-6" />}
                        />
                        <SidebarLink
                            href="/dashboard/services"
                            label="Serviços"
                            pathname={pathname}
                            isCollapse={isCollapse}
                            icon={<Folder className="w-6 h-6" />}
                        />

                        <SidebarLink
                            href="/dashboard/profile"
                            label="Meu perfil"
                            pathname={pathname}
                            isCollapse={isCollapse}
                            icon={<Settings className="w-6 h-6" />}
                        />

                        <SidebarLink
                            href="/dashboard/plans"
                            label="Serviços"
                            pathname={pathname}
                            isCollapse={isCollapse}
                            icon={<Banknote className="w-6 h-6" />}
                        />


                    </nav>
                )}

                <Collapsible open={!isCollapse}>
                    <CollapsibleContent>
                        <nav className="flex flex-col gap-1 overflow-y-hidden">
                            <span className="text-sm text-sidebar-text-secondary font-medium mt-1 uppercase">Painel</span>

                            <SidebarLink
                                href="/dashboard"
                                label="Agendamentos"
                                pathname={pathname}
                                isCollapse={isCollapse}
                                icon={<CalendarCheck2 className="w-6 h-6" />}
                            />
                            <SidebarLink
                                href="/dashboard/services"
                                label="Serviços"
                                pathname={pathname}
                                isCollapse={isCollapse}
                                icon={<Folder className="w-6 h-6" />}
                            />
                            <span className="text-sm text-sidebar-text-secondary font-medium mt-1 uppercase">Configurações</span>
                            <SidebarLink
                                href="/dashboard/profile"
                                label="Meu perfil"
                                pathname={pathname}
                                isCollapse={isCollapse}
                                icon={<Settings className="w-6 h-6" />}
                            />

                            <SidebarLink
                                href="/dashboard/plans"
                                label="Planos"
                                pathname={pathname}
                                isCollapse={isCollapse}
                                icon={<Banknote className="w-6 h-6" />}
                            />


                        </nav>
                    </CollapsibleContent>
                </Collapsible>

            </aside>

            <div className={clsx("flex flex-1 flex-col transition-all duration-300 bg-surface-page", {
                "md:ml-20": isCollapse,
                "md:ml-64": !isCollapse
            })}>

                <header className="md:hidden flex items-center justify-between border-b border-border px-2 md:px-6 h-14 z-10 sticky top-0 bg-surface-card">
                    <Sheet>
                        <div className="flex items-center gap-4">
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="md:hidden"
                                    onClick={() => setIsCollapse(false)}>
                                    <List className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>

                            <h1 className="text-base md:text-lg font-semibold text-content-primary">
                                Menu PsicoPro
                            </h1>
                        </div>

                        <SheetContent side="left" className="sm:max-w-xs bg-surface-card border-border text-content-primary">
                            <SheetTitle className="text-content-primary">
                                PsicoPro
                            </SheetTitle>
                            <SheetDescription className="text-content-secondary">
                                Menu administrativo
                            </SheetDescription>

                            <nav
                                className="grid gap-2 text-base pt-5">
                                <SidebarLink
                                    href="/dashboard"
                                    label="Agendamentos"
                                    pathname={pathname}
                                    isCollapse={isCollapse}
                                    icon={<CalendarCheck2 className="w-6 h-6" />}
                                    variant="menu"
                                />

                                <SidebarLink
                                    href="/dashboard/services"
                                    label="Serviços"
                                    pathname={pathname}
                                    isCollapse={isCollapse}
                                    icon={<Folder className="w-6 h-6" />}
                                    variant="menu"
                                />

                                <SidebarLink
                                    href="/dashboard/profile"
                                    label="Meu perfil"
                                    pathname={pathname}
                                    isCollapse={isCollapse}
                                    icon={<Settings className="w-6 h-6" />}
                                    variant="menu"
                                />

                                <SidebarLink
                                    href="/dashboard/plans"
                                    label="Planos"
                                    pathname={pathname}
                                    isCollapse={isCollapse}
                                    icon={<Banknote className="w-6 h-6" />}
                                    variant="menu"
                                />
                            </nav>
                        </SheetContent>
                    </Sheet>
                </header>

                <main className="flex-1 py-4 px-2 md:p-8 bg-surface-page">
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
    isCollapse: boolean;
    pathname: string;
    variant?: "sidebar" | "menu";
}

function SidebarLink({ href, icon, label, isCollapse, pathname, variant = "sidebar" }: SidebarItemProps) {
    const isActive = pathname === href;

    return (
        <Link href={href}>
            <div className={clsx("flex items-center gap-2 px-3 py-2 rounded-md transition-colors", {
                "bg-sidebar-item-active text-sidebar-text-primary": variant === "sidebar" && isActive,
                "text-sidebar-text-secondary hover:bg-sidebar-item-active hover:text-sidebar-text-primary": variant === "sidebar" && !isActive,
                "bg-status-chip-confirmed-bg text-status-chip-confirmed-text": variant === "menu" && isActive,
                "text-content-secondary hover:bg-surface-slot-hover hover:text-content-primary": variant === "menu" && !isActive,
            })}>
                <span className="w-6 h-6">{icon}</span>
                {!isCollapse && <span>{label}</span>}
            </div>
        </Link>

    )
}
