// UI text constants for button labels, messages, and user-facing strings
export const BUTTON_LABELS = {
  GENERATE_METADATA: "Generate metadata",
  ADD_MORE_VARIANTS: "Add more variants",
  GENERATING_METADATA: "Generating metadata...",
  GENERATING_MORE_THUMBNAILS: "Generating more thumbnails...",
  GENERATING_MORE_VARIANTS: "Adding more variants...",
  // Mobile-specific buttons
  GENERATE_METADATA_DISABLED: "Complete inputs to generate",
  REGENERATE: "Regenerate",
  EDIT_INPUTS: "Edit Inputs",
} as const;

// Mobile tab labels
export const MOBILE_TABS = {
  INPUTS: "Inputs",
  RESULTS: "Results",
} as const;

// Mobile validation messages
export const MOBILE_VALIDATION = {
  HOOK_TEXT_TOO_LONG: "Hook text must be 200 characters or less",
  MISSING_VIDEO: "Please upload a video or select images",
  MISSING_IMAGES: "Please upload images or select video",
  TONE_REQUIRED: "Please select a tone",
} as const;

export const ALERT_MESSAGES = {
  GENERATING_THUMBNAILS: "Images sent for processing",
  GENERATING_MORE_THUMBNAILS: "Generating more thumbnails...",
  ALL_METADATA_GENERATED: "All metadata generated successfully!",
  VARIANTS_ADDED: (count: number) => `${count} new options added`,
  MORE_THUMBNAILS_GENERATED: (count: number) =>
    `Generated ${count} more thumbnails`,
  REGENERATION_LIMIT_REACHED:
    "You've reached the limit. Choose a thumbnail to continue.",
  GENERATION_FAILED: "Failed to generate thumbnails",
  REGENERATION_FAILED: "Failed to regenerate thumbnails",
  // Mobile-specific messages
  METADATA_GENERATED_SUCCESS: "Metadata generated successfully!",
  METADATA_GENERATION_FAILED: "Failed to generate metadata",
  // Section-specific error messages
  THUMBNAILS_GENERATION_FAILED: "Failed to generate thumbnails",
  DESCRIPTION_GENERATION_FAILED: "Failed to generate description",
  TAGS_GENERATION_FAILED: "Failed to generate tags",
} as const;

// Helper text for generation requirements
export const GENERATION_HELPER = {
  UPLOAD_FILE_TO_CONTINUE: "Upload a video or images to continue",
  WHAT_HAPPENS_NEXT: "Upload your video or images, add optional hook text and tone preferences, then generate your metadata. We'll create thumbnails, descriptions, and tags optimized for YouTube.",
} as const;

// Checklist labels
export const CHECKLIST_LABELS = {
  FILE_UPLOADED: "File uploaded",
  HOOK_TEXT: "Hook text",
  TONE_SELECTED: "Tone selected",
} as const;

// Upload status messages
export const UPLOAD_STATUS = {
  UPLOADING: "Uploading...",
  ANALYZING: "Analyzing...",
  PROCESSING: "Processing...",
  COMPLETE: "Upload complete",
  FAILED: "Upload failed",
} as const;

// Upload UI labels
export const UPLOAD_LABELS = {
  CLICK_OR_DRAG: "Click to upload or drag and drop",
  REPLACE_FILE: "Replace",
  REMOVE_FILE: "Remove",
  FILE_SIZE: "File size:",
  VIDEO_DURATION: "Duration:",
} as const;

// Section state labels
export const SECTION_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;