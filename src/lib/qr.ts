import type { Options } from "qr-code-styling";
import { effectiveErrorLevel, MAX_LOGO_SIZE, type QrStyle } from "./style";

const BASE_SIZE = 300;

// Produce a full qr-code-styling Options object for a given render size.
// The quiet-zone margin is scaled so exports at any resolution look identical
// to the on-screen preview.
export function buildOptions(
  data: string,
  style: QrStyle,
  size: number,
): Partial<Options> {
  const scale = size / BASE_SIZE;
  const logoSize = Math.min(style.logoSize, MAX_LOGO_SIZE);

  return {
    type: "canvas",
    width: size,
    height: size,
    data: data || " ",
    margin: Math.round(style.margin * scale),
    image: style.logo ?? undefined,
    qrOptions: {
      errorCorrectionLevel: effectiveErrorLevel(style),
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: logoSize,
      margin: Math.round(6 * scale),
      crossOrigin: "anonymous",
      saveAsBlob: true,
    },
    dotsOptions: {
      type: style.dotType,
      color: style.fgColor,
    },
    cornersSquareOptions: {
      type: style.cornerType,
      color: style.fgColor,
    },
    cornersDotOptions: {
      color: style.fgColor,
    },
    backgroundOptions: {
      color: style.transparentBg ? "transparent" : style.bgColor,
    },
  };
}
