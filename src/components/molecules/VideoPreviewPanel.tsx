"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { ThumbnailVariantsPanel } from "@/components/organisms/ThumbnailVariantsPanel";
import { InlineAlert as InlineAlertComponent } from "@/components/atoms/InlineAlert";
import { DescriptionSkeleton } from "@/components/atoms/DescriptionSkeleton";
import { TagsSkeleton } from "@/components/atoms/TagsSkeleton";
import { SectionError } from "@/components/atoms/SectionError";
import { GENERATION_HELPER } from "@/constants/ui";
import type { ThumbnailVariant, SourceType, HookTone, InlineAlert as InlineAlertType, SectionStatus } from "@/lib/types/thumbnails";

export interface VideoPreviewPanelProps {
  sourceType: SourceType;
  hookText: string;
  tone: HookTone;
  variants: ThumbnailVariant[];
  selectedVariantId: string | null;
  onVariantsChange: (variants: ThumbnailVariant[]) => void;
  onSelectedVariantChange: (variantId: string | null) => void;
  regenerationCount: number;
  onRegenerationCountChange: (count: number | ((prev: number) => number)) => void;
  description: string;
  tags: string[];
  isGeneratingAll?: boolean;
  hasVideoUploaded?: boolean;
  hasImagesUploaded?: boolean;
  assetIds?: string[];
  // Per-section states
  thumbnailsStatus?: SectionStatus;
  descriptionStatus?: SectionStatus;
  tagsStatus?: SectionStatus;
  thumbnailsError?: string | null;
  descriptionError?: string | null;
  tagsError?: string | null;
  // Retry handlers
  onRetryThumbnails?: () => void;
  onRetryDescription?: () => void;
  onRetryTags?: () => void;
}

