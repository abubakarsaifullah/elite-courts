import { PACKAGE_CURRENCY, PACKAGE_PRICES } from "@/data/packagePrices";
import { businessHours, type BusinessDayHours, type Weekday } from "@/data/businessHours";
import { bookingDurations, type BookingDurationId } from "@/data/bookingDurations";

// Central booking rules for each sport used by the chatbot and admin portal.
// Owner/developer update guide:
// - Set active: false to hide a sport from new chatbot/admin bookings.
// - Update weeklyAvailability to change sport-specific timings.
// - Add/remove allowedDurations to control which durations a sport can book.
// - Use priceKey / weekdayPriceKey / weekendPriceKey to connect durations to data/packagePrices.ts.
// - Update colorId to change the Google Calendar event color for that sport.

type PackagePriceKey = keyof typeof PACKAGE_PRICES;

export interface SportDurationPriceRule {
  durationId: BookingDurationId;
  priceKey?: PackagePriceKey;
  weekdayPriceKey?: PackagePriceKey;
  weekendPriceKey?: PackagePriceKey;
  note?: string;
}

export interface SportBookingConfigItem {
  id: string;
  name: string;
  active: boolean;
  colorId: string;
  capacity: number;
  allowSameTimeWithOtherSports: boolean;
  displayOrder: number;
  weeklyAvailability: Record<Weekday, BusinessDayHours>;
  allowedDurations: SportDurationPriceRule[];
  notes?: string;
}

export const sportBookingSettings = {
  timezone: businessHours.timezone,
  // Slots start at clean 30-minute boundaries: xx:00 and xx:30.
  // The system rounds the current time up to the next boundary before offering slots.
  slotStartIntervalMinutes: 30,
  // Weekend pricing is configurable here.
  // Every day listed below uses weekendPriceKey. Every day not listed uses weekdayPriceKey.
  // Example: for Friday/Saturday weekends, change this to ["friday", "saturday"].
  weekendDays: ["saturday", "sunday"] as Weekday[],
};

const dailyHours = businessHours.weeklyHours;

export const sportBookingConfig = [
  {
    id: "padel",
    name: "Padel",
    active: true,
    colorId: "10",
    capacity: 1,
    allowSameTimeWithOtherSports: true,
    displayOrder: 1,
    weeklyAvailability: dailyHours,
    allowedDurations: [
      { durationId: "30-min", note: "Price will be confirmed by our team." },
      { durationId: "60-min", weekdayPriceKey: "padelWeekdayOneHour", weekendPriceKey: "padelWeekendOneHour" },
      { durationId: "90-min", note: "Price will be confirmed by our team." },
      { durationId: "120-min", weekdayPriceKey: "padelTwoHourWeekdayDiscounted", weekendPriceKey: "padelTwoHourWeekendDiscounted" },
    ],
    notes: "Padel pricing may vary by weekday/weekend.",
  },
  {
    id: "pickleball",
    name: "Pickleball",
    active: true,
    colorId: "2",
    capacity: 1,
    allowSameTimeWithOtherSports: true,
    displayOrder: 2,
    weeklyAvailability: dailyHours,
    allowedDurations: [
      { durationId: "30-min", note: "Price will be confirmed by our team." },
      { durationId: "60-min", weekdayPriceKey: "pickleballOneHour", weekendPriceKey: "pickleballOneHourWeekend" },
      { durationId: "90-min", note: "Price will be confirmed by our team." },
      { durationId: "120-min", priceKey: "pickleballTwoHourDiscounted" },
    ],
  },
  {
    id: "cricket",
    name: "Cricket Bowling Machine",
    active: true,
    colorId: "5",
    capacity: 1,
    allowSameTimeWithOtherSports: true,
    displayOrder: 3,
    weeklyAvailability: dailyHours,
    allowedDurations: [
      { durationId: "30-min", priceKey: "cricketHalfHour" },
      { durationId: "60-min", priceKey: "cricketOneHour" },
      { durationId: "90-min", note: "Price will be confirmed by our team." },
      { durationId: "120-min", note: "Price will be confirmed by our team." },
    ],
  },
  {
    id: "table-tennis",
    name: "Table Tennis",
    active: true,
    colorId: "6",
    capacity: 1,
    allowSameTimeWithOtherSports: true,
    displayOrder: 4,
    weeklyAvailability: dailyHours,
    allowedDurations: [
      { durationId: "30-min", priceKey: "tableTennisSinglesThirtyMinutes" },
      { durationId: "60-min", priceKey: "tableTennisSinglesSixtyMinutes" },
      { durationId: "90-min", note: "Price will be confirmed by our team." },
      { durationId: "120-min", note: "Price will be confirmed by our team." },
    ],
  },
  {
    id: "badminton",
    name: "Badminton",
    active: true,
    colorId: "7",
    capacity: 1,
    allowSameTimeWithOtherSports: true,
    displayOrder: 5,
    weeklyAvailability: dailyHours,
    allowedDurations: [
      { durationId: "30-min", note: "Price will be confirmed by our team." },
      { durationId: "60-min", priceKey: "badmintonCourtSixtyMinutes" },
      { durationId: "90-min", note: "Price will be confirmed by our team." },
      { durationId: "120-min", note: "Price will be confirmed by our team." },
    ],
  },
] as const satisfies readonly SportBookingConfigItem[];

