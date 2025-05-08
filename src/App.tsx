
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DatabasePage from "./pages/DatabasePage";
import PollenDetailPage from "./pages/PollenDetailPage";
import PollenFormPage from "./pages/PollenFormPage";
import NotFound from "./pages/NotFound";
import { PollenProvider } from "./context/PollenContext";
import AppLoader from "./components/layout/AppLoader";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PollenProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLoader>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/database" element={<DatabasePage />} />
              <Route path="/pollen/:id" element={<PollenDetailPage />} />
              <Route path="/add" element={<PollenFormPage />} />
              <Route path="/edit/:id" element={<PollenFormPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLoader>
        </BrowserRouter>
      </PollenProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
