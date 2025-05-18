import { PrismaClient } from '../generated/prisma';
import type { VideoDTO, PrismaVideo, PrismaTag, VideoQueryParams } from '../types';

const prisma = new PrismaClient();


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
    tag = '' 
  } = params;
  
  // Build the where clause for filtering
  const where: any = {};

  console.log("In search page: ", page, " pageSize: ", pageSize, " search: ", search, " tag: ", tag)
  
  if (search) {
    where.title = {
      contains: search,
    };
  }
  
  if (tag) {
    where.tags = {
      some: {
        name: tag
      }
    };
  }
  
  // Get total count for pagination
  const total = await prisma.video.count({ where });
  
  // Get paginated results
  const videos = await prisma.video.findMany({
    where,
    include: {
      tags: true,
    },
    orderBy: {
      created_at: 'desc' // Most recent videos first
    },
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