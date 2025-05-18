import type { Video, PaginatedResponse, VideoQueryParams } from '../types';

// Sample mock video data
const mockVideos: Video[] = [
  {
    id: 'v-001',
    title: 'Introduction to Testing',
    thumbnail_url: 'https://example.com/thumbnail1.jpg',
    created_at: '2023-01-01T12:00:00Z',
    duration: 300,
    views: 1000,
    tags: ['testing', 'react']
  },
  {
    id: 'v-002',
    title: 'Advanced React Patterns',
    thumbnail_url: 'https://example.com/thumbnail2.jpg',
    created_at: '2023-02-01T12:00:00Z',
    duration: 450,
    views: 2000,
    tags: ['react', 'advanced']
  }
];

// Mock getVideos function
export const getVideos = vi.fn(async (params: VideoQueryParams = {}): Promise<PaginatedResponse<Video>> => {
  // Simulate filtering by search term
  let filteredVideos = [...mockVideos];
  
  if (params.search) {
    filteredVideos = filteredVideos.filter(video => 
      video.title.toLowerCase().includes(params.search!.toLowerCase())
    );
  }
  
  // Simulate filtering by tags
  if (params.tags && params.tags.length > 0) {
    if (params.tagFilterMode === 'AND') {
      filteredVideos = filteredVideos.filter(video => 
        params.tags!.every(tag => video.tags.includes(tag))
      );
    } else {
      filteredVideos = filteredVideos.filter(video => 
        params.tags!.some(tag => video.tags.includes(tag))
      );
    }
  }
  
  // Simulate pagination
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedVideos = filteredVideos.slice(startIndex, endIndex);
  
  return {
    data: paginatedVideos,
    total: filteredVideos.length,
    page: page,
    pageSize: pageSize,
    totalPages: Math.ceil(filteredVideos.length / pageSize)
  };
});

// Mock getVideo function
export const getVideo = vi.fn(async (id: string): Promise<Video> => {
  const video = mockVideos.find(v => v.id === id);
  if (!video) throw new Error('Video not found');
  return video;
});

export default {
  getVideos,
  getVideo
};