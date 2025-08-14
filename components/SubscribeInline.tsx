// components/SubscribeInline.tsx
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "osj_subscribed";

export default function SubscribeInline() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [returning, setReturning] = useState(false); // only true on reload if LS is set

  // Returning visitor? (persisted)
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1") {
        setSubscribed(true);
        setReturning(true);
      }
    } catch {}
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("err"); setMsg("enter a valid email"); return;
    }
    setStatus("loading"); setMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("ok");
        setSubscribed(true);     // show "subscribed" (this session)
        setOpen(false);
        setEmail("");
        try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("err"); setMsg(data?.error || "something went wrong");
      }
    } catch {
      setStatus("err"); setMsg("network error");
    }
  }

  return (
    <div className="w-full">
      {/* Returning visitor (after refresh / new visit) */}
      {subscribed && returning && (
        <div className="inline-flex items-center gap-2">
          <span className="text-sm px-3 py-1.5 rounded-full border border-border dark:border-border-dark bg-card dark:bg-card-dark">
            👋 welcome back
          </span>
        </div>
      )}

      {/* Closed: bigger button + inline blurb */}
      {!open && !subscribed && !returning && (
        <div className="inline-flex flex-wrap items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="text-base px-4 py-2 rounded-lg border border-accent bg-accent/15
                       text-ink dark:text-ink-dark hover:bg-accent
                       dark:hover:text-paper transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            subscribe
          </button>
          <span className="text-sm text-subtext dark:text-subtext-dark">
            get new notes whenever i post ’em. no spam.
          </span>
        </div>
      )}

      {/* Open: bigger form + blurb below */}
      {open && !subscribed && !returning && (
        <div className="flex flex-col items-start gap-3">
          <form onSubmit={onSubmit} className="flex items-center gap-3">
            <label htmlFor="subscribe-email" className="sr-only">email</label>
            <input
              id="subscribe-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="text-base rounded-lg border border-border dark:border-border-dark
                         bg-card dark:bg-card-dark text-ink dark:text-ink-dark
                         px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="text-base px-4 py-2 rounded-lg border border-accent bg-accent/15
                         text-ink dark:text-ink-dark hover:bg-accent
                         dark:hover:text-paper transition-colors disabled:opacity-60
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {status === "loading" ? "…" : "join"}
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setStatus("idle"); setMsg(""); }}
              className="text-sm underline text-subtext dark:text-subtext-dark"
            >
              cancel
            </button>
          </form>

          <p className="text-sm text-subtext dark:text-subtext-dark mt-1">
            get new notes whenever i post ’em. no spam.
          </p>

          {msg && status === "err" && (
            <p className="text-sm text-red-700 dark:text-red-400" aria-live="polite">
              {msg}
            </p>
          )}
        </div>
      )}

      {/* New subscription (this session only) */}
      {subscribed && !returning && (
        <div className="flex flex-col items-start gap-3">
          <span className="text-sm px-3 py-1.5 rounded-full border border-border dark:border-border-dark bg-card dark:bg-card-dark text-green-700 dark:text-green-400">
            subscribed
          </span>
          <p className="text-sm text-subtext dark:text-subtext-dark">
            you’ll get new notes 1–2×/month. thanks for reading.
          </p>
        </div>
      )}
    </div>
  );
}
