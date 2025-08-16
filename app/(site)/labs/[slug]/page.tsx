// app/(site)/labs/[slug]/page.tsx
export default function LabPage({ params }: { params: { slug: string } }) {
  return (
    <article className="prose dark:prose-invert">
      <h1>Lab: {params.slug}</h1>
      <p>Content coming soon...</p>
    </article>
  );
}
