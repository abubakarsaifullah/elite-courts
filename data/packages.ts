export type PackageSport = "Padel" | "Pickleball" | "Cricket" | "Table Tennis" | "Badminton" | "Membership";
export type PackageType = "court" | "bundle" | "bowling-machine" | "indoor-sport" | "monthly-membership";

export interface SitePackage {
  id: string;
  sport: PackageSport;
  packageType: PackageType;
  title: string;
  subtitle?: string;
  description?: string;
  currency: "Rs";
  originalPrice?: number;
  discountedPrice: number;
  priceSuffix?: string;
  duration: string;
  availability?: string;
  promotionLabel?: string;
  badge?: "Standard" | "Popular" | "Recommended" | "Best Value" | "Weekday" | "Weekend";
  isPopular?: boolean;
  isRecommended?: boolean;
  features: readonly string[];
  terms?: readonly string[];
  whatsappMessage: string;
}

export interface PackageSection {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  packageIds: readonly string[];
  note?: string;
}

export const packages = [
  {
    id: "padel-weekday-1-hour",
    sport: "Padel",
    packageType: "court",
    title: "Weekday Padel",
    subtitle: "Monday to Thursday",
    description: "A one-hour padel session for weekday play.",
    currency: "Rs",
    discountedPrice: 3000,
    priceSuffix: " / hour",
    duration: "1 hour",
    availability: "Monday to Thursday, 12 PM - 5 AM",
    badge: "Weekday",
    features: ["Carbon fiber rackets included", "Free balls provided", "GoPro recording access", "Access to all board games"],
    whatsappMessage: "I'm looking to book a Weekday Padel session at Elite Courts.",
  },
  {
    id: "padel-weekend-1-hour",
    sport: "Padel",
    packageType: "court",
    title: "Weekend Padel",
    subtitle: "Friday to Sunday",
    description: "A one-hour padel session for weekend and prime-time play.",
    currency: "Rs",
    discountedPrice: 3500,
    priceSuffix: " / hour",
    duration: "1 hour",
    availability: "Friday to Sunday, prime-time slots",
    badge: "Popular",
    isPopular: true,
    features: ["Carbon fiber rackets included", "Free balls provided", "GoPro recording access", "Full facility access"],
    whatsappMessage: "I'm looking to book a Weekend Padel session at Elite Courts.",
  },
  {
    id: "padel-2-hour-weekday",
    sport: "Padel",
    packageType: "bundle",
    title: "2 Hours Weekday Padel",
    subtitle: "Multi-hour discount",
    description: "Book two weekday padel hours at a discounted bundle rate.",
    currency: "Rs",
    originalPrice: 6000,
    discountedPrice: 5500,
    duration: "2 hours",
    availability: "Monday to Thursday",
    promotionLabel: "Save Rs 500",
    badge: "Popular",
    isPopular: true,
    features: ["Carbon fiber rackets included", "Free balls provided", "GoPro recording access", "Access to all board games"],
    whatsappMessage: "I'm interested in the 2 Hours Weekday Padel bundle at Elite Courts.",
  },
  {
    id: "padel-2-hour-weekend",
    sport: "Padel",
    packageType: "bundle",
    title: "2 Hours Weekend Padel",
    subtitle: "Multi-hour discount",
    description: "Book two weekend padel hours at a discounted bundle rate.",
    currency: "Rs",
    originalPrice: 7000,
    discountedPrice: 6500,
    duration: "2 hours",
    availability: "Friday to Sunday",
    promotionLabel: "Save Rs 500",
    features: ["Carbon fiber rackets included", "Free balls provided", "GoPro recording access", "Full facility access"],
    whatsappMessage: "I'm interested in the 2 Hours Weekend Padel bundle at Elite Courts.",
  },
  {
    id: "padel-3-hour-weekday",
    sport: "Padel",
    packageType: "bundle",
    title: "3 Hours Weekday Padel",
    subtitle: "Best value bundle",
    description: "A longer weekday padel booking with stronger savings.",
    currency: "Rs",
    originalPrice: 9000,
    discountedPrice: 7500,
    duration: "3 hours",
    availability: "Monday to Thursday",
    promotionLabel: "Save Rs 1,500",
    badge: "Best Value",
    isRecommended: true,
    features: ["Carbon fiber rackets included", "Free balls provided", "GoPro recording access", "Access to all board games"],
    whatsappMessage: "I'm interested in the 3 Hours Weekday Padel bundle at Elite Courts.",
  },
  {
    id: "padel-3-hour-weekend",
    sport: "Padel",
    packageType: "bundle",
    title: "3 Hours Weekend Padel",
    subtitle: "Best value bundle",
    description: "A longer weekend padel booking with stronger savings.",
    currency: "Rs",
    originalPrice: 10500,
    discountedPrice: 9000,
    duration: "3 hours",
    availability: "Friday to Sunday",
    promotionLabel: "Save Rs 1,500",
    badge: "Best Value",
    isRecommended: true,
    features: ["Carbon fiber rackets included", "Free balls provided", "GoPro recording access", "Full facility access"],
    whatsappMessage: "I'm interested in the 3 Hours Weekend Padel bundle at Elite Courts.",
  },
  {
    id: "pickleball-weekday-1-hour",
    sport: "Pickleball",
    packageType: "court",
    title: "Weekday Pickleball",
    subtitle: "Monday to Thursday",
    description: "A one-hour pickleball slot for weekday singles or doubles.",
    currency: "Rs",
    discountedPrice: 1500,
    priceSuffix: " / hour",
    duration: "1 hour",
    availability: "Monday to Thursday, 12 PM - 5 AM",
    badge: "Weekday",
    features: ["Premium rackets included", "Free balls provided", "GoPro recording access", "Access to all board games"],
    whatsappMessage: "I'm looking to book a Weekday Pickleball slot at Elite Courts.",
  },
  {
    id: "pickleball-weekend-1-hour",
    sport: "Pickleball",
    packageType: "court",
    title: "Weekend Pickleball",
    subtitle: "Friday to Sunday",
    description: "A one-hour pickleball slot at the same flat rate on weekends.",
    currency: "Rs",
    discountedPrice: 1500,
    priceSuffix: " / hour",
    duration: "1 hour",
    availability: "Friday to Sunday, prime-time slots",
    badge: "Popular",
    isPopular: true,
    features: ["Premium rackets included", "Free balls provided", "GoPro recording access", "Full facility access"],
    whatsappMessage: "I'm looking to book a Weekend Pickleball slot at Elite Courts.",
  },
  {
    id: "pickleball-1-hour-all-week",
    sport: "Pickleball",
    packageType: "bundle",
    title: "1 Hour Pickleball",
    subtitle: "Flat rate all week",
    description: "Standard one-hour pickleball rate available all week.",
    currency: "Rs",
    discountedPrice: 1500,
    duration: "1 hour",
    availability: "All week",
    badge: "Standard",
    features: ["Premium rackets included", "Free balls provided", "GoPro recording access"],
    terms: ["Flat rate applicable all week"],
    whatsappMessage: "I'm interested in the 1 Hour Pickleball package at Elite Courts.",
  },
  {
    id: "pickleball-2-hours-all-week",
    sport: "Pickleball",
    packageType: "bundle",
    title: "2 Hours Pickleball",
    subtitle: "Multi-hour discount",
    description: "Two hours of pickleball at a discounted all-week rate.",
    currency: "Rs",
    originalPrice: 3000,
    discountedPrice: 2750,
    duration: "2 hours",
    availability: "All week",
    promotionLabel: "Save Rs 250",
    badge: "Popular",
    isPopular: true,
    features: ["Premium rackets included", "Free balls provided", "GoPro recording access"],
    terms: ["Flat rate applicable all week"],
    whatsappMessage: "I'm interested in the 2 Hours Pickleball bundle at Elite Courts.",
  },
  {
    id: "pickleball-3-hours-all-week",
    sport: "Pickleball",
    packageType: "bundle",
    title: "3 Hours Pickleball",
    subtitle: "Best value bundle",
    description: "Three hours of pickleball at the best listed all-week bundle rate.",
    currency: "Rs",
    originalPrice: 4500,
    discountedPrice: 4000,
    duration: "3 hours",
    availability: "All week",
    promotionLabel: "Save Rs 500",
    badge: "Best Value",
    isRecommended: true,
    features: ["Premium rackets included", "Free balls provided", "GoPro recording access"],
    terms: ["Flat rate applicable all week"],
    whatsappMessage: "I'm interested in the 3 Hours Pickleball bundle at Elite Courts.",
  },
  {
    id: "cricket-weekday-5-overs",
    sport: "Cricket",
    packageType: "bowling-machine",
    title: "5 Overs Weekday Cricket",
    subtitle: "Bowling machine practice",
    description: "A short weekday cricket practice package.",
    currency: "Rs",
    discountedPrice: 400,
    duration: "5 overs",
    availability: "Monday to Thursday",
    badge: "Weekday",
    features: ["Bowling machine access", "Speed gun", "Swing and spin options", "Adjustable speed up to 160 kph"],
    whatsappMessage: "I'm looking to book the 5 Overs Weekday Cricket package at Elite Courts.",
  },
  {
    id: "cricket-weekday-10-overs",
    sport: "Cricket",
    packageType: "bowling-machine",
    title: "10 Overs Weekday Cricket",
    subtitle: "Bowling machine practice",
    description: "A balanced weekday cricket practice package.",
    currency: "Rs",
    discountedPrice: 750,
    duration: "10 overs",
    availability: "Monday to Thursday",
    badge: "Weekday",
    features: ["Bowling machine access", "Speed gun", "Swing and spin options", "Adjustable speed up to 160 kph"],
    whatsappMessage: "I'm looking to book the 10 Overs Weekday Cricket package at Elite Courts.",
  },
  {
    id: "cricket-weekday-20-overs",
    sport: "Cricket",
    packageType: "bowling-machine",
    title: "20 Overs Weekday Cricket",
    subtitle: "Best value weekday practice",
    description: "A longer weekday bowling machine session for serious practice.",
    currency: "Rs",
    discountedPrice: 1450,
    duration: "20 overs",
    availability: "Monday to Thursday",
    badge: "Best Value",
    isRecommended: true,
    features: ["Bowling machine access", "Speed gun", "Swing and spin options", "Adjustable speed up to 160 kph"],
    whatsappMessage: "I'm looking to book the 20 Overs Weekday Cricket package at Elite Courts.",
  },
  {
    id: "cricket-weekend-5-overs",
    sport: "Cricket",
    packageType: "bowling-machine",
    title: "5 Overs Weekend Cricket",
    subtitle: "Bowling machine practice",
    description: "A short weekend cricket practice package.",
    currency: "Rs",
    discountedPrice: 450,
    duration: "5 overs",
    availability: "Friday to Sunday",
    badge: "Weekend",
    features: ["Bowling machine access", "Speed gun", "Swing and spin options", "Adjustable speed up to 160 kph"],
    whatsappMessage: "I'm looking to book the 5 Overs Weekend Cricket package at Elite Courts.",
  },
  {
    id: "cricket-weekend-10-overs",
    sport: "Cricket",
    packageType: "bowling-machine",
    title: "10 Overs Weekend Cricket",
    subtitle: "Bowling machine practice",
    description: "A balanced weekend cricket practice package.",
    currency: "Rs",
    discountedPrice: 850,
    duration: "10 overs",
    availability: "Friday to Sunday",
    badge: "Weekend",
    features: ["Bowling machine access", "Speed gun", "Swing and spin options", "Adjustable speed up to 160 kph"],
    whatsappMessage: "I'm looking to book the 10 Overs Weekend Cricket package at Elite Courts.",
  },
  {
    id: "cricket-weekend-20-overs",
    sport: "Cricket",
    packageType: "bowling-machine",
    title: "20 Overs Weekend Cricket",
    subtitle: "Best value weekend practice",
    description: "A longer weekend bowling machine session for serious practice.",
    currency: "Rs",
    discountedPrice: 1650,
    duration: "20 overs",
    availability: "Friday to Sunday",
    badge: "Best Value",
    isRecommended: true,
    features: ["Bowling machine access", "Speed gun", "Swing and spin options", "Adjustable speed up to 160 kph"],
    whatsappMessage: "I'm looking to book the 20 Overs Weekend Cricket package at Elite Courts.",
  },
  {
    id: "table-tennis-singles-30-minutes",
    sport: "Table Tennis",
    packageType: "indoor-sport",
    title: "Singles Table Tennis",
    subtitle: "1 vs 1 matches",
    description: "A 30-minute singles table tennis session.",
    currency: "Rs",
    discountedPrice: 400,
    duration: "30 minutes",
    availability: "Indoor room",
    features: ["Indoor room", "Professional rackets", "Unlimited balls access"],
    whatsappMessage: "I'm looking to book Table Tennis Singles for 30 minutes at Elite Courts.",
  },
  {
    id: "table-tennis-singles-60-minutes",
    sport: "Table Tennis",
    packageType: "indoor-sport",
    title: "Singles Table Tennis",
    subtitle: "1 vs 1 matches",
    description: "A 60-minute singles table tennis session.",
    currency: "Rs",
    discountedPrice: 700,
    duration: "60 minutes",
    availability: "Indoor room",
    badge: "Popular",
    isPopular: true,
    features: ["Indoor room", "Professional rackets", "Unlimited balls access"],
    whatsappMessage: "I'm looking to book Table Tennis Singles for 60 minutes at Elite Courts.",
  },
  {
    id: "table-tennis-doubles-30-minutes",
    sport: "Table Tennis",
    packageType: "indoor-sport",
    title: "Doubles Table Tennis",
    subtitle: "2 vs 2 matches",
    description: "A 30-minute doubles table tennis session.",
    currency: "Rs",
    discountedPrice: 600,
    duration: "30 minutes",
    availability: "Indoor room",
    features: ["High intensity indoor play", "4 rackets included", "Unlimited ball access"],
    whatsappMessage: "I'm looking to book Table Tennis Doubles for 30 minutes at Elite Courts.",
  },
  {
    id: "table-tennis-doubles-60-minutes",
    sport: "Table Tennis",
    packageType: "indoor-sport",
    title: "Doubles Table Tennis",
    subtitle: "2 vs 2 matches",
    description: "A 60-minute doubles table tennis session.",
    currency: "Rs",
    discountedPrice: 1000,
    duration: "60 minutes",
    availability: "Indoor room",
    badge: "Best Value",
    isRecommended: true,
    features: ["High intensity indoor play", "4 rackets included", "Unlimited ball access"],
    whatsappMessage: "I'm looking to book Table Tennis Doubles for 60 minutes at Elite Courts.",
  },
  {
    id: "badminton-court-rental-60-minutes",
    sport: "Badminton",
    packageType: "indoor-sport",
    title: "Badminton Court Rental",
    subtitle: "60 minute session",
    description: "A one-hour badminton court rental session.",
    currency: "Rs",
    discountedPrice: 1500,
    duration: "60 minutes",
    availability: "12 PM - 5 AM",
    badge: "Popular",
    isPopular: true,
    features: ["Pre-booking required", "Professional rackets included", "Premium shuttles provided"],
    whatsappMessage: "I'm looking to book a Badminton Court Rental at Elite Courts.",
  },
  {
    id: "membership-cricket-5-overs-daily",
    sport: "Membership",
    packageType: "monthly-membership",
    title: "Cricket Academy - 5 Overs Daily",
    subtitle: "Daily practice membership",
    description: "Monthly cricket practice membership with 5 overs daily.",
    currency: "Rs",
    discountedPrice: 7500,
    duration: "Monthly",
    availability: "5 overs daily",
    features: ["Daily cricket practice", "Bowling machine access"],
    whatsappMessage: "I'm interested in the Cricket Academy 5 Overs Daily membership at Elite Courts.",
  },
  {
    id: "membership-cricket-10-overs-daily",
    sport: "Membership",
    packageType: "monthly-membership",
    title: "Cricket Academy - 10 Overs Daily",
    subtitle: "Daily practice membership",
    description: "Monthly cricket practice membership with 10 overs daily.",
    currency: "Rs",
    discountedPrice: 10000,
    duration: "Monthly",
    availability: "10 overs daily",
    features: ["Daily cricket practice", "Bowling machine access"],
    whatsappMessage: "I'm interested in the Cricket Academy 10 Overs Daily membership at Elite Courts.",
  },
  {
    id: "membership-cricket-15-overs-daily",
    sport: "Membership",
    packageType: "monthly-membership",
    title: "Cricket Academy - 15 Overs Daily",
    subtitle: "Daily practice membership",
    description: "Monthly cricket practice membership with 15 overs daily.",
    currency: "Rs",
    discountedPrice: 12500,
    duration: "Monthly",
    availability: "15 overs daily",
    features: ["Daily cricket practice", "Bowling machine access"],
    whatsappMessage: "I'm interested in the Cricket Academy 15 Overs Daily membership at Elite Courts.",
  },
  {
    id: "membership-cricket-20-overs-daily",
    sport: "Membership",
    packageType: "monthly-membership",
    title: "Cricket Academy - 20 Overs Daily",
    subtitle: "Daily practice membership",
    description: "Monthly cricket practice membership with 20 overs daily.",
    currency: "Rs",
    discountedPrice: 15000,
    duration: "Monthly",
    availability: "20 overs daily",
    badge: "Best Value",
    isRecommended: true,
    features: ["Daily cricket practice", "Bowling machine access"],
    whatsappMessage: "I'm interested in the Cricket Academy 20 Overs Daily membership at Elite Courts.",
  },
  {
    id: "membership-padel-10-hours",
    sport: "Membership",
    packageType: "monthly-membership",
    title: "Padel Monthly - 10 Hours",
    subtitle: "Racket sports membership",
    description: "Monthly padel membership with 10 hours included.",
    currency: "Rs",
    discountedPrice: 25000,
    duration: "Monthly",
    availability: "Padel, 10 hours",
    features: ["Priority court booking", "10% off guest fees", "Free racket rentals"],
    whatsappMessage: "I'm interested in the Padel 10 Hours monthly membership at Elite Courts.",
  },
  {
    id: "membership-pickleball-12-hours",
    sport: "Membership",
    packageType: "monthly-membership",
    title: "Pickleball Monthly - 12 Hours",
    subtitle: "Racket sports membership",
    description: "Monthly pickleball membership with 12 hours included.",
    currency: "Rs",
    discountedPrice: 15000,
    duration: "Monthly",
    availability: "Pickleball, 12 hours",
    badge: "Popular",
    isPopular: true,
    features: ["Priority court booking", "10% off guest fees", "Free racket rentals"],
    whatsappMessage: "I'm interested in the Pickleball 12 Hours monthly membership at Elite Courts.",
  },
] as const satisfies readonly SitePackage[];

