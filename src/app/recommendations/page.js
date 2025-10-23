'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Avatar, Progress, Divider, Tabs, Tab } from '@heroui/react';
import { Sparkles, Heart, Eye, Share, Bookmark, Users, TrendingUp, Clock, Camera, Music, Palette, Film } from 'lucide-react';

export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState('for-you');

  // 根据类别返回对应的图标
  const getCategoryIcon = (category) => {
    switch (category) {
      case '摄影':
        return <Camera size={24} className="text-gray-400" />;
      case '音乐':
        return <Music size={24} className="text-gray-400" />;
      case '设计':
        return <Palette size={24} className="text-gray-400" />;
      case '动画':
        return <Film size={24} className="text-gray-400" />;
      default:
        return <Palette size={24} className="text-gray-400" />;
    }
  };

  const recommendedContent = [
    {
      id: 1,
      title: '城市夜景摄影技巧',
      creator: 'Alice Photography',
      avatar: 'A',
      category: '摄影',
      views: '12.5K',
      likes: '892',
      thumbnail: '🌃',
      duration: '8:32',
      matchScore: 95,
      reason: '基于您对摄影内容的兴趣'
    },
    {
      id: 2,
      title: '电子音乐制作入门',
      creator: 'Bob Music Studio',
      avatar: 'B',
      category: '音乐',
      views: '8.3K',
      likes: '654',
      thumbnail: '🎵',
      duration: '12:15',
      matchScore: 88,
      reason: '您关注的创作者发布了新内容'
    },
    {
      id: 3,
      title: 'UI设计趋势2024',
      creator: 'Carol Design',
      avatar: 'C',
      category: '设计',
      views: '15.2K',
      likes: '1.2K',
      thumbnail: '🎨',
      duration: '6:45',
      matchScore: 92,
      reason: '热门内容推荐'
    },
    {
      id: 4,
      title: '3D动画角色建模',
      creator: 'David Animation',
      avatar: 'D',
      category: '动画',
      views: '9.7K',
      likes: '743',
      thumbnail: '🎬',
      duration: '15:20',
      matchScore: 85,
      reason: '相似用户也喜欢'
    }
  ];

  const trendingCreators = [
    {
      id: 1,
      name: 'Emma Digital Art',
      avatar: 'E',
      followers: '25.3K',
      category: '数字艺术',
      growth: '+15%',
      featured: true
    },
    {
      id: 2,
      name: 'Frank Video Pro',
      avatar: 'F',
      followers: '18.7K',
      category: '视频制作',
      growth: '+22%',
      featured: true
    },
    {
      id: 3,
      name: 'Grace Writer',
      avatar: 'G',
      followers: '12.1K',
      category: '写作',
      growth: '+8%',
      featured: false
    }
  ];

  const personalizedTags = [
    { name: '摄影', weight: 85, color: 'bg-blue-500' },
    { name: '设计', weight: 72, color: 'bg-purple-500' },
    { name: '音乐', weight: 68, color: 'bg-green-500' },
    { name: '动画', weight: 45, color: 'bg-orange-500' },
    { name: '数字艺术', weight: 38, color: 'bg-pink-500' }
  ];

  const weeklyDigest = [
    {
      title: '本周热门',
      items: [
        { name: '春季摄影挑战', engagement: '2.3K 参与' },
        { name: 'AI艺术创作讨论', engagement: '1.8K 评论' },
        { name: '音乐制作直播', engagement: '5.2K 观看' }
      ]
    },
    {
      title: '新兴趋势',
      items: [
        { name: '可持续设计', growth: '+45%' },
        { name: '虚拟现实艺术', growth: '+38%' },
        { name: '环境音乐', growth: '+29%' }
      ]
    }
  ];

  const renderContentCard = (content) => (
    <Card key={content.id} className="bg-content2/50 border border-divider hover:border-lime-400 transition-colors">
      <CardBody className="p-4">
        <div className="flex gap-3">
          <div className="w-24 h-16 bg-content2 rounded-lg flex items-center justify-center">
            {getCategoryIcon(content.category)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm line-clamp-2">
                  {content.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar
                    name={content.avatar}
                    size="sm"
                    className="bg-lime-400 text-black w-6 h-6"
                  />
                  <span className="text-gray-400 text-xs">{content.creator}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {content.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {content.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {content.duration}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <Chip
                  size="sm"
                  className="bg-lime-400 text-black text-xs"
                >
                  {content.matchScore}% 匹配
                </Chip>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-2">{content.reason}</p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" className="bg-lime-400 text-black flex-1">
                观看
              </Button>
              <Button size="sm" variant="bordered" className="border-gray-600" isIconOnly>
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="bordered" className="border-gray-600" isIconOnly>
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-lime-400" />
            个性化推荐
          </h1>
          <p className="text-gray-400 text-lg">基于您的兴趣和行为，为您精选优质内容</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center">
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={setActiveTab}
            classNames={{
              tabList: "bg-content2/50 border border-divider",
              tab: "text-gray-400 data-[selected=true]:text-lime-400",
              cursor: "bg-lime-400"
            }}
          >
            <Tab key="for-you" title="为您推荐" />
            <Tab key="trending" title="热门趋势" />
            <Tab key="following" title="关注动态" />
            <Tab key="discover" title="发现新内容" />
          </Tabs>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'for-you' && (
              <>
                <Card className="bg-content1/80 backdrop-blur-sm border border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-bold">为您精选</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    {recommendedContent.map(renderContentCard)}
                  </CardBody>
                </Card>
              </>
            )}

            {activeTab === 'trending' && (
              <Card className="bg-content1/80 backdrop-blur-sm border border-divider">
                <CardHeader>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-lime-400" />
                    热门趋势
                  </h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  {weeklyDigest.map((section, index) => (
                    <div key={index}>
                      <h3 className="text-white font-semibold mb-3">{section.title}</h3>
                      <div className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between items-center p-3 bg-content2/50 rounded-lg">
                            <span className="text-white">{item.name}</span>
                            <Chip size="sm" className="bg-lime-400 text-black">
                              {item.engagement || item.growth}
                            </Chip>
                          </div>
                        ))}
                      </div>
                      {index < weeklyDigest.length - 1 && <Divider className="mt-4" />}
                    </div>
                  ))}
                </CardBody>
              </Card>
            )}

            {activeTab === 'following' && (
              <Card className="bg-content1/80 backdrop-blur-sm border border-divider">
                <CardHeader>
                  <h2 className="text-xl font-bold">关注动态</h2>
                </CardHeader>
                <CardBody>
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">您关注的创作者暂无新动态</p>
                    <Button className="bg-lime-400 text-black mt-4">
                      发现更多创作者
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}

            {activeTab === 'discover' && (
              <Card className="bg-content1/80 backdrop-blur-sm border border-divider">
                <CardHeader>
                  <h2 className="text-xl font-bold">发现新内容</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  {recommendedContent.slice().reverse().map(renderContentCard)}
                </CardBody>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Interest Profile */}
            <Card className="bg-content1/80 backdrop-blur-sm border border-divider">
              <CardHeader>
                <h3 className="text-lg font-bold">兴趣画像</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                {personalizedTags.map((tag, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm">{tag.name}</span>
                      <span className="text-gray-400 text-xs">{tag.weight}%</span>
                    </div>
                    <Progress
                      value={tag.weight}
                      className="max-w-full"
                      classNames={{
                        indicator: tag.color
                      }}
                    />
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="bordered"
                  className="w-full border-gray-600 hover:border-lime-400"
                >
                  调整兴趣偏好
                </Button>
              </CardBody>
            </Card>

            {/* Trending Creators */}
            <Card className="bg-content1/80 backdrop-blur-sm border border-divider">
              <CardHeader>
                <h3 className="text-lg font-bold">热门创作者</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                {trendingCreators.map((creator) => (
                  <div key={creator.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={creator.avatar}
                        className="bg-lime-400 text-black"
                        size="sm"
                      />
                      <div>
                        <h4 className="text-white text-sm font-medium">{creator.name}</h4>
                        <p className="text-gray-400 text-xs">{creator.category}</p>
                        <p className="text-gray-500 text-xs">{creator.followers} 关注者</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Chip
                        size="sm"
                        className="bg-green-500 mb-1"
                      >
                        {creator.growth}
                      </Chip>
                      <Button size="sm" className="bg-lime-400 text-black block">
                        关注
                      </Button>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>

            {/* Recommendation Settings */}
            <Card className="bg-content1/80 backdrop-blur-sm border border-divider">
              <CardHeader>
                <h3 className="text-lg font-bold">推荐设置</h3>
              </CardHeader>
              <CardBody className="space-y-3">
                <Button
                  size="sm"
                  variant="bordered"
                  className="w-full border-gray-600 hover:border-lime-400"
                >
                  重置推荐算法
                </Button>
                <Button
                  size="sm"
                  variant="bordered"
                  className="w-full border-gray-600 hover:border-lime-400"
                >
                  导出数据
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-lime-400 text-black"
                >
                  反馈建议
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}