import { useRef } from "react";
import {
  COLOR_PRESETS,
  CORNER_TYPES,
  DOT_TYPES,
  ERROR_LEVELS,
  MAX_LOGO_SIZE,
  type QrStyle,
} from "../lib/style";
import { Field, SegGroup } from "./ui";

interface Props {
  style: QrStyle;
  patch: (value: Partial<QrStyle>) => void;
}

function ColorWell({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className={disabled ? "opacity-40" : ""}>
      <span className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
        {label}
      </span>
      <div className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white p-1.5 dark:border-ink-700 dark:bg-ink-900">
        <input
          type="color"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 cursor-pointer rounded-lg border-0 bg-transparent p-0 disabled:cursor-not-allowed"
          aria-label={label}
        />
        <input
          type="text"
          value={value.toUpperCase()}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent font-mono text-sm uppercase text-ink-700 outline-none dark:text-ink-200"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

export default function DesignPanel({ style, patch }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  function onLogoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patch({ logo: String(reader.result) });
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <span className="mb-2 block text-sm font-medium text-ink-700 dark:text-ink-200">
          색상 프리셋
        </span>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((p) => {
            const active =
              style.fgColor.toLowerCase() === p.fg.toLowerCase() &&
              style.bgColor.toLowerCase() === p.bg.toLowerCase();
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => patch({ fgColor: p.fg, bgColor: p.bg })}
                title={p.name}
                className={`group flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-500/10 dark:text-brand-200"
                    : "border-ink-200 text-ink-600 hover:border-ink-300 dark:border-ink-700 dark:text-ink-300 dark:hover:border-ink-600"
                }`}
              >
                <span
                  className="h-4 w-4 rounded-full ring-1 ring-black/10"
                  style={{
                    background: `linear-gradient(135deg, ${p.fg} 50%, ${p.bg} 50%)`,
                  }}
                />
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-3">
        <ColorWell
          label="전경색"
          value={style.fgColor}
          onChange={(v) => patch({ fgColor: v })}
        />
        <ColorWell
          label="배경색"
          value={style.bgColor}
          onChange={(v) => patch({ bgColor: v })}
          disabled={style.transparentBg}
        />
      </div>
      <label className="-mt-2 flex cursor-pointer items-center gap-2.5 text-sm text-ink-700 dark:text-ink-200">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500 dark:border-ink-600 dark:bg-ink-800"
          checked={style.transparentBg}
          onChange={(e) => patch({ transparentBg: e.target.checked })}
        />
        투명 배경 (PNG/SVG)
      </label>

      {/* Dot & corner styles */}
      <Field label="점 스타일">
        <SegGroup
          value={style.dotType}
          onChange={(v) => patch({ dotType: v })}
          options={DOT_TYPES}
        />
      </Field>
      <Field label="모서리 스타일">
        <SegGroup
          value={style.cornerType}
          onChange={(v) => patch({ cornerType: v })}
          options={CORNER_TYPES}
        />
      </Field>

      {/* Error correction */}
      <Field
        label="오류정정 레벨"
        hint={ERROR_LEVELS.find((e) => e.value === style.errorLevel)?.hint}
      >
        <SegGroup
          value={style.errorLevel}
          onChange={(v) => patch({ errorLevel: v })}
          options={ERROR_LEVELS}
        />
      </Field>

      {/* Quiet zone */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-ink-700 dark:text-ink-200">
          <span>여백 (quiet zone)</span>
          <span className="font-mono text-xs text-ink-400">{style.margin}</span>
        </div>
        <input
          type="range"
          min={0}
          max={40}
          step={2}
          value={style.margin}
          onChange={(e) => patch({ margin: Number(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Logo */}
      <div className="rounded-2xl border border-dashed border-ink-200 p-4 dark:border-ink-700">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-ink-700 dark:text-ink-200">
            중앙 로고
          </span>
          {style.logo && (
            <button
              type="button"
              onClick={() => patch({ logo: null })}
              className="text-xs font-medium text-red-500 hover:text-red-600"
            >
              제거
            </button>
          )}
        </div>
        {style.logo ? (
          <div className="flex items-center gap-4">
            <img
              src={style.logo}
              alt="로고 미리보기"
              className="h-14 w-14 rounded-lg object-contain ring-1 ring-ink-200 dark:ring-ink-700"
            />
            <div className="flex-1">
              <div className="mb-1.5 flex items-center justify-between text-xs text-ink-500 dark:text-ink-400">
                <span>로고 크기</span>
                <span className="font-mono">
                  {Math.round(style.logoSize * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={MAX_LOGO_SIZE}
                step={0.01}
                value={style.logoSize}
                onChange={(e) => patch({ logoSize: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl bg-ink-50 py-5 text-sm text-ink-500 transition hover:bg-ink-100 dark:bg-ink-800/50 dark:text-ink-400 dark:hover:bg-ink-800"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            로고 이미지 업로드
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onLogoPick}
        />
        <p className="mt-2 text-xs text-ink-400 dark:text-ink-500">
          로고를 넣으면 스캔 안정성을 위해 오류정정이 자동으로 올라갑니다.
        </p>
      </div>
    </div>
  );
}
