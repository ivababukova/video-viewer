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
  Pagination,
  Card,
  DatePicker,
  Space,
  Button,
  Drawer,
  Radio,
  Divider,
  Tag,
  Tooltip,
  Switch,
  Segmented
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  SortAscendingOutlined, 
  CalendarOutlined,
  TagsOutlined,
  ClearOutlined,
  DownOutlined,
  MenuOutlined,
  SortDescendingOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  DisconnectOutlined
} from '@ant-design/icons';
import { getVideos } from '../services/api';
import VideoCard from '../components/VideoCard';
import type { Video, SortOption, VideoQueryParams, TagFilterMode } from '../types';
import type { RadioChangeEvent } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
    console.log("***** tag filter mode: ", value, selectedTags);
    
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
  
  // Render filter badges/tags for active filters
  const renderActiveFilterTags = () => {
    if (activeFilters === 0) return null;
    
    return (
      <Space wrap style={{ marginBottom: 16 }}>
        <Text strong>Active filters:</Text>
        
        {selectedTags.length > 0 && (
          <Tag color="blue" closable onClose={() => setSelectedTags([])}>
            <TagsOutlined /> {tagFilterMode === 'AND' ? 'An' : 'Any Tag'}: {selectedTags.length}
          </Tag>
        )}
        
        {dateRange && dateRange[0] && dateRange[1] && (
          <Tooltip title={`From ${dateRange[0].format('MMM D, YYYY')} to ${dateRange[1].format('MMM D, YYYY')}`}>
            <Tag color="blue" closable onClose={() => setDateRange(null)}>
              <CalendarOutlined /> Date Range
            </Tag>
          </Tooltip>
        )}
        
        {sortBy !== 'newest' && (
          <Tooltip title={`Sorted by: ${getSortTitle(sortBy)}`}>
            <Tag color="blue" closable onClose={() => setSortBy('newest')}>
              <SortAscendingOutlined /> {getSortTitle(sortBy)}
            </Tag>
          </Tooltip>
        )}
        
        {activeFilters > 0 && (
          <Button 
            size="small" 
            icon={<ClearOutlined />} 
            onClick={handleClearFilters}
          >
            Clear All
          </Button>
        )}
      </Space>
    );
  };

  
  // Helper function to get sort option display name
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

  const renderTagDropdownHeader = () => {
    // This will be rendered in the dropdown
    return (
      <div style={{ 
        padding: '8px 12px', 
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        background: 'white',
        zIndex: 10
      }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>Match type:</Text>
          <Segmented
            options={[
              {
                value: 'OR',
                icon: <DisconnectOutlined />,
                label: 'Any Tag',
              },
              {
                value: 'AND',
                icon: <LinkOutlined />,
                label: 'All Tags',
              },
            ]}
            value={tagFilterMode}
            onChange={(value) => handleTagFilterModeChange(value as TagFilterMode)}
            block
            size="small"
          />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {tagFilterMode === 'AND' 
              ? 'Videos must have ALL selected tags' 
              : 'Videos can have ANY of the selected tags'}
          </Text>
        </Space>
      </div>
    );
  };

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
              dropdownMatchSelectWidth={false}
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
        
        {renderActiveFilterTags()}
        
        {/* Videos Grid with Loading Indicator */}
        {loading ? (
          <div style={{ textAlign: 'center', margin: '60px 0' }}>
            <Spin size="large" tip="Loading videos..." />
          </div>
        ) : videos.length === 0 ? (
          <Empty 
            description={
              <span>
                No videos found. Try adjusting your search or filters.
                <br />
                <Button type="link" onClick={handleClearFilters}>
                  Clear all filters
                </Button>
              </span>
            } 
            style={{ margin: '60px 0' }}
          />
        ) : (
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
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={['12', '24', '36', '48']}
                showTotal={(total) => `Total ${total} videos`}
              />
            </Row>
          </>
        )}
      </Card>
      
      {/* Filters Drawer */}
      <Drawer
        title="Filter Videos"
        placement="right"
        onClose={() => setFilterDrawerOpen(false)}
        open={filterDrawerOpen}
        width={320}
        extra={
          <Button 
            type="text" 
            icon={<ClearOutlined />} 
            onClick={handleClearFilters}
            disabled={activeFilters === 0}
          >
            Clear
          </Button>
        }
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setFilterDrawerOpen(false)} type="primary">
              Apply Filters
            </Button>
          </div>
        }
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={5}>
            <TagsOutlined /> Tags
          </Title>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%', marginBottom: 8 }}
            placeholder="Select tags"
            value={selectedTags}
            onChange={handleTagsChange}
            maxTagCount="responsive"
            popupRender={(menu) => (
              <>
                {renderTagDropdownHeader()}
                {menu}
              </>
            )}
          >
            {tags.map(tag => (
              <Option key={tag} value={tag}>{tag}</Option>
            ))}
          </Select>
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <Title level={5}>
            <CalendarOutlined /> Date Range
          </Title>
          <RangePicker 
            style={{ width: '100%' }} 
            onChange={handleDateRangeChange}
            value={dateRange}
            allowClear
          />
        </div>
        
        <div>
          <Title level={5}>
            <SortAscendingOutlined /> Sort By
          </Title>
          <Radio.Group onChange={handleSortChange} value={sortBy}>
            <Space direction="vertical">
              <Radio value="newest">
                <SortDescendingOutlined /> Newest First
              </Radio>
              <Radio value="oldest">
                <SortAscendingOutlined /> Oldest First
              </Radio>
              <Radio value="title_asc">
                <SortAscendingOutlined /> Title (A-Z)
              </Radio>
              <Radio value="title_desc">
                <SortDescendingOutlined /> Title (Z-A)
              </Radio>
              <Radio value="most_viewed">
                <MenuOutlined /> Most Viewed
              </Radio>
              <Radio value="longest">
                <ClockCircleOutlined /> Longest Duration
              </Radio>
            </Space>
          </Radio.Group>
        </div>
      </Drawer>
    </div>
  );
};

export default Dashboard;