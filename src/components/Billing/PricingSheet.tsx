import { Tables } from "@datatypes.types";
import { User } from "@supabase/supabase-js";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import Pricing from "../Billing/Pricing";

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

interface PricingSheetProps {
  subscription: SubscriptionWithProduct | null;
  user: User | null;
  products: ProductWithPrices[] | null;
}

function PricingSheet({ user, products, subscription }: PricingSheetProps) {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant={"outline"}>Upgrade</Button>
      </SheetTrigger>
      <SheetContent className="lg:max-w-[70vw] sm:max-w-[90vw] text-left w-full">
        <SheetHeader>
          <SheetTitle>Change Subscription Plan</SheetTitle>
          <SheetDescription>
            Choose a plan which fits your needs and budget to continue using our service.
          </SheetDescription>
        </SheetHeader>


        <Pricing user={user} products={products ?? []} subscription={subscription} mostPopularProduct="pro" />


      </SheetContent>
    </Sheet>
  );
}

export default PricingSheet;
