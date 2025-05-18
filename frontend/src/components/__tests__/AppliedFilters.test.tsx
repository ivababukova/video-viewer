import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import AppliedFilters from "../AppliedFilters";
import dayjs from 'dayjs';

describe('AppliedFilters', () => {
  const defaultProps = {
    selectedTags: [],
    tagFilterMode: 'OR' as const,
    dateRange: null,
    sortBy: 'newest' as const,
    onClearTags: vi.fn(),
    onClearDateRange: vi.fn(),
    onClearSort: vi.fn(),
    onClearAll: vi.fn(),
    getSortTitle: (sort: string) => sort,
  };
  
  test('renders nothing when no filters are active', () => {
    const { container } = render(<AppliedFilters {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });
  
  test('renders selected tags', () => {
    render(
      <AppliedFilters 
        {...defaultProps} 
        selectedTags={['react', 'testing']}
      />
    );
    
    expect(screen.getByText(/Tags/)).toBeInTheDocument();
    expect(screen.getByText((_, element) => {
  if (!element) return false;
  const text = element.textContent || '';
  return text.includes('2') && element.className.includes('ant-tag');
})).toBeInTheDocument();
  });
  
  test('renders date range tag', () => {
    const dateRange: [dayjs.Dayjs, dayjs.Dayjs] = [
      dayjs('2023-01-01'),
      dayjs('2023-01-31')
    ];
    
    render(
      <AppliedFilters 
        {...defaultProps} 
        dateRange={dateRange} 
      />
    );
    
    expect(screen.getByText('Date Range')).toBeInTheDocument();
  });
  
  test('renders sort tag when non-default sort is selected', () => {
    render(
      <AppliedFilters 
        {...defaultProps} 
        sortBy="title_asc" 
        getSortTitle={() => 'Title (A-Z)'}
      />
    );
    
    expect(screen.getByText('Title (A-Z)')).toBeInTheDocument();
  });
  
  test('calls onClearTags when tag close button is clicked', () => {
    const onClearTags = vi.fn();
    
    render(
      <AppliedFilters 
        {...defaultProps} 
        selectedTags={['react', 'testing']} 
        onClearTags={onClearTags}
      />
    );
    
    const tagElement = screen.getByText((_, element) => {
      if (!element) return false;
      const text = element.textContent || '';
      return text.includes('Tags') && element.className.includes('ant-tag');
    });
    const closeButton = tagElement.querySelector('.ant-tag-close-icon') as HTMLElement;
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    
    expect(onClearTags).toHaveBeenCalled();
  });
  
  test('calls onClearAll when clear all button is clicked', () => {
    const onClearAll = vi.fn();
    
    render(
      <AppliedFilters 
        {...defaultProps} 
        selectedTags={['react']} 
        sortBy="title_asc" 
        onClearAll={onClearAll}
      />
    );
    
    const clearAllButton = screen.getByText('Clear All');
    fireEvent.click(clearAllButton);
    
    expect(onClearAll).toHaveBeenCalled();
  });
});