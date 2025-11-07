'use client'
import { toast } from 'sonner'
import type { ApiResponse } from '@/contracts/types/common'

export type RequestExtraOptions = {
  showErrorToast?: boolean
  throwOnError?: boolean
  parseJson?: boolean
}

export type RequestResult<T> = {
  ok: boolean
  status: number
  data: ApiResponse<T> | null
  error?: string
}

async function baseRequest<T = any>(
  url: string,
  fetchOptions: RequestInit & { body?: any } = {},
  options: RequestExtraOptions = {}
): Promise<RequestResult<T>> {
  const {
    showErrorToast = true,
    throwOnError = true,
    parseJson = true,
  } = options

  const {
    method = 'GET',
    headers = {},
    body,
    ...rest
  } = fetchOptions

  const isJsonBody = body && typeof body !== 'string'

  const finalHeaders: HeadersInit = {
    Accept: 'application/json',
    ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  }

  const finalOptions: RequestInit = {
    method,
    headers: finalHeaders,
    credentials: 'include',
    ...(body ? { body: isJsonBody ? JSON.stringify(body) : (body as any) } : {}),
    ...rest,
  }

  try {
    const res = await fetch(url, finalOptions)

    let data: ApiResponse<T> | null = null
    if (parseJson) {
      try {
        data = (await res.json()) as ApiResponse<T>
      } catch {
        data = null
      }
    }

    const isAppError = data && data.success === false
    if (!res.ok || isAppError) {
      const msg = extractErrorMessage(res, data)
      if (throwOnError) {
        const error: any = new Error(msg)
        error.status = res.status
        error.data = data
        throw error
      }
      return { ok: false, status: res.status, data, error: msg }
    }

    return { ok: true, status: res.status, data }
  } catch (err: any) {
    const msg = err?.message || 'Network error, please try again later'
    if (showErrorToast && typeof window !== 'undefined') {
      toast.error(msg)
    }
    if (throwOnError) throw err
    return { ok: false, status: 0, data: null, error: msg }
  }
}

function extractErrorMessage<T>(res: Response, data: ApiResponse<T> | null) {
  const appMsg = (data as any)?.error?.message
  if (appMsg) return appMsg
  const status = res?.status
  switch (status) {
    case 400: return 'Invalid request parameters'
    case 401: return 'Unauthorized or session expired'
    case 403: return 'Forbidden: insufficient permissions'
    case 404: return 'Resource not found'
    case 429: return 'Too many requests, please try again later'
    case 500:
    case 502:
    case 503:
      return 'Server error, please try again later'
    default:
      return 'Request failed, please try again later'
  }
}

export const api = {
  get: <T = any>(url: string, opts: RequestInit = {}, extra: RequestExtraOptions = {}) => baseRequest<T>(url, { ...opts, method: 'GET' }, extra),
  post: <T = any>(url: string, body?: any, opts: RequestInit = {}, extra: RequestExtraOptions = {}) => baseRequest<T>(url, { ...opts, method: 'POST', body }, extra),
  put: <T = any>(url: string, body?: any, opts: RequestInit = {}, extra: RequestExtraOptions = {}) => baseRequest<T>(url, { ...opts, method: 'PUT', body }, extra),
  patch: <T = any>(url: string, body?: any, opts: RequestInit = {}, extra: RequestExtraOptions = {}) => baseRequest<T>(url, { ...opts, method: 'PATCH', body }, extra),
  delete: <T = any>(url: string, body?: any, opts: RequestInit = {}, extra: RequestExtraOptions = {}) => baseRequest<T>(url, { ...opts, method: 'DELETE', body }, extra),
}

// Export a typed request with shorthand methods for better TS compatibility
type RequestFunction = typeof baseRequest
type RequestWithShorthands = RequestFunction & {
  get: typeof api.get
  post: typeof api.post
  put: typeof api.put
  patch: typeof api.patch
  delete: typeof api.delete
}

const requestWithShorthands = Object.assign(baseRequest, {
  get: api.get,
  post: api.post,
  put: api.put,
  patch: api.patch,
  delete: api.delete,
}) as RequestWithShorthands

export { requestWithShorthands as request }