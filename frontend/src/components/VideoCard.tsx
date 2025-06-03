import React, { useState } from 'react';
import { Card, Tag, Typography, Space } from 'antd';
import { PlayCircleOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Video } from '../types';
import { formatDuration, formatViews, formatDate } from '../utils/formatters';

const { Text, Title } = Typography;

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      cover={
        <div style={{ position: 'relative' }}>
          <img
            alt={video.title}
            src={video.thumbnail_url}
            style={{ width: '100%', height: '160px', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px',
          }}>
            <PlayCircleOutlined /> {formatDuration(video.duration)}
          </div>
        </div>
      }
      onClick={() => navigate(`/videos/${video.id}`)}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
    >
      <Title level={5} ellipsis={{ rows: 2 }} style={{ marginBottom: '8px' }}>
        {video.title}
      </Title>

      <Space direction="vertical" size={4} style={{ marginTop: 'auto' }}>
        <Space>
          <EyeOutlined /> <Text type="secondary">{formatViews(video.views)} views</Text>
          <CalendarOutlined /> <Text type="secondary">{formatDate(video.created_at)}</Text>
        </Space>

        <div>
          {video.tags.slice(0, 3).map(tag => (
            <Tag key={tag} color="blue" style={{ marginBottom: '4px' }}>
              {tag}
            </Tag>
          ))}
          {video.tags.length > 3 && (
            <Tag color="default">+{video.tags.length - 3}</Tag>
          )}
        </div>
      </Space>
    </Card>
  );
};

export default VideoCard;