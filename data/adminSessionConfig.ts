// Server-side admin session settings. Do not import this file into client components.
// maxActiveSessions: 1 means a new successful login replaces the previous session.
// For multi-server production deployments, move active session tracking to Redis/database.

export const adminSessionConfig = {
  maxAgeMinutes: Number(process.env.ADMIN_SESSION_MAX_AGE_MINUTES ?? 120),
  maxActiveSessions: Number(process.env.ADMIN_MAX_ACTIVE_SESSIONS ?? 1),
  replaceOldSessionOnLogin: (process.env.ADMIN_REPLACE_OLD_SESSION_ON_LOGIN ?? "true") !== "false",
};
