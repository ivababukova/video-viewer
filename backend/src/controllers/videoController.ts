import express from 'express';
import * as videoService from '../services/videoService';
import { VideoDTO } from '../types';

export const getAllVideos = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const videos = await videoService.getAllVideos();
    res.json(videos);
  } catch (error) {
    console.error('Error getting videos:', error);
    res.status(500).json({ error: 'Failed to get videos' });
  }
};

export const getVideoById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params;
    const video = await videoService.getVideoById(id);
    
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