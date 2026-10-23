// Builds the raw string that gets encoded into the QR, per type.
// Escaping here is the #1 source of "QR scans but data is wrong" bugs,
// so each builder handles its own special characters explicitly.

export type QrKind =
  | "url"
  | "text"
  | "wifi"
  | "vcard"
  | "email"
  | "phone"
  | "sms"
  | "geo";

export interface UrlData {
  url: string;
}
export interface TextData {
  text: string;
}
export interface WifiData {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}
export interface VCardData {
  fullName: string;
  org: string;
  title: string;
  phone: string;
  email: string;
  url: string;
  address: string;
}
export interface EmailData {
  to: string;
  subject: string;
  body: string;
}
export interface PhoneData {
  number: string;
}
export interface SmsData {
  number: string;
  message: string;
}
export interface GeoData {
  lat: string;
  lng: string;
}

export interface FormState {
  url: UrlData;
  text: TextData;
  wifi: WifiData;
  vcard: VCardData;
  email: EmailData;
  phone: PhoneData;
  sms: SmsData;
  geo: GeoData;
}

export const emptyForm: FormState = {
  url: { url: "" },
  text: { text: "" },
  wifi: { ssid: "", password: "", encryption: "WPA", hidden: false },
  vcard: {
    fullName: "",
    org: "",
    title: "",
    phone: "",
    email: "",
    url: "",
    address: "",
  },
  email: { to: "", subject: "", body: "" },
  phone: { number: "" },
  sms: { number: "", message: "" },
  geo: { lat: "", lng: "" },
};

// WIFI: and vCard both treat \ ; , : (and WIFI also ") as delimiters.
function escapeWifi(value: string): string {
  // Order matters: backslash first so we don't double-escape.
  return value.replace(/([\\;,:"])/g, "\\$1");
}

function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function buildWifi(d: WifiData): string {
  const t = d.encryption === "nopass" ? "nopass" : d.encryption;
  const parts = [`T:${t}`, `S:${escapeWifi(d.ssid)}`];
  if (d.encryption !== "nopass") {
    parts.push(`P:${escapeWifi(d.password)}`);
  }
  if (d.hidden) {
    parts.push("H:true");
  }
  return `WIFI:${parts.join(";")};;`;
}

export function buildVCard(d: VCardData): string {
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];
  const fn = escapeVCard(d.fullName.trim());
  lines.push(`N:${fn};;;;`);
  lines.push(`FN:${fn}`);
  if (d.org.trim()) lines.push(`ORG:${escapeVCard(d.org.trim())}`);
  if (d.title.trim()) lines.push(`TITLE:${escapeVCard(d.title.trim())}`);
  if (d.phone.trim()) lines.push(`TEL;TYPE=CELL:${escapeVCard(d.phone.trim())}`);
  if (d.email.trim()) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCard(d.email.trim())}`);
  if (d.url.trim()) lines.push(`URL:${escapeVCard(d.url.trim())}`);
  if (d.address.trim())
    lines.push(`ADR;TYPE=HOME:;;${escapeVCard(d.address.trim())};;;;`);
  lines.push("END:VCARD");
  // vCard uses CRLF line endings per spec.
  return lines.join("\r\n");
}

export function buildEmail(d: EmailData): string {
  const params: string[] = [];
  if (d.subject.trim()) params.push(`subject=${encodeURIComponent(d.subject)}`);
  if (d.body.trim()) params.push(`body=${encodeURIComponent(d.body)}`);
  const query = params.length ? `?${params.join("&")}` : "";
  return `mailto:${d.to.trim()}${query}`;
}

export function buildPhone(d: PhoneData): string {
  return `tel:${d.number.replace(/\s+/g, "")}`;
}

export function buildSms(d: SmsData): string {
  // SMSTO is the format recognized by the vast majority of QR scanners.
  const num = d.number.replace(/\s+/g, "");
  return d.message.trim() ? `SMSTO:${num}:${d.message}` : `SMSTO:${num}`;
}

export function buildGeo(d: GeoData): string {
  return `geo:${d.lat.trim()},${d.lng.trim()}`;
}

export function buildUrl(d: UrlData): string {
  const raw = d.url.trim();
  if (!raw) return "";
  // Add a scheme if the user typed a bare domain.
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(raw) || raw.startsWith("mailto:")) {
    return raw;
  }
  return `https://${raw}`;
}

export function buildPayload(kind: QrKind, form: FormState): string {
  switch (kind) {
    case "url":
      return buildUrl(form.url);
    case "text":
      return form.text.text;
    case "wifi":
      return buildWifi(form.wifi);
    case "vcard":
      return buildVCard(form.vcard);
    case "email":
      return buildEmail(form.email);
    case "phone":
      return buildPhone(form.phone);
    case "sms":
      return buildSms(form.sms);
    case "geo":
      return buildGeo(form.geo);
  }
}

// Whether the form has enough input to render a meaningful QR.
export function hasContent(kind: QrKind, form: FormState): boolean {
  switch (kind) {
    case "url":
      return form.url.url.trim().length > 0;
    case "text":
      return form.text.text.trim().length > 0;
    case "wifi":
      return form.wifi.ssid.trim().length > 0;
    case "vcard":
      return (
        form.vcard.fullName.trim().length > 0 ||
        form.vcard.phone.trim().length > 0 ||
        form.vcard.email.trim().length > 0
      );
    case "email":
      return form.email.to.trim().length > 0;
    case "phone":
      return form.phone.number.trim().length > 0;
    case "sms":
      return form.sms.number.trim().length > 0;
    case "geo":
      return form.geo.lat.trim().length > 0 && form.geo.lng.trim().length > 0;
  }
}
