import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export async function generateMetadata({ params }) {
  const { franchise } = await params;
  const { data } = await supabase.from("franchises").select("name,slug,description").eq("slug", franchise).maybeSingle();
  if (!data) return { title: "Anime franchise not found" };
  return {
    title: data.name,
    description: data.description || `News, guides, characters, explanations and updates about ${data.name}.`,
    alternates: { canonical: `/anime/${data.slug}` }
  };
}

export default async function FranchisePage({ params }) {
  const { franchise } = await params;
  const { data: hub } = await supabase.from("franchises").select("id,name,slug,description").eq("slug", franchise).maybeSingle();
  if (!hub) notFound();

  const { data: articles } = await supabase
    .from("articles")
    .select("id,title,slug,excerpt,featured_image,published_at")
    .eq("franchise_id", hub.id)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: hub.name,
    description: hub.description || `Anime coverage for ${hub.name}.`,
    url: `/anime/${hub.slug}`
  };

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <header className="border-b border-white/10 sticky top-0 bg-[#08090d]/95 backdrop-blur z-10">
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black">ANIME<span className="text-fuchsia-400">HUB</span></Link>
        <Link href="/" className="text-sm text-white/50 hover:text-white">Home</Link>
      </div>
    </header>
    <section className="container py-16">
      <p className="text-xs uppercase tracking-widest text-fuchsia-400 font-bold">Anime Franchise</p>
      <h1 className="mt-3 text-5xl font-black">{hub.name}</h1>
      {hub.description && <p className="mt-4 text-white/55 max-w-2xl">{hub.description}</p>}
    </section>
    <section className="container pb-24">
      {!articles?.length ? <div className="rounded-2xl border border-white/10 p-10 text-white/45">Coverage for this franchise is being prepared.</div> :
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map(a => <article key={a.id} className="rounded-2xl border border-white/10 bg-white/[.025] overflow-hidden">
            {a.featured_image && <img src={a.featured_image} alt="" className="w-full aspect-video object-cover" />}
            <div className="p-5"><h2 className="text-xl font-bold"><Link href={`/article/${a.slug}`}>{a.title}</Link></h2>{a.excerpt && <p className="mt-3 text-sm text-white/50">{a.excerpt}</p>}</div>
          </article>)}
        </div>}
    </section>
  </main>;
}
