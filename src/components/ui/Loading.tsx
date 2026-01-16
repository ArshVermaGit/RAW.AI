import { Loader2 } from "lucide-react";

export const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-12 w-12 animate-ping rounded-full bg-primary/20 opacity-75"></div>
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <p className="animate-pulse text-sm font-medium text-muted-foreground">
          Loading RAW.AI...
        </p>
      </div>
    </div>
  );
};
