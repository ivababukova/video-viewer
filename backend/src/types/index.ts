export interface VideoDTO {
  id: string;
  title: string;
  thumbnail_url: string;
  created_at: string;
  duration: number;
  views: number;
  tags: string[];
}

export interface VideoImport {
  videos: VideoDTO[];
}

export interface PrismaTag {
  id: string;
  name: string;
}

export interface PrismaVideo {
  id: string;
  title: string;
  thumbnail_url: string;
  created_at: Date;
  duration: number;
  views: number;
  tags: PrismaTag[];
}
