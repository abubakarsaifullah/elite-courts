import {
  NEW_PACKAGE_BADGE_LABEL,
  formatMoney,
  getPackageBadgeLabel,
  getPackageSavings,
  isNewPackage,
  type SitePackage,
  visiblePackages,
} from "./packages";

export type AnnouncementTone = "new" | "discount" | "popular" | "recommended" | "general";

export interface AnnouncementItem {
  id: string;
  label: string;
  message: string;
  tone: AnnouncementTone;
}

// Announcement marquee settings
// Update fallbackItems when you want to change the default ticker text.
// Package announcements are generated from data/packages.ts so prices, discounts,
// and labels do not need to be copied into this file.
export const announcements = {
  enabled: true,
  label: "Latest Offers",
  maxPackageMessages: 10,
  showNewPackages: true,
  showDiscountedPackages: true,
  showPopularPackages: true,
  fallbackItems: [
    "Book your slot through WhatsApp before visiting Elite Courts.",
    "Padel, pickleball, cricket, badminton, and table tennis slots are available.",
    "Check current packages and memberships before your next session.",
  ],
} as const;

function hasDiscount(item: SitePackage) {
  return Boolean(item.originalPrice && item.originalPrice > item.discountedPrice);
}

function makeId(prefix: string, item: SitePackage) {
  return `${prefix}-${item.id}`;
}

function getDiscountMessage(item: SitePackage): AnnouncementItem | null {
  const savings = getPackageSavings(item);
  if (!savings) return null;

  const savingText = item.promotionLabel ?? `Save ${formatMoney(savings, item.currency)}`;

  return {
    id: makeId("discount", item),
    label: "Save",
    message: `${savingText} on ${item.title}`,
    tone: "discount",
  };
}

function getPopularMessage(item: SitePackage): AnnouncementItem | null {
  const label = getPackageBadgeLabel(item);

  if (!label || label === NEW_PACKAGE_BADGE_LABEL || label === "Standard" || label === "Weekday" || label === "Weekend") {
    return null;
  }

  return {
    id: makeId(label.toLowerCase().replace(/\s+/g, "-"), item),
    label,
    message: `${item.title} available for ${formatMoney(item.discountedPrice, item.currency)}${item.priceSuffix ?? ""}`,
    tone: label === "Recommended" ? "recommended" : "popular",
  };
}

function getNewPackageMessage(item: SitePackage): AnnouncementItem {
  return {
    id: makeId("new", item),
    label: NEW_PACKAGE_BADGE_LABEL,
    message: `${item.title} is now available for ${formatMoney(item.discountedPrice, item.currency)}${item.priceSuffix ?? ""}`,
    tone: "new",
  };
}

function getFallbackItems(): AnnouncementItem[] {
  return announcements.fallbackItems.map((message, index) => ({
    id: `fallback-${index}`,
    label: "Update",
    message,
    tone: "general",
  }));
}

function uniqueItems(items: readonly (AnnouncementItem | null)[]) {
  const seen = new Set<string>();
  return items.filter((item): item is AnnouncementItem => {
    if (!item) return false;
    const key = `${item.label}:${item.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getAnnouncementItems() {
  const newMessages = announcements.showNewPackages
    ? visiblePackages.filter(isNewPackage).map(getNewPackageMessage)
    : [];

  const discountMessages = announcements.showDiscountedPackages
    ? visiblePackages.filter(hasDiscount).map(getDiscountMessage)
    : [];

  const popularMessages = announcements.showPopularPackages
    ? visiblePackages.map(getPopularMessage)
    : [];

  const generatedItems = uniqueItems([...newMessages, ...discountMessages, ...popularMessages]).slice(0, announcements.maxPackageMessages);

  return generatedItems.length > 0 ? generatedItems : getFallbackItems();
}
