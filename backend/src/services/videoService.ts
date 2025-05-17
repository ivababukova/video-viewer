import { PrismaClient } from '../generated/prisma';
import type { VideoDTO, PrismaVideo, PrismaTag } from '../types';

const prisma = new PrismaClient();


export const getAllVideos = async (): Promise<VideoDTO[]> => {
  const videos = await prisma.video.findMany({
    include: {
      tags: true,
    },
  });
  
  return videos.map((video: PrismaVideo) => ({
    id: video.id,
    title: video.title,
    thumbnail_url: video.thumbnail_url,
    created_at: video.created_at.toISOString(),
    duration: video.duration,
    views: video.views,
    tags: video.tags.map((tag: PrismaTag) => tag.name),
  }));
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