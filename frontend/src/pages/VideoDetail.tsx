import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Card, 
  Descriptions, 
  Tag, 
  Button, 
  Spin, 
  Alert, 
  Modal, 
  Space, 
  Row, 
  Col 
} from 'antd';
import { 
  ClockCircleOutlined, 
  EyeOutlined, 
  CalendarOutlined,
  DeleteOutlined, 
  EditOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { getVideo, deleteVideo } from '../services/api';
import { formatDuration, formatViews, formatDate } from '../utils/formatters';
import type { Video } from '../types';

const { Title, Text } = Typography;
const { confirm } = Modal;

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;
      
      try {
        const data = await getVideo(id);
        setVideo(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load video. Please try again later.');
        setLoading(false);
        console.error('Error fetching video:', err);
      }
    };

    fetchVideo();
  }, [id]);

  const handleDelete = () => {
    if (!video || !id) return;
    
    confirm({
      title: 'Are you sure you want to delete this video?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteVideo(id);
          navigate('/');
        } catch (err) {
          setError('Failed to delete video. Please try again later.');
          console.error('Error deleting video:', err);
        }
      },
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="Loading video details..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert 
        message="Error" 
        description={error} 
        type="error" 
        showIcon 
        style={{ maxWidth: '800px', margin: '100px auto' }}
      />
    );
  }

  if (!video) {
    return (
      <Alert 
        message="Video not found" 
        description="The requested video could not be found." 
        type="warning" 
        showIcon 
        style={{ maxWidth: '800px', margin: '100px auto' }}
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/')}
        style={{ marginBottom: '16px' }}
      >
        Back to Dashboard
      </Button>

      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <img 
              src={video.thumbnail_url} 
              alt={video.title}
              style={{ width: '100%', borderRadius: '8px', maxHeight: '500px', objectFit: 'cover' }}
            />
          </Col>
          
          <Col xs={24} lg={8}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={3}>{video.title}</Title>
                
                <Space size="large" wrap>
                  <Text type="secondary">
                    <EyeOutlined /> {formatViews(video.views)} views
                  </Text>
                  <Text type="secondary">
                    <ClockCircleOutlined /> {formatDuration(video.duration)}
                  </Text>
                  <Text type="secondary">
                    <CalendarOutlined /> {formatDate(video.created_at)}
                  </Text>
                </Space>
              </div>
              
              <div>
                <Title level={5}>Tags</Title>
                <div>
                  {video.tags.map(tag => (
                    <Tag key={tag} color="blue" style={{ margin: '0 8px 8px 0' }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
              
              <Space>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/videos/${id}/edit`)}
                >
                  Edit
                </Button>
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default VideoDetail;