const EMAIL_PARTS = {
  local: [109, 97, 105, 108],
  domain: [
    112, 111, 115, 116, 108, 97, 98, 111, 114, 97, 116, 111, 114, 121, 46, 99,
    111, 109,
  ],
} as const;

function decodeCharCodes(codes: readonly number[]) {
  return String.fromCharCode(...codes);
}

export function getProtectedContactEmail() {
  return `${decodeCharCodes(EMAIL_PARTS.local)}@${decodeCharCodes(EMAIL_PARTS.domain)}`;
}

export function getProtectedContactMailto() {
  return `mailto:${getProtectedContactEmail()}`;
}
