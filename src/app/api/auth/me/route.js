import { getCurrentUserFromSession } from "@/lib/auth-helpers";

export async function GET() {
  const user = await getCurrentUserFromSession();
  if (!user)
    return new Response(JSON.stringify({ user: null }), { status: 401 });
  return new Response(JSON.stringify({ user }), { status: 200 });
}
