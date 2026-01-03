import { cn } from "@/lib/utils";

export interface ThumbnailVariantSkeletonProps {
  className?: string;
}

export const ThumbnailVariantSkeleton = ({
  className,
}: ThumbnailVariantSkeletonProps) => {
  return (
    <div className={cn("relative", className)}>
      {/* Skeleton Image Container */}
      <div className="aspect-video rounded-lg bg-slate-200 animate-pulse border-4 border-slate-200" />

      {/* Skeleton Readability Badge */}
      <div className="absolute top-3 right-3">
        <div className="w-12 h-6 bg-slate-200 rounded-full animate-pulse" />
      </div>
    </div>
  );
};
