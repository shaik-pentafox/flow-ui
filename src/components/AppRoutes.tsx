import { MainLayout } from "@/components/layouts/MainLayout";
import { Builder } from "@/pages/Builder";
import { FeatureBuilder } from "@/pages/FeatureBuilder";
import { Features } from "@/pages/Features";
import { Flow } from "@/pages/Flow";
import { FlowBuilder } from "@/pages/FlowBuilder";
import { Home } from "@/pages/Home";
import { Route, Routes } from "react-router-dom";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/flows" element={<Flow />} />
        <Route path="/features" element={<Features />} />
        <Route path="inbox" element={<h1>Inbox</h1>} />
      </Route>
      <Route path="/flow-builder" element={<FlowBuilder />} />
      <Route path="/feature-builder" element={<FeatureBuilder />} />
    </Routes>
  )
}