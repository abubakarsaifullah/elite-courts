// Practical anti-spam limits for booking requests. Server-side limits are best-effort
// in serverless environments; for heavy traffic, move these counters to Redis or a database.

export const bookingLimits = {
  maxCreateRequestsPerIpPerHour: 6,
  maxViewRequestsPerIpPer15Minutes: 30,
  maxPendingBookingsPerPhone: 3,
  cooldownMinutesAfterBooking: 5,
  deviceCooldownCookieName: "elite_booking_cooldown",
};
