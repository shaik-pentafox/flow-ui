import { MainLayout } from "@/components/layouts/MainLayout";
import { FlowBuilder } from "@/pages/FlowBuilder";
import { Home } from "@/pages/Home";
import { Route, Routes } from "react-router-dom";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="inbox" element={<h1>Inbox</h1>} />
        {/* <Route path="bike" element={<BikeProducts />} /> */}
      </Route>
      <Route path="/flow-builder" element={<FlowBuilder />} />
    </Routes>
  )
}