export interface Video {
  id: string;
  title: string;
  thumbnail_url: string;
  created_at: string;
  duration: number;
  views: number;
  tags: string[];
}

export type TagFilterMode = 'OR' | 'AND';

export interface VideoQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  tags?: string[];
  tagFilterMode?: TagFilterMode;
  startDate?: string;
  endDate?: string;
  sortBy?: SortOption;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type SortOption = 
  | 'newest' 
  | 'oldest' 
  | 'title_asc' 
  | 'title_desc' 
  | 'most_viewed'
  | 'longest';

export interface VideoQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  sortBy?: SortOption;
}