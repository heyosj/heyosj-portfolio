'use client';

import { useEffect, useState } from 'react';

type Props = {
  user?: string;
  domain?: string;
  className?: string;
};

export default function MailLink({
  user = 'me',
  domain = 'heyosj.com',
  className = 'underline',
}: Props) {
  // don’t expose the full mailto in the server-rendered HTML
  const [href, setHref] = useState<string | undefined>(undefined);
  useEffect(() => {
    setHref(`mailto:${user}@${domain}`);
  }, [user, domain]);

  // zero-width characters break naive scrapers but are invisible to users
  const obfuscatedText = `${user}\u2060@\u2060${domain}`;

  return (
    <>
      <a className={className} href={href}>
        {obfuscatedText}
      </a>
      {/* no-JS fallback that’s less scrape-able */}
      <noscript>
        <span>{user} [at] {domain}</span>
      </noscript>
    </>
  );
}
