import { Footer } from "./(public)/_components/footer";
import Header from "./(public)/_components/header";
import { Hero } from "./(public)/_components/hero";
import { Professionals } from "./(public)/_components/professionals";



export default function Home() {
  return(
    <div className="flex flex-col min-h-screen">
      <Header/>

      <div>
       <Hero/>
       <Professionals/>
       <Footer/>
      </div>
    </div> 
  )
}