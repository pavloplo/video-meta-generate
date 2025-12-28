import Link from "next/link";

const features = [
  {
    title: "Frontend workspace",
    description:
      "Use the app router to build the UI that manages video metadata generation."
  },
  {
    title: "API routes",
    description:
      "Serverless endpoints live under /app/api for metadata pipelines."
  },
  {
    title: "Tailwind styling",
    description:
      "Rapidly prototype and theme the experience with Tailwind CSS."
  }
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-12">
      <section className="flex flex-col gap-4">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
          Video Meta Generate
        </p>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
          Next.js + Tailwind scaffold for the frontend &amp; API layer
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-300">
          Start building the product UI and the backend endpoints in the same
          project. This starter includes TypeScript, Tailwind CSS, and the app
          router out of the box.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
          >
            <h2 className="text-lg font-semibold text-white">
              {feature.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-xl font-semibold text-white">Quick API check</h2>
        <p className="mt-2 text-sm text-slate-300">
          The starter API route is available at
          <span className="mx-1 rounded bg-slate-800 px-2 py-1 font-mono text-xs">
            /api/health
          </span>
          and returns a ready flag.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <Link
            className="rounded-full border border-slate-700 px-4 py-2 text-slate-200 transition hover:border-slate-500"
            href="/api/health"
          >
            View JSON response
          </Link>
          <span className="text-slate-400">
            Tip: create additional endpoints in <code>/src/app/api</code>.
          </span>
        </div>
      </section>
    </main>
  );
}
