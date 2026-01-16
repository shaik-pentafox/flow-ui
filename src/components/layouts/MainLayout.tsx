// src/components/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SideBar } from "@/components/layouts/SideBar";

export const MainLayout = () => {
  return (
    <SidebarProvider>
      <SideBar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
