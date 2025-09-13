import Header from "./(public)/_components/header";
import { Hero } from "./(public)/_components/Hero";

export default function Home() {
  return(
    <div className="flex flex-col min-h-screen">
      <Header/>

      <div>
       <Hero/>
      </div>
    </div> 
  )
}