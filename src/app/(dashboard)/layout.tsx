import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "../globals.css";
import { AppSidebar } from "@/components/app-sidebar"


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <SidebarTrigger className="-ml-1" />

    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {children}
    </main>

      </SidebarInset>
    </SidebarProvider>
  );
}
