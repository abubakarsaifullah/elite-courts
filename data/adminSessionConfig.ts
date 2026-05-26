// Server-side admin session settings. Do not import this file into client components.

export const adminSessionConfig = {
  maxAgeMinutes: Number(process.env.ADMIN_SESSION_MAX_AGE_MINUTES ?? 120),
};
