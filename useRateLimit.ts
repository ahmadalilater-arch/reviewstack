// ============================================================
// useRateLimit — React hook wrapping the rate limiter
// ============================================================
import { useState, useCallback, useEffect, useRef } from "react";
import { checkRateLimit, peekRateLimit, resetRateLimit, formatCooldown } from "../utils/rateLimit";

interface UseRateLimitReturn {
  /** Check and consume a token. Returns true if allowed. */
  attempt: () => boolean;
  /** Whether the action is currently rate limited */
  isLimited: boolean;
  /** Error message to display to user */
  error: string | null;
  /** Remaining attempts before getting rate limited */
  remaining: number;
  /** Formatted countdown string (e.g. "45s" or "2m") */
  countdown: string;
  /** Clear the error manually */
  clearError: () => void;
  /** Reset the rate limit (e.g. after success) */
  reset: () => void;
}

export function useRateLimit(action: string): UseRateLimitReturn {
  const [isLimited, setIsLimited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number>(999);
  const [resetInMs, setResetInMs] = useState<number>(0);
  const [countdown, setCountdown] = useState<string>("");
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer when rate limited
  useEffect(() => {
    if (isLimited && resetInMs > 0) {
      let remaining = resetInMs;

      countdownRef.current = setInterval(() => {
        remaining -= 1000;
        if (remaining <= 0) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          setIsLimited(false);
          setError(null);
          setCountdown("");
          setResetInMs(0);
        } else {
          setCountdown(formatCooldown(remaining));
          setResetInMs(remaining);
        }
      }, 1000);
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isLimited, resetInMs]);

  const attempt = useCallback((): boolean => {
    const result = checkRateLimit(action);

    if (!result.allowed) {
      setIsLimited(true);
      setError(result.error || "Rate limit exceeded. Please wait.");
      setResetInMs(result.resetInMs);
      setCountdown(formatCooldown(result.resetInMs));
      setRemaining(0);
      return false;
    }

    setRemaining(result.remaining);
    // Clear any previous error on successful attempt
    if (error) setError(null);
    return true;
  }, [action, error]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    resetRateLimit(action);
    setIsLimited(false);
    setError(null);
    setRemaining(999);
    setResetInMs(0);
    setCountdown("");
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, [action]);

  // Initialize remaining on mount
  useEffect(() => {
    const result = peekRateLimit(action);
    setRemaining(result.remaining);
    if (!result.allowed) {
      setIsLimited(true);
      setResetInMs(result.resetInMs);
      setCountdown(formatCooldown(result.resetInMs));
    }
  }, [action]);

  return { attempt, isLimited, error, remaining, countdown, clearError, reset };
}
