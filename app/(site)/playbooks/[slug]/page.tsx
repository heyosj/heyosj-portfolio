// app/(site)/playbooks/[slug]/page.tsx
import { notFound } from "next/navigation";

export default function PlaybookPage({ params }: { params: { slug: string } }) {
  // eventually fetch MDX content here
  return (
    <article className="prose dark:prose-invert">
      <h1>Playbook: {params.slug}</h1>
      <p>Content coming soon...</p>
    </article>
  );
}
