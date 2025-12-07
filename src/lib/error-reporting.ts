import { IS_SENTRY_ENABLED } from '@/config/sentry'
import * as Sentry from '@sentry/nextjs'

const SENSITIVE_KEYS = [
  'password',
  'confirmPassword',
  'token',
  'newPassword',
  'oldPassword',
  'secret',
]

const sanitizeParams = (params: any): any => {
  if (!params) return params
  if (typeof params !== 'object') return params

  if (Array.isArray(params)) {
    return params.map((item) => sanitizeParams(item))
  }

  const sanitized: any = {}
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const lowerKey = key.toLowerCase()
      if (SENSITIVE_KEYS.some((k) => lowerKey.includes(k.toLowerCase()))) {
        sanitized[key] = '[REDACTED]'
      } else if (typeof params[key] === 'object' && params[key] !== null) {
        sanitized[key] = sanitizeParams(params[key])
      } else {
        sanitized[key] = params[key]
      }
    }
  }
  return sanitized
}

export const reportError = (action: string, error: any, params?: any) => {
  const sanitizedParams = params ? sanitizeParams(params) : undefined
  // eslint-disable-next-line no-console
  console.error(
    `Error during ${action}:`,
    error,
    ...(sanitizedParams ? ['Params:', sanitizedParams] : [])
  )
  if (IS_SENTRY_ENABLED) {
    Sentry.captureException(
      error instanceof Error ? error : new Error(JSON.stringify(error)),
      {
        tags: {
          auth_action: action,
        },
        extra: {
          raw_error: error,
          params: sanitizedParams,
        },
      }
    )
  }
}
