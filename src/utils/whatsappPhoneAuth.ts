const PHONE_AUTH_DOMAIN = "mmmphone.app";
const PHONE_AUTH_PASSWORD_SUFFIX = "_secure";
const DEFAULT_OTP_LENGTH = 6;

export const normalizeIndianPhone = (value: string) =>
  value.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");

export const toInternationalPhoneDigits = (phone: string) =>
  `91${normalizeIndianPhone(phone)}`;

export const phoneToDerivedEmail = (phone: string) =>
  `phone_${toInternationalPhoneDigits(phone)}@${PHONE_AUTH_DOMAIN}`;

export const phoneToDerivedPassword = (phone: string) =>
  `phone_auth_${toInternationalPhoneDigits(phone)}${PHONE_AUTH_PASSWORD_SUFFIX}`;

export const generateNumericOtp = (length = DEFAULT_OTP_LENGTH) => {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (value) => (value % 10).toString()).join("");
};

export const buildWhatsappOtpLink = (phone: string, otp: string) => {
  const fullPhone = toInternationalPhoneDigits(phone);
  const message = encodeURIComponent(
    `Your verification code is: *${otp}*\n\nEnter this code in Make My Mattress to continue.`,
  );
  return `https://wa.me/${fullPhone}?text=${message}`;
};

export const isOtpExpired = (
  expiresAt: number | null,
  now = Date.now(),
) => !expiresAt || now > expiresAt;

export const isValidIndianMobile = (phone: string) =>
  normalizeIndianPhone(phone).length === 10;
