import React from 'react';
import { Space, Typography, Tag, Button, Tooltip } from 'antd';
import {
  TagsOutlined,
  CalendarOutlined,
  SortAscendingOutlined,
  ClearOutlined
} from '@ant-design/icons';
import type { TagFilterMode, SortOption } from '../types';
import dayjs from 'dayjs';
import { sortByOptions } from '../utils/formatters';

const { Text } = Typography;

interface AppliedFiltersProps {
  selectedTags: string[];
  tagFilterMode: TagFilterMode;
  dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null;
  sortBy: SortOption;
  onClearTags: () => void;
  onClearDateRange: () => void;
  onClearSort: () => void;
  onClearAll: () => void;
}

const AppliedFilters: React.FC<AppliedFiltersProps> = ({
  selectedTags,
  tagFilterMode,
  dateRange,
  sortBy,
  onClearTags,
  onClearDateRange,
  onClearSort,
  onClearAll,
}) => {
  // Calculate active filters count
  const activeFilters = [
    selectedTags.length > 0,
    dateRange && dateRange[0] && dateRange[1],
    sortBy !== 'newest'
  ].filter(Boolean).length;

  if (activeFilters === 0) return null;

  return (
    <Space wrap style={{ marginBottom: 16 }}>
      <Text strong>Active filters:</Text>

      {selectedTags.length > 0 && (
        <Tag color="blue" closable onClose={onClearTags}>
          <TagsOutlined /> {tagFilterMode === 'AND' ? 'All' : 'Any'} Tags: {selectedTags.length}
        </Tag>
      )}

      {dateRange && dateRange[0] && dateRange[1] && (
        <Tooltip title={`From ${dateRange[0].format('MMM D, YYYY')} to ${dateRange[1].format('MMM D, YYYY')}`}>
          <Tag color="blue" closable onClose={onClearDateRange}>
            <CalendarOutlined /> Date Range
          </Tag>
        </Tooltip>
      )}

      {sortBy !== 'newest' && (
        <Tooltip title={`Sorted by: ${sortByOptions[sortBy]}`}>
          <Tag color="blue" closable onClose={onClearSort}>
            <SortAscendingOutlined /> {sortByOptions[sortBy]}
          </Tag>
        </Tooltip>
      )}

      {activeFilters > 0 && (
        <Button
          size="small"
          icon={<ClearOutlined />}
          onClick={onClearAll}
        >
          Clear All
        </Button>
      )}
    </Space>
  );
};

export default AppliedFilters;