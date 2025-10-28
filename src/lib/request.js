'use client'
import { toast } from 'sonner'
/**
 * 统一请求封装：集中处理错误、状态码与提示
 *
 * 用法示例：
 * const { data } = await request('/api/works?limit=20')
 * data 为接口返回的 JSON（通常包含 success、data、error 等字段）
 */
export async function request(
  url,
  fetchOptions = {},
  options = {}
) {
  const {
    showErrorToast = true, // 发生错误时是否弹出错误提示
    throwOnError = true,   // 发生错误时是否抛出异常；为 false 时返回 { ok:false, error }
    parseJson = true       // 是否尝试解析 JSON 响应
  } = options

  const {
    method = 'GET',
    headers = {},
    body,
    ...rest
  } = fetchOptions

  const isJsonBody = body && typeof body !== 'string'

  const finalHeaders = {
    Accept: 'application/json',
    ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  }

  const finalOptions = {
    method,
    headers: finalHeaders,
    credentials: 'include', // 保证同源请求携带 Cookie（适配基于 Cookie 的认证）
    ...(body ? { body: isJsonBody ? JSON.stringify(body) : body } : {}),
    ...rest,
  }

  try {
    const res = await fetch(url, finalOptions)

    let data = null
    if (parseJson) {
      try {
        data = await res.json()
      } catch (_) {
        data = null
      }
    }

    const isAppError = data && data.success === false
    if (!res.ok || isAppError) {
      const msg = extractErrorMessage(res, data)
      if (throwOnError) {
        const error = new Error(msg)
        error.status = res.status
        error.data = data
        throw error
      }
      return { ok: false, status: res.status, data, error: msg }
    }

    return { ok: true, status: res.status, data: data }
  } catch (err) {
    const msg = err?.message || 'Network error, please try again later'
    if (showErrorToast && typeof window !== 'undefined') {
      toast.error(msg)
    }
    if (throwOnError) throw err
    return { ok: false, status: 0, data: null, error: msg }
  }
}

function extractErrorMessage(res, data) {
  if (data?.error) return data?.message ?? data.error
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
  get: (url, opts = {}, extra = {}) => request(url, { ...opts, method: 'GET' }, extra),
  post: (url, body, opts = {}, extra = {}) => request(url, { ...opts, method: 'POST', body }, extra),
  put: (url, body, opts = {}, extra = {}) => request(url, { ...opts, method: 'PUT', body }, extra),
  patch: (url, body, opts = {}, extra = {}) => request(url, { ...opts, method: 'PATCH', body }, extra),
  delete: (url, opts = {}, extra = {}) => request(url, { ...opts, method: 'DELETE' }, extra),
}

request.get = api.get
request.post = api.post
request.put = api.put
request.patch = api.patch
request.delete = api.delete