import { createClient } from "@/lib/supabase/server";
import React from 'react'
import { getProducts, getSubscription, getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import PlanSummary from "@/components/Billing/planSummary";
import { getCredits } from "@/app/actions/credit-actions";
import Pricing from "@/components/Billing/Pricing";

async function Billingpage() {

  
const supabase = await createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )
  

    const [user , products , subscription] = await Promise.all([
      getUser(supabase),   
      getProducts(supabase),
      getSubscription(supabase)
    ])
  
    if(!user){
      return redirect("/login")
    }


    const {data: credits} = await getCredits();




  return (
    <section className='container mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Plans and Billing</h1>
        <p className='text-muted-foreground'> 
          Manage your subscription and billing information.
        </p>
      </div>

      <div className='grid gap-10'>
        <PlanSummary credits={credits} subscription = {subscription} user ={user} products={products || []} />


        {
          subscription.status === "active" && <Pricing user={user}
           products={products ?? []}
            subscription ={subscription} 
            showInterval={false} 
            className="p-0 max-w-full "
            activeProduct={subscription.prices?.products?.name.toLowerCase() || "pro"}
            
            />
        }


      </div>

    </section>
  )
}

export default Billingpage