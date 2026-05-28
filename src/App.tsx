import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { SnowEffect } from "./components/SnowEffect";

const PackageSelection = lazy(() => import("./pages/PackageSelection"));
const SchedulingPage = lazy(() => import("./pages/SchedulingPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="relative">
        <SnowEffect />
        <div className="relative z-10">
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <Routes>
                <Route path="/" element={<PackageSelection />} />
                <Route path="/test-api" element={<NotFound />} />
                <Route path="/simple-test" element={<NotFound />} />
                <Route path="/validation-test" element={<NotFound />} />
                <Route path="/:packageSlug" element={<SchedulingPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
