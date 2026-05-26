export const REGEX = {
  name: /^[A-Za-z\s.'-]{2,50}$/,
  pakistaniMobile: /^03[0-9]{9}$/,
  bookingId: /^EC(?:-[A-Z]{2,4})?-[0-9]{6}-[A-Z0-9]{4,6}$/,
} as const;
