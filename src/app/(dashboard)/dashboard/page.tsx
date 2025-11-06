import { getCredits } from "@/app/actions/credit-actions";
import { getImages } from "@/app/actions/image-action";
import { fetchModels } from "@/app/actions/model-actions";
import StatsCard from "@/components/dashboard/StatsCard";
import { createClient } from "@/lib/supabase/server";
import RecentImages from "@/components/dashboard/RecentImages";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentModels from "@/components/dashboard/RecentModels";

export  default async function Page() {


  const supabase = await createClient(
    process.env.SUPABASE_URL!,  
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const {data:{user}} = await supabase.auth.getUser();

  const {data: models , count : modelCount} = await fetchModels();


  const {data: credits} = await getCredits();
  const {data: imagesResponse} = await getImages();

  const images = imagesResponse?.results || [];
  const imageCount = images?.length || 0;


  
  return (
      <section className="container mx-auto flex-1 space-y-6 p-6">

        <div className="flex items-center justify-between">
          <h1 className="font-bold text-3xl tracking-tight">Welcome back , {user?.user_metadata.full_name}</h1>
        </div>

        <StatsCard
        imageCount = {imageCount}
         modelCount = {modelCount}
         credits = {credits}
         />


         <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
          {/* Recent Images */}
          <RecentImages images={images?.slice(0,6) ?? [] } />

          <div className="h-full flex sm:flex-row flex-col xl:space-y-6 xl:gap-0 gap-0 sm:gap-6 xl:col-span-1 col-span-full xl:flex-col space-y-6">

          {/* Quick Actions */}
        <QuickActions/>


          {/* Recent Models */}
          <RecentModels models={models ?? []} />
          </div>

          
         </div>


      </section>
  );
}
