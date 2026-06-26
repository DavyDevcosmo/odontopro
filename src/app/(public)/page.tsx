
import { Footer } from "./_components/Footer";
import Header from "./_components/Header";
import { Hero } from "./_components/Hero";
import { Professionals } from "./_components/Professionals";
import { getProfessionals } from "./data-access/get-professional";


export const revalidate = 120;

export default async function Home() {

  const professionals = await getProfessionals();



  return (
    <div className="flex flex-col min-h-screen bg-surface-page">
      <Header />

      <div>
        <Hero />

        <Professionals professionals={professionals || []} />

        <Footer />
      </div>
    </div>
  )
}