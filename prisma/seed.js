import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 创建测试用户
  const user1 = await prisma.user.upsert({
    where: { email: 'creator@example.com' },
    update: {},
    create: {
      id: 'user-1',
      name: '创意大师',
      email: 'creator@example.com',
      image: '/api/placeholder/100/100',
      isCreator: true,
      level: 'Creator',
      points: 1500
    }
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      id: 'user-2',
      name: '普通用户',
      email: 'user@example.com',
      image: '/api/placeholder/100/100',
      isCreator: false,
      level: 'User',
      points: 500
    }
  })

  // 创建测试作品
  const work1 = await prisma.work.upsert({
    where: { id: 'work-1' },
    update: {},
    create: {
      id: 'work-1',
      title: 'AI艺术创作教程',
      description: '这是一个详细的AI艺术创作教程，包含了从基础到高级的所有技巧。学习如何使用最新的AI工具创作令人惊艳的艺术作品。',
      price: 99.99,
      category: '教程',
      tags: 'AI,艺术,教程,创作',
      thumbnailUrl: '/api/placeholder/400/300',
      fileUrl: '/test-video.mp4',
      status: 'published',
      downloads: 1234,
      rating: 4.8,
      earnings: 12345.67,
      userId: user1.id
    }
  })

  const work2 = await prisma.work.upsert({
    where: { id: 'work-2' },
    update: {},
    create: {
      id: 'work-2',
      title: '摄影后期处理素材包',
      description: '专业摄影师精心制作的后期处理素材包，包含各种滤镜、预设和调色方案。',
      price: 49.99,
      category: '素材',
      tags: '摄影,后期,滤镜,预设',
      thumbnailUrl: '/api/placeholder/400/300',
      fileUrl: '/files/photo-editing-pack.zip',
      status: 'published',
      downloads: 856,
      rating: 4.6,
      earnings: 4280.44,
      userId: user1.id
    }
  })

  const work3 = await prisma.work.upsert({
    where: { id: 'work-3' },
    update: {},
    create: {
      id: 'work-3',
      title: '音乐制作完整课程',
      description: '从零开始学习音乐制作，包含编曲、混音、母带处理等全套流程。',
      price: 199.99,
      category: '课程',
      tags: '音乐,制作,编曲,混音',
      thumbnailUrl: '/api/placeholder/400/300',
      fileUrl: '/files/music-production-course.zip',
      status: 'published',
      downloads: 567,
      rating: 4.9,
      earnings: 11339.43,
      userId: user1.id
    }
  })

  // 创建评论
  await prisma.review.upsert({
    where: { id: 'review-1' },
    update: {},
    create: {
      id: 'review-1',
      rating: 5,
      comment: '非常棒的教程！学到了很多实用的技巧。',
      userId: user2.id,
      workId: work1.id
    }
  })

  await prisma.review.upsert({
    where: { id: 'review-2' },
    update: {},
    create: {
      id: 'review-2',
      rating: 4,
      comment: '内容很丰富，但有些部分可以更详细一些。',
      userId: user2.id,
      workId: work2.id
    }
  })

  await prisma.review.upsert({
    where: { id: 'review-3' },
    update: {},
    create: {
      id: 'review-3',
      rating: 5,
      comment: '音质很棒，制作很专业！',
      userId: user2.id,
      workId: work3.id
    }
  })

  console.log('数据库种子数据创建完成！')
  console.log('创建的用户:', { user1: user1.name, user2: user2.name })
  console.log('创建的作品:', { work1: work1.title, work2: work2.title, work3: work3.title })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })