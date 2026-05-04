
import { Footer } from "./(public)/_components/Footer"
import Header from "./(public)/_components/Header"
import { Hero } from "./(public)/_components/Hero"
import { Professionals } from "./(public)/_components/Professionals";
import { getProfessionals } from "./(public)/data-acess/get-professional";

export const revalidate = 120;

export default async function Home() {
  const professionals = await getProfessionals();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div>
        <Hero />
        <Professionals professionals={professionals} />
        <Footer />
      </div>
    </div>
  )
}