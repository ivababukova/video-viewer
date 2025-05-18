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
import type { AxiosError } from 'axios';


const { Title } = Typography;
const { Option } = Select;

const Dashboard: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [total, setTotal] = useState<number>(0);


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 3000);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);


  useEffect(() => {
    const fetchTags = async () => {
      try {
        // You might need to create a separate API endpoint for tags
        // For now, we can get it with the first page of videos
        const response = await getVideos({ page: 1, pageSize: 100 });
        const allTags = new Set<string>();
        
        response.data.forEach(video => {
          video.tags.forEach(tag => allTags.add(tag));
        });
        
        setTags(Array.from(allTags).sort());
      } catch (err) {
        setError('Error fetching tags. Please try again later.');
        console.error('Error fetching tags:', err);
      }
    };

    fetchTags();
  }, []);


  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await getVideos({
          page: currentPage,
          pageSize: pageSize,
          search: debouncedSearch,
          tag: selectedTag
        });
        
        setVideos(response.data);
        setTotal(response.total);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.code.includes('ERR_NETWORK')) {
            setError('Failed to load videos: Please check your internet connection.');
          } else {
            setError('Failed to load videos: ' + err.message);
          }
        } else {
          setError('Failed to load videos: Please try again later.');
        }
        setLoading(false);
        console.error('Error fetching videos:', err);
      }
    };

    fetchVideos();
  }, [currentPage, pageSize, debouncedSearch, selectedTag]);



  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTagChange = (value: string) => {
    setSelectedTag(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };


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
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={16}>
          <Input 
            placeholder="Search videos by name" 
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={handleSearchChange}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            placeholder="Filter by tag"
            style={{ width: '100%' }}
            value={selectedTag}
            onChange={handleTagChange}
            allowClear
          >
            {tags.map(tag => (
              <Option key={tag} value={tag}>{tag}</Option>
            ))}
          </Select>
        </Col>
      </Row>
      
      {/* Videos Grid with Loading Indicator */}
      {loading && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <Spin />
        </div>
      )}
      
      {/* Videos Grid */}
      {!loading && videos.length === 0 ? (
        <Empty description="No videos found" />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {videos.map(video => (
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
          <Row justify="center" style={{ marginTop: '32px' }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total) => `Total ${total} videos`}
            />
          </Row>
        </>
      )}
    </div>
  );
};

export default Dashboard;