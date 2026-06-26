import { isRoseReviewModeEnabled } from "@/lib/rose-review-mode";

export function RoseReviewModeBanner() {
  if (!isRoseReviewModeEnabled()) return null;

  return (
    <div
      role="status"
      className="border-b border-cyan-500/30 bg-gradient-to-r from-sky-950/90 via-cyan-950/80 to-sky-950/90 px-4 py-2 text-center text-xs font-medium tracking-wide text-cyan-100"
    >
      Rose Review Mode · Temporary access expires automatically
    </div>
  );
}
