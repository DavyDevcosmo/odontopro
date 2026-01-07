"use client"

import { Footer } from "./_components/Footer";
import Header from "./_components/Header";
import { Hero } from "./_components/Hero";
import { Professionals } from "./_components/Professionals";

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