// Business opening hours used by the public website, chatbot slot generator,
// Google Calendar availability checks, and admin dashboard stats.
//
// Elite Courts currently opens at 12:00 PM and closes at 5:00 AM the next day.
// If hours change, update this file only.

export type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface BusinessDayHours {
  open: string; // 24-hour HH:mm format, e.g. "12:00"
  close: string; // 24-hour HH:mm format, e.g. "05:00"
  closesNextDay: boolean; // true when closing time is after midnight
  closed?: boolean;
}

export const weekdayOrder: Weekday[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export const businessHours: {
  timezone: "Asia/Karachi";
  slotBufferMinutes: number;
  weeklyHours: Record<Weekday, BusinessDayHours>;
} = {
  timezone: "Asia/Karachi",
  slotBufferMinutes: 0,
  weeklyHours: {
    monday: { open: "12:00", close: "05:00", closesNextDay: true },
    tuesday: { open: "12:00", close: "05:00", closesNextDay: true },
    wednesday: { open: "12:00", close: "05:00", closesNextDay: true },
    thursday: { open: "12:00", close: "05:00", closesNextDay: true },
    friday: { open: "12:00", close: "05:00", closesNextDay: true },
    saturday: { open: "12:00", close: "05:00", closesNextDay: true },
    sunday: { open: "12:00", close: "05:00", closesNextDay: true },
  },
};

export const businessHoursDisplay = {
  title: "Opening Hours",
  summary: "Open daily from 12:00 PM to 5:00 AM next day.",
  note: "Late-night slots after midnight belong to the previous operating day.",
};
