import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Toaster />
        <CookieConsent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
