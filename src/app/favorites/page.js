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
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Checkbox
} from '@heroui/react'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState('content')
  const [sortBy, setSortBy] = useState('recent')
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState(new Set())
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

  // 收藏的内容
  const favoriteContent = [
    {
      id: 1,
      title: "AI艺术创作指南",
      creator: "艺术大师",
      creatorAvatar: "/api/placeholder/40/40",
      thumbnail: "/api/placeholder/300/200",
      category: "教程",
      type: "视频",
      duration: "15:30",
      addedDate: "2024-01-15",
      tags: ["AI", "艺术", "教程"],
      description: "详细介绍如何使用AI工具进行艺术创作",
      likes: 1234,
      views: 5678
    },
    {
      id: 2,
      title: "数字绘画技巧合集",
      creator: "绘画达人",
      creatorAvatar: "/api/placeholder/40/40",
      thumbnail: "/api/placeholder/300/200",
      category: "素材",
      type: "图片",
      addedDate: "2024-01-12",
      tags: ["绘画", "技巧", "数字艺术"],
      description: "包含50+数字绘画技巧和笔刷设置",
      likes: 892,
      views: 3456
    },
    {
      id: 3,
      title: "摄影后期处理教程",
      creator: "摄影师小李",
      creatorAvatar: "/api/placeholder/40/40",
      thumbnail: "/api/placeholder/300/200",
      category: "教程",
      type: "视频",
      duration: "22:45",
      addedDate: "2024-01-10",
      tags: ["摄影", "后期", "Photoshop"],
      description: "从基础到进阶的摄影后期处理技巧",
      likes: 2156,
      views: 8901
    },
    {
      id: 4,
      title: "UI设计规范文档",
      creator: "设计团队",
      creatorAvatar: "/api/placeholder/40/40",
      thumbnail: "/api/placeholder/300/200",
      category: "文档",
      type: "文档",
      addedDate: "2024-01-08",
      tags: ["UI", "设计", "规范"],
      description: "完整的UI设计规范和组件库",
      likes: 567,
      views: 2345
    }
  ]

  // 收藏的创作者
  const favoriteCreators = [
    {
      id: 1,
      name: "艺术大师",
      avatar: "/api/placeholder/80/80",
      bio: "专业数字艺术家，擅长AI艺术创作",
      followers: 12340,
      works: 156,
      category: "数字艺术",
      isFollowing: true,
      addedDate: "2024-01-15",
      recentWork: "AI未来城市概念图"
    },
    {
      id: 2,
      name: "摄影师小李",
      avatar: "/api/placeholder/80/80",
      bio: "风光摄影师，热爱捕捉自然之美",
      followers: 8765,
      works: 234,
      category: "摄影",
      isFollowing: true,
      addedDate: "2024-01-12",
      recentWork: "日出时分的山峦"
    },
    {
      id: 3,
      name: "设计师王小明",
      avatar: "/api/placeholder/80/80",
      bio: "UI/UX设计师，专注用户体验设计",
      followers: 5432,
      works: 89,
      category: "UI设计",
      isFollowing: false,
      addedDate: "2024-01-10",
      recentWork: "移动应用界面设计"
    }
  ]

  // 收藏的圈子
  const favoriteCircles = [
    {
      id: 1,
      name: "AI艺术创作圈",
      avatar: "/api/placeholder/80/80",
      description: "分享AI艺术创作技巧和作品",
      members: 15678,
      posts: 2345,
      category: "艺术",
      isJoined: true,
      addedDate: "2024-01-15",
      recentActivity: "新发布了AI绘画教程"
    },
    {
      id: 2,
      name: "摄影爱好者联盟",
      avatar: "/api/placeholder/80/80",
      description: "摄影技巧交流和作品分享",
      members: 23456,
      posts: 5678,
      category: "摄影",
      isJoined: true,
      addedDate: "2024-01-12",
      recentActivity: "举办了线上摄影比赛"
    },
    {
      id: 3,
      name: "设计师交流群",
      avatar: "/api/placeholder/80/80",
      description: "UI/UX设计师的专业交流平台",
      members: 9876,
      posts: 1234,
      category: "设计",
      isJoined: false,
      addedDate: "2024-01-10",
      recentActivity: "分享了最新设计趋势"
    }
  ]

  // 收藏夹
  const [collections, setCollections] = useState([
    {
      id: 1,
      name: "AI艺术学习",
      description: "收集AI艺术相关的教程和资源",
      itemCount: 15,
      isPublic: true,
      createdDate: "2024-01-01",
      thumbnail: "/api/placeholder/200/150"
    },
    {
      id: 2,
      name: "摄影技巧",
      description: "摄影相关的技巧和后期教程",
      itemCount: 8,
      isPublic: false,
      createdDate: "2023-12-15",
      thumbnail: "/api/placeholder/200/150"
    },
    {
      id: 3,
      name: "设计灵感",
      description: "收集优秀的设计作品和案例",
      itemCount: 23,
      isPublic: true,
      createdDate: "2023-11-20",
      thumbnail: "/api/placeholder/200/150"
    }
  ])

  const handleRemoveFromFavorites = (type, id) => {
    console.log(`从收藏中移除 ${type}:`, id)
  }

  const handleBatchRemove = () => {
    console.log('批量移除选中项目:', Array.from(selectedItems))
    setSelectedItems(new Set())
    onDeleteClose()
  }

  const handleCreateCollection = () => {
    console.log('创建新收藏夹')
    onCreateClose()
  }

  const getTypeIcon = (type) => {
    const icons = {
      '视频': '🎥',
      '图片': '🖼️',
      '文档': '📄',
      '音频': '🎵'
    }
    return icons[type] || '📄'
  }

  const getCategoryColor = (category) => {
    const colors = {
      '教程': 'primary',
      '素材': 'secondary',
      '文档': 'success',
      '艺术': 'warning',
      '摄影': 'danger',
      '设计': 'default'
    }
    return colors[category] || 'default'
  }

  const filteredContent = favoriteContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.creator.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const sortedContent = [...filteredContent].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.addedDate) - new Date(a.addedDate)
      case 'oldest':
        return new Date(a.addedDate) - new Date(b.addedDate)
      case 'popular':
        return b.likes - a.likes
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation isLoggedIn={true} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">我的收藏</h1>
            <p className="text-gray-400">管理您收藏的内容、创作者和圈子</p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button 
              color="primary" 
              onPress={onCreateOpen}
            >
              创建收藏夹
            </Button>
            {selectedItems.size > 0 && (
              <Button 
                color="danger" 
                variant="bordered"
                onPress={onDeleteOpen}
              >
                删除选中 ({selectedItems.size})
              </Button>
            )}
          </div>
        </div>

        {/* 标签页导航 */}
        <Tabs 
          selectedKey={activeTab} 
          onSelectionChange={setActiveTab}
          className="mb-6"
          color="primary"
        >
          <Tab key="content" title="收藏内容" />
          <Tab key="creators" title="关注创作者" />
          <Tab key="circles" title="加入圈子" />
          <Tab key="collections" title="收藏夹" />
        </Tabs>

        {/* 收藏内容 */}
        {activeTab === 'content' && (
          <div>
            {/* 筛选和排序 */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="搜索收藏的内容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="md:w-80"
                startContent="🔍"
              />
              
              <Select
                label="分类筛选"
                selectedKeys={[filterCategory]}
                onSelectionChange={(keys) => setFilterCategory(Array.from(keys)[0])}
                className="md:w-40"
              >
                <SelectItem key="all" value="all">全部</SelectItem>
                <SelectItem key="教程" value="教程">教程</SelectItem>
                <SelectItem key="素材" value="素材">素材</SelectItem>
                <SelectItem key="文档" value="文档">文档</SelectItem>
              </Select>

              <Select
                label="排序方式"
                selectedKeys={[sortBy]}
                onSelectionChange={(keys) => setSortBy(Array.from(keys)[0])}
                className="md:w-40"
              >
                <SelectItem key="recent" value="recent">最近收藏</SelectItem>
                <SelectItem key="oldest" value="oldest">最早收藏</SelectItem>
                <SelectItem key="popular" value="popular">最受欢迎</SelectItem>
                <SelectItem key="title" value="title">标题排序</SelectItem>
              </Select>
            </div>

            {/* 内容网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedContent.map((item) => (
                <Card 
                  key={item.id} 
                  className="bg-gray-900 border-gray-800 hover:border-lime-400/50 transition-all"
                >
                  <CardHeader className="p-0 relative">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 left-2">
                      <Chip 
                        color={getCategoryColor(item.category)} 
                        size="sm" 
                        variant="solid"
                      >
                        {getTypeIcon(item.type)} {item.category}
                      </Chip>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Checkbox
                        isSelected={selectedItems.has(item.id)}
                        onValueChange={(checked) => {
                          const newSelected = new Set(selectedItems)
                          if (checked) {
                            newSelected.add(item.id)
                          } else {
                            newSelected.delete(item.id)
                          }
                          setSelectedItems(newSelected)
                        }}
                        className="bg-black/50 rounded"
                      />
                    </div>
                    {item.duration && (
                      <div className="absolute bottom-2 right-2">
                        <Chip size="sm" variant="solid" className="bg-black/70">
                          {item.duration}
                        </Chip>
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardBody className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar src={item.creatorAvatar} size="sm" />
                      <span className="text-sm text-gray-300">{item.creator}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map((tag, index) => (
                        <Chip key={index} size="sm" variant="flat" color="default">
                          {tag}
                        </Chip>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-4">
                        <span>❤️ {item.likes}</span>
                        <span>👁️ {item.views}</span>
                      </div>
                      <span>收藏于 {item.addedDate}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button color="primary" size="sm" className="flex-1">
                        查看详情
                      </Button>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button variant="bordered" size="sm" isIconOnly>
                            ⋯
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          <DropdownItem key="share">分享</DropdownItem>
                          <DropdownItem key="collection">添加到收藏夹</DropdownItem>
                          <DropdownItem 
                            key="remove" 
                            className="text-danger"
                            onPress={() => handleRemoveFromFavorites('content', item.id)}
                          >
                            取消收藏
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {sortedContent.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">暂无收藏内容</h3>
                <p className="text-gray-400 mb-4">开始探索并收藏您感兴趣的内容吧</p>
                <Button color="primary">
                  去发现内容
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 关注创作者 */}
        {activeTab === 'creators' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteCreators.map((creator) => (
              <Card 
                key={creator.id} 
                className="bg-gray-900 border-gray-800 hover:border-lime-400/50 transition-all"
              >
                <CardBody className="p-6 text-center">
                  <Avatar 
                    src={creator.avatar} 
                    className="w-20 h-20 mx-auto mb-4"
                  />
                  
                  <h3 className="text-lg font-semibold mb-2">{creator.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{creator.bio}</p>
                  
                  <div className="flex justify-center gap-4 mb-4 text-sm text-gray-400">
                    <div>
                      <p className="font-semibold text-white">{creator.followers.toLocaleString()}</p>
                      <p>关注者</p>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{creator.works}</p>
                      <p>作品</p>
                    </div>
                  </div>

                  <Chip 
                    color={getCategoryColor(creator.category)} 
                    variant="flat" 
                    size="sm"
                    className="mb-4"
                  >
                    {creator.category}
                  </Chip>

                  <p className="text-xs text-gray-500 mb-4">
                    最新作品: {creator.recentWork}
                  </p>

                  <div className="flex gap-2">
                    <Button 
                      color={creator.isFollowing ? "default" : "primary"} 
                      variant={creator.isFollowing ? "bordered" : "solid"}
                      size="sm" 
                      className="flex-1"
                    >
                      {creator.isFollowing ? "已关注" : "关注"}
                    </Button>
                    <Button variant="bordered" size="sm">
                      查看主页
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    关注于 {creator.addedDate}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* 加入圈子 */}
        {activeTab === 'circles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteCircles.map((circle) => (
              <Card 
                key={circle.id} 
                className="bg-gray-900 border-gray-800 hover:border-lime-400/50 transition-all"
              >
                <CardBody className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar 
                      src={circle.avatar} 
                      className="w-16 h-16"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{circle.name}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{circle.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mb-4 text-sm text-gray-400">
                    <div>
                      <p className="font-semibold text-white">{circle.members.toLocaleString()}</p>
                      <p>成员</p>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{circle.posts.toLocaleString()}</p>
                      <p>帖子</p>
                    </div>
                  </div>

                  <Chip 
                    color={getCategoryColor(circle.category)} 
                    variant="flat" 
                    size="sm"
                    className="mb-4"
                  >
                    {circle.category}
                  </Chip>

                  <p className="text-xs text-gray-500 mb-4">
                    最新动态: {circle.recentActivity}
                  </p>

                  <div className="flex gap-2">
                    <Button 
                      color={circle.isJoined ? "default" : "primary"} 
                      variant={circle.isJoined ? "bordered" : "solid"}
                      size="sm" 
                      className="flex-1"
                    >
                      {circle.isJoined ? "已加入" : "加入圈子"}
                    </Button>
                    <Button variant="bordered" size="sm">
                      查看详情
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    加入于 {circle.addedDate}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* 收藏夹 */}
        {activeTab === 'collections' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Card 
                key={collection.id} 
                className="bg-gray-900 border-gray-800 hover:border-lime-400/50 transition-all cursor-pointer"
              >
                <CardHeader className="p-0">
                  <img 
                    src={collection.thumbnail} 
                    alt={collection.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                </CardHeader>
                
                <CardBody className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{collection.name}</h3>
                    <Chip 
                      color={collection.isPublic ? "success" : "default"} 
                      variant="flat" 
                      size="sm"
                    >
                      {collection.isPublic ? "公开" : "私有"}
                    </Chip>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {collection.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                    <span>{collection.itemCount} 个项目</span>
                    <span>创建于 {collection.createdDate}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button color="primary" size="sm" className="flex-1">
                      查看收藏夹
                    </Button>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="bordered" size="sm" isIconOnly>
                          ⋯
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem key="edit">编辑</DropdownItem>
                        <DropdownItem key="share">分享</DropdownItem>
                        <DropdownItem key="duplicate">复制</DropdownItem>
                        <DropdownItem key="delete" className="text-danger">
                          删除
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </CardBody>
              </Card>
            ))}

            {/* 创建新收藏夹卡片 */}
            <Card 
              className="bg-gray-900 border-gray-800 border-dashed hover:border-lime-400/50 transition-all cursor-pointer"
              isPressable
              onPress={onCreateOpen}
            >
              <CardBody className="p-6 text-center">
                <div className="text-4xl mb-4">➕</div>
                <h3 className="text-lg font-semibold mb-2">创建新收藏夹</h3>
                <p className="text-gray-400 text-sm">
                  整理您的收藏内容
                </p>
              </CardBody>
            </Card>
          </div>
        )}
      </main>

      <Footer />

      {/* 创建收藏夹模态框 */}
      <Modal 
        isOpen={isCreateOpen} 
        onClose={onCreateClose}
        className="bg-gray-900 text-white"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">创建新收藏夹</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="收藏夹名称"
                placeholder="请输入收藏夹名称"
              />
              
              <Input
                label="描述"
                placeholder="简单描述这个收藏夹的用途"
              />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">公开收藏夹</h3>
                  <p className="text-sm text-gray-400">允许其他用户查看此收藏夹</p>
                </div>
                <Checkbox defaultSelected>
                  公开
                </Checkbox>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCreateClose}>
              取消
            </Button>
            <Button color="primary" onPress={handleCreateCollection}>
              创建
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 批量删除确认模态框 */}
      <Modal 
        isOpen={isDeleteOpen} 
        onClose={onDeleteClose}
        className="bg-gray-900 text-white"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold text-red-400">确认删除</h2>
          </ModalHeader>
          <ModalBody>
            <p>您确定要删除选中的 {selectedItems.size} 个项目吗？此操作无法撤销。</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              取消
            </Button>
            <Button color="danger" onPress={handleBatchRemove}>
              确认删除
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}