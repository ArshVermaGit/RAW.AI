import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Ghost } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-secondary/50 border border-border/50 mb-8 animate-bounce-subtle">
          <Ghost className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="font-display text-8xl md:text-9xl font-bold mb-4 tracking-tighter">404</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-md mx-auto leading-relaxed">
          The page you're looking for has vanished into thin air.
        </p>
        <MagneticButton
          onClick={() => navigate("/")}
          variant="primary"
          size="xl"
          className="gap-3"
        >
          <ArrowLeft className="w-5 h-5" />
          Navigate Home
        </MagneticButton>
      </div>
    </div>
  );
};

export default NotFound;
