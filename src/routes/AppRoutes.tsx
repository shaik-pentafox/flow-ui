import { MainLayout } from "@/components/layouts/MainLayout";
import { FeatureBuilder } from "@/pages/FeatureBuilder";
import { Features } from "@/pages/Features";
import { Flow } from "@/pages/Flow";
import { FlowBuilder } from "@/pages/FlowBuilder";
import { Home } from "@/pages/Home";
import LoginPage from "@/pages/Login";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { SVG } from "@/pages/SVG";
import { SuperAdminRoute } from "./SuperAdminRoute";

export function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/svg" element={<SVG />} />
      </Route>

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="flows" element={<Flow />} />
          <Route element={<SuperAdminRoute />}>
            <Route path="features" element={<Features />} />
            <Route path="inbox" element={<h1>Inbox</h1>} />
          </Route>
        </Route>
        <Route path="flow-builder">
          <Route index element={<FlowBuilder />} />
          <Route path=":id" element={<FlowBuilder />} />
        </Route>

        <Route path="feature-builder" element={<SuperAdminRoute />}>
          <Route index element={<FeatureBuilder />} />
          <Route path=":id" element={<FeatureBuilder />} />
        </Route>
      </Route>
    </Routes>
  );
}
