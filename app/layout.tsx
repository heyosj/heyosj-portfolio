import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: { default: "OSJ Dispatch", template: "%s | OSJ Dispatch" },
  description: "Short, useful security essays and notes.",
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="progress" />
        <div className="mx-auto max-w-3xl px-5">
          <header className="py-6 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-tight">OSJ Dispatch</Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/blog" className="hover:underline">Archive</Link>
              <Link href="/about" className="hover:underline">About</Link>
            </nav>
          </header>
          <main className="pb-24">{children}</main>
          <footer className="py-10 text-sm text-subtext">
            <p>© {new Date().getFullYear()} OSJ • Security notes, no fluff.</p>
          </footer>
        </div>
        <script dangerouslySetInnerHTML={{__html:`
          (function(){
            var bar=document.getElementById('progress'); var ticking=false;
            function update(){ var h=document.documentElement, b=document.body;
              var percent=((h.scrollTop||b.scrollTop)/(h.scrollHeight-h.clientHeight))*100;
              bar.style.width=percent+'%'; ticking=false; }
            window.addEventListener('scroll',function(){ if(!ticking){requestAnimationFrame(update); ticking=true;}},{passive:true});
          })();`}} />
      </body>
    </html>
  );
}
