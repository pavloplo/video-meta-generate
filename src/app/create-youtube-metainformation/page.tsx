import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { VideoMetadataForm } from "@/components/templates/VideoMetadataForm";

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

      <VideoMetadataForm />
    </main>
  );
}

