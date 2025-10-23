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
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  Select,
  SelectItem,
  Divider,
  Badge
} from '@heroui/react'
import { 
  Star, 
  Heart, 
  Handshake, 
  Palette, 
  TrendingUp, 
  MapPin, 
  Globe, 
  MessageSquare, 
  Eye,
  Calendar,
  Check
} from 'lucide-react'
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  
  // 模拟用户数据
  const [userProfile, setUserProfile] = useState({
    name: "创作大师",
    email: "creator@mastera.com",
    avatar: "/api/placeholder/120/120",
    level: "ProCreator",
    points: 15680,
    bio: "热爱创作的数字艺术家，专注于AI艺术和视觉设计。希望通过作品传递美好与创意。",
    location: "上海, 中国",
    website: "https://myportfolio.com",
    joinDate: "2023-06-15",
    followers: 12340,
    following: 567,
    totalWorks: 156,
    totalLikes: 45678,
    totalViews: 234567,
    skills: ["AI艺术", "数字绘画", "UI设计", "摄影", "视频制作"],
    interests: ["科技", "艺术", "设计", "摄影", "音乐"]
  })

  // 用户作品数据
  const userWorks = [
    {
      id: 1,
      title: "AI未来城市",
      category: "数字艺术",
      thumbnail: "/api/placeholder/300/200",
      likes: 234,
      views: 1567,
      date: "2024-01-15",
      featured: true
    },
    {
      id: 2,
      title: "抽象几何设计",
      category: "平面设计",
      thumbnail: "/api/placeholder/300/200",
      likes: 189,
      views: 892,
      date: "2024-01-10",
      featured: false
    },
    {
      id: 3,
      title: "自然光影摄影",
      category: "摄影",
      thumbnail: "/api/placeholder/300/200",
      likes: 345,
      views: 2134,
      date: "2024-01-08",
      featured: true
    },
    {
      id: 4,
      title: "品牌标识设计",
      category: "品牌设计",
      thumbnail: "/api/placeholder/300/200",
      likes: 156,
      views: 678,
      date: "2024-01-05",
      featured: false
    }
  ]

  // 成就数据
  const achievements = [
    {
      id: 1,
      title: "创作新星",
      description: "发布第一个作品",
      icon: <Star size={20} className="text-yellow-400" />,
      unlocked: true,
      date: "2023-06-20"
    },
    {
      id: 2,
      title: "人气创作者",
      description: "获得1000个点赞",
      icon: <Heart size={20} className="text-red-400" />,
      unlocked: true,
      date: "2023-08-15"
    },
    {
      id: 3,
      title: "社区贡献者",
      description: "帮助100位新用户",
      icon: <Handshake size={20} className="text-blue-400" />,
      unlocked: true,
      date: "2023-10-22"
    },
    {
      id: 4,
      title: "创作大师",
      description: "发布100个作品",
      icon: <Palette size={20} className="text-purple-400" />,
      unlocked: true,
      date: "2023-12-10"
    },
    {
      id: 5,
      title: "影响力达人",
      description: "获得10000个关注者",
      icon: <TrendingUp size={20} className="text-green-400" />,
      unlocked: true,
      date: "2024-01-01"
    },
    {
      id: 6,
      title: "平台之星",
      description: "获得50000浏览量",
      icon: <Star size={20} className="text-yellow-400" />,
      unlocked: false,
      progress: 46.8
    }
  ]

  // 活动记录
  const activities = [
    {
      id: 1,
      type: "work",
      title: "发布了新作品《数字艺术探索》",
      icon: <Palette size={16} className="text-gray-400" />,
      time: "2小时前"
    },
    {
      id: 2,
      type: "like",
      title: "点赞了《城市夜景摄影》",
      icon: <Heart size={16} className="text-gray-400" />,
      time: "5小时前"
    },
    {
      id: 3,
      type: "comment",
      title: "评论了《UI设计趋势》",
      icon: <MessageSquare size={16} className="text-gray-400" />,
      time: "1天前"
    }
  ]

  const handleSaveProfile = () => {
    console.log('保存用户资料:', userProfile)
    setIsEditing(false)
    onEditClose()
  }

  const getLevelColor = (level) => {
    const colors = {
      "Beginner": "default",
      "Creator": "primary",
      "ProCreator": "secondary",
      "MasterCreator": "success",
      "LegendCreator": "warning"
    }
    return colors[level] || "default"
  }

  const getProgressToNextLevel = () => {
    const levelThresholds = {
      "Beginner": 0,
      "Creator": 1000,
      "ProCreator": 5000,
      "MasterCreator": 15000,
      "LegendCreator": 50000
    }
    
    const currentThreshold = levelThresholds[userProfile.level] || 0
    const nextLevel = Object.keys(levelThresholds).find(level => 
      levelThresholds[level] > currentThreshold
    )
    
    if (!nextLevel) return { progress: 100, nextLevel: "Max Level", needed: 0 }
    
    const nextThreshold = levelThresholds[nextLevel]
    const progress = ((userProfile.points - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    
    return {
      progress: Math.min(progress, 100),
      nextLevel,
      needed: Math.max(0, nextThreshold - userProfile.points)
    }
  }

  const levelProgress = getProgressToNextLevel()

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 用户头部信息 */}
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700 mb-8">
          <CardBody className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative">
                <Avatar 
                  src={userProfile.avatar} 
                  className="w-32 h-32"
                />
                <Badge 
                  content={userProfile.level} 
                  color={getLevelColor(userProfile.level)}
                  placement="bottom-right"
                  className="text-xs"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{userProfile.name}</h1>
                    <p className="text-gray-300 mb-2">{userProfile.bio}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={16} className="text-gray-400" />
                        {userProfile.location}
                      </span>
                      <span className="flex items-center gap-1">
                         <Calendar size={16} className="text-gray-400" />
                         加入于 {userProfile.joinDate}
                       </span>
                      {userProfile.website && (
                        <a href={userProfile.website} className="text-lime-400 hover:underline flex items-center gap-1">
                          <Globe size={16} className="text-lime-400" />
                          个人网站
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    color="primary" 
                    variant="bordered"
                    onPress={onEditOpen}
                  >
                    编辑资料
                  </Button>
                </div>

                {/* 统计数据 */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{userProfile.followers.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">关注者</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{userProfile.following}</p>
                    <p className="text-gray-400 text-sm">关注中</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{userProfile.totalWorks}</p>
                    <p className="text-gray-400 text-sm">作品数</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{userProfile.totalLikes.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">获赞数</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{userProfile.totalViews.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">浏览量</p>
                  </div>
                </div>

                {/* 等级进度 */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">等级进度</span>
                    <span className="text-sm">
                      {levelProgress.nextLevel === "Max Level" ? "已达最高等级" : 
                       `距离 ${levelProgress.nextLevel} 还需 ${levelProgress.needed} 积分`}
                    </span>
                  </div>
                  <Progress 
                    value={levelProgress.progress} 
                    color="primary"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 内容标签页 */}
        <Tabs 
          selectedKey={activeTab} 
          onSelectionChange={setActiveTab}
          className="mb-8"
          color="primary"
        >
          <Tab key="overview" title="概览" />
          <Tab key="works" title="我的作品" />
          <Tab key="achievements" title="成就" />
          <Tab key="activities" title="动态" />
        </Tabs>

        {/* 概览 */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* 技能标签 */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <h3 className="text-xl font-semibold">专业技能</h3>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skills.map((skill, index) => (
                      <Chip key={index} color="primary" variant="flat">
                        {skill}
                      </Chip>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* 兴趣爱好 */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <h3 className="text-xl font-semibold">兴趣爱好</h3>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.interests.map((interest, index) => (
                      <Chip key={index} color="secondary" variant="flat">
                        {interest}
                      </Chip>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* 精选作品 */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <h3 className="text-xl font-semibold">精选作品</h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userWorks.filter(work => work.featured).map((work) => (
                      <div key={work.id} className="relative group cursor-pointer">
                        <img 
                          src={work.thumbnail} 
                          alt={work.title}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <h4 className="font-semibold mb-1">{work.title}</h4>
                            <p className="text-sm text-gray-300">{work.category}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="space-y-6">
              {/* 最新成就 */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <h3 className="text-xl font-semibold">最新成就</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    {achievements.filter(a => a.unlocked).slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <p className="font-semibold text-sm">{achievement.title}</p>
                          <p className="text-xs text-gray-400">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* 最近活动 */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <h3 className="text-xl font-semibold">最近活动</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    {activities.slice(0, 4).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="text-lg">{activity.icon}</div>
                        <div className="flex-1">
                          <p className="text-sm">
                            {activity.action} <span className="text-lime-400">{activity.target}</span>
                          </p>
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* 我的作品 */}
        {activeTab === 'works' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userWorks.map((work) => (
              <Card 
                key={work.id} 
                className="bg-gray-900 border-gray-800 hover:border-lime-400/50 transition-all cursor-pointer"
              >
                <CardHeader className="p-0 relative">
                  <img 
                    src={work.thumbnail} 
                    alt={work.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {work.featured && (
                    <div className="absolute top-2 left-2">
                      <Chip color="warning" size="sm" variant="solid">
                        <Star size={12} className="text-yellow-400 mr-1" />
                        精选
                      </Chip>
                    </div>
                  )}
                </CardHeader>
                <CardBody className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{work.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{work.category}</p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Heart size={16} className="text-gray-400" />
                        {work.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={16} className="text-gray-400" />
                        {work.views}
                      </span>
                    </div>
                    <span>{work.date}</span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* 成就 */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`border-gray-800 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-700/50' 
                    : 'bg-gray-900 opacity-60'
                }`}
              >
                <CardBody className="p-6 text-center">
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>
                  
                  {achievement.unlocked ? (
                    <div>
                      <Chip color="success" variant="flat" size="sm">
                        <Check size={12} className="text-green-400 mr-1" />
                        已解锁
                      </Chip>
                      <p className="text-xs text-gray-500 mt-2">{achievement.date}</p>
                    </div>
                  ) : (
                    <div>
                      <Progress 
                        value={achievement.progress || 0} 
                        color="warning"
                        className="w-full mb-2"
                      />
                      <p className="text-xs text-gray-400">
                        进度: {achievement.progress?.toFixed(1) || 0}%
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* 动态 */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id} className="bg-gray-900 border-gray-800">
                <CardBody className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm">
                        {activity.action} <span className="text-lime-400">{activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Modal 
        isOpen={isEditOpen} 
        onClose={onEditClose}
        size="2xl"
        className="bg-gray-900 text-white"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">编辑个人资料</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="用户名"
                value={userProfile.name}
                onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
              />
              
              <Textarea
                label="个人简介"
                value={userProfile.bio}
                onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                minRows={3}
              />

              <Input
                label="所在地"
                value={userProfile.location}
                onChange={(e) => setUserProfile({...userProfile, location: e.target.value})}
              />

              <Input
                label="个人网站"
                value={userProfile.website}
                onChange={(e) => setUserProfile({...userProfile, website: e.target.value})}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onEditClose}>
              取消
            </Button>
            <Button color="primary" onPress={handleSaveProfile}>
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}