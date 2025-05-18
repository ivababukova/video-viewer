import { render, screen } from '@testing-library/react';
import VideoGrid from '../VideoGrid';
import type { Video } from '../../types';

// Mock the VideoCard component to simplify testing
vi.mock('../VideoCard', () => ({
  default: ({ video }: { video: Video }) => (
    <div data-testid={`video-card-${video.id}`}>{video.title}</div>
  )
}));

describe('VideoGrid', () => {
  const mockVideos: Video[] = [
    {
      id: 'v-001',
      title: 'Test Video 1',
      thumbnail_url: 'https://example.com/1.jpg',
      created_at: '2023-01-01T00:00:00Z',
      duration: 300,
      views: 1000,
      tags: ['test']
    },
    {
      id: 'v-002',
      title: 'Test Video 2',
      thumbnail_url: 'https://example.com/2.jpg',
      created_at: '2023-01-02T00:00:00Z',
      duration: 400,
      views: 2000,
      tags: ['test']
    }
  ];
  
  const defaultProps = {
    videos: mockVideos,
    loading: false,
    total: 10,
    currentPage: 1,
    pageSize: 10,
    onPageChange: vi.fn(),
    onClearFilters: vi.fn()
  };

  
  test('renders empty state when no videos are available', () => {
    render(
      <VideoGrid 
        {...defaultProps} 
        videos={[]}
      />
    );
    
    expect(screen.getByText(/No videos found/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear all filters/i)).toBeInTheDocument();
  });
  
  test('renders video cards for each video', () => {
    render(<VideoGrid {...defaultProps} />);
    
    expect(screen.getByTestId('video-card-v-001')).toBeInTheDocument();
    expect(screen.getByTestId('video-card-v-002')).toBeInTheDocument();
    expect(screen.getByText('Test Video 1')).toBeInTheDocument();
    expect(screen.getByText('Test Video 2')).toBeInTheDocument();
  });
  
  test('renders pagination with correct total', () => {
    render(<VideoGrid {...defaultProps} />);
    
    expect(screen.getByText(/Total 10 videos/i)).toBeInTheDocument();
  });
});