"use client"

import { SidebarDashboard } from "./components/sideBar"




export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SidebarDashboard>
                {children}
            </SidebarDashboard>
        </>
    )
}