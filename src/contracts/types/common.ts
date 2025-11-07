import { z } from 'zod'

// Error code enum suggestion – keep as string union for flexibility
export const ErrorCodeSchema = z.enum([
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'VALIDATION_FAILED',
  'CONFLICT',
  'INTERNAL_ERROR',
])
export type ErrorCode = z.infer<typeof ErrorCodeSchema>

export const ApiErrorSchema = z.object({
  code: ErrorCodeSchema,
  message: z.string(),
  details: z.any().optional(),
})
export type ApiError = z.infer<typeof ApiErrorSchema>

export function createApiSuccessSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
    error: z.null(),
  })
}

export const ApiFailureSchema = z.object({
  success: z.literal(false),
  data: z.null(),
  error: ApiErrorSchema,
})

export function createApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.union([createApiSuccessSchema(dataSchema), ApiFailureSchema])
}

export type ApiSuccess<T> = {
  success: true
  data: T
  error: null
}

export type ApiFailure = {
  success: false
  data: null
  error: ApiError
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

export function apiSuccess<T>(data: T): ApiSuccess<T> {
  return { success: true, data, error: null }
}

export function apiFailure(code: ErrorCode, message: string, details?: any): ApiFailure {
  return { success: false, data: null, error: { code, message, details } }
}