export type SportBookingId = (typeof sportBookingConfig)[number]["id"];

export function getSportBookingConfigById(id: string) {
  return sportBookingConfig.find((sport) => sport.id === id);
}

export function getActiveSportBookingConfig() {
  return sportBookingConfig.filter((sport) => sport.active).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getAllowedDurationsForSport(sportId: string, includeInactive = false) {
  const sport = getSportBookingConfigById(sportId);
  if (!sport || (!sport.active && !includeInactive)) return [];
  return sport.allowedDurations
    .map((rule) => {
      const duration = bookingDurations.find((item) => item.id === rule.durationId);
      return duration ? { ...duration, priceRule: rule } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

export function isDurationAllowedForSport(sportId: string, durationId: string, includeInactive = false) {
  return getAllowedDurationsForSport(sportId, includeInactive).some((duration) => duration.id === durationId);
}
function getCalendarWeekday(dateString: string): Weekday {
  const [year, month, day] = dateString.split("-").map(Number);
  const index = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const map: Weekday[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return map[index];
}

export function isWeekendBookingDate(dateString: string) {
  return sportBookingSettings.weekendDays.includes(getCalendarWeekday(dateString));
}

export interface BookingPriceEstimate {
  amount: number | null;
  currency: typeof PACKAGE_CURRENCY;
  label: string;
  note?: string;
}

export function getBookingPriceEstimate(params: { sportId: string; durationId: string; date?: string }): BookingPriceEstimate {
  const sport = getSportBookingConfigById(params.sportId);
  const durationRule = sport?.allowedDurations.find((rule) => rule.durationId === params.durationId) as SportDurationPriceRule | undefined;
  if (!sport || !durationRule) {
    return { amount: null, currency: PACKAGE_CURRENCY, label: "Price will be confirmed by our team" };
  }

  const priceKey: PackagePriceKey | undefined = durationRule.priceKey
    ?? (params.date && isWeekendBookingDate(params.date) ? durationRule.weekendPriceKey : durationRule.weekdayPriceKey)
    ?? durationRule.weekdayPriceKey
    ?? durationRule.weekendPriceKey;

  if (!priceKey) {
    return { amount: null, currency: PACKAGE_CURRENCY, label: durationRule.note ?? "Price will be confirmed by our team" };
  }

  const amount = PACKAGE_PRICES[priceKey];
  return {
    amount,
    currency: PACKAGE_CURRENCY,
    label: `${PACKAGE_CURRENCY} ${amount.toLocaleString("en-PK")}`,
    note: durationRule.note,
  };
}
