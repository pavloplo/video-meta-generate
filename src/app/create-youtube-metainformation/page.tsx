import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CreateYoutubeMetainformationPage() {
  // Check for session cookie (middleware also checks, but this is a backup)
  // Full database session validation is handled separately
  // const cookieStore = await cookies();
  // const cookieName = process.env.SESSION_COOKIE_NAME ?? "sid";
  // const sessionId = cookieStore.get(cookieName)?.value;

  // if (!sessionId) {
  //   redirect("/");
  // }

  // TODO: Add full session validation with database when Prisma is configured
  // const user = await getCurrentUser();
  // if (!user) { redirect("/"); }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold text-slate-950 sm:text-5xl">
        Create metainformation for your youtube video
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inputs Panel */}
        <section
          aria-labelledby="inputs-heading"
          className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.4)]"
        >
          <h2
            id="inputs-heading"
            className="mb-4 text-2xl font-semibold text-slate-950"
          >
            Inputs
          </h2>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-600">
              Input fields will be added here.
            </p>
          </div>
        </section>

        {/* Preview Panel */}
        <section
          aria-labelledby="preview-heading"
          className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.4)]"
        >
          <h2
            id="preview-heading"
            className="mb-4 text-2xl font-semibold text-slate-950"
          >
            Preview
          </h2>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-600">
              Live preview will appear here.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

