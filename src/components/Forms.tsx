import type { FormState, QrKind } from "../lib/payload";
import { Field, SegGroup, TextArea, TextInput } from "./ui";

interface Props {
  kind: QrKind;
  form: FormState;
  patch: <K extends QrKind>(kind: K, value: Partial<FormState[K]>) => void;
}

export default function Forms({ kind, form, patch }: Props) {
  switch (kind) {
    case "url":
      return (
        <Field label="웹사이트 주소" hint="https:// 는 생략 가능">
          <TextInput
            type="url"
            inputMode="url"
            placeholder="example.com/menu"
            value={form.url.url}
            onChange={(e) => patch("url", { url: e.target.value })}
          />
        </Field>
      );

    case "text":
      return (
        <Field label="텍스트" hint="메모 · 문구 등">
          <TextArea
            placeholder="QR에 담을 텍스트를 입력하세요"
            value={form.text.text}
            onChange={(e) => patch("text", { text: e.target.value })}
          />
        </Field>
      );

    case "wifi": {
      const noPass = form.wifi.encryption === "nopass";
      return (
        <div className="space-y-4">
          <Field label="네트워크 이름 (SSID)">
            <TextInput
              placeholder="MyCafe_5G"
              value={form.wifi.ssid}
              onChange={(e) => patch("wifi", { ssid: e.target.value })}
            />
          </Field>
          <Field label="암호화 방식">
            <SegGroup
              value={form.wifi.encryption}
              onChange={(v) =>
                patch("wifi", {
                  encryption: v as FormState["wifi"]["encryption"],
                })
              }
              options={[
                { value: "WPA", label: "WPA/WPA2" },
                { value: "WEP", label: "WEP" },
                { value: "nopass", label: "없음" },
              ]}
            />
          </Field>
          <Field label="비밀번호" hint={noPass ? "암호화 없음" : undefined}>
            <TextInput
              type="text"
              placeholder={noPass ? "비밀번호 없는 네트워크" : "비밀번호"}
              value={form.wifi.password}
              disabled={noPass}
              onChange={(e) => patch("wifi", { password: e.target.value })}
            />
          </Field>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700 dark:text-ink-200">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500 dark:border-ink-600 dark:bg-ink-800"
              checked={form.wifi.hidden}
              onChange={(e) => patch("wifi", { hidden: e.target.checked })}
            />
            숨김 네트워크 (SSID 브로드캐스트 안 함)
          </label>
        </div>
      );
    }

    case "vcard":
      return (
        <div className="space-y-4">
          <Field label="이름">
            <TextInput
              placeholder="홍길동"
              value={form.vcard.fullName}
              onChange={(e) => patch("vcard", { fullName: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="전화번호">
              <TextInput
                type="tel"
                inputMode="tel"
                placeholder="010-1234-5678"
                value={form.vcard.phone}
                onChange={(e) => patch("vcard", { phone: e.target.value })}
              />
            </Field>
            <Field label="이메일">
              <TextInput
                type="email"
                inputMode="email"
                placeholder="hong@company.com"
                value={form.vcard.email}
                onChange={(e) => patch("vcard", { email: e.target.value })}
              />
            </Field>
            <Field label="회사">
              <TextInput
                placeholder="QR Studio"
                value={form.vcard.org}
                onChange={(e) => patch("vcard", { org: e.target.value })}
              />
            </Field>
            <Field label="직함">
              <TextInput
                placeholder="대표"
                value={form.vcard.title}
                onChange={(e) => patch("vcard", { title: e.target.value })}
              />
            </Field>
          </div>
          <Field label="웹사이트">
            <TextInput
              type="url"
              placeholder="https://company.com"
              value={form.vcard.url}
              onChange={(e) => patch("vcard", { url: e.target.value })}
            />
          </Field>
          <Field label="주소">
            <TextInput
              placeholder="서울특별시 ..."
              value={form.vcard.address}
              onChange={(e) => patch("vcard", { address: e.target.value })}
            />
          </Field>
        </div>
      );

    case "email":
      return (
        <div className="space-y-4">
          <Field label="받는 사람">
            <TextInput
              type="email"
              inputMode="email"
              placeholder="hello@example.com"
              value={form.email.to}
              onChange={(e) => patch("email", { to: e.target.value })}
            />
          </Field>
          <Field label="제목">
            <TextInput
              placeholder="문의드립니다"
              value={form.email.subject}
              onChange={(e) => patch("email", { subject: e.target.value })}
            />
          </Field>
          <Field label="본문">
            <TextArea
              placeholder="메일 내용을 입력하세요"
              value={form.email.body}
              onChange={(e) => patch("email", { body: e.target.value })}
            />
          </Field>
        </div>
      );

    case "phone":
      return (
        <Field label="전화번호">
          <TextInput
            type="tel"
            inputMode="tel"
            placeholder="010-1234-5678"
            value={form.phone.number}
            onChange={(e) => patch("phone", { number: e.target.value })}
          />
        </Field>
      );

    case "sms":
      return (
        <div className="space-y-4">
          <Field label="받는 번호">
            <TextInput
              type="tel"
              inputMode="tel"
              placeholder="010-1234-5678"
              value={form.sms.number}
              onChange={(e) => patch("sms", { number: e.target.value })}
            />
          </Field>
          <Field label="메시지">
            <TextArea
              placeholder="미리 채워질 문자 내용"
              value={form.sms.message}
              onChange={(e) => patch("sms", { message: e.target.value })}
            />
          </Field>
        </div>
      );

    case "geo":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="위도 (lat)">
              <TextInput
                inputMode="decimal"
                placeholder="37.5665"
                value={form.geo.lat}
                onChange={(e) => patch("geo", { lat: e.target.value })}
              />
            </Field>
            <Field label="경도 (lng)">
              <TextInput
                inputMode="decimal"
                placeholder="126.9780"
                value={form.geo.lng}
                onChange={(e) => patch("geo", { lng: e.target.value })}
              />
            </Field>
          </div>
          <p className="text-xs text-ink-400 dark:text-ink-500">
            지도 앱에서 좌표를 복사해 붙여넣으세요. 스캔하면 해당 위치가 열립니다.
          </p>
        </div>
      );
  }
}
