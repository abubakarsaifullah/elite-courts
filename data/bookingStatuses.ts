export type BookingStatusId = "pending" | "confirmed" | "cancelled" | "rejected" | "completed" | "no_show";

export const bookingStatuses: Record<BookingStatusId, { label: string; color: string; description: string }> = {
  pending: {
    label: "Pending",
    color: "amber",
    description: "Booking request received and waiting for admin confirmation.",
  },
  confirmed: {
    label: "Confirmed",
    color: "green",
    description: "Booking has been confirmed by the admin.",
  },
  cancelled: {
    label: "Cancelled",
    color: "red",
    description: "Booking was cancelled.",
  },
  rejected: {
    label: "Rejected",
    color: "slate",
    description: "Booking request was not accepted.",
  },
  completed: {
    label: "Completed",
    color: "cyan",
    description: "Booking has been completed.",
  },
  no_show: {
    label: "No Show",
    color: "rose",
    description: "Customer did not arrive for the booking.",
  },
};

export const adminEditableStatuses = ["pending", "confirmed", "cancelled"] as const satisfies readonly BookingStatusId[];

export function getBookingStatus(id: string | null | undefined) {
  return bookingStatuses[(id as BookingStatusId) || "pending"] ?? bookingStatuses.pending;
}
