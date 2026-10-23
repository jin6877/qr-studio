import { useEffect, useMemo, useState } from "react";
import {
  buildPayload,
  emptyForm,
  hasContent,
  type FormState,
  type QrKind,
} from "./lib/payload";
import { defaultStyle, type QrStyle } from "./lib/style";
import { KIND_META } from "./lib/kinds";
import { loadState, saveState } from "./lib/storage";
import Forms from "./components/Forms";
import DesignPanel from "./components/DesignPanel";
import QrPreview from "./components/QrPreview";

type Theme = "light" | "dark";

function getInitialTheme(saved?: string): Theme {
  if (saved === "light" || saved === "dark") return saved;
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

export default function App() {
  const persisted = useMemo(
    () => loadState<QrStyle, FormState>(),
    [],
  );

  const [kind, setKind] = useState<QrKind>(
    (persisted?.kind as QrKind) ?? "url",
  );
  const [form, setForm] = useState<FormState>({
    ...emptyForm,
    ...(persisted?.form ?? {}),
  });
  const [style, setStyle] = useState<QrStyle>({
    ...defaultStyle,
    ...(persisted?.style ?? {}),
    logo: null,
  });
  const [theme, setTheme] = useState<Theme>(getInitialTheme(persisted?.theme));

  // Apply theme class.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  // Persist (debounced-ish via effect).
  useEffect(() => {
    const t = window.setTimeout(() => {
      saveState<QrStyle, FormState>({ style, form, kind, theme });
    }, 250);
    return () => window.clearTimeout(t);
  }, [style, form, kind, theme]);

  const patchForm = <K extends QrKind>(k: K, value: Partial<FormState[K]>) =>
    setForm((f) => ({ ...f, [k]: { ...f[k], ...value } }));

  const patchStyle = (value: Partial<QrStyle>) =>
    setStyle((st) => ({ ...st, ...value }));

  const payload = buildPayload(kind, form);
  const ready = hasContent(kind, form);
  const meta = KIND_META.find((m) => m.value === kind)!;

  return (
    <div className="min-h-full bg-ink-50 text-ink-900 dark:bg-ink-950 dark:text-ink-50">
      {/* decorative gradient blob */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-brand-500/10 to-transparent dark:from-brand-500/[0.07]" />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="3" height="3" rx="0.5" />
                <rect x="18" y="18" width="3" height="3" rx="0.5" />
              </svg>
            </span>
            <div className="leading-tight">
              <h1 className="text-lg font-bold tracking-tight">QR Studio</h1>
              <p className="text-[11px] text-ink-400 dark:text-ink-500">
                브라우저에서 바로 만드는 QR
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-600 sm:flex dark:text-teal-400">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              100% 브라우저 처리
            </span>
            <button
              type="button"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-600 transition hover:bg-ink-100 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
              aria-label="테마 전환"
            >
              {theme === "dark" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Hero line */}
        <div className="mt-8 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-[32px]">
            링크·와이파이·연락처 QR을
            <br className="hidden sm:block" />{" "}
            <span className="bg-gradient-to-r from-brand-600 to-teal-500 bg-clip-text text-transparent">
              만들고, 꾸미고, 내려받기
            </span>
          </h2>
          <p className="mt-2.5 text-[15px] text-ink-500 dark:text-ink-400">
            입력값은 서버로 전송되지 않고 전부 이 브라우저에서 처리됩니다. PNG·SVG로
            저장하거나 클립보드로 바로 복사하세요.
          </p>
        </div>

        {/* Main */}
        <main className="mt-8 lg:grid lg:grid-cols-[1fr_380px] lg:items-start lg:gap-6">
          {/* Left: content + design */}
          <div className="space-y-6">
            {/* Type tabs + form */}
            <section className="rounded-2xl border border-ink-200/80 bg-white p-5 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-6">
              <div className="-mx-1 mb-5 flex gap-1.5 overflow-x-auto px-1 pb-1">
                {KIND_META.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setKind(m.value)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                      kind === m.value
                        ? "border-brand-500 bg-brand-600 text-white shadow-md shadow-brand-600/20"
                        : "border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
                    }`}
                  >
                    {m.icon}
                    {m.label}
                  </button>
                ))}
              </div>

              <div key={kind} className="fade-up">
                <Forms kind={kind} form={form} patch={patchForm} />
              </div>
            </section>

            {/* Design */}
            <section className="rounded-2xl border border-ink-200/80 bg-white p-5 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-6">
              <div className="mb-5 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600 dark:text-brand-400">
                  <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                  <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                  <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                  <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                </svg>
                <h3 className="font-semibold">디자인</h3>
              </div>
              <DesignPanel style={style} patch={patchStyle} />
            </section>
          </div>

          {/* Right: preview (sticky on desktop) */}
          <aside className="mt-6 lg:sticky lg:top-6 lg:mt-0">
            <section className="rounded-2xl border border-ink-200/80 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-semibold">미리보기</h3>
                <span className="flex items-center gap-1.5 rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-500 dark:bg-ink-800 dark:text-ink-400">
                  {meta.icon}
                  {meta.label}
                </span>
              </div>
              <QrPreview
                data={payload}
                style={style}
                ready={ready}
                emptyHint={meta.emptyHint}
              />
            </section>
          </aside>
        </main>

        <footer className="mt-12 border-t border-ink-200 pt-6 text-center text-xs text-ink-400 dark:border-ink-800 dark:text-ink-500">
          QR Studio · 모든 QR 생성은 브라우저에서 처리됩니다 · 입력값은 저장·전송되지
          않아요
        </footer>
      </div>
    </div>
  );
}
