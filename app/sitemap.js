import { supabase } from "../lib/supabase";

const categorySlugs = ["anime-news","episode-guides","characters","explained","watch-guides","rankings","manga","recommendations"];

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [{ data: articles }, { data: franchises }] = await Promise.all([
    supabase.from("articles").select("slug,published_at,updated_at").eq("status", "published"),
    supabase.from("franchises").select("slug,created_at")
  ]);
  return [
    { url: base, lastModified: new Date() },
    ...categorySlugs.map(slug => ({ url: base + "/" + slug, lastModified: new Date() })),
    ...(franchises || []).map(f => ({ url: base + "/anime/" + f.slug, lastModified: new Date(f.created_at || Date.now()) })),
    ...(articles || []).map(a => ({ url: base + "/article/" + a.slug, lastModified: new Date(a.updated_at || a.published_at || Date.now()) }))
  ];
}