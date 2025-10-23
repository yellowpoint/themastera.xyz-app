import { createClient } from '@supabase/supabase-js'

// 创建Supabase客户端实例
// 注意：这些环境变量需要在.env.local文件中设置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 如果环境变量未设置，给出警告
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your environment variables.')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

// 获取存储桶URL
export const getStorageUrl = (bucket, path) => {
  if (!supabaseUrl) return ''
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

export default supabase