"use client";

import type { HookTone } from "@/lib/types/thumbnails";

export interface OptimizationNote {
  label: string;
  value: string;
  icon?: string;
}

export interface OptimizationNotesProps {
  /** The tone selected for content generation */
  tone: HookTone;
  /** Whether hook text was provided */
  hasHookText: boolean;
  /** Whether tags were generated */
  hasTags: boolean;
  /** Additional custom notes to display */
  customNotes?: OptimizationNote[];
  /** Whether to show the component */
  show?: boolean;
}

const TONE_LABELS: Record<HookTone, string> = {
  viral: "Viral - Attention-grabbing",
  curiosity: "Curiosity - Interest-sparking",
  educational: "Educational - Informative",
};

const HOOK_STRATEGIES: Record<HookTone, string> = {
  viral: "Emotional appeal & shareability",
  curiosity: "Curiosity gap & intrigue",
  educational: "Clear value proposition",
};

export const OptimizationNotes = ({
  tone,
  hasHookText,
  hasTags,
  customNotes = [],
  show = true,
}: OptimizationNotesProps) => {
  if (!show) return null;

  const notes: OptimizationNote[] = [
    {
      label: "Tone",
      value: TONE_LABELS[tone],
      icon: "🎯",
    },
  ];

  // Add hook strategy if hook text was provided
  if (hasHookText) {
    notes.push({
      label: "Hook Strategy",
      value: HOOK_STRATEGIES[tone],
      icon: "🎣",
    });
  }

  // Add tags optimization note if tags were generated
  if (hasTags) {
    notes.push({
      label: "Tags",
      value: "Include trend-related keywords for discovery",
      icon: "🏷️",
    });
  }

  // Add any custom notes
  notes.push(...customNotes);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-2.5 mb-3">
        <svg
          className="w-4 h-4 text-blue-600 mt-0.5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            Optimization Notes
          </h4>
          <p className="text-xs text-blue-800 mb-3 leading-relaxed">
            Your content has been optimized based on the latest YouTube trends
            and best practices:
          </p>
          <ul className="space-y-2" role="list" aria-label="Optimization details">
            {notes.map((note, index) => (
              <li key={index} className="flex items-start gap-2">
                {note.icon && (
                  <span className="text-sm shrink-0" aria-hidden="true">
                    {note.icon}
                  </span>
                )}
                <span className="text-xs text-blue-900">
                  <span className="font-semibold">{note.label}:</span>{" "}
                  {note.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

