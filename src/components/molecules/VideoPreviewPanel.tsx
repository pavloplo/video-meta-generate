import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { Typography } from "@/components/atoms/Typography";

export const VideoPreviewPanel = () => {
  return (
    <Card className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.4)]">
      <CardHeader>
        <CardTitle id="preview-heading">Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <Typography className="text-sm text-slate-600">
          Live preview will appear here.
        </Typography>
      </CardContent>
    </Card>
  );
};
