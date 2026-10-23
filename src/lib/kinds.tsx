import type { ReactNode } from "react";
import type { QrKind } from "./payload";

export interface KindMeta {
  value: QrKind;
  label: string;
  icon: ReactNode;
  emptyHint: string;
}

const s = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const KIND_META: KindMeta[] = [
  {
    value: "url",
    label: "링크",
    emptyHint: "주소를 입력하면 QR이 나타나요",
    icon: (
      <svg {...s}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    value: "wifi",
    label: "와이파이",
    emptyHint: "SSID를 입력하면 QR이 나타나요",
    icon: (
      <svg {...s}>
        <path d="M5 13a10 10 0 0 1 14 0" />
        <path d="M8.5 16.5a5 5 0 0 1 7 0" />
        <path d="M2 8.82a15 15 0 0 1 20 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    ),
  },
  {
    value: "text",
    label: "텍스트",
    emptyHint: "텍스트를 입력하면 QR이 나타나요",
    icon: (
      <svg {...s}>
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </svg>
    ),
  },
  {
    value: "vcard",
    label: "연락처",
    emptyHint: "이름이나 연락처를 입력해 주세요",
    icon: (
      <svg {...s}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    value: "email",
    label: "이메일",
    emptyHint: "받는 사람 주소를 입력해 주세요",
    icon: (
      <svg {...s}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 6L2 7" />
      </svg>
    ),
  },
  {
    value: "phone",
    label: "전화",
    emptyHint: "전화번호를 입력해 주세요",
    icon: (
      <svg {...s}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    value: "sms",
    label: "문자",
    emptyHint: "받는 번호를 입력해 주세요",
    icon: (
      <svg {...s}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    value: "geo",
    label: "위치",
    emptyHint: "위도·경도를 입력해 주세요",
    icon: (
      <svg {...s}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];