export const packageSections = [
  {
    id: "padel",
    label: "Padel",
    eyebrow: "Padel",
    title: "Padel court packages",
    description:
      "Weekday, weekend, and multi-hour padel bundles with included rackets, balls, recording access, and facility benefits.",
    packageIds: [
      "padel-weekday-1-hour",
      "padel-weekend-1-hour",
      "padel-2-hour-weekday",
      "padel-2-hour-weekend",
      "padel-3-hour-weekday",
      "padel-3-hour-weekend",
    ],
  },
  {
    id: "pickleball",
    label: "Pickleball",
    eyebrow: "Pickleball",
    title: "Pickleball court packages",
    description:
      "Flat-rate pickleball packages with weekday, weekend, and all-week bundle options for singles and doubles play.",
    packageIds: [
      "pickleball-weekday-1-hour",
      "pickleball-weekend-1-hour",
      "pickleball-1-hour-all-week",
      "pickleball-2-hours-all-week",
      "pickleball-3-hours-all-week",
    ],
    note: "Pickleball bundle rates are listed as flat rates applicable all week.",
  },
  {
    id: "cricket",
    label: "Cricket",
    eyebrow: "Cricket",
    title: "Cricket bowling machine packages",
    description:
      "Weekday and weekend bowling machine rates for 5, 10, and 20-over practice sessions.",
    packageIds: [
      "cricket-weekday-5-overs",
      "cricket-weekday-10-overs",
      "cricket-weekday-20-overs",
      "cricket-weekend-5-overs",
      "cricket-weekend-10-overs",
      "cricket-weekend-20-overs",
    ],
  },
  {
    id: "table-tennis",
    label: "Table Tennis",
    eyebrow: "Table Tennis",
    title: "Table tennis packages",
    description:
      "Singles and doubles indoor table tennis sessions with rackets and ball access included.",
    packageIds: [
      "table-tennis-singles-30-minutes",
      "table-tennis-singles-60-minutes",
      "table-tennis-doubles-30-minutes",
      "table-tennis-doubles-60-minutes",
    ],
  },
  {
    id: "badminton",
    label: "Badminton",
    eyebrow: "Badminton",
    title: "Badminton court rental",
    description:
      "A simple 60-minute badminton court rental offer with rackets, shuttles, and pre-booking details.",
    packageIds: ["badminton-court-rental-60-minutes"],
  },
  {
    id: "memberships",
    label: "Memberships",
    eyebrow: "Memberships",
    title: "Monthly memberships",
    description:
      "Monthly Cricket Academy practice plans and racket-sports memberships for regular players.",
    packageIds: [
      "membership-cricket-5-overs-daily",
      "membership-cricket-10-overs-daily",
      "membership-cricket-15-overs-daily",
      "membership-cricket-20-overs-daily",
      "membership-padel-10-hours",
      "membership-pickleball-12-hours",
    ],
  },
] as const satisfies readonly PackageSection[];

