"use client"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LogIn, Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)

    const navItems = [
        { href: "#Profissionais", label: "Profissionais"}
    ]
    const session = null

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
          <Link href="/dasboard"
          className="flex items-center justify-center gap-2">
            Acesar clinica
          </Link>
        ) : (
          <Button className="w-1/2">
            <LogIn/>
Portal da clinica
          </Button>
        )}
        </>
    )



  return (
   <header className="fixed top-0 right-0 left-0 z-{999} py-4 px-6 bg-white ">
    <div className="container mx-auto flex items-center justify-between ">

      <Link href="/" className="text-3xl font-bold text-shadow-zinc-900">
      Odonto<span className="text-emerald-500">Pro</span>
      </Link>

      <nav className="hidden md:flex items-center space-x-4">
      <NavLinks/>
      </nav>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="md:hidden">
          <Button
          className="text-black hover:bg-transparent"
          variant="ghost"
          size="icon">
            <Menu className="w-6 h-6"/>
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-{240xp
        sm:w-{300px} z-{9999}"
        >
          <SheetTitle>Menu</SheetTitle>
          <SheetHeader></SheetHeader>

          <SheetDescription>
            Veja nosso links
          </SheetDescription>

      <nav className="flex flex-col space-y-4 mt-6">
          <NavLinks/>
      </nav>

        </SheetContent>
      </Sheet>

    </div>
   </header>
  )
}