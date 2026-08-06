"use client"


import { LogIn, Menu } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "#Profissionais", label: "Profissionais" }
  ]

  async function handleLogin() {
    await signIn("google", { callbackUrl: "/dashboard" })
  }


  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Button key={item.href} asChild
          className="bg-transparent hover:bg-transparent text-content-primary hover:text-accent-primary shadow-none"
        >
          <Link href={item.href} className="text-base">
            {item.label}
          </Link>
        </Button>
      ))}

      {session ? (
        <Link href="/dashboard" className="flex items-center justify-center gap-2 bg-accent-dark text-white hover:bg-sidebar-text-muted-dark transition-colors py-1 rounded-md px-4">
          Acessar clínica
        </Link>
      ) : (
        <Button onClick={handleLogin}>
          <LogIn />
          Portal da clínica
        </Button>
      )}
    </>
  )

  return (
    <header className="fixed top-0 right-0 left-0 z-[999] py-4 px-6 bg-surface-card border-b border-border">
      <div className="container mx-auto flex items-center pb-4 sm:pb-0 justify-between ">

        <Link href="/" className="text-3xl font-bold text-content-primary">
          Psico<span className="text-accent-primary">Pro</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <NavLinks />
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-content-primary hover:bg-surface-slot-hover hover:text-content-primary"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[240px] sm:w-[300px] z-[9999] bg-surface-card border-border"
          >
            <SheetTitle className="text-content-primary text-center">Menu</SheetTitle>
            <SheetHeader></SheetHeader>

            <SheetDescription className="text-content-secondary text-center">
              Veja nossos links
            </SheetDescription>

            <nav className="flex flex-col items-center space-y-4 mt-6 text-center">
              <NavLinks />
            </nav>

          </SheetContent>
        </Sheet>

      </div>
    </header>
  )
}
