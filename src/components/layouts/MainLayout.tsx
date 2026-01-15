// src/components/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SideBar } from "@/components/layouts/SideBar"
import { Input } from "../ui/input"

export const MainLayout = () => {
  return (
    <SidebarProvider>
      <SideBar />
      <main className="flex-1 p-4">
        <div className="h-15 w-full border items-center mb-4 flex px-4 rounded-md">
          <Input placeholder="Search..." className="!bg-background border-0 !text-xl font-medium text-muted-foreground" />
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  )
}