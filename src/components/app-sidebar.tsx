"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  History,
  Home,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { SidebarPlaylistSection } from "./sidebar-playlist-section";

// This is sample data.
const data = {
  navMain: [
    { title: "Home", url: "/", icon: Home },
    { title: "Subscriptions", url: "/subscriptions", icon: BookOpen },
    { title: "History", url: "/history", icon: History },
  ],
  navMain2: [
    { title: "Me", url: "/me", icon: GalleryVerticalEnd },
    { title: "History", url: "/history", icon: Map },
    { title: "Explore", url: "/explore", icon: Command },
    { title: "Broadcast", url: "/broadcast", icon: Bot },
  ],
  navMain3: [
    { title: "Community", url: "/community", icon: PieChart },
    { title: "Explorer", url: "/explorer", icon: Frame },
  ],
  footer: [
    { title: "Settings", url: "/settings", icon: Settings2 },
    { title: "Report history", url: "/report-history", icon: Frame },
  ],
};

function SidebarContentWithState() {
  const { state } = useSidebar();
  
  return (
    <SidebarContent>
      <NavMain items={data.navMain} title="Main Operations" />
      {/* <NavMain items={data.navMain2} title="Me" /> */}
      {/* <NavMain items={data.navMain3} title="Community" /> */}
      {state === "expanded" && <SidebarPlaylistSection />}
    </SidebarContent>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group-data-[collapsible=icon]:hidden"
          >
            <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
            <span className="font-semibold">TheMasterA</span>
          </Link>
          <SidebarTrigger />
        </div> */}
      </SidebarHeader>
      <SidebarContentWithState />
      <SidebarFooter>
        <NavMain items={data.footer} />
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
