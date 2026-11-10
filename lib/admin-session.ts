import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
const COOKIE = "paty_admin_session";
const AGE_SECONDS = 60 * 60 * 12;
function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("Configure ADMIN_SESSION_SECRET com pelo menos 32 caracteres.");
  return value;
}
function sign(text: string) { return createHmac("sha256",secret()).update(text).digest("hex"); }
export function verifyPassword(value: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 12) throw new Error("Configure ADMIN_PASSWORD com pelo menos 12 caracteres.");
  const a = createHmac("sha256", "pw").update(value).digest();
  const b = createHmac("sha256", "pw").update(expected).digest();
  return timingSafeEqual(a,b);
}
export async function startAdmin() {
  const expires = String(Date.now() + AGE_SECONDS * 1000);
  (await cookies()).set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: AGE_SECONDS
  });
}
export async function isAdmin() {
  const token = (await cookies()).get(COOKIE)?.value || "";
  const [expire,sig,extra] = token.split(".");
  if (extra || !expire || !sig || !/^\d{13}$/.test(expire) || Date.now() >= Number(expire)) return false;
  const a = Buffer.from(sign(expire),"hex");
  const b = Buffer.from(sig,"hex");
  return a.length === b.length && timingSafeEqual(a,b);
}
export async function logOutAdmin() { (await cookies()).delete(COOKIE); }
// Compara o cabeçalho Origin com a URL pública real (suporta reverse proxy na Vercel).
export function correctOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  const parsed = new URL(req.url);
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || parsed.host;
  const protocol = req.headers.get("x-forwarded-proto") || parsed.protocol.replace(":", "");
  return origin === `${protocol}://${host}` || origin === parsed.origin;
}
