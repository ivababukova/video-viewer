import { z } from 'zod';
import { sortByOptions } from '../utils/formatters';

// Video search parameter validation
export const videoSearchParamsSchema = z.object({
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  tagFilterMode: z.enum(['OR', 'AND']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sortBy: z.enum(Object.keys(sortByOptions) as [string, ...string[]]).optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
});

export type VideoSearchParams = z.infer<typeof videoSearchParamsSchema>;

// Date range validation
export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
}).refine(
  (data) => {
    if (!data.startDate || !data.endDate) return true;
    return new Date(data.startDate) <= new Date(data.endDate);
  },
  {
    message: 'End date must be after or equal to start date',
    path: ['endDate'],
  }
);

export const validateVideoSearchParams = (params: any) => {
  return videoSearchParamsSchema.safeParse(params);
};

export const validateDateRange = (range: any) => {
  return dateRangeSchema.safeParse(range);
};
