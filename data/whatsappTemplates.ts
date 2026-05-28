// WhatsApp message templates for booking notifications.
// The message is not sent automatically. The customer chooses the button and presses Send in WhatsApp.

export const whatsappTemplates = {
  bookingNotifyTeam: `Hi Elite Courts,

I have created a new booking request.

Booking ID: {{bookingId}}
Name: {{name}}
Phone: {{phone}}
Sport: {{sport}}
Date: {{date}}
Time: {{time}}
Duration: {{duration}}
Estimated Price: {{price}}
Status: {{status}}

Please confirm my booking.`,
};

export function renderTemplate(template: string, values: Record<string, string | number | null | undefined>) {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key: string) => String(values[key] ?? ""));
}
