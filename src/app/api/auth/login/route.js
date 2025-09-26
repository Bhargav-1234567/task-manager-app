import { auth } from "@/lib/firebaseAdmin";
import { setCookie } from "@/lib/cookies";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password)
      return new Response(
        JSON.stringify({ message: "Email & password required" }),
        { status: 400 }
      );

    const apiKey = process.env.FIREBASE_WEB_API_KEY;
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );
    const data = await res.json();
    if (!res.ok)
      return new Response(
        JSON.stringify({
          message: data.error?.message || "Invalid credentials",
        }),
        { status: 401 }
      );

    const maxAgeDays = parseInt(
      process.env.SESSION_COOKIE_MAX_AGE_DAYS || "5",
      10
    );
    const sessionCookie = await auth.createSessionCookie(data.idToken, {
      expiresIn: maxAgeDays * 24 * 60 * 60 * 1000,
    });

    const headers = setCookie(
      process.env.SESSION_COOKIE_NAME || "session",
      sessionCookie,
      {
        maxAge: maxAgeDays * 24 * 60 * 60,
        httpOnly: true,
        secure: process.env.SESSION_COOKIE_SECURE !== "false",
      }
    );
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 400,
    });
  }
}
