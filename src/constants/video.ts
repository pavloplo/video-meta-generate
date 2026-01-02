export const VALIDATION_RULES = {
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 5000,
  TAGS_MAX_COUNT: 15,
} as const;

export const VIDEO_METADATA_TYPES = {
  TITLE: 'title',
  DESCRIPTION: 'description',
  TAGS: 'tags',
  THUMBNAIL: 'thumbnail',
  CHAPTERS: 'chapters',
} as const;
