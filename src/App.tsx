
import { Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ModalProvider } from "@/hooks/use-modals";
import { ModalContainer } from "@/components/ModalContainer";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Loading } from "@/components/ui/Loading";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Changelog from "./pages/Changelog";
import RefundPolicy from "./pages/RefundPolicy";
import HowItWorks from "./pages/HowItWorks";
import Disclaimer from "./pages/Disclaimer";
import CookiePolicy from "./pages/CookiePolicy";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import ErrorPage from "./pages/ErrorPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <AuthProvider>
          <ModalProvider>
            <TooltipProvider>
              <Sonner />
              <ModalContainer />
              <BrowserRouter>
                <ScrollToTop />
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/changelog" element={<Changelog />} />
                     <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/disclaimer" element={<Disclaimer />} />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />
                    <Route path="/support" element={<Support />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="/error" element={<ErrorPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </ModalProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
