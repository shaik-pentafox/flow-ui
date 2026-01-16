// src/components/layouts/SideBar.tsx
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "../common/DynamicIcon";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: "Home",
  },
  {
    title: "Flow",
    url: "/flows",
    icon: "Waves",
  },
  {
    title: "Features",
    url: "/features",
    icon: "Blocks",
  },
  {
    title: "Inbox",
    url: "/inbox",
    icon: "Inbox",
  },
];

export function SideBar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Flow</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <NavLink key={item.title} to={item.url} end>
                  {({ isActive }) => (
                    <SidebarMenuItem>
                      <SidebarMenuButton className={cn("w-full", isActive && "bg-sidebar-accent text-sidebar-accent-foreground")}>
                        <DynamicIcon name={item.icon} />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </NavLink>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <SidebarTrigger label="Toggle Sidebar" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
