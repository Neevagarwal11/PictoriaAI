import Image from "next/image";
import Pricing from '@/components/landingPage/Pricing'
import { createClient } from "@/lib/supabase/server";
import { getProducts, getUser } from "@/lib/supabase/queries";

export default async function Home() {

  const supabase = await createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )

  const [user , products] = await Promise.all([
    getUser(supabase),   
    getProducts(supabase)
  ])

  // if(user){
  //   return redirect('/dashboard')
  // }

  return (
    <main className="flex flex-col min-h-screen items-center justify-center">

    
    <Pricing products={products ?? []} />
    </main>
     
  );
}
