// app/layout.tsx
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { cookies } from "next/headers";
import Script from "next/script";

export const metadata = {
  title: { default: "heyosj", template: "%s | heyosj" },
  description: "short, useful security essays and notes.",
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const saved = cookies().get("theme")?.value; // 'light' | 'dark' | 'system'
  const initialHtmlClass = saved && saved !== "system" ? saved : "";

  return (
    <html lang="en" className={initialHtmlClass} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark">
        <main className="flex-1 flex">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 flex-1">{children}</div>
        </main>
        <footer className="py-10 text-sm text-subtext dark:text-subtext-dark">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <p>© {new Date().getFullYear()} osj • security notes, no fluff.</p>
          </div>
        </footer>

        {/* Route stack + "came from" marker. Clears on hard loads. */}
        <Script
          id="route-stack"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){
  try{
    var KEY='__route_stack__';
    var FROM='__came_from__';
    function save(s){ try{ sessionStorage.setItem(KEY, JSON.stringify(s)); }catch(e){} }
    function setFrom(p){ try{ sessionStorage.setItem(FROM, p||''); }catch(e){} }

    // Hard load: reset stack to current path and clear "came from"
    var stack=[location.pathname];
    save(stack);
    setFrom('');

    var origPush=history.pushState, origReplace=history.replaceState;

    history.pushState=function(state,title,url){
      var prev = stack[stack.length-1] || location.pathname;
      var ret = origPush.apply(this, arguments);
      try{
        if(url){
          var u=new URL(url, location.href);
          setFrom(prev);
          if(stack[stack.length-1]!==u.pathname){ stack.push(u.pathname); save(stack); }
        }
      }catch(e){}
      return ret;
    };

    history.replaceState=function(state,title,url){
      var prev = stack[stack.length-1] || location.pathname;
      var ret = origReplace.apply(this, arguments);
      try{
        if(url){
          var u=new URL(url, location.href);
          setFrom(prev);
          stack[stack.length-1]=u.pathname; save(stack);
        }
      }catch(e){}
      return ret;
    };

    window.addEventListener('popstate', function(){
      var prev = stack.pop() || '';
      save(stack);
      setFrom(prev);
      if(stack.length===0){ stack=[location.pathname]; save(stack); }
    });
  }catch(e){}
})();`,
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
