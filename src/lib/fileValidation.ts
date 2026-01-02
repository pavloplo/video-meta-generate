import {
  UPLOAD_CONSTRAINTS,
  SUPPORTED_VIDEO_FORMATS,
  SUPPORTED_IMAGE_FORMATS,
  UPLOAD_ERROR_MESSAGES,
} from "@/constants/video";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
}

/**
 * Validates if the file format is supported
 */
export const validateFileFormat = (file: File): ValidationResult => {
  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');

  if (!isVideo && !isImage) {
    return {
      isValid: false,
      error: 'File must be a video or image',
    };
  }

  if (isVideo && !SUPPORTED_VIDEO_FORMATS.includes(file.type as never)) {
    return {
      isValid: false,
      error: UPLOAD_ERROR_MESSAGES.UNSUPPORTED_FORMAT('video'),
    };
  }

  if (isImage && !SUPPORTED_IMAGE_FORMATS.includes(file.type as never)) {
    return {
      isValid: false,
      error: UPLOAD_ERROR_MESSAGES.UNSUPPORTED_FORMAT('image'),
    };
  }

  return { isValid: true };
};

/**
 * Validates file size against constraints
 */
export const validateFileSize = (file: File): ValidationResult => {
  const isVideo = file.type.startsWith('video/');
  const maxSizeMB = isVideo
    ? UPLOAD_CONSTRAINTS.VIDEO_MAX_SIZE_MB
    : UPLOAD_CONSTRAINTS.IMAGE_MAX_SIZE_MB;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: UPLOAD_ERROR_MESSAGES.FILE_TOO_LARGE(
        maxSizeMB,
        isVideo ? 'video' : 'image'
      ),
    };
  }

  return { isValid: true };
};

/**
 * Validates video duration by loading the video element
 */
export const validateVideoDuration = (
  file: File
): Promise<ValidationResult & { duration?: number }> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('video/')) {
      resolve({ isValid: true });
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);

      const duration = video.duration;

      if (duration > UPLOAD_CONSTRAINTS.VIDEO_MAX_DURATION_SECONDS) {
        resolve({
          isValid: false,
          error: UPLOAD_ERROR_MESSAGES.VIDEO_TOO_LONG(
            UPLOAD_CONSTRAINTS.VIDEO_MAX_DURATION_SECONDS
          ),
        });
      } else {
        resolve({
          isValid: true,
          duration,
        });
      }
    };

    video.onerror = () => {
      window.URL.revokeObjectURL(video.src);
      resolve({
        isValid: false,
        error: UPLOAD_ERROR_MESSAGES.VIDEO_LOAD_ERROR,
      });
    };

    video.src = URL.createObjectURL(file);
  });
};

/**
 * Extracts video metadata (duration, dimensions)
 */
export const extractVideoMetadata = (file: File): Promise<VideoMetadata> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('video/')) {
      reject(new Error('File is not a video'));
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);

      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      });
    };

    video.onerror = () => {
      window.URL.revokeObjectURL(video.src);
      reject(new Error(UPLOAD_ERROR_MESSAGES.VIDEO_LOAD_ERROR));
    };

    video.src = URL.createObjectURL(file);
  });
};

/**
 * Generates a thumbnail from video file
 */
export const generateVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('video/')) {
      reject(new Error('File is not a video'));
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.currentTime = 1; // Seek to 1 second for thumbnail

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      window.URL.revokeObjectURL(video.src);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          reject(new Error('Failed to generate thumbnail'));
        }
      }, 'image/jpeg');
    };

    video.onerror = () => {
      window.URL.revokeObjectURL(video.src);
      reject(new Error(UPLOAD_ERROR_MESSAGES.VIDEO_LOAD_ERROR));
    };

    video.onloadedmetadata = () => {
      // Trigger seeking after metadata is loaded
      video.currentTime = Math.min(1, video.duration);
    };

    video.src = URL.createObjectURL(file);
  });
};

/**
 * Generates a thumbnail from image file
 */
export const generateImageThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read image'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Comprehensive file validation
 */
export const validateFile = async (
  file: File
): Promise<ValidationResult & { duration?: number }> => {
  // Check format
  const formatResult = validateFileFormat(file);
  if (!formatResult.isValid) {
    return formatResult;
  }

  // Check size
  const sizeResult = validateFileSize(file);
  if (!sizeResult.isValid) {
    return sizeResult;
  }

  // Check video duration if applicable
  if (file.type.startsWith('video/')) {
    const durationResult = await validateVideoDuration(file);
    if (!durationResult.isValid) {
      return durationResult;
    }
    return { isValid: true, duration: durationResult.duration };
  }

  return { isValid: true };
};

