// components/HeadingAnchors.tsx
"use client";

import { useEffect } from "react";

export default function HeadingAnchors({ containerId = "post-body" }: { containerId?: string }) {
  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) return;

    const headings = Array.from(root.querySelectorAll<HTMLElement>("h2[id]"));

    headings.forEach((h) => {
      if (h.querySelector(".copy-anchor-btn")) return; // avoid duplicates

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        // keep classes static so Tailwind can see them
        "copy-anchor-btn ml-2 text-xs opacity-60 hover:opacity-100 underline decoration-dotted";
      btn.setAttribute("aria-label", "Copy link to this section");
      btn.setAttribute("title", "Copy link");
      btn.textContent = "🔗";

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = h.id;
        const url = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(id)}`;
        // copy
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(url);
        } else {
          // fallback
          const ta = document.createElement("textarea");
          ta.value = url;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        // feedback
        const prev = btn.textContent;
        btn.textContent = "copied";
        setTimeout(() => {
          btn.textContent = prev || "🔗";
        }, 1200);
      });

      // append button at end of the heading
      h.appendChild(btn);
    });
  }, [containerId]);

  return null;
}
