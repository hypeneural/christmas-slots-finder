import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SnowEffect } from "./components/SnowEffect";
import PackageSelection from "./pages/PackageSelection";
import SchedulingPage from "./pages/SchedulingPage";
import NotFound from "./pages/NotFound";
import { ApiIntegrationTest } from "./components/ApiIntegrationTest";
import { SimpleApiTest } from "./components/SimpleApiTest";
import { ApiValidationTest } from "./components/ApiValidationTest";

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
            <Routes>
              <Route path="/" element={<PackageSelection />} />
              <Route path="/test-api" element={<ApiIntegrationTest />} />
              <Route path="/simple-test" element={<SimpleApiTest />} />
              <Route path="/validation-test" element={<ApiValidationTest />} />
              <Route path="/:packageSlug" element={<SchedulingPage />} />
              <Route path="/:packageSlug/pg" element={<SchedulingPage />} />
              <Route path="/:packageSlug/pg/:page" element={<SchedulingPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
