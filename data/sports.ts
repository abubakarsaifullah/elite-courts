// Booking sports/resources used by the chatbot and admin portal.
// The detailed booking rules live in data/sportBookingConfig.ts.

import { getActiveSportBookingConfig, getSportBookingConfigById, sportBookingConfig } from "@/data/sportBookingConfig";

export interface BookingSport {
  id: string;
  name: string;
  calendarColorId: string;
  capacity: number;
  allowSameTimeWithOtherSports: boolean;
  displayOrder: number;
  active: boolean;
}

export const bookingSports = sportBookingConfig
  .map((sport) => ({
    id: sport.id,
    name: sport.name,
    calendarColorId: sport.colorId,
    capacity: sport.capacity,
    allowSameTimeWithOtherSports: sport.allowSameTimeWithOtherSports,
    displayOrder: sport.displayOrder,
    active: sport.active,
  }))
  .sort((a, b) => a.displayOrder - b.displayOrder) as readonly BookingSport[];

export type BookingSportId = (typeof bookingSports)[number]["id"];

export function getBookingSportById(id: string, options?: { includeInactive?: boolean }) {
  const sport = getSportBookingConfigById(id);
  if (!sport || (!sport.active && !options?.includeInactive)) return undefined;
  return {
    id: sport.id,
    name: sport.name,
    calendarColorId: sport.colorId,
    capacity: sport.capacity,
    allowSameTimeWithOtherSports: sport.allowSameTimeWithOtherSports,
    displayOrder: sport.displayOrder,
    active: sport.active,
  } satisfies BookingSport;
}

export function getActiveBookingSports() {
  return getActiveSportBookingConfig().map((sport) => ({
    id: sport.id,
    name: sport.name,
    calendarColorId: sport.colorId,
    capacity: sport.capacity,
    allowSameTimeWithOtherSports: sport.allowSameTimeWithOtherSports,
    displayOrder: sport.displayOrder,
    active: sport.active,
  })) satisfies BookingSport[];
}
