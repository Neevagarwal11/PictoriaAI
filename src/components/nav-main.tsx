"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChevronsUpDown,
  Command,
  CreditCard,
  Frame,
  FrameIcon,
  GalleryVerticalEnd,
  Image,
  Images,
  Layers,
  Map,
  PieChart,
  Settings2,
  SparkleIcon,
  Sparkles,
  SquareTerminal,
} from "lucide-react"


  const navItems = [
      {
          title:"Dashboard",
          url:"/dashboard",
          icon: SquareTerminal,
      },
      {
          title:"Generate Image", 
          url:"/image-generation",
          icon: Image ,
      },
      {
          title:"My Models", 
          url:"/models",
          icon: FrameIcon ,
      },
      {
          title:"Train Model", 
          url:"/model-training",
          icon: Layers ,
      },
      {
          title:"My Images", 
          url:"/gallery",
          icon: Images ,
      },
      {
          title:"Billing", 
          url:"/billing",
          icon: CreditCard ,
      },
      {
          title:"Settings", 
          url:"/account-settings",
          icon: Settings2
      },
  ]
    
export function NavMain() {

  const pathname = usePathname()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu> 
        {navItems.map((item) => (
          <Link key={item.title} href={item.url}  className={cn("rounded-none" , 
            pathname === item.url? 'text-primary bg-primary/5' : 'text-muted-foreground' 
          )} >
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
