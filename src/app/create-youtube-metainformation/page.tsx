import HeaderSticky from "@/components/organisms/HeaderSticky";
import SiteFooter from "@/components/organisms/SiteFooter";
import { ResponsiveMetadataForm } from "@/components/templates/ResponsiveMetadataForm";

export default async function CreateYoutubeMetadataPage() {
  // TODO: Add full session validation with database when Prisma is configured
  // const user = await getCurrentUser();
  // if (!user) { redirect("/"); }

  return (
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8"
      aria-label="YouTube metadata generation"
    >
      <HeaderSticky />
      <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
        Create YouTube thumbnails and metadata
      </h1>

      <ResponsiveMetadataForm />
      <SiteFooter />
    </main>
  );
}
