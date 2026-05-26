// Sports/resources used by the booking chatbot.
// All sports use one Google Calendar. colorId helps identify the sport in Google Calendar.
// capacity is kept for future expansion if one sport can accept more than one booking at the same time.

export interface BookingSport {
  id: string;
  name: string;
  calendarColorId: string;
  capacity: number;
  allowSameTimeWithOtherSports: boolean;
  displayOrder: number;
}

export const bookingSports = [
  {
    id: "padel",
    name: "Padel",
    calendarColorId: "10",
    capacity: 1,
    allowSameTimeWithOtherSports: true,
    displayOrder: 1,
  },
  {
    id: "pickleball",
    name: "Pickleball",
    calendarColorId: "2",
    capacity: 1,
    allowSameTimeWithOtherSports: true,
    displayOrder: 2,
  },
  {
    id: "cricket",
    name: "Cricket Bowling Machine",
    calendarColorId: "5",
    capacity: 1,
    allowSameTimeWithOtherSports: true,
    displayOrder: 3,
  },
  {
    id: "table-tennis",
    name: "Table Tennis",
    calendarColorId: "6",
    capacity: 1,
    allowSameTimeWithOtherSports: true,
    displayOrder: 4,
  },
  {
    id: "badminton",
    name: "Badminton",
    calendarColorId: "7",
    capacity: 1,
    allowSameTimeWithOtherSports: true,
    displayOrder: 5,
  },
] as const satisfies readonly BookingSport[];

export type BookingSportId = (typeof bookingSports)[number]["id"];

export function getBookingSportById(id: string) {
  return bookingSports.find((sport) => sport.id === id);
}
