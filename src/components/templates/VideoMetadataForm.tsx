import { VideoInputPanel } from "@/components/molecules/VideoInputPanel";
import { VideoPreviewPanel } from "@/components/molecules/VideoPreviewPanel";

export const VideoMetadataForm = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <VideoInputPanel />
      <VideoPreviewPanel />
    </div>
  );
};
