import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/generate-password-hash.mjs "your-secure-password"');
  process.exit(1);
}

const salt = randomBytes(16).toString("base64url");
const n = 16384;
const r = 8;
const p = 1;
const keyLength = 64;
const hash = scryptSync(password, salt, keyLength, { N: n, r, p }).toString("base64url");
console.log(`scrypt$${n}$${r}$${p}$${salt}$${hash}`);
