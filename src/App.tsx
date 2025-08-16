
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { PWAInstaller } from "@/components/PWAInstaller";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Colleges from "./pages/Colleges";
import Meetings from "./pages/Meetings";
import Contacts from "./pages/Contacts";
import Settings from "./pages/Settings";
import UserGuide from "./pages/UserGuide";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Add PWA manifest link
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/manifest.json';
    document.head.appendChild(link);

    // Add theme color meta tag
    const themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    themeColorMeta.content = '#0f172a';
    document.head.appendChild(themeColorMeta);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(themeColorMeta);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/meetings" element={<Meetings />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/search" element={<Search />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/guide" element={<UserGuide />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <PWAInstaller />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
