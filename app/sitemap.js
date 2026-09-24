import { supabase } from "../lib/supabase";

const categorySlugs = ["anime-news","episode-guides","characters","explained","watch-guides","rankings","manga","recommendations"];

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { data } = await supabase.from("articles").select("slug,published_at,updated_at").eq("status", "published");
  return [{ url: base, lastModified: new Date() }, ...categorySlugs.map(slug => ({ url: base + "/" + slug, lastModified: new Date() })), ...(data || []).map(a => ({ url: base + "/article/" + a.slug, lastModified: new Date(a.updated_at || a.published_at || Date.now()) }))];
}