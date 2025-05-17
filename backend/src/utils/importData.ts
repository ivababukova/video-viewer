import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { VideoImport } from '../types';

const prisma = new PrismaClient();

async function importData() {
  try {
    // Read the JSON file
    const dataPath = path.join(__dirname, '../../data/videos.json');
    const jsonData = fs.readFileSync(dataPath, 'utf8');
    const data: VideoImport = JSON.parse(jsonData);
    
    console.log(`Found ${data.videos.length} videos to import.`);
    
    // Process each video
    for (const videoData of data.videos) {
      // Create or connect tags
      const tagObjects = await Promise.all(
        videoData.tags.map(async (tagName) => {
          return await prisma.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });
        })
      );
      
      // Create the video with tag connections
      await prisma.video.create({
        data: {
          id: videoData.id,
          title: videoData.title,
          thumbnail_url: videoData.thumbnail_url,
          created_at: new Date(videoData.created_at),
          duration: videoData.duration,
          views: videoData.views,
          tags: {
            connect: tagObjects.map(tag => ({ id: tag.id })),
          },
        },
      });
    }
    
    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();