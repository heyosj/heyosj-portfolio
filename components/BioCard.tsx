// components/BioCard.tsx
import Link from "next/link";

export default function BioCard() {
  return (
    <div className="card p-5 sm:p-6 md:p-7">
      <div className="flex items-start gap-4">
        {/* simple avatar w/ initials */}
        <div
          aria-hidden
          className="flex h-12 w-12 shrink-0 select-none items-center justify-center rounded-full border border-border dark:border-border-dark bg-card dark:bg-card-dark font-semibold"
        >
          OSJ
        </div>

        <div className="space-y-2">
          <div className="text-sm uppercase tracking-wide opacity-60">about me</div>
          <p className="max-w-prose text-sm sm:text-base">
            I’m <span className="font-medium">O. Sanchez Jr.</span>, a security engineer focused on
            SecOps & cloud/email security. I publish working notes on SPF/DKIM/DMARC, MTA-STS,
            Microsoft Sentinel/KQL, and practical incident response—clear, field-tested write-ups
            you can apply right away.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="https://x.com/inf0stache" className="underline" target="_blank" rel="noreferrer">
              Follow on X
            </Link>
            <Link href="mailto:me@heyosj.com" className="underline">
              me@heyosj.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
