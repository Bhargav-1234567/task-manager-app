"use client";
import { useEffect } from "react";
import useAppStore from "@/store/useAppStore";

export default function Home() {
  const { user, loadUser } = useAppStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);
  useEffect(() => {
    if (user) window.location.replace("/dashboard");
    else window.location.replace("/login");
  }, [user]);

  return <p>Loading…</p>;
}
