import axios from 'axios';
import type { Video, VideoQueryParams, PaginatedResponse } from '../types';

// Define the base URL for API requests
const API_URL = 'http://localhost:3001/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const getVideos = async (params: VideoQueryParams = {}): Promise<PaginatedResponse<Video>> => {
  const { 
    page, 
    pageSize, 
    search, 
    tags, 
    tagFilterMode,
    startDate, 
    endDate, 
    sortBy 
  } = params;
  
  // Build query string
  const queryParams = new URLSearchParams();
  if (page) queryParams.append('page', page.toString());
  if (pageSize) queryParams.append('pageSize', pageSize.toString());
  if (search) queryParams.append('search', search);
  if (sortBy) queryParams.append('sortBy', sortBy);
  
  // Handle array of tags
  if (tags && tags.length > 0) {
    tags.forEach(tag => queryParams.append('tags', tag));
  }

  if (tagFilterMode) queryParams.append('tagFilterMode', tagFilterMode);

  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);

  const response = await api.get<PaginatedResponse<Video>>(`/videos?${queryParams.toString()}`);
  return response.data;
};

export const getVideo = async (id: string): Promise<Video> => {
  const response = await api.get<Video>(`/videos/${id}`);
  return response.data;
};

export const createVideo = async (video: Omit<Video, 'id'>): Promise<Video> => {
  const response = await api.post<Video>('/videos', video);
  return response.data;
};

export const updateVideo = async (id: string, video: Partial<Video>): Promise<Video> => {
  const response = await api.put<Video>(`/videos/${id}`, video);
  return response.data;
};

export const deleteVideo = async (id: string): Promise<void> => {
  await api.delete(`/videos/${id}`);
};

export default api;
