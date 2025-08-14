// components/SubscribeInline.tsx
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "osj_subscribed"; // set only after confirmed

export default function SubscribeInline() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");
  const [subscribed, setSubscribed] = useState(false); // this-session state after submit
  const [returning, setReturning] = useState(false);   // true if confirmed + came back

  // A) Returning visit via localStorage (already confirmed earlier)
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY) === "1") {
        setSubscribed(true);
        setReturning(true);
      }
    } catch {}
  }, []);

  // B) Confirmation redirect flag (e.g., /?confirmed=1 or /?sub=confirmed)
  // Set your Buttondown confirmation redirect to your homepage with one of these params.
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const sp = new URLSearchParams(window.location.search);
      const confirmed =
        sp.get("confirmed") === "1" ||
        sp.get("sub") === "confirmed" ||
        sp.get("bd_confirmed") === "1";
      if (confirmed) {
        window.localStorage.setItem(STORAGE_KEY, "1");
        setSubscribed(true);
        setReturning(true);
      }
    } catch {}
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("err");
      setMsg("enter a valid email");
      return;
    }
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        // Double opt-in: show “please confirm” state for this session.
        setStatus("ok");
        setSubscribed(true);
        setOpen(false);
        setEmail("");
        // Do NOT set localStorage here—only after confirmation redirect.
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("err");
        setMsg(data?.error || "something went wrong");
      }
    } catch {
      setStatus("err");
      setMsg("network error");
    }
  }

  return (
    <div className="w-full">
      {/* Returning visitor (confirmed + remembered) */}
      {returning && (
        <div className="inline-flex items-center gap-2">
          <span className="text-sm px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark">
            👋 welcome back
          </span>
        </div>
      )}

      {/* Closed: bigger button + inline blurb */}
      {!returning && !open && !subscribed && (
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
      {!returning && open && !subscribed && (
        <div className="flex flex-col items-start gap-3">
          <form onSubmit={onSubmit} className="flex items-center gap-3">
            <label htmlFor="subscribe-email" className="sr-only">
              email
            </label>
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
              onClick={() => {
                setOpen(false);
                setStatus("idle");
                setMsg("");
              }}
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

      {/* Success (pending confirmation, this session only) */}
      {!returning && subscribed && (
        <div className="flex flex-col items-start gap-3">
          <span className="text-sm px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark">
            ❤️ you’re kind
          </span>
          <p className="text-sm text-subtext dark:text-subtext-dark">
            please check your email to confirm — enjoy the reading.
          </p>
        </div>
      )}
    </div>
  );
}
