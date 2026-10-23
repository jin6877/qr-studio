const KEY = "qr-studio:v1";

export interface Persisted<S, F> {
  style: S;
  form: F;
  kind: string;
  theme: "light" | "dark";
}

export function loadState<S, F>(): Partial<Persisted<S, F>> | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveState<S, F>(state: Persisted<S, F>): void {
  try {
    // Don't persist a potentially huge logo data URL — it can blow the quota.
    const toSave = {
      ...state,
      style: { ...(state.style as object), logo: null },
    };
    localStorage.setItem(KEY, JSON.stringify(toSave));
  } catch {
    // ignore quota / private-mode errors
  }
}
