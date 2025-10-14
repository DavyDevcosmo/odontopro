"use client"

import { Footer } from "./(public)/_components/Footer"
import Header from "./(public)/_components/Header"
import { Hero } from "./(public)/_components/Hero"
import { Professionals } from "./(public)/_components/Professionals";



export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div>
        <Hero />
        <Professionals />
        <Footer />
      </div>
    </div>
  )
}