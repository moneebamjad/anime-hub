import Link from "next/link";

export default function NotFound() {
  return <main className="container min-h-screen flex items-center justify-center text-center">
    <div>
      <p className="text-fuchsia-400 font-bold">404</p>
      <h1 className="mt-2 text-5xl font-black">Page not found</h1>
      <p className="mt-4 text-white/50">The anime page you requested does not exist.</p>
      <Link href="/" className="inline-block mt-8 px-5 py-3 rounded-full border border-white/10 hover:bg-white/10">Back to Anime Hub</Link>
    </div>
  </main>;
}