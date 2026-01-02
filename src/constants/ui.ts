// UI text constants for button labels, messages, and user-facing strings
export const BUTTON_LABELS = {
  GENERATE_THUMBNAILS: 'Generate thumbnails',
  ADD_MORE_VARIANTS: 'Add more variants',
  GENERATING_ALL_METADATA: 'Generating all metadata...',
  GENERATING_MORE_THUMBNAILS: 'Generating more thumbnails...',
  GENERATING_MORE_VARIANTS: 'Adding more variants...',
} as const;

export const ALERT_MESSAGES = {
  GENERATING_THUMBNAILS: 'Images sent for processing',
  GENERATING_MORE_THUMBNAILS: 'Generating more thumbnails...',
  ALL_METADATA_GENERATED: 'All metadata generated successfully!',
  VARIANTS_ADDED: (count: number) => `${count} new options added`,
  MORE_THUMBNAILS_GENERATED: (count: number) => `Generated ${count} more thumbnails`,
  REGENERATION_LIMIT_REACHED: "You've reached the limit. Choose a thumbnail to continue.",
  GENERATION_FAILED: 'Failed to generate thumbnails',
  REGENERATION_FAILED: 'Failed to regenerate thumbnails',
} as const;
