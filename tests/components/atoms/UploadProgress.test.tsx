import { render, screen } from '@testing-library/react';
import { UploadProgress } from '@/components/atoms/UploadProgress';
import { UPLOAD_STATUS } from '@/constants/ui';

describe('UploadProgress', () => {
  it('should render uploading stage correctly', () => {
    render(<UploadProgress stage="uploading" progress={30} fileName="test.mp4" />);

    expect(screen.getByText(UPLOAD_STATUS.UPLOADING)).toBeInTheDocument();
    expect(screen.getByText('test.mp4')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(screen.getByText(/Uploading your file to the server/i)).toBeInTheDocument();
  });

  it('should render analyzing stage correctly', () => {
    render(<UploadProgress stage="analyzing" progress={60} fileName="test.mp4" />);

    expect(screen.getByText(UPLOAD_STATUS.ANALYZING)).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText(/Analyzing video content/i)).toBeInTheDocument();
  });

  it('should render processing stage correctly', () => {
    render(<UploadProgress stage="processing" progress={85} />);

    expect(screen.getByText(UPLOAD_STATUS.PROCESSING)).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText(/Processing and preparing/i)).toBeInTheDocument();
  });

  it('should render complete stage correctly', () => {
    render(<UploadProgress stage="complete" progress={100} />);

    expect(screen.getByText(UPLOAD_STATUS.COMPLETE)).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText(/File ready for metadata generation/i)).toBeInTheDocument();
  });

  it('should show spinner for non-complete stages', () => {
    const { container } = render(<UploadProgress stage="uploading" progress={50} />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should show checkmark for complete stage', () => {
    const { container } = render(<UploadProgress stage="complete" progress={100} />);

    // Check for the checkmark icon (green circle with checkmark)
    const checkmarkContainer = container.querySelector('.bg-green-500');
    expect(checkmarkContainer).toBeInTheDocument();
    
    // Check for the SVG checkmark
    const checkmark = container.querySelector('svg path[stroke-linecap="round"]');
    expect(checkmark).toBeInTheDocument();
  });

  it('should render without filename', () => {
    render(<UploadProgress stage="uploading" progress={40} />);

    expect(screen.getByText(UPLOAD_STATUS.UPLOADING)).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('should have proper progress bar attributes', () => {
    render(<UploadProgress stage="analyzing" progress={75} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('should display correct progress bar width', () => {
    const { container } = render(<UploadProgress stage="processing" progress={65} />);

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle({ width: '65%' });
  });

  it('should round progress percentage', () => {
    render(<UploadProgress stage="uploading" progress={45.7} />);

    expect(screen.getByText('46%')).toBeInTheDocument();
  });
});

