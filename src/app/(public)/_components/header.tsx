"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { LogIn, Menu } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import { handleRegister } from "../_actions/login"

export default function Header() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "#Profissionais", label: "Profissionais" }
  ]

  async function handleLogin() {
    await handleRegister("github")
  }


  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Button key={item.href} asChild
          className="bg-transparent hover:bg-transparent text-black shadow-none"
        >
          <Link href={item.href} className="text-base">
            {item.label}
          </Link>
        </Button>
      ))}

      {session ? (
        <Link href="/dashboard" className="flex items-center justify-center gap-2 bg-zinc-900 text-white py-1 rounded-md px-4">
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
    <header className="fixed top-0 right-0 left-0 z-[999] py-4 px-6 bg-white ">
      <div className="container mx-auto flex items-center pb-4 sm:pb-0 justify-between ">

        <Link href="/" className="text-3xl font-bold text-shadow-zinc-900">
          Odonto<span className="text-emerald-500">Pro</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <NavLinks />
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6 text-black" />
            </button>
          </SheetTrigger>



          <SheetContent side="right" className="w-[240px]
        sm:w-[300px] z-[9999]"
          >
            <SheetTitle>Menu</SheetTitle>
            <SheetHeader></SheetHeader>

            <SheetDescription>
              Veja nosso links
            </SheetDescription>

            <nav className="flex flex-col space-y-4 mt-6">
              <NavLinks />
            </nav>

          </SheetContent>
        </Sheet>

      </div>
    </header>
  )
}