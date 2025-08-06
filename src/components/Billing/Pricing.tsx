"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "../ui/animated-gradient-text";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Tables } from "@datatypes.types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";
import { Check } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { checkoutWithStripe } from "@/lib/stripe/server";
import { getErrorRedirect } from "@/lib/helpers";
import { getStripe } from "@/lib/stripe/client";
type Product = Tables<"products">;
type Price = Tables<"prices">;
type Subscription = Tables<"subscriptions">;

interface ProductWithPrices extends Product {
  prices: Price[];
}

interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface PricingProps {
  subscription: SubscriptionWithProduct | null;
  user: User | null;
  products: ProductWithPrices[] | null;
  mostPopularProduct: string
}

const renderPricingButton = ({
  subscription , user, product,price , mostPopularProduct , handelStripeCheckout ,handelStripePortalRequest
} : {
  subscription : SubscriptionWithProduct | null,
   user: User |null,
   product : ProductWithPrices | null,
   price:Price,
   mostPopularProduct : string,
   handelStripePortalRequest: () => Promise<void>,
   handelStripeCheckout: () => Promise<void>,


}) => {

 if(user && !subscription){
  return (
    <Button className="mt-8 w-full font-semibold" variant={ product.name?.toLowerCase() === mostPopularProduct.toLowerCase() ? "default" : "secondary"} onClick={()=> handelStripeCheckout(price)}>
      Subscribe
    </Button>
  )
 }

  return null


}



function Pricing({user , products, mostPopularProduct = "pro", subscription }: PricingProps) {
  const router = useRouter()
  const [billingInterval, setbillingInterval] = useState("month");
  // console.log(products);
  const currentPath = usePathname()

  const handelStripeCheckout = async (price : Price) =>{
    // console.log("Handel Stripe Checkout Function" , price)
    if(!user){
      return router.push('/login') 
    }

   const {errorRedirect , sessionId} =  await checkoutWithStripe(price , currentPath)

   if(errorRedirect){
    return router.push(errorRedirect)
   }

   if(!sessionId){
    return router.push(getErrorRedirect(
      currentPath, "An unknown error occured" , "Please try again later or contact us."
    ))
   }

   const stripe = await getStripe()
   stripe?.redirectToCheckout({sessionId})

  }
  
  const handelStripePortalRequest = () =>{
    return "stripe checkout function"

  }


  return (
    <>
      <div className="max-w-7xl mx-auto py-16 px-8 flex flex-col ">
        {/* Billing Period */}
        <div className="flex justify-center items-center space-x-4 py-12">
          <Label htmlFor="pricing-switch" className="font-semibold text-base">
            Monthly
          </Label>

          <Switch
            id="pricing-switch"
            checked={billingInterval === "year"}
            onCheckedChange={(checked) =>
              setbillingInterval(checked ? "year" : "month")
            }
          />

          <Label htmlFor="pricing-switch" className="font-semibold text-base">
            Yearly
          </Label>
        </div>

        {/* Products */}
        <div className="grid grid-cols-3 place-items-center space-y-4  gap-8">
          {products.map((product) => {
            const price = product?.prices?.find(
              (price) => price.interval === billingInterval
            );
            if (!price) return null;

            const priceString = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: price.currency!,
              minimumFractionDigits: 0,
            }).format((price?.unit_amount || 0) / 100);

            return (
              <div
                key={product.id}
                className={cn(
                  "border bg-background rounded-xl shadow-sm h-fit divide-border divide-y",
                  product.name?.toLowerCase() ===
                    mostPopularProduct.toLowerCase()
                    ? "border-primary bg-background drop-shadow-md scale-105"
                    : "border-border"
                )}
              >
                <div className="p-6">
                  <h2 className="text-2xl leading-6 font-semibold text-foreground flex items-center justify-between">
                    {product.name}

                    {product.name?.toLowerCase() ===
                    mostPopularProduct.toLowerCase() ? (
                      <Badge className="border-border font-semibold">
                        Most Popular
                      </Badge>
                    ) : null}
                  </h2>

                  <p className="text-muted-foreground mt-4 text-sm">
                    {product.description}
                  </p>

                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-foreground">
                      {priceString}
                    </span>
                    <span className="text-base font-medium text-muted-foreground ">
                      / {billingInterval}
                    </span>
                  </p>

                    {
                      renderPricingButton({subscription , user ,product , price , mostPopularProduct , handelStripeCheckout , handelStripePortalRequest})
                    }
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Pricing;
