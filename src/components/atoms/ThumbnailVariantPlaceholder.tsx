import { cn } from "@/lib/utils";

export interface ThumbnailVariantPlaceholderProps {
  className?: string;
}

export const ThumbnailVariantPlaceholder = ({
  className,
}: ThumbnailVariantPlaceholderProps) => {
  return (
    <div className={cn("relative", className)}>
      {/* Placeholder Container */}
      <div className="aspect-video rounded-lg border-4 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400 text-sm font-medium">
          Empty slot
        </div>
      </div>
    </div>
  );
};
