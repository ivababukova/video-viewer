import express from 'express';
import * as videoService from '../services/videoService';
import { VideoDTO } from '../types';


// videoController.ts (backend)
export const getAllVideos = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    // Extract query parameters
    const page = req.query.page ? parseInt(req.query.page as string) : undefined;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : undefined;
    const search = req.query.search as string | undefined;
    const tags = Array.isArray(req.query.tags) 
      ? req.query.tags as string[] 
      : req.query.tags 
        ? [req.query.tags as string] 
        : undefined;
    const tagFilterMode = (req.query.tagFilterMode as 'AND' | 'OR' | undefined) || 'OR';
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;
    
    // Get videos with pagination, filtering and sorting
    const result = await videoService.getAllVideos({
      page,
      pageSize,
      search,
      tags,
      tagFilterMode,
      startDate,
      endDate,
      sortBy
    });
    
    // Return the paginated response
    res.json({
      data: result.videos,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages
    });
  } catch (error) {
    console.error('Error getting videos:', error);
    res.status(500).json({ error: 'Failed to get videos' });
  }
};

export const getVideoById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params;
    const video = await videoService.getVideoById(id);

    console.log("in getVideoById");
    
    if (!video) {
      res.status(404).json({ error: 'Video not found' });
    }
    
    res.json(video);
  } catch (error) {
    console.error('Error getting video:', error);
    res.status(500).json({ error: 'Failed to get video' });
  }
};

export const createVideo = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const videoData = req.body as VideoDTO;
    const video = await videoService.createVideo(videoData);
    res.status(201).json(video);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ error: 'Failed to create video' });
  }
};

// Add update and delete controller methods as needed