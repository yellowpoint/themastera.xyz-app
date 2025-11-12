import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import { createApiResponseSchema, ApiFailureSchema } from '@/contracts/types/common'
import { PlaylistCardSchema } from '@/contracts/domain/playlist'

const c = initContract()

// Response payload schemas (non-paginated list)
const ListPlaylistsDataSchema = z.object({
  items: z.array(PlaylistCardSchema),
})

const CreatePlaylistBodySchema = z.object({ name: z.string().min(1) })
const CreatePlaylistDataSchema = PlaylistCardSchema // aligns with current API returning id, name, items

const AddEntryBodySchema = z.object({ workId: z.string().min(1) })
const AddEntryDataSchema = z.object({ id: z.string() })

const RemoveEntryBodySchema = z.object({ workId: z.string().min(1) })
const RemoveEntryDataSchema = z.object({ removed: z.boolean() })

const DeletePlaylistDataSchema = z.object({ deleted: z.boolean() })

export const playlistsContract = c.router({
  list: {
    method: 'GET',
    path: '/api/playlists',
    responses: {
      200: createApiResponseSchema(ListPlaylistsDataSchema),
      401: ApiFailureSchema,
      403: ApiFailureSchema,
      500: ApiFailureSchema,
    },
  },
  getById: {
    method: 'GET',
    path: '/api/playlists/:id',
    responses: {
      200: createApiResponseSchema(PlaylistCardSchema),
      401: ApiFailureSchema,
      403: ApiFailureSchema,
      404: ApiFailureSchema,
      500: ApiFailureSchema,
    },
  },
  create: {
    method: 'POST',
    path: '/api/playlists',
    body: CreatePlaylistBodySchema,
    responses: {
      201: createApiResponseSchema(CreatePlaylistDataSchema),
      400: ApiFailureSchema,
      401: ApiFailureSchema,
      500: ApiFailureSchema,
    },
  },
  addEntry: {
    method: 'POST',
    path: '/api/playlists/:id/entries',
    body: AddEntryBodySchema,
    responses: {
      201: createApiResponseSchema(AddEntryDataSchema),
      400: ApiFailureSchema,
      401: ApiFailureSchema,
      403: ApiFailureSchema,
      404: ApiFailureSchema,
      500: ApiFailureSchema,
    },
  },
  removeEntry: {
    method: 'DELETE',
    path: '/api/playlists/:id/entries',
    body: RemoveEntryBodySchema,
    responses: {
      200: createApiResponseSchema(RemoveEntryDataSchema),
      400: ApiFailureSchema,
      401: ApiFailureSchema,
      403: ApiFailureSchema,
      404: ApiFailureSchema,
      500: ApiFailureSchema,
    },
  },
  delete: {
    method: 'DELETE',
    path: '/api/playlists/:id',
    responses: {
      200: createApiResponseSchema(DeletePlaylistDataSchema),
      401: ApiFailureSchema,
      403: ApiFailureSchema,
      404: ApiFailureSchema,
      500: ApiFailureSchema,
    },
  },
})

export type PlaylistsContract = typeof playlistsContract