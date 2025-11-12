import { z } from 'zod'

// Minimal item shape used by current API responses
export const PlaylistItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  thumbnail: z.string().nullable(),
})
export type PlaylistItem = z.infer<typeof PlaylistItemSchema>

export const PlaylistCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  items: z.array(PlaylistItemSchema),
})
export type PlaylistCard = z.infer<typeof PlaylistCardSchema>

// Raw models (optional – useful for detailed pages)
export const PlaylistSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
})
export type Playlist = z.infer<typeof PlaylistSchema>

export const PlaylistEntrySchema = z.object({
  id: z.string(),
  playlistId: z.string(),
  workId: z.string(),
  createdAt: z.date(),
})
export type PlaylistEntry = z.infer<typeof PlaylistEntrySchema>