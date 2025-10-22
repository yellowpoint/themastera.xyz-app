-- Supabase Storage RLS 策略配置
-- 这些 SQL 语句需要在 Supabase Dashboard 的 SQL Editor 中执行

-- 1. 为 storage.objects 表启用 RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. 为 storage.buckets 表启用 RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- 3. 允许认证用户查看所有存储桶
CREATE POLICY "Allow authenticated users to view buckets" ON storage.buckets
FOR SELECT TO authenticated
USING (true);

-- 4. 允许认证用户上传文件到 works 存储桶
CREATE POLICY "Allow authenticated users to upload to works bucket" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'works' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 5. 允许用户查看自己上传的文件
CREATE POLICY "Allow users to view their own files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'works' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 6. 允许用户更新自己上传的文件
CREATE POLICY "Allow users to update their own files" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'works' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 7. 允许用户删除自己上传的文件
CREATE POLICY "Allow users to delete their own files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'works' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 8. 允许公开访问 works 存储桶中的文件（用于显示）
CREATE POLICY "Allow public access to works files" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'works');

-- 注意：
-- 1. 这些策略假设文件路径的第一部分是用户ID
-- 2. 如果需要更严格的权限控制，可以调整策略条件
-- 3. 确保在 Supabase Dashboard 中创建了 'works' 存储桶
-- 4. 存储桶应该设置为公开访问以允许文件下载