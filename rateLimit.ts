// ============================================================
// RATE LIMITER — Sliding Window
// Very lenient limits — only blocks obvious abuse/bots.
// All state is in-memory (per session), resets on page reload.
// ============================================================

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  cooldownMs: number;
  label: string;
}

interface RateLimitState {
  attempts: number;
  windowStart: number;
  blockedUntil: number | null;
}

// ============================================================
// CONFIGS — very generous, only stop bots
// ============================================================
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // Auth — 20 login attempts per 15 min is plenty for a real user
  login: {
    maxAttempts: 20,
    windowMs: 15 * 60 * 1000,   // 15 minutes
    cooldownMs: 30 * 1000,       // 30 second cooldown
    label: "login",
  },
  // Signup — 10 per hour is more than enough
  signup: {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000,   // 1 hour
    cooldownMs: 30 * 1000,       // 30 second cooldown
    label: "account creation",
  },
  // Newsletter — 10 per hour
  newsletter: {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000,   // 1 hour
    cooldownMs: 15 * 1000,       // 15 second cooldown
    label: "newsletter subscription",
  },
  // Campaign creation — 50 per hour (power users create a lot)
  campaign: {
    maxAttempts: 50,
    windowMs: 60 * 60 * 1000,   // 1 hour
    cooldownMs: 10 * 1000,       // 10 second cooldown
    label: "campaign creation",
  },
  // Settings — 100 saves per hour (autosave-friendly)
  settings: {
    maxAttempts: 100,
    windowMs: 60 * 60 * 1000,   // 1 hour
    cooldownMs: 5 * 1000,        // 5 second cooldown
    label: "settings update",
  },
  // Templates — 60 saves per hour
  template: {
    maxAttempts: 60,
    windowMs: 60 * 60 * 1000,   // 1 hour
    cooldownMs: 5 * 1000,        // 5 second cooldown
    label: "template save",
  },
  // Replies — 50 per hour
  reply: {
    maxAttempts: 50,
    windowMs: 60 * 60 * 1000,   // 1 hour
    cooldownMs: 5 * 1000,        // 5 second cooldown
    label: "reply",
  },
  // Import — 30 per hour
  import: {
    maxAttempts: 30,
    windowMs: 60 * 60 * 1000,   // 1 hour
    cooldownMs: 10 * 1000,       // 10 second cooldown
    label: "import",
  },
  // Search — basically unlimited, just stops hammering
  search: {
    maxAttempts: 500,
    windowMs: 60 * 1000,         // 1 minute
    cooldownMs: 2 * 1000,        // 2 second cooldown
    label: "search",
  },
};

// In-memory store — keyed by action name
const store = new Map<string, RateLimitState>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
  error?: string;
}

export function checkRateLimit(action: string): RateLimitResult {
  const config = RATE_LIMIT_CONFIGS[action];
  if (!config) {
    return { allowed: true, remaining: 999, resetInMs: 0 };
  }

  const now = Date.now();
  let state = store.get(action);

  if (!state) {
    state = { attempts: 0, windowStart: now, blockedUntil: null };
    store.set(action, state);
  }

  // Check cooldown
  if (state.blockedUntil && now < state.blockedUntil) {
    const resetInMs = state.blockedUntil - now;
    const seconds = Math.ceil(resetInMs / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetInMs,
      error: `Please wait ${seconds} second${seconds !== 1 ? "s" : ""} before trying again.`,
    };
  }

  // Reset window if expired
  if (now - state.windowStart > config.windowMs) {
    state.attempts = 0;
    state.windowStart = now;
    state.blockedUntil = null;
  }

  // Over limit
  if (state.attempts >= config.maxAttempts) {
    state.blockedUntil = now + config.cooldownMs;
    const seconds = Math.ceil(config.cooldownMs / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetInMs: config.cooldownMs,
      error: `Too many attempts. Please wait ${seconds} second${seconds !== 1 ? "s" : ""}.`,
    };
  }

  // Allow
  state.attempts++;
  return {
    allowed: true,
    remaining: config.maxAttempts - state.attempts,
    resetInMs: 0,
  };
}

export function peekRateLimit(action: string): RateLimitResult {
  const config = RATE_LIMIT_CONFIGS[action];
  if (!config) return { allowed: true, remaining: 999, resetInMs: 0 };

  const now = Date.now();
  const state = store.get(action);
  if (!state) return { allowed: true, remaining: config.maxAttempts, resetInMs: 0 };

  if (state.blockedUntil && now < state.blockedUntil) {
    return { allowed: false, remaining: 0, resetInMs: state.blockedUntil - now };
  }
  if (now - state.windowStart > config.windowMs) {
    return { allowed: true, remaining: config.maxAttempts, resetInMs: 0 };
  }
  const remaining = Math.max(0, config.maxAttempts - state.attempts);
  return { allowed: remaining > 0, remaining, resetInMs: 0 };
}

export function resetRateLimit(action: string): void {
  store.delete(action);
}

export function formatCooldown(ms: number): string {
  if (ms <= 0) return "";
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.ceil(ms / 60000);
  return `${minutes}m`;
}
