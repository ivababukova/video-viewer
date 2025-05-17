import React, { useEffect, useState } from 'react';
import { 
  Row, 
  Col, 
  Typography, 
  Input, 
  Select, 
  Spin, 
  Empty, 
  Alert, 
  Pagination
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getVideos } from '../services/api';
import VideoCard from '../components/VideoCard';
import type { Video } from '../types';

const { Title } = Typography;
const { Option } = Select;

const Dashboard: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(12);

  // Get all unique tags from videos
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    videos.forEach(video => {
      video.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [videos]);

  // Fetch videos on component mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getVideos();
        setVideos(data);
        setFilteredVideos(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load videos. Please try again later.');
        setLoading(false);
        console.error('Error fetching videos:', err);
      }
    };

    fetchVideos();
  }, []);

  // Filter videos when search term or selected tag changes
  useEffect(() => {
    const filtered = videos.filter(video => {
      const matchesSearch = searchTerm === '' || 
        video.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTag = selectedTag === '' || 
        video.tags.includes(selectedTag);
      
      return matchesSearch && matchesTag;
    });
    
    setFilteredVideos(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedTag, videos]);

  // Calculate current page videos
  const currentVideos = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredVideos.slice(startIndex, startIndex + pageSize);
  }, [filteredVideos, currentPage, pageSize]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="Loading videos..." />
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

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Video Dashboard</Title>
      
      {/* Filters */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={16}>
          <Input 
            placeholder="Search videos by name" 
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            placeholder="Filter by tag"
            style={{ width: '100%' }}
            value={selectedTag}
            onChange={value => setSelectedTag(value)}
            allowClear
          >
            {allTags.map(tag => (
              <Option key={tag} value={tag}>{tag}</Option>
            ))}
          </Select>
        </Col>
      </Row>
      
      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <Empty description="No videos found" />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {currentVideos.map(video => (
              <Col 
                key={video.id} 
                xs={24} 
                sm={12} 
                md={8} 
                lg={6} 
                style={{ marginBottom: '16px' }}
              >
                <VideoCard video={video} />
              </Col>
            ))}
          </Row>
          
          {/* Pagination */}
          <Row justify="center" style={{ marginTop: '32px' }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredVideos.length}
              onChange={page => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </Row>
        </>
      )}
    </div>
  );
};

export default Dashboard;