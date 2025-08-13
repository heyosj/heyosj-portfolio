"use client";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
export default function ShareBar({ title }:{title:string}){
  const pathname = usePathname();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = origin + pathname;
  const copy = useCallback(async ()=>{
    try{ await navigator.clipboard.writeText(url); alert("Link copied!"); }catch{}
  },[url]);
  return (
    <div className="flex items-center gap-3 text-sm muted">
      <button onClick={copy} className="underline">Copy link</button>
      <a className="underline" target="_blank" rel="noreferrer" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}>Twitter</a>
      <a className="underline" target="_blank" rel="noreferrer" href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}>Email</a>
    </div>
  );
}
