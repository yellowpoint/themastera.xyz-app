'use client'

import { useState } from 'react'
import { 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Tabs,
  Tab,
  Chip,
  Avatar,
  Badge,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  Divider
} from '@heroui/react'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('circles')
  const [selectedCircle, setSelectedCircle] = useState(null)
  const { isOpen: isCircleOpen, onOpen: onCircleOpen, onClose: onCircleClose } = useDisclosure()
  const { isOpen: isPostOpen, onOpen: onPostOpen, onClose: onPostClose } = useDisclosure()
  const [newPost, setNewPost] = useState({ title: '', content: '' })

  // 模拟用户数据
  const userProfile = {
    name: "社区活跃者",
    email: "user@mastera.com",
    avatar: "/api/placeholder/40/40",
    level: "ArtCircle",
    points: 3240
  }

  // 圈子数据
  const circles = [
    {
      id: 1,
      name: "AI艺术创作",
      description: "探索AI在艺术创作中的无限可能",
      members: 15420,
      posts: 2341,
      avatar: "/api/placeholder/60/60",
      isJoined: true,
      category: "艺术",
      tags: ["AI", "艺术", "创作"],
      moderators: ["AI艺术家", "数字创作者"]
    },
    {
      id: 2,
      name: "摄影技巧分享",
      description: "分享摄影技巧，交流拍摄心得",
      members: 8765,
      posts: 1876,
      avatar: "/api/placeholder/60/60",
      isJoined: false,
      category: "摄影",
      tags: ["摄影", "技巧", "分享"],
      moderators: ["光影大师"]
    },
    {
      id: 3,
      name: "音乐制作工坊",
      description: "音乐制作技术交流与作品分享",
      members: 6543,
      posts: 987,
      avatar: "/api/placeholder/60/60",
      isJoined: true,
      category: "音乐",
      tags: ["音乐", "制作", "编曲"],
      moderators: ["节拍制作人", "音乐工程师"]
    }
  ]

  // 直播数据
  const liveStreams = [
    {
      id: 1,
      title: "AI绘画实时创作",
      creator: "数字艺术家",
      viewers: 1234,
      thumbnail: "/api/placeholder/300/200",
      isLive: true,
      category: "艺术创作",
      startTime: "19:00"
    },
    {
      id: 2,
      title: "摄影后期技巧分享",
      creator: "光影大师",
      viewers: 856,
      thumbnail: "/api/placeholder/300/200",
      isLive: true,
      category: "摄影教学",
      startTime: "20:30"
    },
    {
      id: 3,
      title: "音乐制作AMA问答",
      creator: "节拍制作人",
      viewers: 567,
      thumbnail: "/api/placeholder/300/200",
      isLive: false,
      category: "音乐制作",
      startTime: "21:00"
    }
  ]

  // 热门帖子数据
  const hotPosts = [
    {
      id: 1,
      title: "如何用AI创作出令人惊艳的艺术作品？",
      author: "创意探索者",
      circle: "AI艺术创作",
      likes: 234,
      comments: 45,
      views: 1567,
      timeAgo: "2小时前",
      content: "分享一些AI艺术创作的心得和技巧...",
      tags: ["AI", "艺术", "教程"]
    },
    {
      id: 2,
      title: "街头摄影的构图技巧分享",
      author: "街拍达人",
      circle: "摄影技巧分享",
      likes: 189,
      comments: 32,
      views: 892,
      timeAgo: "4小时前",
      content: "在街头摄影中，构图是非常重要的...",
      tags: ["摄影", "构图", "街拍"]
    }
  ]

  const handleJoinCircle = (circleId) => {
    // 模拟加入圈子
    console.log(`加入圈子: ${circleId}`)
  }

  const handleCircleClick = (circle) => {
    setSelectedCircle(circle)
    onCircleOpen()
  }

  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      console.log('创建新帖子:', newPost)
      setNewPost({ title: '', content: '' })
      onPostClose()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation userProfile={userProfile} isLoggedIn={true} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            社区圈子 <span className="text-lime-400">Mastera Circle</span>
          </h1>
          <p className="text-gray-300 text-lg">
            加入兴趣圈子，与志同道合的创作者交流互动
          </p>
        </div>

        {/* 快速操作 */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button 
            color="primary" 
            onPress={onPostOpen}
            startContent={<span>✏️</span>}
          >
            发布新帖
          </Button>
          <Button 
            variant="bordered"
            className="border-lime-400 text-lime-400"
            startContent={<span>📺</span>}
          >
            开始直播
          </Button>
          <Button 
            variant="bordered"
            className="border-gray-600 text-gray-300"
            startContent={<span>🔍</span>}
          >
            发现圈子
          </Button>
        </div>

        {/* 内容标签页 */}
        <Tabs 
          selectedKey={activeTab} 
          onSelectionChange={setActiveTab}
          className="mb-8"
          color="primary"
        >
          <Tab key="circles" title="我的圈子" />
          <Tab key="live" title="直播中" />
          <Tab key="hot" title="热门帖子" />
          <Tab key="following" title="关注动态" />
        </Tabs>

        {/* 圈子列表 */}
        {activeTab === 'circles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {circles.map((circle) => (
              <Card 
                key={circle.id} 
                className="bg-gray-900 border-gray-800 hover:border-lime-400/50 transition-all cursor-pointer"
                isPressable
                onPress={() => handleCircleClick(circle)}
              >
                <CardHeader className="flex gap-3">
                  <Avatar src={circle.avatar} size="lg" />
                  <div className="flex flex-col flex-1">
                    <h3 className="text-lg font-semibold">{circle.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {circle.description}
                    </p>
                  </div>
                  {circle.isJoined && (
                    <Chip color="success" size="sm" variant="flat">
                      已加入
                    </Chip>
                  )}
                </CardHeader>
                <CardBody className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {circle.tags.map((tag, index) => (
                      <Chip key={index} size="sm" variant="flat" color="default">
                        {tag}
                      </Chip>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                    <span>{circle.members.toLocaleString()} 成员</span>
                    <span>{circle.posts} 帖子</span>
                  </div>

                  <Button
                    color={circle.isJoined ? "default" : "primary"}
                    variant={circle.isJoined ? "bordered" : "solid"}
                    size="sm"
                    className="w-full"
                    onPress={(e) => {
                      e.stopPropagation()
                      handleJoinCircle(circle.id)
                    }}
                  >
                    {circle.isJoined ? "已加入" : "加入圈子"}
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* 直播列表 */}
        {activeTab === 'live' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveStreams.map((stream) => (
              <Card 
                key={stream.id} 
                className="bg-gray-900 border-gray-800 hover:border-lime-400/50 transition-all cursor-pointer"
                isPressable
              >
                <CardHeader className="p-0">
                  <div className="relative w-full h-48">
                    <img 
                      src={stream.thumbnail} 
                      alt={stream.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    {stream.isLive && (
                      <div className="absolute top-2 left-2">
                        <Badge content="LIVE" color="danger" variant="solid">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        </Badge>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-sm">
                      👥 {stream.viewers}
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {stream.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar size="sm" />
                    <span className="text-gray-400 text-sm">{stream.creator}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <Chip size="sm" variant="flat" color="primary">
                      {stream.category}
                    </Chip>
                    <span className="text-sm text-gray-400">
                      {stream.isLive ? "直播中" : stream.startTime}
                    </span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* 热门帖子 */}
        {activeTab === 'hot' && (
          <div className="space-y-6">
            {hotPosts.map((post) => (
              <Card 
                key={post.id} 
                className="bg-gray-900 border-gray-800 hover:border-lime-400/50 transition-all cursor-pointer"
                isPressable
              >
                <CardBody className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar size="md" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{post.author}</span>
                        <span className="text-gray-400 text-sm">发布在</span>
                        <Chip size="sm" variant="flat" color="primary">
                          {post.circle}
                        </Chip>
                        <span className="text-gray-400 text-sm">{post.timeAgo}</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                      
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {post.content}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <Chip key={index} size="sm" variant="flat" color="default">
                            #{tag}
                          </Chip>
                        ))}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <button className="flex items-center gap-1 hover:text-lime-400">
                          <span>👍</span>
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-lime-400">
                          <span>💬</span>
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-lime-400">
                          <span>👁️</span>
                          <span>{post.views}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-lime-400">
                          <span>🔗</span>
                          <span>分享</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* 关注动态 */}
        {activeTab === 'following' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">关注更多创作者</h3>
            <p className="text-gray-400 mb-6">关注感兴趣的创作者，获取最新动态</p>
            <Button color="primary">发现创作者</Button>
          </div>
        )}
      </main>

      <Footer />

      {/* 圈子详情模态框 */}
      <Modal 
        isOpen={isCircleOpen} 
        onClose={onCircleClose}
        size="2xl"
        className="bg-gray-900 text-white"
      >
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-3">
              <Avatar src={selectedCircle?.avatar} size="lg" />
              <div>
                <h2 className="text-xl font-bold">{selectedCircle?.name}</h2>
                <p className="text-sm text-gray-400">{selectedCircle?.category}</p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedCircle && (
              <div className="space-y-4">
                <p className="text-gray-300">{selectedCircle.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {selectedCircle.tags.map((tag, index) => (
                    <Chip key={index} size="sm" variant="flat" color="primary">
                      {tag}
                    </Chip>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">成员数量：</span>
                    <span>{selectedCircle.members.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">帖子数量：</span>
                    <span>{selectedCircle.posts}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">圈子管理员</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCircle.moderators.map((mod, index) => (
                      <Chip key={index} size="sm" variant="flat" color="warning">
                        {mod}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCircleClose}>
              关闭
            </Button>
            <Button 
              color="primary"
              onPress={() => {
                handleJoinCircle(selectedCircle?.id)
                onCircleClose()
              }}
            >
              {selectedCircle?.isJoined ? "已加入" : "加入圈子"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 发布帖子模态框 */}
      <Modal 
        isOpen={isPostOpen} 
        onClose={onPostClose}
        size="2xl"
        className="bg-gray-900 text-white"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">发布新帖</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="帖子标题"
                placeholder="输入帖子标题..."
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              />
              <Textarea
                label="帖子内容"
                placeholder="分享你的想法..."
                minRows={6}
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onPostClose}>
              取消
            </Button>
            <Button 
              color="primary"
              onPress={handleCreatePost}
              isDisabled={!newPost.title || !newPost.content}
            >
              发布帖子
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}