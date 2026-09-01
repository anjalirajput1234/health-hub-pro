// Human-readable auth/network error messages + connectivity diagnostics.

const URL_ = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY_ = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export function configError(): string | null {
  if (!URL_ || !KEY_) return "App is not connected to the backend (missing configuration). Please reload the page.";
  if (!/^https?:\/\//.test(URL_)) return "Backend URL is invalid. Please reload the page.";
  return null;
}

/** Ping the auth service to distinguish "no internet" from "backend down". */
export async function diagnoseNetwork(): Promise<string> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return "You appear to be offline. Check your internet connection and try again.";
  }
  const cfg = configError();
  if (cfg) return cfg;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`${URL_}/auth/v1/health`, {
      headers: { apikey: KEY_! },
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (res.ok) {
      return "Network request was blocked before reaching the server. Disable ad-blockers/VPN or try a normal browser tab (not incognito), then retry.";
    }
    return `Auth service responded with an error (${res.status}). Please try again in a moment.`;
  } catch (e: any) {
    if (e?.name === "AbortError") return "Connection timed out. Your network is slow or unstable — please retry.";
    return "Cannot reach the server right now. Check your connection or try again in a minute.";
  }
}

export async function authErrorMessage(err: any, mode: "login" | "signup"): Promise<string> {
  const raw = String(err?.message || err || "");
  const m = raw.toLowerCase();

  if (m.includes("failed to fetch") || m.includes("networkerror") || m.includes("load failed") || m.includes("fetch")) {
    return await diagnoseNetwork();
  }
  if (m.includes("timeout") || m.includes("timed out")) return "The request timed out. Please try again.";
  if (m.includes("invalid") && m.includes("credential"))
    return mode === "login"
      ? "Email or password is incorrect. New here? Create an account."
      : "Those details look invalid. Please check and try again.";
  if (m.includes("not confirmed")) return "Please confirm your email first, then sign in.";
  if (m.includes("already") || m.includes("registered")) return "This email is already registered. Please sign in instead.";
  if (m.includes("weak") || m.includes("pwned")) return "That password is too common. Add numbers, symbols, or make it longer.";
  if (m.includes("email") && m.includes("invalid")) return "Please enter a valid email address.";
  if (m.includes("rate") || m.includes("too many")) return "Too many attempts. Please wait a moment and try again.";
  if (m.includes("localstorage") || m.includes("storage"))
    return "Your browser is blocking storage, so we can't keep you signed in. Allow cookies/site data and retry.";
  return raw || (mode === "login" ? "Sign-in failed. Please try again." : "Registration failed. Please try again.");
}

/** Retry a request once on transient network failures. */
export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e: any) {
    const m = String(e?.message || "").toLowerCase();
    if (m.includes("failed to fetch") || m.includes("load failed") || m.includes("networkerror")) {
      await new Promise((r) => setTimeout(r, 800));
      return await fn();
    }
    throw e;
  }
}
