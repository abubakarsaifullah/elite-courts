import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { adminSessionConfig } from "@/data/adminSessionConfig";

const SESSION_COOKIE_NAME = "elite_portal_session";
function getConfiguredSessionMaxAgeSeconds() {
  const minutes = adminSessionConfig.maxAgeMinutes;
  return Math.max(15, minutes) * 60;
}
const HASH_PREFIX = "scrypt";

export interface AdminSession {
  username: string;
  expiresAt: number;
}

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

function fromBase64url(input: string) {
  return Buffer.from(input, "base64url");
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set and at least 32 characters long.");
  }
  return secret;
}

export function hashAdminPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const n = 16384;
  const r = 8;
  const p = 1;
  const keyLength = 64;
  const hash = scryptSync(password, salt, keyLength, { N: n, r, p }).toString("base64url");
  return `${HASH_PREFIX}$${n}$${r}$${p}$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [prefix, nValue, rValue, pValue, salt, expectedHash] = storedHash.split("$");
  if (prefix !== HASH_PREFIX || !nValue || !rValue || !pValue || !salt || !expectedHash) return false;

  const actual = scryptSync(password, salt, fromBase64url(expectedHash).length, {
    N: Number(nValue),
    r: Number(rValue),
    p: Number(pValue),
  });
  const expected = fromBase64url(expectedHash);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function signPayload(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function createSessionToken(username: string) {
  const payload = base64url(
    JSON.stringify({
      username,
      expiresAt: Date.now() + getConfiguredSessionMaxAgeSeconds() * 1000,
      nonce: randomBytes(12).toString("base64url"),
    }),
  );
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): AdminSession | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = signPayload(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  try {
    const data = JSON.parse(fromBase64url(payload).toString("utf8")) as AdminSession;
    if (!data.username || !data.expiresAt || data.expiresAt <= Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getAdminSessionFromCookies() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function getSessionMaxAgeSeconds() {
  return getConfiguredSessionMaxAgeSeconds();
}

export function isPortalAuthConfigured() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD_HASH && process.env.SESSION_SECRET);
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUsername || !passwordHash) return false;
  return username === expectedUsername && verifyPassword(password, passwordHash);
}

export async function requireAdminSession() {
  const session = await getAdminSessionFromCookies();
  if (!session) throw new Error("Unauthorized");
  return session;
}
