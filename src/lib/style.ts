import type { DotType, CornerSquareType } from "qr-code-styling";

export type ErrorLevel = "L" | "M" | "Q" | "H";

export interface QrStyle {
  fgColor: string;
  bgColor: string;
  dotType: DotType;
  cornerType: CornerSquareType;
  errorLevel: ErrorLevel;
  margin: number; // quiet zone, in modules-ish px scaled to preview
  logo: string | null; // data URL
  logoSize: number; // 0.1 - 0.35 (fraction of QR)
  transparentBg: boolean;
}

export const defaultStyle: QrStyle = {
  fgColor: "#1b1f3b",
  bgColor: "#ffffff",
  dotType: "rounded",
  cornerType: "extra-rounded",
  errorLevel: "M",
  margin: 16,
  logo: null,
  logoSize: 0.22,
  transparentBg: false,
};

export const DOT_TYPES: { value: DotType; label: string }[] = [
  { value: "square", label: "사각" },
  { value: "rounded", label: "둥근" },
  { value: "dots", label: "도트" },
  { value: "classy", label: "클래시" },
  { value: "classy-rounded", label: "클래시+" },
  { value: "extra-rounded", label: "엑스트라" },
];

export const CORNER_TYPES: { value: CornerSquareType; label: string }[] = [
  { value: "square", label: "사각" },
  { value: "dot", label: "원형" },
  { value: "extra-rounded", label: "라운드" },
];

export const ERROR_LEVELS: { value: ErrorLevel; label: string; hint: string }[] =
  [
    { value: "L", label: "L", hint: "~7% 복원" },
    { value: "M", label: "M", hint: "~15% 복원" },
    { value: "Q", label: "Q", hint: "~25% 복원" },
    { value: "H", label: "H", hint: "~30% 복원" },
  ];

// Curated color presets (fg / bg) that stay high-contrast & scannable.
export const COLOR_PRESETS: { name: string; fg: string; bg: string }[] = [
  { name: "클래식", fg: "#1b1f3b", bg: "#ffffff" },
  { name: "인디고", fg: "#4f46e5", bg: "#ffffff" },
  { name: "틸", fg: "#0f766e", bg: "#f0fdfa" },
  { name: "선셋", fg: "#b91c1c", bg: "#fff7ed" },
  { name: "미드나잇", fg: "#e2e8f0", bg: "#0f172a" },
  { name: "포레스트", fg: "#14532d", bg: "#f7fee7" },
];

// The highest error-correction level between the chosen one and H,
// used automatically when a logo is placed so the QR stays scannable.
export function effectiveErrorLevel(style: QrStyle): ErrorLevel {
  if (style.logo) {
    // bump to at least Q, and to H for larger logos
    if (style.logoSize >= 0.25) return "H";
    return style.errorLevel === "L" || style.errorLevel === "M"
      ? "Q"
      : style.errorLevel;
  }
  return style.errorLevel;
}

// Safe upper bound on logo size relative to the QR so scanning doesn't break.
export const MAX_LOGO_SIZE = 0.3;
