

// src/components/FilterDrawer.tsx
import React from 'react';
import { 
  SortAscendingOutlined, 
  CalendarOutlined,
  TagsOutlined,
  ClearOutlined,
  MenuOutlined,
  SortDescendingOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  DisconnectOutlined
} from '@ant-design/icons';
import { Segmented, DatePicker, Select, Typography, Drawer, Button, Radio, Space } from 'antd';
import type { RadioChangeEvent } from 'antd';

import type { SortOption, TagFilterMode } from '../types';
import dayjs from 'dayjs';


const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Option } = Select;


interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  tags: string[];
  selectedTags: string[];
  tagFilterMode: TagFilterMode;
  dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null;
  sortBy: SortOption;
  activeFilters: number;
  onTagsChange: (tags: string[]) => void;
  onTagFilterModeChange: (mode: TagFilterMode) => void;
  onDateRangeChange: (dates: any) => void;
  onSortChange: (e: RadioChangeEvent) => void;
  onClearFilters: () => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  open,
  onClose,
  tags,
  selectedTags,
  tagFilterMode,
  dateRange,
  sortBy,
  activeFilters,
  onTagsChange,
  onTagFilterModeChange,
  onDateRangeChange,
  onSortChange,
  onClearFilters
}) => {

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
            onChange={(value) => onTagFilterModeChange(value as TagFilterMode)}
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
    <Drawer
      title="Filter Videos"
      placement="right"
      onClose={onClose}
      open={open}
      width={320}
      extra={
        <Button 
          type="text" 
          icon={<ClearOutlined />} 
          onClick={onClearFilters}
          disabled={activeFilters === 0}
        >
          Clear
        </Button>
      }
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} type="primary">
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
            onChange={onTagsChange}
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
            onChange={onDateRangeChange}
            value={dateRange}
            allowClear
          />
        </div>
        
        <div>
          <Title level={5}>
            <SortAscendingOutlined /> Sort By
          </Title>
          <Radio.Group onChange={onSortChange} value={sortBy}>
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
  );
};

export default FilterDrawer;