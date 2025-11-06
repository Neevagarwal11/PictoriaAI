import Image from "next/image";
import Pricing from '@/components/landingPage/Pricing'
import { createClient } from "@/lib/supabase/server";
import { getProducts, getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import Navigation from "@/components/landingPage/Navigation";
import HeroSection from "@/components/landingPage/HeroSection";
import Features from "@/components/landingPage/Features";
import Testimonials from "@/components/landingPage/Testimonials";

export default async function Home() {

  const supabase = await createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )

  const [user , products] = await Promise.all([
    getUser(supabase),    //gets currently logged in user
    getProducts(supabase) //gets list of active products from supabase
  ])

  if(user){
    return redirect('/dashboard')
  }

  return (
    <main className="flex flex-col min-h-screen items-center justify-center">

    <Navigation/>
    <HeroSection/>
    <Features/>
    <Testimonials/>
    <Pricing products={products ?? []} />
    </main>
     
  );
}
