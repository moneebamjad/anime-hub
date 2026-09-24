import Link from "next/link";
import { supabase } from "../../lib/supabase";

export const metadata = {
  title: "Search Anime News, Guides & Explanations",
  description: "Search Anime Hub for anime news, episode guides, characters, explanations, watch orders, rankings and manga coverage."
};

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const q = (params?.q || "").trim();
  const safeQ = q.replace(/[%,]/g, " ");
  let articles = [];
  if (q) {
    const { data } = await supabase
      .from("articles")
      .select("id,title,slug,excerpt,published_at")
      .eq("status", "published")
       .or(`title.ilike.%${safeQ}%,excerpt.ilike.%${safeQ}%`)
      .order("published_at", { ascending: false })
      .limit(50);
    articles = data || [];
  }

  return <main className="min-h-screen">
    <header className="border-b border-white/10 sticky top-0 bg-[#08090d]/95 backdrop-blur z-10">
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black">ANIME<span className="text-fuchsia-400">HUB</span></Link>
        <Link href="/" className="text-sm text-white/50 hover:text-white">Home</Link>
      </div>
    </header>
    <section className="container py-14">
      <p className="text-xs uppercase tracking-widest text-fuchsia-400 font-bold">Search</p>
      <h1 className="mt-3 text-4xl md:text-5xl font-black">Find anime answers</h1>
      <form className="mt-8 flex gap-3 max-w-2xl">
        <input name="q" defaultValue={q} placeholder="Search One Piece, watch order, characters..." className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none" />
        <button className="rounded-xl bg-fuchsia-500 px-6 py-3 font-bold">Search</button>
      </form>
    </section>
    <section className="container pb-24">
      {!q ? <p className="text-white/45">Search for an anime, character, episode, ending, watch order or manga topic.</p> :
        !articles.length ? <p className="text-white/45">No published articles matched “{q}”.</p> :
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{articles.map(a => <article key={a.id} className="rounded-2xl border border-white/10 bg-white/[.025] p-5"><h2 className="text-xl font-bold"><Link href={`/article/${a.slug}`}>{a.title}</Link></h2>{a.excerpt && <p className="mt-3 text-sm text-white/50">{a.excerpt}</p>}</article>)}</div>}
    </section>
  </main>;
}