export const quickPricingHighlights = [
  "Padel starts from Rs 3,000 on weekdays and Rs 3,500 on weekends.",
  "Pickleball is Rs 1,500 per hour, with multi-hour bundle savings available.",
  "Cricket bowling machine packages start from Rs 400 on weekdays and Rs 450 on weekends.",
  "Badminton is Rs 1,500 for a 60-minute court rental session.",
] as const;

const packageMap: ReadonlyMap<string, SitePackage> = new Map<string, SitePackage>(
  packages.map((item): [string, SitePackage] => [item.id, item]),
);

export function formatMoney(amount: number, currency: SitePackage["currency"] = "Rs") {
  return `${currency} ${new Intl.NumberFormat("en-PK").format(amount)}`;
}

export function formatPackagePrice(item: SitePackage) {
  return `${formatMoney(item.discountedPrice, item.currency)}${item.priceSuffix ?? ""}`;
}

export function formatOriginalPrice(item: SitePackage) {
  return item.originalPrice ? `${formatMoney(item.originalPrice, item.currency)}${item.priceSuffix ?? ""}` : null;
}

export function getPackageSavings(item: SitePackage) {
  if (!item.originalPrice || item.originalPrice <= item.discountedPrice) return null;
  return item.originalPrice - item.discountedPrice;
}

