// src/components/layouts/SideBar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "../common/DynamicIcon";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/hooks/useTheme";

export function SideBar() {
  const { logout, isSuperAdmin } = useAuthStore.getState();
  const { isDarkMode } = useTheme();

  // Menu items.
  const items = [
    {
      title: "Dashboard",
      url: "/",
      icon: "Home",
    },
    {
      title: "Flow",
      url: "/flows",
      icon: "Waves",
    },
    isSuperAdmin && {
      title: "Features",
      url: "/features",
      icon: "Blocks",
    },
    isSuperAdmin && {
      title: "Inbox",
      url: "/inbox",
      icon: "Inbox",
    },
  ].filter(Boolean);

  return (
    <Sidebar collapsible="icon" className="group">
      <SidebarHeader className="flex items-start justify-start overflow-hidden">
        {/* <img src={isDarkMode ? "/darkLogo.png" : "/logo.png"} alt="Logo" className="h-12 transition-all group-data-[collapsible=icon]:hidden" />
        <img src="/logoIcon.png" alt="Logo Icon" className="hidden transition-all group-data-[collapsible=icon]:block" /> */}
        {/* Full logo */}
        <img
          src={isDarkMode ? "/darkLogo.png" : "/logo.png"}
          alt="Logo"
          className="h-12 origin-left transition-all duration-200 ease-in-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:scale-95 group-data-[collapsible=icon]:-translate-x-2 pointer-events-none"
        />

        {/* Icon logo */}
        <img
          src="/logoIcon.png"
          alt="Logo Icon"
          className="absolute left-2 h-8 origin-left transition-all duration-200 ease-in-out opacity-0 scale-90 translate-x-2 group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:scale-100 group-data-[collapsible=icon]:translate-x-0 pointer-events-none"
        />
      </SidebarHeader>
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
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout}>
              <DynamicIcon name="LogOut" className="text-destructive" />
              <span className="text-destructive">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
