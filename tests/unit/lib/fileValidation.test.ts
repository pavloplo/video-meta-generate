import {
  validateFileFormat,
  validateFileSize,
  validateFile,
} from '@/lib/fileValidation';
import {
  UPLOAD_CONSTRAINTS,
  UPLOAD_ERROR_MESSAGES,
} from '@/constants/video';

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock HTMLVideoElement
Object.defineProperty(global, 'HTMLVideoElement', {
  value: class MockHTMLVideoElement {
    duration = 60;
    videoWidth = 1920;
    videoHeight = 1080;
    currentTime = 0;
    src = '';
    preload = '';
    onloadedmetadata: (() => void) | null = null;
    onseeked: (() => void) | null = null;
    onerror: (() => void) | null = null;

    constructor() {
      // Simulate successful metadata loading after a tick
      setTimeout(() => {
        if (this.onloadedmetadata) {
          this.onloadedmetadata();
        }
      }, 0);
    }
  },
  writable: true,
});

describe('fileValidation', () => {
  describe('validateFileFormat', () => {
    it('should accept supported video formats', () => {
      const videoFile = new File([''], 'test.mp4', { type: 'video/mp4' });
      const result = validateFileFormat(videoFile);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept supported image formats', () => {
      const imageFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFileFormat(imageFile);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject unsupported video formats', () => {
      const videoFile = new File([''], 'test.mkv', { type: 'video/x-matroska' });
      const result = validateFileFormat(videoFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(UPLOAD_ERROR_MESSAGES.UNSUPPORTED_FORMAT('video'));
    });

    it('should reject unsupported image formats', () => {
      const imageFile = new File([''], 'test.bmp', { type: 'image/bmp' });
      const result = validateFileFormat(imageFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(UPLOAD_ERROR_MESSAGES.UNSUPPORTED_FORMAT('image'));
    });

    it('should reject non-video/image files', () => {
      const textFile = new File([''], 'test.txt', { type: 'text/plain' });
      const result = validateFileFormat(textFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File must be a video or image');
    });
  });

  describe('validateFileSize', () => {
    it('should accept video files under the size limit', () => {
      const maxSize = UPLOAD_CONSTRAINTS.VIDEO_MAX_SIZE_MB * 1024 * 1024;
      const videoFile = new File(
        [new ArrayBuffer(maxSize - 1000)],
        'test.mp4',
        { type: 'video/mp4' }
      );
      const result = validateFileSize(videoFile);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject video files over the size limit', () => {
      const maxSize = UPLOAD_CONSTRAINTS.VIDEO_MAX_SIZE_MB * 1024 * 1024;
      const videoFile = new File(
        [new ArrayBuffer(maxSize + 1000)],
        'test.mp4',
        { type: 'video/mp4' }
      );
      const result = validateFileSize(videoFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        UPLOAD_ERROR_MESSAGES.FILE_TOO_LARGE(
          UPLOAD_CONSTRAINTS.VIDEO_MAX_SIZE_MB,
          'video'
        )
      );
    });

    it('should accept image files under the size limit', () => {
      const maxSize = UPLOAD_CONSTRAINTS.IMAGE_MAX_SIZE_MB * 1024 * 1024;
      const imageFile = new File(
        [new ArrayBuffer(maxSize - 1000)],
        'test.jpg',
        { type: 'image/jpeg' }
      );
      const result = validateFileSize(imageFile);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject image files over the size limit', () => {
      const maxSize = UPLOAD_CONSTRAINTS.IMAGE_MAX_SIZE_MB * 1024 * 1024;
      const imageFile = new File(
        [new ArrayBuffer(maxSize + 1000)],
        'test.jpg',
        { type: 'image/jpeg' }
      );
      const result = validateFileSize(imageFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        UPLOAD_ERROR_MESSAGES.FILE_TOO_LARGE(
          UPLOAD_CONSTRAINTS.IMAGE_MAX_SIZE_MB,
          'image'
        )
      );
    });
  });

  describe('validateFile', () => {
    it('should return error for invalid format', async () => {
      const textFile = new File([''], 'test.txt', { type: 'text/plain' });
      const result = await validateFile(textFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File must be a video or image');
    });

    it('should return error for oversized file', async () => {
      const maxSize = UPLOAD_CONSTRAINTS.IMAGE_MAX_SIZE_MB * 1024 * 1024;
      const imageFile = new File(
        [new ArrayBuffer(maxSize + 1000)],
        'test.jpg',
        { type: 'image/jpeg' }
      );
      const result = await validateFile(imageFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        UPLOAD_ERROR_MESSAGES.FILE_TOO_LARGE(
          UPLOAD_CONSTRAINTS.IMAGE_MAX_SIZE_MB,
          'image'
        )
      );
    });

    it('should pass validation for valid image files', async () => {
      const imageFile = new File(['fake-image-data'], 'test.jpg', {
        type: 'image/jpeg',
      });
      const result = await validateFile(imageFile);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    // Note: Video validation tests requiring HTMLVideoElement are skipped
    // as they require a browser environment. These are better tested in E2E tests.
  });
});

