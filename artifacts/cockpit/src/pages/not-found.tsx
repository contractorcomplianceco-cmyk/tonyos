import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center">
      <div className="w-full max-w-md mx-4 border border-card-border bg-card rounded shadow-sm overflow-hidden text-center p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-sidebar rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-sans font-bold text-card-foreground tracking-tight">System Module Not Found</h1>
        <p className="mt-3 text-sm text-card-foreground/70 font-medium">
          The requested command center module is unavailable or unauthorized.
        </p>
        <div className="mt-8 pt-6 border-t border-card-border">
          <Link href="/" className="inline-flex items-center justify-center bg-primary text-primary-foreground text-[11px] font-mono uppercase tracking-widest font-bold px-6 py-2.5 rounded-sm hover:bg-primary/90 transition-colors">
            Return to Command Center
          </Link>
        </div>
      </div>
    </div>
  );
}
