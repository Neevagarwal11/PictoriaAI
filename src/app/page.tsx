import Image from "next/image";
import Pricing from "@/components/landingPage/Pricing";
import { createClient } from "@/lib/supabase/server";
import { getProducts, getUser } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import Navigation from "@/components/landingPage/Navigation";
import HeroSection from "@/components/landingPage/HeroSection";
import Features from "@/components/landingPage/Features";
import Testimonials from "@/components/landingPage/Testimonials";
import Faqs from "@/components/landingPage/Faqs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Footer from "@/components/landingPage/Footer";


export default async function Home() {
  const supabase = await createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const [user, products] = await Promise.all([
    getUser(supabase), //gets currently logged in user
    getProducts(supabase), //gets list of active products from supabase
  ]);

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <main className="flex flex-col min-h-screen items-center justify-center">
      <Navigation />
      <HeroSection />
      <Features />
      <Testimonials />
      <Pricing products={products ?? []} />
      <Faqs />

      <section className="w-full mt-16 px-16 bg-muted">
        <div className="container px-6 xs:px-8 sm:px-0 sm:mx-8 lg:mx-auto">
          <div className="flex flex-col p-10 items-center space-y-4 text-center">
            <h2 className="subHeading font-bold">
              Ready to Transform your Photos?
            </h2>
            <p className="subText mt-4 text-center">
              Join thousands of users who are already creating amazing
              AI-generated images.
            </p>
            <Link href="/login?state=signup">
              <Button className="rounded-md text-base h-12">
                ✨ Create Your First AI Model
              </Button>
            </Link>
          </div>
        </div>
      </section>

    <Footer/>
    </main>
  );
}
