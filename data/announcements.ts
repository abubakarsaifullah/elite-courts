import { formatMoney, packages, type SitePackage } from "./packages";

// Announcement marquee settings
// Update the fallbackItems text below when you want to change the default ticker text.
// Promotional package messages are generated from data/packages.ts so discounts are not duplicated here.
export const announcements = {
  enabled: true,
  label: "Special Offer",
  maxPackageMessages: 12,
  showNewPackages: true,
  showDiscountedPackages: true,
  showPopularPackages: true,
  fallbackItems: [
    "Special discounts are available on selected packages.",
    "Book your slot through WhatsApp before visiting Elite Courts.",
    "Padel, pickleball, cricket, badminton, and table tennis slots are available.",
  ],
} as const;

function hasDiscount(item: SitePackage) {
  return Boolean(item.originalPrice && item.originalPrice > item.discountedPrice);
}

function getBadgePrefix(item: SitePackage) {
  if (item.badge === "New") return "New: ";
  if (item.badge === "Best Value") return "Best Value: ";
  if (item.badge === "Popular") return "Popular: ";
  if (item.isRecommended) return "Recommended: ";
  if (item.isPopular) return "Popular: ";
  return "";
}

function getDiscountMessage(item: SitePackage) {
  const saving = item.originalPrice ? item.originalPrice - item.discountedPrice : 0;
  const savingText = item.promotionLabel ?? `Save ${formatMoney(saving, item.currency)}`;
  return `${getBadgePrefix(item)}${savingText} on ${item.title}`;
}

function getPopularMessage(item: SitePackage) {
  const prefix = getBadgePrefix(item);
  if (!prefix) return null;
  return `${prefix}${item.title} available for ${formatMoney(item.discountedPrice, item.currency)}${item.priceSuffix ?? ""}`;
}

function uniqueItems(items: readonly string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

export function getAnnouncementItems() {
  const typedPackages = packages as readonly SitePackage[];

  const discountMessages = announcements.showDiscountedPackages
    ? typedPackages.filter(hasDiscount).map(getDiscountMessage)
    : [];

  const popularMessages = announcements.showPopularPackages
    ? typedPackages
        .filter((item) => item.visible !== false && item.badge !== "New")
        .map(getPopularMessage)
        .filter((item): item is string => Boolean(item))
    : [];

  const newMessages = announcements.showNewPackages
    ? typedPackages
        .filter((item) => item.visible !== false && item.badge === "New")
        .map((item) => `New: ${item.title} available for ${formatMoney(item.discountedPrice, item.currency)}${item.priceSuffix ?? ""}`)
    : [];

  const generatedItems = uniqueItems([...newMessages, ...discountMessages, ...popularMessages]).slice(0, announcements.maxPackageMessages);

  return generatedItems.length > 0 ? generatedItems : announcements.fallbackItems;
}
