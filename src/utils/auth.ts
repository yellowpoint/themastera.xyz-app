export const generateVerifyEmailCallbackURL = (
  email: string,
  baseURL: string | null = null
): string => {
  const origin = baseURL || (typeof window !== 'undefined' ? window.location.origin : '')
  const encodedEmail = encodeURIComponent(encodeURIComponent(email))
  return `${origin}/auth/verify-email/${encodedEmail}`
}