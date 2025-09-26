import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(
    new URL(
      "/login",
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    )
  );

  response.cookies.set({
    name: process.env.SESSION_COOKIE_NAME || "session",
    value: "",
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}
