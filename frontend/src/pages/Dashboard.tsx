import React, { useEffect, useState } from 'react';
import { 
  Row, 
  Col, 
  Typography, 
  Input, 
  Select, 
  Alert, 
  Card,
  Button,
  Divider,
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  SortAscendingOutlined, 
} from '@ant-design/icons';
import { getVideos } from '../services/api';
import type { Video, SortOption, VideoQueryParams, TagFilterMode } from '../types';
import type { RadioChangeEvent } from 'antd';
import FilterDrawer from '../components/FilterDrawer';
import AppliedFilters from '../components/AppliedFilters';
import VideoGrid from '../components/VideoGrid';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const Dashboard: React.FC = () => {
  // Video data state
  const [videos, setVideos] = useState<Video[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters and search state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagFilterMode, setTagFilterMode] = useState<TagFilterMode>('OR');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [total, setTotal] = useState<number>(0);
  
  // UI state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<number>(0);
  
  // Handle search debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch all available tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getVideos({ page: 1, pageSize: 100 });
        const allTags = new Set<string>();
        
        response.data.forEach(video => {
          video.tags.forEach(tag => allTags.add(tag));
        });
        
        setTags(Array.from(allTags).sort());
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };

    fetchTags();
  }, []);

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (selectedTags.length > 0) count++;
    if (dateRange && dateRange[0] && dateRange[1]) count++;
    if (sortBy !== 'newest') count++;
    
    setActiveFilters(count);
  }, [selectedTags, dateRange, sortBy]);

  // Fetch videos when filters, pagination, or sorting changes
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      
      try {
        // Prepare query parameters
        const params: VideoQueryParams = {
          page: currentPage,
          pageSize,
          search: debouncedSearch,
          sortBy
        };
        
        // Add tags if selected
        if (selectedTags.length > 0) {
          params.tags = selectedTags;
          params.tagFilterMode = tagFilterMode;
        }
        
        // Add date range if selected
        if (dateRange && dateRange[0] && dateRange[1]) {
          params.startDate = dateRange[0].toISOString();
          params.endDate = dateRange[1].toISOString();
        }

        console.log("Abput to fetch videos: ", params);
        
        const response = await getVideos(params);
        
        setVideos(response.data);
        setTotal(response.total);
      } catch (err) {
        if (err instanceof Error) {
          setError(`Failed to load videos: ${err.message}`);
        } else {
          setError('Failed to load videos. Please try again later.');
        }
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [currentPage, pageSize, debouncedSearch, selectedTags, tagFilterMode, dateRange, sortBy]);

  // Event handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTagsChange = (values: string[]) => {
    setSelectedTags(values);
    setCurrentPage(1);
  };
  
  const handleTagFilterModeChange = (value: TagFilterMode) => {    
    setTagFilterMode(value);
    setCurrentPage(1);
  };
  
  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
    setCurrentPage(1);
  };

  const handleSortChange = (e: RadioChangeEvent) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };
  
  const handleClearFilters = () => {
    setSelectedTags([]);
    setTagFilterMode('OR');
    setDateRange(null);
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  }
  
  const handleClearDateRange = () => {
    setDateRange(null);
  }
  
  const handleClearSort = () => {
    setSortBy('newest');
  }
  
  const getSortTitle = (sort: SortOption): string => {
    switch (sort) {
      case 'newest': return 'Newest First';
      case 'oldest': return 'Oldest First';
      case 'title_asc': return 'Title (A-Z)';
      case 'title_desc': return 'Title (Z-A)';
      case 'most_viewed': return 'Most Viewed';
      case 'longest': return 'Longest Duration';
      default: return 'Newest First';
    }
  };

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
      <Card>
        <Row align="middle" gutter={[16, 16]}>
          <Col flex="auto">
            <Title level={2} style={{ margin: 0 }}>Video Dashboard</Title>
          </Col>
          
          <Col>
            <Button 
              type={activeFilters > 0 ? "primary" : "default"}
              icon={<FilterOutlined />}
              onClick={() => setFilterDrawerOpen(true)}
              style={{ marginRight: 8 }}
            >
              Filters {activeFilters > 0 && `(${activeFilters})`}
            </Button>
            
            <Select
              placeholder="Sort by"
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              style={{ width: 150 }}
              suffixIcon={<SortAscendingOutlined />}
            >
              <Option value="newest">Newest First</Option>
              <Option value="oldest">Oldest First</Option>
              <Option value="title_asc">Title (A-Z)</Option>
              <Option value="title_desc">Title (Z-A)</Option>
              <Option value="most_viewed">Most Viewed</Option>
              <Option value="longest">Longest Duration</Option>
            </Select>
          </Col>
        </Row>
        
        <Divider style={{ margin: '16px 0' }} />
        
        <Input 
          placeholder="Search videos by title" 
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={handleSearchChange}
          allowClear
          size="large"
          style={{ marginBottom: 16 }}
        />

        <AppliedFilters
          selectedTags={selectedTags}
          tagFilterMode={tagFilterMode}
          dateRange={dateRange}
          sortBy={sortBy}
          onClearTags={handleClearTags}
          onClearDateRange={handleClearDateRange}
          onClearSort={handleClearSort}
          onClearAll={handleClearFilters}
          getSortTitle={getSortTitle}
        />

        <VideoGrid
          videos={videos}
          loading={loading}
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onClearFilters={handleClearFilters}
        />
      </Card>
      
      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        tags={tags}
        selectedTags={selectedTags}
        tagFilterMode={tagFilterMode}
        dateRange={dateRange}
        sortBy={sortBy}
        activeFilters={activeFilters}
        onTagsChange={handleTagsChange}
        onTagFilterModeChange={handleTagFilterModeChange}
        onDateRangeChange={handleDateRangeChange}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
};

export default Dashboard;