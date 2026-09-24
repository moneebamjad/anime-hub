import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

async function getArticle(slug) {
  const { data } = await supabase
    .from("articles")
    .select("id,title,slug,excerpt,content,featured_image,published_at,updated_at,categories(name,slug),authors(name,slug)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.excerpt || article.title,
    alternates: { canonical: `/article/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      type: "article",
      publishedTime: article.published_at || undefined,
      modifiedTime: article.updated_at || undefined,
      images: article.featured_image ? [article.featured_image] : undefined
    }
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const canonical = `${base}/article/${article.slug}`;
  const category = article.categories;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || "",
    datePublished: article.published_at || undefined,
    dateModified: article.updated_at || article.published_at || undefined,
    mainEntityOfPage: canonical,
    image: article.featured_image ? [article.featured_image] : undefined,
    author: { "@type": "Person", name: article.authors?.name || "Anime Hub Editorial" },
    publisher: { "@type": "Organization", name: "Anime Hub" }
  };

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <header className="border-b border-white/10 sticky top-0 bg-[#08090d]/95 backdrop-blur z-10">
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tight">ANIME<span className="text-fuchsia-400">HUB</span></Link>
        <Link href={category?.slug ? `/${category.slug}` : "/"} className="text-sm text-white/60 hover:text-white">{category?.name || "Anime"}</Link>
      </div>
    </header>
    <article className="container max-w-4xl py-16">
      <nav className="text-sm text-white/40 mb-8"><Link href="/">Home</Link> / {category?.name || "Anime"} / {article.title}</nav>
      <p className="text-xs uppercase tracking-widest text-fuchsia-400 font-bold">{category?.name || "Anime"}</p>
      <h1 className="mt-3 text-4xl md:text-6xl font-black leading-tight">{article.title}</h1>
      {article.excerpt && <p className="mt-6 text-xl text-white/60">{article.excerpt}</p>}
      <p className="mt-5 text-sm text-white/40">{article.published_at ? new Date(article.published_at).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}) : ""}</p>
      {article.featured_image && <img src={article.featured_image} alt="" className="mt-10 w-full rounded-2xl aspect-video object-cover" />}
      <div className="mt-10 prose prose-invert max-w-none whitespace-pre-wrap leading-8 text-white/80">{article.content}</div>
    </article>
  </main>;
}