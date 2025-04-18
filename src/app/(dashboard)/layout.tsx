import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "../globals.css";
import { AppSidebar } from "@/components/app-sidebar"
import { createClient } from "@/lib/supabase/server";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const supabase = await createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
  const {data} = await supabase.auth.getUser()

  const user = {
    name:data.user?.user_metadata?.full_name || "Guest",
    email:data.user?.email ?? " ",
  }


  return (
    
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <div className="w-fit flex items-center gap-2 my-2 px-4"></div>
      <SidebarTrigger className="px-6 " /> 

    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {children}
    </main>

      </SidebarInset>
    </SidebarProvider>
  );
}
