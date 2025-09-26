import { auth } from "@/lib/firebaseAdmin";
import { getCookieValue } from "@/lib/cookies";

export async function getCurrentUserFromSession() {
  const cookieName = process.env.SESSION_COOKIE_NAME || "session";
  const sessionCookie = await getCookieValue(cookieName);
  if (!sessionCookie) return null;
  try {
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    const user = await auth.getUser(decoded.uid);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email,
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUserFromSession();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}
