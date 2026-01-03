import { render, screen, fireEvent } from '@testing-library/react';
import { FileUploadSummary, type UploadedFileInfo } from '@/components/atoms/FileUploadSummary';
import { UPLOAD_LABELS } from '@/constants/ui';

describe('FileUploadSummary', () => {
  const mockOnReplace = jest.fn();
  const mockOnRemove = jest.fn();

  const videoFile: UploadedFileInfo = {
    name: 'test-video.mp4',
    size: 10485760, // 10 MB
    type: 'video/mp4',
    duration: 120,
    thumbnailUrl: 'https://example.com/thumb.jpg',
  };

  const imageFile: UploadedFileInfo = {
    name: 'test-image.jpg',
    size: 2097152, // 2 MB
    type: 'image/jpeg',
    thumbnailUrl: 'https://example.com/image.jpg',
  };

  beforeEach(() => {
    mockOnReplace.mockClear();
    mockOnRemove.mockClear();
  });

  it('should render video file information', () => {
    render(
      <FileUploadSummary
        file={videoFile}
        onReplace={mockOnReplace}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('test-video.mp4')).toBeInTheDocument();
    expect(screen.getByText(/10 MB/i)).toBeInTheDocument();
    expect(screen.getByText(/2:00/)).toBeInTheDocument(); // 120 seconds = 2:00
    expect(screen.getByText(UPLOAD_LABELS.FILE_SIZE)).toBeInTheDocument();
    expect(screen.getByText(UPLOAD_LABELS.VIDEO_DURATION)).toBeInTheDocument();
  });

  it('should render image file information without duration', () => {
    render(
      <FileUploadSummary
        file={imageFile}
        onReplace={mockOnReplace}
      />
    );

    expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
    expect(screen.getByText(/2 MB/i)).toBeInTheDocument();
    expect(screen.queryByText(UPLOAD_LABELS.VIDEO_DURATION)).not.toBeInTheDocument();
  });

  it('should display thumbnail preview when available', () => {
    render(
      <FileUploadSummary
        file={videoFile}
        onReplace={mockOnReplace}
      />
    );

    const thumbnail = screen.getByAltText('File preview');
    expect(thumbnail).toBeInTheDocument();
    expect(thumbnail).toHaveAttribute('src', videoFile.thumbnailUrl);
  });

  it('should show video icon when no thumbnail is available', () => {
    const fileWithoutThumb: UploadedFileInfo = {
      ...videoFile,
      thumbnailUrl: undefined,
    };

    const { container } = render(
      <FileUploadSummary
        file={fileWithoutThumb}
        onReplace={mockOnReplace}
      />
    );

    // Check for SVG video icon (it should be present in the DOM)
    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
    expect(svgIcon).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('should call onReplace when Replace button is clicked', () => {
    render(
      <FileUploadSummary
        file={videoFile}
        onReplace={mockOnReplace}
      />
    );

    const replaceButton = screen.getByRole('button', { name: UPLOAD_LABELS.REPLACE_FILE });
    fireEvent.click(replaceButton);

    expect(mockOnReplace).toHaveBeenCalledTimes(1);
  });

  it('should call onRemove when Remove button is clicked', () => {
    render(
      <FileUploadSummary
        file={videoFile}
        onReplace={mockOnReplace}
        onRemove={mockOnRemove}
      />
    );

    const removeButton = screen.getByRole('button', { name: UPLOAD_LABELS.REMOVE_FILE });
    fireEvent.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it('should not render Remove button when onRemove is not provided', () => {
    render(
      <FileUploadSummary
        file={videoFile}
        onReplace={mockOnReplace}
      />
    );

    const removeButton = screen.queryByRole('button', { name: UPLOAD_LABELS.REMOVE_FILE });
    expect(removeButton).not.toBeInTheDocument();
  });

  it('should format file sizes correctly', () => {
    const smallFile: UploadedFileInfo = {
      name: 'small.jpg',
      size: 1024, // 1 KB
      type: 'image/jpeg',
    };

    render(
      <FileUploadSummary
        file={smallFile}
        onReplace={mockOnReplace}
      />
    );

    expect(screen.getByText(/1 KB/i)).toBeInTheDocument();
  });

  it('should format video duration correctly', () => {
    const shortVideo: UploadedFileInfo = {
      name: 'short.mp4',
      size: 1024,
      type: 'video/mp4',
      duration: 45, // 45 seconds
    };

    render(
      <FileUploadSummary
        file={shortVideo}
        onReplace={mockOnReplace}
      />
    );

    expect(screen.getByText(/45s/)).toBeInTheDocument();
  });
});

