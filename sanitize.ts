// ============================================================
// SANITIZATION & VALIDATION UTILITIES
// Lenient validation — guide users, don't block them
// ============================================================

/**
 * Strip HTML tags and dangerous characters to prevent XSS.
 * Removes script tags, event handlers, javascript: URIs, etc.
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== "string") return "";

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:/gi, "")
    .replace(/vbscript\s*:/gi, "")
    .replace(/\bon\w+\s*=/gi, "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .trim();
}

/**
 * Sanitize for use in URLs — keeps the value while typing,
 * only fully validates on submit.
 */
export function sanitizeUrl(input: string): string {
  if (!input || typeof input !== "string") return "";
  // Strip obvious XSS, keep everything else
  return input
    .trim()
    .replace(/javascript\s*:/gi, "")
    .replace(/vbscript\s*:/gi, "")
    .replace(/<[^>]*>/g, "");
}

/**
 * Validate a URL only on submit (not while typing).
 */
export function validateUrlStrict(input: string): boolean {
  if (!input) return false;
  try {
    const url = new URL(input.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Sanitize email — lowercase, trim.
 */
export function sanitizeEmail(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input.trim().toLowerCase().replace(/\s/g, "");
}

/**
 * Sanitize phone — only digits, +, -, (, ), spaces.
 */
export function sanitizePhone(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input.replace(/[^\d+\-() ]/g, "").trim();
}

/**
 * Sanitize a message template — strip HTML/scripts,
 * preserve {{name}} {{business}} template tags.
 */
export function sanitizeTemplate(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/\bon\w+\s*=/gi, "")
    .trim();
}

/**
 * Sanitize a name — strip HTML/scripts, allow everything else
 * (numbers, punctuation, international chars are fine in names).
 */
export function sanitizeName(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/javascript\s*:/gi, "")
    .trim();
}

/**
 * Sanitize business name — strip XSS, allow all normal characters.
 */
export function sanitizeBusinessName(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/javascript\s*:/gi, "")
    .trim()
    .slice(0, 150);
}

/**
 * Sanitize CSV paste — remove dangerous content, keep structure.
 */
export function sanitizeCsvPaste(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/javascript\s*:/gi, "")
    .trim()
    .slice(0, 100_000); // Max 100KB
}

/**
 * Enforce max length on any string.
 */
export function enforceMaxLength(input: string, max: number): string {
  if (!input || typeof input !== "string") return "";
  return input.slice(0, max);
}

// ============================================================
// VALIDATORS — only called on form submit, not while typing
// ============================================================

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  if (!email) return { valid: false, error: "Email is required" };
  const clean = sanitizeEmail(email);
  if (clean.length > 254) return { valid: false, error: "Email address is too long" };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(clean)) return { valid: false, error: "Please enter a valid email address" };
  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) return { valid: false, error: "Password is required" };
  // Relaxed: just 6+ characters, no uppercase/number requirements
  if (password.length < 6) return { valid: false, error: "Password must be at least 6 characters" };
  if (password.length > 128) return { valid: false, error: "Password is too long" };
  return { valid: true };
}

export function validateName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) return { valid: false, error: "Name is required" };
  if (name.trim().length < 2) return { valid: false, error: "Name must be at least 2 characters" };
  if (name.trim().length > 100) return { valid: false, error: "Name is too long" };
  return { valid: true };
}

export function validateBusinessName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) return { valid: false, error: "Business name is required" };
  if (name.trim().length < 2) return { valid: false, error: "Business name must be at least 2 characters" };
  if (name.trim().length > 150) return { valid: false, error: "Business name is too long" };
  return { valid: true };
}

export function validateUrl(url: string): ValidationResult {
  if (!url) return { valid: false, error: "URL is required" };
  if (!validateUrlStrict(url)) return { valid: false, error: "Please enter a valid URL (https://...)" };
  return { valid: true };
}

export function validatePhone(phone: string): ValidationResult {
  // Phone is always optional — only validate if provided
  if (!phone || phone.trim().length === 0) return { valid: true };
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) return { valid: false, error: "Phone number is too short" };
  if (digits.length > 15) return { valid: false, error: "Phone number is too long" };
  return { valid: true };
}

export function validateTemplate(template: string): ValidationResult {
  if (!template || template.trim().length === 0) return { valid: false, error: "Message template is required" };
  // Very relaxed minimum — 5 chars is fine
  if (template.trim().length < 5) return { valid: false, error: "Template is too short" };
  if (template.length > 5000) return { valid: false, error: "Template is too long (max 5000 characters)" };
  return { valid: true };
}

export function validateCampaignName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) return { valid: false, error: "Campaign name is required" };
  if (name.trim().length < 2) return { valid: false, error: "Campaign name must be at least 2 characters" };
  if (name.trim().length > 100) return { valid: false, error: "Campaign name is too long" };
  return { valid: true };
}
