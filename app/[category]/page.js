import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../lib/supabase";

export async function generateMetadata({ params }) {
  const { category } = await params;
  const { data } = await supabase.from("categories").select("name,slug").eq("slug", category).maybeSingle();
  if (!data) return { title: "Category not found" };
  return { title: `${data.name} — Anime Hub`, description: `Latest ${data.name.toLowerCase()}, guides and stories from Anime Hub.`, alternates: { canonical: `/${data.slug}` } };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const { data: cat } = await supabase.from("categories").select("id,name,slug").eq("slug", category).maybeSingle();
  if (!cat) notFound();
  const { data: articles } = await supabase.from("articles").select("id,title,slug,excerpt,featured_image,published_at").eq("category_id", cat.id).eq("status", "published").order("published_at", { ascending: false }).limit(50);
  return <main><header className="border-b border-white/10 sticky top-0 bg-[#08090d]/95 backdrop-blur z-10"><div className="container h-16 flex items-center justify-between"><Link href="/" className="text-2xl font-black">ANIME<span className="text-fuchsia-400">HUB</span></Link><Link href="/" className="text-sm text-white/50 hover:text-white">Home</Link></div></header><section className="container py-16"><p className="text-xs uppercase tracking-widest text-fuchsia-400 font-bold">Anime Hub</p><h1 className="mt-3 text-5xl font-black">{cat.name}</h1><p className="mt-4 text-white/55 max-w-2xl">Explore {cat.name.toLowerCase()} covering the anime, characters, stories and questions fans are searching for.</p></section><section className="container pb-24">{!articles?.length ? <div className="rounded-2xl border border-white/10 p-10 text-white/45">Stories for this section are being prepared.</div> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{articles.map(a => <article key={a.id} className="rounded-2xl border border-white/10 bg-white/[.025] overflow-hidden">{a.featured_image && <img src={a.featured_image} alt="" className="w-full aspect-video object-cover" />}<div className="p-5"><h2 className="text-xl font-bold"><Link href={`/article/${a.slug}`}>{a.title}</Link></h2>{a.excerpt && <p className="mt-3 text-sm text-white/50">{a.excerpt}</p>}</div></article>)}</div>}</section></main>;
}