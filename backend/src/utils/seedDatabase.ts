import fs from 'fs';
import path from 'path';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

interface VideoData {
  id: string;
  title: string;
  thumbnail_url: string;
  created_at: string;
  duration: number;
  views: number;
  tags: string[];
}

interface VideoImport {
  videos: VideoData[];
}

async function seedDatabase() {
  try {
    // Read the JSON file
    const dataPath = path.join(__dirname, '../../data/videos.json');
    const jsonData = fs.readFileSync(dataPath, 'utf8');
    const data: VideoImport = JSON.parse(jsonData);
    
    console.log(`Found ${data.videos.length} videos to import...`);
    
    // Clear existing data (optional - remove this if you want to keep existing data)
    console.log('Clearing existing data...');
    await prisma.video.deleteMany({});
    await prisma.tag.deleteMany({});
    
    // Process each video
    console.log('Importing videos...');
    for (const videoData of data.videos) {
      console.log(`Importing video: ${videoData.id} - ${videoData.title}`);
      
      // Process tags - create them if they don't exist
      const tags = await Promise.all(
        videoData.tags.map(async (tagName) => {
          return await prisma.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });
        })
      );
      
      // Create the video with connections to tags
      await prisma.video.create({
        data: {
          id: videoData.id,
          title: videoData.title,
          thumbnail_url: videoData.thumbnail_url,
          created_at: new Date(videoData.created_at),
          duration: videoData.duration,
          views: videoData.views,
          tags: {
            connect: tags.map(tag => ({ id: tag.id })),
          },
        },
      });
    }
    
    console.log('Database seeding completed successfully!');
    
    // Display some stats
    const videoCount = await prisma.video.count();
    const tagCount = await prisma.tag.count();
    console.log(`Total videos in database: ${videoCount}`);
    console.log(`Total tags in database: ${tagCount}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the seed function
seedDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });