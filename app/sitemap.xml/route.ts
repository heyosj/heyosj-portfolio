import { getAllPosts } from "@/lib/posts";
export async function GET(){
  const site=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";
  const posts=await getAllPosts();
  const urls=["","blog","about",...posts.map(p=>`blog/${p.slug}`)];
  const xml=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u=>`<url><loc>${site}/${u}</loc></url>`).join("\n")}
</urlset>`;
  return new Response(xml,{headers:{"Content-Type":"application/xml"}});
}
