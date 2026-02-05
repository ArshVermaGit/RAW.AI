
import { Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ModalProvider } from "@/hooks/use-modals";
import { ModalContainer, ScrollToTop, ErrorBoundary } from "@/components/common";
import { CookieConsentModal } from "@/components/common/CookieConsentModal";
import { Loading } from "@/components/ui/Loading";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { lazy } from "react";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Profile = lazy(() => import("./pages/Profile"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Changelog = lazy(() => import("./pages/Changelog"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const PaymentPolicy = lazy(() => import("./pages/PaymentPolicy"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const Security = lazy(() => import("./pages/Security"));
const AccessibilityStatement = lazy(() => import("./pages/AccessibilityStatement"));
const Support = lazy(() => import("./pages/Support"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));

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
              <CookieConsentModal />
              <BrowserRouter>
                <ScrollToTop />
                <Suspense fallback={<Loading />}>
                  <Routes>

                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/onboarding" 
                      element={
                        <ProtectedRoute>
                          <Onboarding />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/changelog" element={<Changelog />} />
                     <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/payment-policy" element={<PaymentPolicy />} />
                    <Route path="/disclaimer" element={<Disclaimer />} />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />
                    <Route path="/security" element={<Security />} />
                    <Route path="/accessibility-statement" element={<AccessibilityStatement />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/sitemap" element={<Sitemap />} />
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
