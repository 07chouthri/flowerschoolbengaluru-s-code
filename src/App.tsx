import { Button } from "@/components/ui/button";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { ScrollToTop } from "../src/pages/ScrollToTop";
import Payment from "./pages/Payment";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Classes from "./pages/Classes";
import Calendar from "./pages/Calendar";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRoute";
import SEO from "./components/SEO";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SEO />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route 
              path="/admin" 
              element={
                <AdminProtectedRoute>
                  <Admin />
                </AdminProtectedRoute>
              } 
            />
            <Route path="/signin" element={<SignInPage />} />
            {/* <Route path="/signup" element={<SignUpPage />} /> */}
            <Route path="/payment" element={<Payment />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
