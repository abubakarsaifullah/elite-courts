// Practical anti-spam limits for booking requests.
//
// Change maxPendingRequestsPerPhone to control how many pending booking
// requests one mobile number can have at the same time. This value is used
// by both chatbot booking checks and server-side booking validation.
//
// Server-side counters are best-effort in serverless environments; for heavy
// production traffic, move these counters to Redis or a database.

export const bookingLimits = {
  maxCreateRequestsPerIpPerHour: 6,
  maxViewRequestsPerIpPer15Minutes: 30,
  maxPendingRequestsPerPhone: 3,
  cooldownMinutesAfterBooking: 5,
  deviceCooldownCookieName: "elite_booking_cooldown",
};
