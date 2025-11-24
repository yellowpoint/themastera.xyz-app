// Default cover images for user profiles (picsum.photos)
export const DEFAULT_COVER_IMAGES: string[] = [
  'https://picsum.photos/id/1015/1200/360',
  'https://picsum.photos/id/1016/1200/360',
  'https://picsum.photos/id/1024/1200/360',
  'https://picsum.photos/id/1035/1200/360',
  'https://picsum.photos/id/1043/1200/360',
  'https://picsum.photos/id/1056/1200/360',
  'https://picsum.photos/id/1069/1200/360',
  'https://picsum.photos/id/1074/1200/360',
  'https://picsum.photos/id/1084/1200/360',
  'https://picsum.photos/id/109/1200/360',
]

export function getDefaultCoverForUser(userId?: string | null): string {
  const covers = DEFAULT_COVER_IMAGES
  if (!userId) return covers[Math.floor(Math.random() * covers.length)]
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0
  }
  const idx = hash % covers.length
  return covers[idx]
}

export function resolveUserCover(coverImage: string | null | undefined, userId?: string | null): string {
  return coverImage || getDefaultCoverForUser(userId)
}
