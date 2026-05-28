// Public-safe booking/chatbot timing configuration. Values with NEXT_PUBLIC_ are
// safe for the browser bundle.

export const chatbotConfig = {
  inactivityResetMinutes: Number(process.env.NEXT_PUBLIC_CHATBOT_INACTIVITY_RESET_MINUTES ?? 15),
  initialVisibleSlots: 5,
};

export const bookingSyncConfig = {
  adminPortalRefreshSeconds: Number(process.env.NEXT_PUBLIC_ADMIN_PORTAL_REFRESH_SECONDS ?? 30),
  enableManualRefresh: true,
};

export const bookingWindowConfig = {
  // Current business week plus the next week until Sunday.
  includeCurrentWeekAndNextWeekUntilSunday: true,
};
