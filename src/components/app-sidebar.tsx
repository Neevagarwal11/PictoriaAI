import * as React from "react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Image, Sparkles } from "lucide-react"
import { createClient } from '@/lib/supabase/server'
import { NavUser } from "./nav-user"

// This is sample data.


interface AppSidebarProps {
  user: {
    name: string;
    email: string;
  };
}


export async function AppSidebar( {
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {user:{name:string ; email:string}}) {


//   const supabase = await createClient(
//     process.env.SUPABASE_URL!,
//     process.env.SUPABASE_ANON_KEY!
//   )
//   const {data} = await supabase.auth.getUser()


//   const user = {
//     name:data.user?.user_metadata?.full_name,
//     email:data.user?.email ?? " ",
//   }
// console.log("user", user)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                      Pictoria AI
                  </span>
                  <span className="truncate text-xs">Pro</span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <NavMain  />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
