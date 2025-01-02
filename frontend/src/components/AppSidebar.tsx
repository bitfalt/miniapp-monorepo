"use client";

import { Settings, Trophy, Activity, Brain, Crown, BarChart2, LogOut, Home } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useSidebar } from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()
  const { isMobile } = useSidebar()

  const sidebarVariant = isMobile ? "floating" : "inset"

  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Activity, label: "Tests", href: "/tests" },
    { icon: Brain, label: "Insights", href: "/insights" },
    { icon: Trophy, label: "Achievements", href: "/achievements" },
    { icon: BarChart2, label: "Leaderboard", href: "/leaderboard" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Crown, label: "Awaken Pro", href: "/pro" },
  ]

  return (
    <Sidebar variant={sidebarVariant} collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 mt-2 md:mt-0 group-data-[collapsible=icon]:justify-center">
          <Image 
            src="/mindvault-logo.png"
            alt="MindVault Logo"
            width={32} 
            height={32}
            className="object-contain w-8 h-8 md:w-10 md:h-10 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:h-12"
          />
          <h2 className="text-xl font-bold md:text-2xl group-data-[collapsible=icon]:hidden">
            MindVault
          </h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <SidebarMenuButton 
                className="h-10 md:h-12 text-base md:text-lg font-medium w-full pl-3 md:pl-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0"
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <item.icon className="mr-3 md:mr-4 h-5 w-5 md:h-6 md:w-6 group-data-[collapsible=icon]:mr-0" />
                <span className="group-data-[collapsible=icon]:hidden">
                  {item.label}
                </span>
              </SidebarMenuButton>
            </Link>
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-sidebar-accent shrink-0 bg-sidebar-accent">
              <AvatarFallback className="text-black">JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold text-sidebar-foreground">John Doe</span>
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <SidebarMenuButton 
            className="h-10 md:h-12 text-base md:text-lg font-medium text-red-500 hover:bg-red-500/10 pl-3 md:pl-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0 group-data-[collapsible=icon]:-ml-1"
            tooltip="Logout"
          >
            <LogOut className="mr-3 md:mr-4 h-5 w-5 md:h-6 md:w-6 group-data-[collapsible=icon]:mr-0" />
            <span className="group-data-[collapsible=icon]:hidden">
              Logout
            </span>
          </SidebarMenuButton>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}