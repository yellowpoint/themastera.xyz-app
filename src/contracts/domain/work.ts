import { z } from 'zod'

// Minimal work shape used across pages/components
export const WorkUserSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  image: z.string().nullable().optional(),
})
export type WorkUser = z.infer<typeof WorkUserSchema>

export const WorkSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  fileUrl: z.string().nullable().optional(),
  durationSeconds: z.number().optional(),
  duration: z.string().nullable().optional(),
  status: z.string().optional(),
  views: z.number().optional(),
  downloads: z.number().optional(),
  createdAt: z.string().optional(),
  language: z.string().nullable().optional(),
  tags: z.string().optional(),
  user: WorkUserSchema.nullable().optional(),
})
export type Work = z.infer<typeof WorkSchema>

// Homepage item and trending item usually share the same structure
export const HomepageItemSchema = WorkSchema
export type HomepageItem = Work

// Filters used by listing pages
export const WorkFiltersSchema = z.object({
  category: z.string().optional(),
  status: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
})
export type WorkFilters = z.infer<typeof WorkFiltersSchema>

// Generic pagination payload
export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number().optional(),
  totalPages: z.number().optional(),
})
export type Pagination = z.infer<typeof PaginationSchema>