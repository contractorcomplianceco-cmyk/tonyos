/** Temporary Rose Review Mode. Remove/disable after Command Center role-based auth is finalized. */

function readFlag(): string | undefined {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    const env = import.meta.env as Record<string, string | undefined>;
    return env.CCA_REVIEW_MODE ?? env.VITE_CCA_REVIEW_MODE;
  }
  return undefined;
}

function readExpiresAt(): string | undefined {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    const env = import.meta.env as Record<string, string | undefined>;
    return env.CCA_REVIEW_MODE_EXPIRES_AT ?? env.VITE_CCA_REVIEW_MODE_EXPIRES_AT;
  }
  return undefined;
}

export function isRoseReviewModeEnabled(): boolean {
  if (readFlag() !== "true") return false;
  const expiresAt = readExpiresAt();
  if (!expiresAt) return false;
  const expiresMs = Date.parse(expiresAt);
  if (Number.isNaN(expiresMs)) return false;
  return Date.now() < expiresMs;
}

export function isRoseReviewViewGateBypassed(): boolean {
  return isRoseReviewModeEnabled();
}

export function isRoseReviewModeBlockingDestructive(): boolean {
  return isRoseReviewModeEnabled();
}
