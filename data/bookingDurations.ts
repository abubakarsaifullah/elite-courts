// Booking durations shown in the chatbot.
// To add a new duration, add a new object with a unique id and minute value.

export const bookingDurations = [
  { id: "30-min", label: "30 minutes", minutes: 30 },
  { id: "60-min", label: "1 hour", minutes: 60 },
  { id: "90-min", label: "1 hour 30 minutes", minutes: 90 },
  { id: "120-min", label: "2 hours", minutes: 120 },
] as const;

export type BookingDurationId = (typeof bookingDurations)[number]["id"];

export function getBookingDurationById(id: string) {
  return bookingDurations.find((duration) => duration.id === id);
}
