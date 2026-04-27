import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(32, "Phone number is too long."),
  subject: z.string().trim().min(3, "Please enter a subject.").max(120, "Subject is too long."),
  message: z.string().trim().min(10, "Please enter a short message.").max(1500),
  website: z.string().optional().default(""),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
