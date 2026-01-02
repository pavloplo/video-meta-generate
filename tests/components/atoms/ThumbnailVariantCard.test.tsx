import { render, screen, fireEvent } from '@testing-library/react';
import { ThumbnailVariantCard } from '@/components/atoms/ThumbnailVariantCard';
import { READABILITY_LEVELS } from '@/constants/video';

describe('ThumbnailVariantCard', () => {
  const mockVariant = {
    id: 'variant-1',
    imageUrl: 'https://example.com/image.jpg',
    readability: READABILITY_LEVELS.GOOD as const,
  };

  const defaultProps = {
    variant: mockVariant,
    isSelected: false,
    onSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders image and readability badge', () => {
    render(<ThumbnailVariantCard {...defaultProps} />);

    const image = screen.getByAltText('Thumbnail variant variant-1');
    expect(image).toBeInTheDocument();
    // Next.js Image component modifies the src attribute, so we just check it exists
    expect(image).toHaveAttribute('src');

    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('shows unselected state styling', () => {
    render(<ThumbnailVariantCard {...defaultProps} />);

    const imageContainer = screen.getByAltText('Thumbnail variant variant-1').parentElement;
    expect(imageContainer).toHaveClass('border-slate-200');
    expect(imageContainer).not.toHaveClass('border-blue-500');

    // Should not show checkmark or selected label
    expect(screen.queryByText('Selected')).not.toBeInTheDocument();
  });

  it('shows selected state', () => {
    render(<ThumbnailVariantCard {...defaultProps} isSelected={true} />);

    // Should show selected styling
    const imageContainer = screen.getByAltText('Thumbnail variant variant-1').parentElement;
    expect(imageContainer).toHaveClass('border-blue-500', 'ring-2', 'ring-blue-500/20');

    // Should show checkmark overlay and selected label
    expect(screen.getByText('Selected')).toBeInTheDocument();
  });

  it('calls onSelect when image container is clicked', () => {
    render(<ThumbnailVariantCard {...defaultProps} />);

    const imageContainer = screen.getByAltText('Thumbnail variant variant-1').parentElement;
    fireEvent.click(imageContainer!);

    expect(defaultProps.onSelect).toHaveBeenCalled();
  });

  it('shows different readability badges', () => {
    const { rerender } = render(
      <ThumbnailVariantCard
        {...defaultProps}
        variant={{ ...mockVariant, readability: READABILITY_LEVELS.OK }}
      />
    );
    expect(screen.getByText('OK')).toBeInTheDocument();

    rerender(
      <ThumbnailVariantCard
        {...defaultProps}
        variant={{ ...mockVariant, readability: READABILITY_LEVELS.POOR }}
      />
    );
    expect(screen.getByText('Poor')).toBeInTheDocument();

    rerender(
      <ThumbnailVariantCard
        {...defaultProps}
        variant={{ ...mockVariant, readability: undefined }}
      />
    );
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});