export function getPackageById(id: string) {
  return packageMap.get(id);
}

export function getPackagesForSection(section: PackageSection) {
  return section.packageIds.map((id) => packageMap.get(id)).filter((item): item is SitePackage => Boolean(item));
}

export const featuredHomePackages = [
  "padel-weekday-1-hour",
  "pickleball-weekday-1-hour",
  "cricket-weekday-5-overs",
  "badminton-court-rental-60-minutes",
]
  .map((id) => packageMap.get(id))
  .filter((item): item is SitePackage => Boolean(item));

export const memberships = [
  {
    slug: "cricket-membership",
    title: "Cricket Academy / Daily Practice Membership",
    subtitle: "Daily practice membership",
    plans: [
      "membership-cricket-5-overs-daily",
      "membership-cricket-10-overs-daily",
      "membership-cricket-15-overs-daily",
      "membership-cricket-20-overs-daily",
    ].map((id) => packageMap.get(id)).filter((item): item is SitePackage => Boolean(item)),
    perksTitle: null,
    perks: [] as string[],
    whatsappMessage: "I'm interested in the Monthly Cricket Membership at Elite Courts.",
  },
  {
    slug: "racket-membership",
    title: "Racket Sports Monthly",
    subtitle: "Padel and Pickleball monthly plans",
    plans: ["membership-padel-10-hours", "membership-pickleball-12-hours"]
      .map((id) => packageMap.get(id))
      .filter((item): item is SitePackage => Boolean(item)),
    perksTitle: "Racket sports member perks",
    perks: ["Priority court booking", "10% off guest fees", "Free racket rentals"],
    whatsappMessage: "I'm interested in Racket Sports Membership at Elite Courts.",
  },
] as const;
