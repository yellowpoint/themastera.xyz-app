import { request } from '@/lib/request'

export async function checkBetaAllowed(
  email: string,
  options: { safe?: boolean } = {}
): Promise<boolean> {
  const { safe = false } = options
  if (!email) return false
  try {
    const { data, ok } = await request.get<{ allowed: boolean }>(
      `/api/beta/check?email=${encodeURIComponent(email)}`,
      {},
      { throwOnError: !safe, showErrorToast: false }
    )
    if (!ok || !data || (data as any).success === false) {
      if (safe) return false
      const msg =
        (data as any)?.error?.message || 'Error verifying beta access.'
      throw new Error(msg)
    }
    return Boolean((data as any)?.data?.allowed)
  } catch (err) {
    if (safe) return false
    throw err
  }
}
