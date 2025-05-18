// src/components/VideoGrid.tsx
import React from 'react';
import { Row, Col, Empty, Button, Pagination, Spin } from 'antd';
import VideoCard from './VideoCard';
import type { Video } from '../types';

interface VideoGridProps {
  videos: Video[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, pageSize?: number) => void;
  onClearFilters: () => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  loading,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onClearFilters
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', margin: '60px 0' }}>
        <Spin size="large" tip="Loading videos..." />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <Empty 
        description={
          <span>
            No videos found. Try adjusting your search or filters.
            <br />
            <Button type="link" onClick={onClearFilters}>
              Clear all filters
            </Button>
          </span>
        } 
        style={{ margin: '60px 0' }}
      />
    );
  }

  return (
    <>
      <Row gutter={[16, 24]}>
        {videos.map(video => (
          <Col 
            key={video.id} 
            xs={24} 
            sm={12} 
            md={8} 
            lg={6} 
          >
            <VideoCard video={video} />
          </Col>
        ))}
      </Row>
      
      <Row justify="center" style={{ marginTop: 32 }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger
          pageSizeOptions={['12', '24', '36', '48']}
          showTotal={(total) => `Total ${total} videos`}
        />
      </Row>
    </>
  );
};

export default VideoGrid;