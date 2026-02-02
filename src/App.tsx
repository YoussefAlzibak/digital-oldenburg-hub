// App v7 - scheduled automation with tag filter
import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/ThemeProvider";
import { ScrollToTop } from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";

// Eager load - critical path
import Index from "./pages/Index";

// Lazy load - secondary pages
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const BookAppointment = lazy(() => import("./pages/BookAppointment"));
const Admin = lazy(() => import("./pages/Admin"));
const Auth = lazy(() => import("./pages/Auth"));
const Imprint = lazy(() => import("./pages/Imprint"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-muted-foreground text-sm">Laden...</span>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="unicum-tech-theme">
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/imprint" element={<Imprint />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="*" element={<Index />} />
            </Routes>
          </Suspense>
          <Toaster />
          <CookieConsent />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