export const VideoPreviewPanel = ({
  sourceType,
  hookText,
  tone,
  variants,
  selectedVariantId,
  onVariantsChange,
  onSelectedVariantChange,
  regenerationCount,
  onRegenerationCountChange,
  description,
  tags,
  isGeneratingAll = false,
  hasVideoUploaded = false,
  hasImagesUploaded = false,
  assetIds = [],
  thumbnailsStatus = "idle",
  descriptionStatus = "idle",
  tagsStatus = "idle",
  thumbnailsError = null,
  descriptionError = null,
  tagsError = null,
  onRetryThumbnails,
  onRetryDescription,
  onRetryTags,
}: VideoPreviewPanelProps) => {
  const [generateAlert, setGenerateAlert] = useState<InlineAlertType | null>(null);

  const handleInlineAlert = (alert: InlineAlertType | null) => {
    if (alert) {
      const alertWithVisibility: InlineAlertType = {
        ...alert,
        isVisible: true,
      };
      setGenerateAlert(alertWithVisibility);

      // Clear alert after a delay (except for errors)
      if (alert.kind !== 'error') {
        setTimeout(() => {
          setGenerateAlert({ ...alertWithVisibility, isVisible: false });
          setTimeout(() => setGenerateAlert(null), 200); // Wait for fade out
        }, 3000);
      }
    } else {
      setGenerateAlert(null);
    }
  };

  const handleReportIssue = (section: string) => {
    // TODO: Implement issue reporting (e.g., open modal, send to analytics)
    console.log(`Reporting issue for section: ${section}`);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'report_generation_issue', {
        section,
      });
    }
  };

  // Check if nothing has been generated yet
  const hasNoContent = variants.length === 0 && !description && tags.length === 0 &&
    thumbnailsStatus === "idle" && descriptionStatus === "idle" && tagsStatus === "idle";

  return (
    <Card className="rounded-3xl border border-slate-200/80 bg-white/80 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.4)] h-full flex flex-col">
      <CardHeader>
        <CardTitle id="preview-heading">Generated Metadata</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-6">
        {/* Empty state guidance when nothing has been generated */}
        {hasNoContent && !isGeneratingAll && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">What happens next?</h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  {GENERATION_HELPER.WHAT_HAPPENS_NEXT}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Thumbnails Section */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="text-blue-600">📸</span>
            Thumbnails
          </h3>
          <div>
            <ThumbnailVariantsPanel
              sourceType={sourceType}
              hookText={hookText}
              tone={tone}
              variants={variants}
              selectedVariantId={selectedVariantId}
              onVariantsChange={onVariantsChange}
              onSelectedVariantChange={onSelectedVariantChange}
              regenerationCount={regenerationCount}
              onRegenerationCountChange={onRegenerationCountChange}
              onInlineAlert={handleInlineAlert}
              hasVideoUploaded={hasVideoUploaded}
              hasImagesUploaded={hasImagesUploaded}
              assetIds={assetIds}
            />
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="text-green-600">📝</span>
            Description
          </h3>
          <div>
            {/* Loading State */}
            {descriptionStatus === "loading" && <DescriptionSkeleton />}

            {/* Error State */}
            {descriptionStatus === "error" && descriptionError && onRetryDescription && (
              <SectionError
                message={descriptionError}
                onRetry={onRetryDescription}
                onReportIssue={() => handleReportIssue("description")}
                isRetrying={false}
              />
            )}

            {/* Success State */}
            {descriptionStatus === "success" && description && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 min-h-[100px] flex flex-col">
                <div className="prose prose-sm max-w-none flex-1">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{description}</p>
                </div>
                <div className="mt-2.5 flex gap-1.5 shrink-0">
                  <button
                    className="text-xs px-2.5 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    aria-label="Copy description to clipboard"
                  >
                    Copy
                  </button>
                  <button
                    className="text-xs px-2.5 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    aria-label="Edit description"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}

            {/* Idle/Empty State */}
            {descriptionStatus === "idle" && !description && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 min-h-[100px] flex flex-col">
                <div className="flex-1 flex items-center justify-center text-center">
                  <div className="text-slate-600">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-slate-700">Your optimized description will appear here</p>
                      <p className="text-xs text-slate-600">Complete the requirements and click Generate</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tags Section */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="text-purple-600">🏷️</span>
            Tags
          </h3>
          <div>
            {/* Loading State */}
            {tagsStatus === "loading" && <TagsSkeleton />}

            {/* Error State */}
            {tagsStatus === "error" && tagsError && onRetryTags && (
              <SectionError
                message={tagsError}
                onRetry={onRetryTags}
                onReportIssue={() => handleReportIssue("tags")}
                isRetrying={false}
              />
            )}

            {/* Success State */}
            {tagsStatus === "success" && tags.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 min-h-[100px] flex flex-col">
                <div className="flex-1 flex flex-wrap gap-1.5 content-start" role="list" aria-label="Generated tags">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      role="listitem"
                      className="px-2.5 py-0.5 bg-slate-200 text-slate-700 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-2.5 flex gap-1.5 shrink-0">
                  <button
                    className="text-xs px-2.5 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    aria-label="Copy all tags to clipboard"
                  >
                    Copy All
                  </button>
                  <button
                    className="text-xs px-2.5 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    aria-label="Edit tags"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}

            {/* Idle/Empty State */}
            {tagsStatus === "idle" && tags.length === 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 min-h-[100px] flex flex-col">
                <div className="flex-1 flex items-center justify-center text-center">
                  <div className="text-slate-600">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-slate-700">Your optimized tags will appear here</p>
                      <p className="text-xs text-slate-600">Complete the requirements and click Generate</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed alert slot for generate actions */}
        <div className="h-8 flex items-start">
          {generateAlert ? (
            <InlineAlertComponent
              scope={generateAlert.scope}
              kind={generateAlert.kind}
              message={generateAlert.message}
              isVisible={generateAlert.isVisible}
            />
          ) : (
            <div className="h-8" aria-hidden="true" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
