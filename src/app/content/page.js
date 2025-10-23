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
  Select,
  SelectItem
} from '@heroui/react'
import { Search, Star } from 'lucide-react'
export default function ContentPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { isOpen: isContentOpen, onOpen: onContentOpen, onClose: onContentClose } = useDisclosure()
  const [selectedContent, setSelectedContent] = useState(null)

  // 模拟用户数据
  const userProfile = {
    name: "创意探索者",
    email: "user@mastera.com",
    avatar: "/api/placeholder/40/40",
    level: "Creator+",
    points: 2580,
    downloadTickets: 15
  }

  // 内容数据
  const contentData = {
    visual: [
      {
        id: 1,
        title: "AI艺术创作合集",
        creator: "数字艺术家",
        type: "图像包",
        price: 50,
        downloads: 1234,
        rating: 4.8,
        thumbnail: "/api/placeholder/300/200",
        requiredLevel: "Free",
        tags: ["AI艺术", "创意", "数字绘画"]
      },
      {
        id: 2,
        title: "摄影后期预设包",
        creator: "光影大师",
        type: "预设包",
        price: 80,
        downloads: 856,
        rating: 4.9,
        thumbnail: "/api/placeholder/300/200",
        requiredLevel: "Creator+",
        tags: ["摄影", "后期", "预设"]
      }
    ],
    audio: [
      {
        id: 3,
        title: "Lo-Fi音乐制作包",
        creator: "节拍制作人",
        type: "音频包",
        price: 120,
        downloads: 567,
        rating: 4.7,
        thumbnail: "/api/placeholder/300/200",
        requiredLevel: "ArtCircle",
        tags: ["Lo-Fi", "音乐", "制作"]
      }
    ],
    premium: [
      {
        id: 4,
        title: "专业UI设计系统",
        creator: "设计工作室",
        type: "设计系统",
        price: 200,
        downloads: 234,
        rating: 5.0,
        thumbnail: "/api/placeholder/300/200",
        requiredLevel: "VIP",
        tags: ["UI设计", "系统", "专业"]
      }
    ]
  }

  const categories = [
    { key: 'all', label: '全部内容' },
    { key: 'visual', label: '视觉内容' },
    { key: 'audio', label: '音频流媒体' },
    { key: 'premium', label: '付费内容包' }
  ]

  const getAllContent = () => {
    if (activeTab === 'all') {
      return [...contentData.visual, ...contentData.audio, ...contentData.premium]
    }
    return contentData[activeTab] || []
  }

  const filteredContent = getAllContent().filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getLevelColor = (level) => {
    const colors = {
      'Free': 'default',
      'Creator+': 'primary',
      'ArtCircle': 'secondary',
      'VIP': 'warning'
    }
    return colors[level] || 'default'
  }

  const canAccess = (requiredLevel) => {
    const levels = ['Free', 'Creator+', 'ArtCircle', 'VIP']
    const userLevelIndex = levels.indexOf(userProfile.level)
    const requiredLevelIndex = levels.indexOf(requiredLevel)
    return userLevelIndex >= requiredLevelIndex
  }

  const handleContentClick = (content) => {
    setSelectedContent(content)
    onContentOpen()
  }

  const handleDownload = (content) => {
    if (canAccess(content.requiredLevel)) {
      if (userProfile.downloadTickets > 0) {
        alert(`开始下载: ${content.title}`)
      } else {
        alert('下载券不足，请前往积分商城兑换')
      }
    } else {
      alert(`需要 ${content.requiredLevel} 等级才能访问此内容`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            内容中心 <span className="text-lime-400">Content Hub</span>
          </h1>
          <p className="text-gray-300 text-lg">
            发现和下载高质量的创意内容，支持多种格式和会员等级访问
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="搜索内容、创作者或标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            startContent={<Search size={16} className="text-gray-400" />}
          />
          <Select
            placeholder="选择分类"
            selectedKeys={[selectedCategory]}
            onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0])}
            className="w-full md:w-48"
          >
            {categories.map((category) => (
              <SelectItem key={category.key} value={category.key}>
                {category.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* 内容标签页 */}
        <Tabs 
          selectedKey={activeTab} 
          onSelectionChange={setActiveTab}
          className="mb-8"
          color="primary"
        >
          <Tab key="all" title="全部内容" />
          <Tab key="visual" title="视觉内容" />
          <Tab key="audio" title="音频流媒体" />
          <Tab key="premium" title="付费内容包" />
        </Tabs>

        {/* 内容网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((content) => (
            <Card 
              key={content.id} 
              className="bg-gray-900 border-gray-800 hover:border-lime-400/50 transition-all cursor-pointer"
              isPressable
              onPress={() => handleContentClick(content)}
            >
              <CardHeader className="p-0">
                <div className="relative w-full h-48">
                  <img 
                    src={content.thumbnail} 
                    alt={content.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <Chip 
                      color={getLevelColor(content.requiredLevel)}
                      size="sm"
                      variant="flat"
                    >
                      {content.requiredLevel}
                    </Chip>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Chip color="default" size="sm" variant="solid">
                      {content.type}
                    </Chip>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {content.title}
                  </h3>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={16} className="text-yellow-400" />
                    <span className="text-sm">{content.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Avatar size="sm" />
                  <span className="text-gray-400 text-sm">{content.creator}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {content.tags.map((tag, index) => (
                    <Chip key={index} size="sm" variant="flat" color="default">
                      {tag}
                    </Chip>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    {content.downloads} 下载
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lime-400 font-semibold">
                      {content.price} 积分
                    </span>
                    <Button
                      size="sm"
                      color={canAccess(content.requiredLevel) ? "primary" : "default"}
                      variant={canAccess(content.requiredLevel) ? "solid" : "bordered"}
                      isDisabled={!canAccess(content.requiredLevel)}
                      onPress={(e) => {
                        e.stopPropagation()
                        handleDownload(content)
                      }}
                    >
                      {canAccess(content.requiredLevel) ? "下载" : "需要升级"}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
                  <Search size={64} className="text-gray-400 mx-auto" />
                </div>
            <h3 className="text-xl font-semibold mb-2">没有找到相关内容</h3>
            <p className="text-gray-400">尝试调整搜索条件或浏览其他分类</p>
          </div>
        )}
      </main>

      <Modal 
        isOpen={isContentOpen} 
        onClose={onContentClose}
        size="2xl"
        className="bg-gray-900 text-white"
      >
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">{selectedContent?.title}</h2>
              <Chip 
                color={getLevelColor(selectedContent?.requiredLevel)}
                size="sm"
                variant="flat"
              >
                {selectedContent?.requiredLevel}
              </Chip>
            </div>
          </ModalHeader>
          <ModalBody>
            {selectedContent && (
              <div className="space-y-4">
                <img 
                  src={selectedContent.thumbnail} 
                  alt={selectedContent.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                
                <div className="flex items-center gap-3">
                  <Avatar size="md" />
                  <div>
                    <p className="font-semibold">{selectedContent.creator}</p>
                    <p className="text-sm text-gray-400">创作者</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedContent.tags.map((tag, index) => (
                    <Chip key={index} size="sm" variant="flat" color="primary">
                      {tag}
                    </Chip>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">类型：</span>
                    <span>{selectedContent.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">下载量：</span>
                    <span>{selectedContent.downloads}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">评分：</span>
                    <span className="text-yellow-400 flex items-center gap-1">
                      <Star size={16} className="text-yellow-400" />
                      {selectedContent.rating}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">价格：</span>
                    <span className="text-lime-400">{selectedContent.price} 积分</span>
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">内容描述</h4>
                  <p className="text-gray-300 text-sm">
                    这是一个高质量的{selectedContent.type}，由专业{selectedContent.creator}精心制作。
                    包含多种风格和用途，适合各种创意项目使用。
                  </p>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onContentClose}>
              关闭
            </Button>
            <Button 
              color="primary"
              isDisabled={!canAccess(selectedContent?.requiredLevel)}
              onPress={() => {
                handleDownload(selectedContent)
                onContentClose()
              }}
            >
              {canAccess(selectedContent?.requiredLevel) ? "立即下载" : "需要升级会员"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}