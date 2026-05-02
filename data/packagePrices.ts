// Elite Courts package prices
//
// Update only the numbers below when package prices change.
// Do not remove or rename a price key unless you also update the matching package
// in data/packages.ts. Amounts are stored as plain numbers in Pakistani Rupees.

export const PACKAGE_CURRENCY = "Rs" as const;

export const PACKAGE_PRICES = {
  // Padel hourly rates
  padelWeekdayOneHour: 3000,
  padelWeekendOneHour: 3500,

  // Padel multi-hour bundles
  padelTwoHourWeekdayOriginal: 6000,
  padelTwoHourWeekdayDiscounted: 5500,
  padelTwoHourWeekendOriginal: 7000,
  padelTwoHourWeekendDiscounted: 6500,
  padelThreeHourWeekdayOriginal: 9000,
  padelThreeHourWeekdayDiscounted: 7500,
  padelThreeHourWeekendOriginal: 10500,
  padelThreeHourWeekendDiscounted: 9000,

  // Pickleball hourly and bundle rates
  pickleballOneHour: 1500,
  pickleballTwoHourOriginal: 3000,
  pickleballTwoHourDiscounted: 2750,
  pickleballThreeHourOriginal: 4500,
  pickleballThreeHourDiscounted: 4000,

  // Cricket bowling machine rates
  cricketFiveOversWeekday: 400,
  cricketTenOversWeekday: 750,
  cricketTwentyOversWeekday: 1450,
  cricketFiveOversWeekend: 450,
  cricketTenOversWeekend: 850,
  cricketTwentyOversWeekend: 1650,

  // Table tennis rates
  tableTennisSinglesThirtyMinutes: 400,
  tableTennisSinglesSixtyMinutes: 700,
  tableTennisDoublesThirtyMinutes: 600,
  tableTennisDoublesSixtyMinutes: 1000,

  // Badminton rate
  badmintonCourtSixtyMinutes: 1500,

  // Monthly memberships
  cricketMembershipFiveOversDaily: 7500,
  cricketMembershipTenOversDaily: 10000,
  cricketMembershipFifteenOversDaily: 12500,
  cricketMembershipTwentyOversDaily: 15000,
  padelMembershipTenHours: 25000,
  pickleballMembershipTwelveHours: 15000,
} as const;
