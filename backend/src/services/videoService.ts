import { PrismaClient } from '../generated/prisma';
import type { VideoDTO, PrismaVideo, PrismaTag, VideoQueryParams } from '../types';

const prisma = new PrismaClient();


// videoService.ts (backend)
export const getAllVideos = async (params: VideoQueryParams = {}): Promise<{
  videos: VideoDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> => {
  const { 
    page = 1, 
    pageSize = 12, 
    search = '', 
    tags = [],
    tagFilterMode,
    startDate,
    endDate,
    sortBy = 'newest'
  } = params;
  
  // Build the where clause for filtering
  const where: any = {};
  
  // Search filter
  if (search) {
    where.title = {
      contains: search,
    };
  }


  console.log("***** tag filtering mode: ", tagFilterMode);
  
  // Tags filter (multiple tags support)
  if (tags.length > 0) {
    if (tagFilterMode === 'AND') {
      // AND logic - videos must have ALL the selected tags
      where.AND = tags.map(tag => ({
        tags: {
          some: {
            name: tag
          }
        }
      }));
    } else {
      // OR logic - videos must have ANY of the selected tags
      where.tags = {
        some: {
          name: {
            in: tags
          }
        }
      };
    }
  }
  
  // Date range filter
  if (startDate && endDate) {
    where.created_at = {
      gte: new Date(startDate),
      lte: new Date(endDate)
    };
  }
  
  let orderBy: any = { created_at: 'desc' }; // default newest first
  
  switch(sortBy) {
    case 'oldest':
      orderBy = { created_at: 'asc' };
      break;
    case 'title_asc':
      orderBy = { title: 'asc' };
      break;
    case 'title_desc':
      orderBy = { title: 'desc' };
      break;
    case 'most_viewed':
      orderBy = { views: 'desc' };
      break;
    case 'longest':
      orderBy = { duration: 'desc' };
      break;
    default:
      orderBy = { created_at: 'desc' };
  }
  
  // Get total count for pagination
  const total = await prisma.video.count({ where });
  
  // Get paginated results
  const videos = await prisma.video.findMany({
    where,
    include: {
      tags: true,
    },
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  }) as PrismaVideo[];
  
  // Transform data for the frontend
  const transformedVideos = videos.map((video: PrismaVideo) => ({
    id: video.id,
    title: video.title,
    thumbnail_url: video.thumbnail_url,
    created_at: video.created_at.toISOString(),
    duration: video.duration,
    views: video.views,
    tags: video.tags.map((tag: PrismaTag) => tag.name),
  }));
  
  return {
    videos: transformedVideos,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
};

export const getVideoById = async (id: string): Promise<VideoDTO | null> => {
  const video = await prisma.video.findUnique({
    where: { id },
    include: {
      tags: true,
    },
  }) as PrismaVideo | null;
  
  if (!video) return null;
  
  return {
    id: video.id,
    title: video.title,
    thumbnail_url: video.thumbnail_url,
    created_at: video.created_at.toISOString(),
    duration: video.duration,
    views: video.views,
    tags: video.tags.map((tag: PrismaTag) => tag.name),
  };
};

export const createVideo = async (videoData: VideoDTO): Promise<VideoDTO> => {
  // Create or connect tags
  const tagConnections = await Promise.all(
    videoData.tags.map(async (tagName: string) => {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });
      return tag;
    })
  );

  const video = await prisma.video.create({
    data: {
      id: videoData.id,
      title: videoData.title,
      thumbnail_url: videoData.thumbnail_url,
      created_at: new Date(videoData.created_at),
      duration: videoData.duration,
      views: videoData.views,
      tags: {
        connect: tagConnections.map((tag: PrismaTag) => ({ id: tag.id })),
      },
    },
    include: {
      tags: true,
    },
  }) as PrismaVideo;
  
  return {
    id: video.id,
    title: video.title,
    thumbnail_url: video.thumbnail_url,
    created_at: video.created_at.toISOString(),
    duration: video.duration,
    views: video.views,
    tags: video.tags.map((tag: PrismaTag) => tag.name),
  };
};

// Add functions for updateVideo and deleteVideo as needed