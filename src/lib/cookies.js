import { cookies } from "next/headers";
import { serialize } from "cookie";

export function setCookie(
  name,
  value,
  { maxAge, path = "/", httpOnly = true, secure = true }
) {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    serialize(name, value, {
      path,
      httpOnly,
      secure,
      sameSite: "lax",
      maxAge,
    })
  );
  return headers;
}

export function clearCookie(name) {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    serialize(name, "", { path: "/", httpOnly: true, secure: true, maxAge: 0 })
  );
  return headers;
}

export async function getCookieValue(name) {
  let cookiesValue = (await cookies().get(name)?.value) || null;
  return cookiesValue;
}
