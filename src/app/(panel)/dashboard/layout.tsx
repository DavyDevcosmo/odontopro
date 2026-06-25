"use client"

import { SidebarDashboard } from "./_components/sideBar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SidebarDashboard>
                {children}
            </SidebarDashboard>
        </>
    )
}