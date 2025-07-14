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


type Product = Tables<"products">
type Price = Tables<"prices">

interface ProductWithPrices extends Product{
    prices : Price[]
}


interface PricingProps{
    products : ProductWithPrices[],
    mostPopularProduct? :string
}

function Pricing({products , mostPopularProduct = "pro"} : PricingProps) {
  const [billingInterval, setbillingInterval] = useState("month");
    console.log(products)

  return (
    <>
    <div className="w-full bg-muted flex flex-col items-center justify-center">
      <div className="text-center flex flex-col items-center justify-center">
        <div className="w-full container mx-auto py-32 flex flex-col items-center justify-center space-y-8">
          {/* Magic Ui compo */}
          <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
            <span
              className={cn(
                "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
              )}
              style={{
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "destination-out",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "subtract",
                WebkitClipPath: "padding-box",
              }}
            />
            <AnimatedGradientText className="text-sm font-medium">
              Pricing
            </AnimatedGradientText>
          </div>

          <h1 className="mt-4 capitalize text-4xl font-bold">
            Choose the plan that fits your need
          </h1>
          <p className="text-base text-muted-foreground max-w-3xl">
            Choose an affordable plan that is packed with the best features for
            engaging you audience , creating customer loyalty and driving sales.
          </p>
        </div>
      </div>

{/* Billing Period */}
      <div className="flex justify-center items-center space-x-4 py-8">
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

      <div className="grid grid-cols-3 place-items-center mx-auto gap-8 ">
        {
            products.map(product => {

                const price = product?.prices?.find(price => price.interval === billingInterval)
                if(!price) return null

                const priceString  = new Intl.NumberFormat("en-US" , {
                    style: "currency",
                    currency: price.currency!,
                    minimumFractionDigits:0
                }).format((price?.unit_amount || 0) /100)




                return <div key={product.id} className="border bg-background rounded-xl shadow-sm h-fit" >
                   <div className="p-6">
                        <h2 className="text-2xl leading-6 font-semibold text-foreground flex items-center justify-between">{product.name}

                            {
                                product.name?.toLowerCase() === mostPopularProduct.toLowerCase()? <Badge className="border-border font-semibold">
                                    Most Popular
                                </Badge> : null
                            }

                        </h2>

                        <p className="text-muted-foreground mt-4 text-sm">
                            {product.description}
                        </p>

                        <p className="mt-8">
                            <span className="text-4xl font-extrabold text-foreground">{priceString}</span>
                            <span className="text-base font-medium text-muted-foreground ">/ {billingInterval}</span>
                        </p>

                            <Link href="/login?state=signup" >
                                <Button className="mt-8 w-full font-semibold" variant = {product?.name?.toLowerCase() === mostPopularProduct.toLowerCase( ) ? "default" : "secondary"} >Subscribe</Button>
                            </Link>

                            <div className="pt-6 pb-8 px-6">

                                <h3>What is </h3>
                                
                            </div>


                    </div> 
                </div>
            })
        }
      </div>


    </div>
    </>
  );
}

export default Pricing;
