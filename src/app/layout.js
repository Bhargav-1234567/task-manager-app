import Link from "next/link";
import "./globals.css";
import { CssBaseline } from "@mui/material";
import { Toaster } from "sonner";
import { headers } from "next/headers";

import { Geist, Roboto } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "Task Manager",
  description: "Next.js 15 + Firebase (API routes)",
};

export default async function RootLayout({ children }) {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "/";
  const hideNav = pathname === "/login" || pathname === "/register";

  return (
    <html lang="en" className={geist.className}>
      <body>
        <CssBaseline />
        {!hideNav && (
          <header className="header sticky top-0 bg-white shadow-md p-4 flex justify-between items-center">
            <Link href={"/dashboard"}>
              <h1 className="text-xl font-bold cursor-pointer">Task Manager</h1>
            </Link>
            <Toaster richColors position="top-center" />
            <nav className="nav flex gap-4">
              <Link href="/projects">Projects</Link>
              <Link href="/dashboard">Dashboard</Link>
              <form className="inline" action="/api/auth/logout" method="post">
                <button type="submit" className="cursor-pointer">
                  Logout
                </button>
              </form>
            </nav>
          </header>
        )}
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
