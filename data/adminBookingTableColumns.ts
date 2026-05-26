export type AdminBookingColumnKey = "customer" | "sportName" | "startIso" | "status" | "bookingId" | "actions";

export interface AdminBookingTableColumn {
  key: AdminBookingColumnKey;
  label: string;
  sortable: boolean;
  order: number;
  desktopClassName?: string;
}

const columns: AdminBookingTableColumn[] = [
  { key: "customer", label: "Customer", sortable: true, order: 1 },
  { key: "sportName", label: "Sport", sortable: true, order: 2 },
  { key: "startIso", label: "Date & Time", sortable: true, order: 3 },
  { key: "status", label: "Status", sortable: true, order: 4 },
  { key: "bookingId", label: "Booking ID", sortable: true, order: 5 },
  { key: "actions", label: "Actions", sortable: false, order: 6 },
];

export const bookingTableColumns = columns.sort((a, b) => a.order - b.order);
