import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { buildOptions } from "../lib/qr";
import type { QrStyle } from "../lib/style";

interface Props {
  data: string;
  style: QrStyle;
  ready: boolean;
  emptyHint: string;
}

const PREVIEW_SIZE = 288;
const PNG_SIZES = [512, 1024, 2048];

type Toast = { id: number; text: string; tone: "ok" | "err" };

export default function QrPreview({ data, style, ready, emptyHint }: Props) {
  const holderRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const [pngSize, setPngSize] = useState(1024);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [showData, setShowData] = useState(false);

  // Create the preview instance once.
  useEffect(() => {
    if (!holderRef.current) return;
    const qr = new QRCodeStyling(buildOptions(data, style, PREVIEW_SIZE));
    qr.append(holderRef.current);
    qrRef.current = qr;
    return () => {
      if (holderRef.current) holderRef.current.innerHTML = "";
      qrRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update on any data/style change.
  useEffect(() => {
    qrRef.current?.update(buildOptions(data, style, PREVIEW_SIZE));
  }, [data, style]);

  function flash(text: string, tone: "ok" | "err" = "ok") {
    const id = Date.now();
    setToast({ id, text, tone });
    window.setTimeout(() => {
      setToast((t) => (t && t.id === id ? null : t));
    }, 2200);
  }

  function safeName() {
    return "qr-studio";
  }

  async function downloadPng() {
    if (!ready || busy) return;
    setBusy(true);
    try {
      const inst = new QRCodeStyling(buildOptions(data, style, pngSize));
      await inst.download({ name: safeName(), extension: "png" });
      flash(`PNG ${pngSize}px 저장됨`);
    } catch {
      flash("다운로드 실패", "err");
    } finally {
      setBusy(false);
    }
  }

  async function downloadSvg() {
    if (!ready || busy) return;
    setBusy(true);
    try {
      const inst = new QRCodeStyling(buildOptions(data, style, 1024));
      await inst.download({ name: safeName(), extension: "svg" });
      flash("SVG (벡터) 저장됨");
    } catch {
      flash("다운로드 실패", "err");
    } finally {
      setBusy(false);
    }
  }

  async function copyPng() {
    if (!ready || busy) return;
    setBusy(true);
    try {
      const inst = new QRCodeStyling(buildOptions(data, style, 1024));
      const blob = (await inst.getRawData("png")) as Blob | null;
      if (!blob) throw new Error("no blob");
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      flash("클립보드에 복사됨");
    } catch {
      flash("클립보드 복사 불가", "err");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* QR stage */}
      <div className="relative">
        <div
          className="rounded-3xl p-5 shadow-[0_18px_50px_-20px_rgba(31,38,89,0.45)] ring-1 ring-ink-200/70 dark:ring-ink-700"
          style={{
            background:
              style.transparentBg || style.bgColor.toLowerCase() === "#ffffff"
                ? "#ffffff"
                : style.bgColor,
          }}
        >
          <div
            ref={holderRef}
            className={`qr-pop overflow-hidden rounded-xl transition-opacity ${
              ready ? "opacity-100" : "opacity-0"
            }`}
            style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
            aria-hidden={!ready}
          />
        </div>

        {/* Transparency checkerboard hint when bg transparent */}
        {style.transparentBg && ready && (
          <span className="mt-2 block text-center text-xs text-ink-400">
            * 미리보기는 흰 배경, 내보내기는 투명 배경
          </span>
        )}

        {/* Empty placeholder */}
        {!ready && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-5">
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ink-200 bg-ink-50/60 text-center dark:border-ink-700 dark:bg-ink-800/40">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="text-ink-300 dark:text-ink-600"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <path d="M14 14h3v3M21 14v7h-7" />
              </svg>
              <p className="max-w-[180px] text-sm text-ink-400 dark:text-ink-500">
                {emptyHint}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Export controls */}
      <div className="mt-6 w-full max-w-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 rounded-xl bg-ink-100 p-1 dark:bg-ink-800">
            {PNG_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPngSize(s)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                  pngSize === s
                    ? "bg-white text-brand-700 shadow-sm dark:bg-ink-600 dark:text-white"
                    : "text-ink-500 hover:text-ink-700 dark:text-ink-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={downloadPng}
          disabled={!ready || busy}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-ink-300 disabled:shadow-none dark:disabled:bg-ink-700"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          PNG 다운로드
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={downloadSvg}
            disabled={!ready || busy}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-ink-200 bg-white py-2.5 text-sm font-semibold text-ink-700 transition hover:border-ink-300 hover:bg-ink-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:hover:bg-ink-800"
          >
            SVG
          </button>
          <button
            type="button"
            onClick={copyPng}
            disabled={!ready || busy}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-ink-200 bg-white py-2.5 text-sm font-semibold text-ink-700 transition hover:border-ink-300 hover:bg-ink-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:hover:bg-ink-800"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            복사
          </button>
        </div>

        {/* Raw data peek (privacy / transparency) */}
        {ready && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowData((v) => !v)}
              className="flex w-full items-center justify-between text-xs font-medium text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
            >
              <span>인코딩된 데이터</span>
              <span>{showData ? "숨기기" : "보기"}</span>
            </button>
            {showData && (
              <pre className="fade-up mt-2 max-h-28 overflow-auto rounded-lg bg-ink-900 p-3 text-left text-[11px] leading-relaxed text-ink-200 dark:bg-black/40">
                {data}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-2 text-sm font-medium text-white shadow-lg fade-up ${
            toast.tone === "ok" ? "bg-ink-900 dark:bg-brand-600" : "bg-red-500"
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}
