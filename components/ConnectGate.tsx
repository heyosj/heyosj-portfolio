// components/ConnectGate.tsx
"use client";
import { usePathname } from "next/navigation";
import SubscribeCTA from "@/components/SubscribeCTA"; // or your About card

export default function ConnectGate() {
  const p = (usePathname() || "/").replace(/\/+$/, "") || "/"; // strip trailing slash

  const show =
    p === "/dispatch" ||  // root only
    p === "/labs" ||
    p === "/playbooks";

  if (!show) return null;
  return <SubscribeCTA />;
}
