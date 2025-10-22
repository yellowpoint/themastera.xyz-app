'use client';

import { useState } from 'react';
import { Card, CardBody, Button, Progress, Chip, Avatar, Divider } from '@heroui/react';
import { Check, Gift, Star, Users, Camera, Music } from 'lucide-react';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);
  
  const onboardingSteps = [
    {
      id: 'welcome',
      title: '欢迎来到 Mastera',
      description: '开始您的创作之旅',
      reward: 100
    },
    {
      id: 'profile',
      title: '完善个人资料',
      description: '上传头像，填写个人简介',
      reward: 200
    },
    {
      id: 'interests',
      title: '选择兴趣标签',
      description: '帮助我们为您推荐内容',
      reward: 150
    },
    {
      id: 'follow',
      title: '关注创作者',
      description: '关注至少 3 位创作者',
      reward: 250
    },
    {
      id: 'first_action',
      title: '首次互动',
      description: '点赞或评论一个内容',
      reward: 200
    }
  ];

  const newUserTasks = [
    {
      id: 1,
      title: '完成邮箱验证',
      description: '验证您的邮箱地址',
      reward: 100,
      icon: '✉️',
      completed: false
    },
    {
      id: 2,
      title: '上传头像',
      description: '设置您的个人头像',
      reward: 150,
      icon: '📸',
      completed: false
    },
    {
      id: 3,
      title: '填写个人简介',
      description: '让其他用户了解您',
      reward: 100,
      icon: '📝',
      completed: false
    },
    {
      id: 4,
      title: '关注 5 位创作者',
      description: '发现您感兴趣的内容',
      reward: 300,
      icon: '👥',
      completed: false
    },
    {
      id: 5,
      title: '发布第一个评论',
      description: '参与社区讨论',
      reward: 200,
      icon: '💬',
      completed: false
    },
    {
      id: 6,
      title: '收藏 3 个内容',
      description: '建立您的收藏夹',
      reward: 150,
      icon: '⭐',
      completed: false
    },
    {
      id: 7,
      title: '邀请一位好友',
      description: '分享 Mastera 给朋友',
      reward: 500,
      icon: '🎁',
      completed: false
    }
  ];

  const interestCategories = [
    { id: 'photography', name: '摄影', icon: <Camera className="w-6 h-6" />, selected: false },
    { id: 'music', name: '音乐', icon: <Music className="w-6 h-6" />, selected: false },
    { id: 'design', name: '设计', icon: '🎨', selected: false },
    { id: 'animation', name: '动画', icon: '🎬', selected: false },
    { id: 'digital_art', name: '数字艺术', icon: '🖼️', selected: false },
    { id: 'video', name: '视频制作', icon: '📹', selected: false },
    { id: 'writing', name: '写作', icon: '✍️', selected: false },
    { id: 'gaming', name: '游戏', icon: '🎮', selected: false }
  ];

  const [selectedInterests, setSelectedInterests] = useState([]);

  const featuredCreators = [
    {
      id: 1,
      name: 'Alice Photography',
      avatar: 'A',
      followers: '12.5K',
      category: '摄影师',
      featured: true
    },
    {
      id: 2,
      name: 'Bob Music Studio',
      avatar: 'B',
      followers: '8.3K',
      category: '音乐制作人',
      featured: true
    },
    {
      id: 3,
      name: 'Carol Design',
      avatar: 'C',
      followers: '15.2K',
      category: '平面设计师',
      featured: true
    },
    {
      id: 4,
      name: 'David Animation',
      avatar: 'D',
      followers: '9.7K',
      category: '动画师',
      featured: true
    }
  ];

  const completeTask = (taskId) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  const toggleInterest = (interestId) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    const step = onboardingSteps[currentStep];
    
    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-r from-lime-400 to-green-400 rounded-full flex items-center justify-center mx-auto">
              <span className="text-black font-bold text-3xl">M</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">欢迎来到 Mastera Platform</h2>
              <p className="text-gray-400 text-lg">连接创作者与粉丝的创意平台</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold">发现内容</h3>
                <p className="text-gray-400 text-sm">探索高质量的创意作品</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold">社区互动</h3>
                <p className="text-gray-400 text-sm">与创作者和粉丝交流</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold">获得奖励</h3>
                <p className="text-gray-400 text-sm">通过互动获得积分奖励</p>
              </div>
            </div>
          </div>
        );
        
      case 'interests':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">选择您的兴趣</h2>
              <p className="text-gray-400">选择至少 3 个兴趣标签，我们将为您推荐相关内容</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {interestCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedInterests.includes(category.id) ? "solid" : "bordered"}
                  className={`h-20 flex-col gap-2 ${
                    selectedInterests.includes(category.id)
                      ? 'bg-lime-400 text-black border-lime-400'
                      : 'border-gray-600 text-white hover:border-lime-400'
                  }`}
                  onPress={() => toggleInterest(category.id)}
                >
                  <span className="text-2xl">{typeof category.icon === 'string' ? category.icon : category.icon}</span>
                  <span className="text-sm">{category.name}</span>
                </Button>
              ))}
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                已选择 {selectedInterests.length} 个兴趣 (最少需要 3 个)
              </p>
            </div>
          </div>
        );
        
      case 'follow':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">关注推荐创作者</h2>
              <p className="text-gray-400">关注您感兴趣的创作者，获取最新作品更新</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredCreators.map((creator) => (
                <Card key={creator.id} className="bg-gray-800/50 border border-gray-700">
                  <CardBody className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={creator.avatar}
                          className="bg-lime-400 text-black"
                        />
                        <div>
                          <h3 className="text-white font-semibold">{creator.name}</h3>
                          <p className="text-gray-400 text-sm">{creator.category}</p>
                          <p className="text-gray-500 text-xs">{creator.followers} 关注者</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-lime-400 text-black"
                      >
                        关注
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">{step.title}</h2>
            <p className="text-gray-400">{step.description}</p>
            <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-black" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">新手引导</h1>
            <Chip className="bg-lime-400 text-black">
              步骤 {currentStep + 1} / {onboardingSteps.length}
            </Chip>
          </div>
          <Progress
            value={(currentStep + 1) / onboardingSteps.length * 100}
            className="mb-2"
            classNames={{
              indicator: "bg-lime-400"
            }}
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>进度: {Math.round((currentStep + 1) / onboardingSteps.length * 100)}%</span>
            <span>奖励: +{onboardingSteps[currentStep].reward} 积分</span>
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 mb-8">
          <CardBody className="p-8">
            {renderStepContent()}
          </CardBody>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="bordered"
            className="border-gray-600 text-white"
            onPress={prevStep}
            isDisabled={currentStep === 0}
          >
            上一步
          </Button>
          <Button
            className="bg-lime-400 text-black font-semibold"
            onPress={nextStep}
            isDisabled={
              currentStep === onboardingSteps.length - 1 ||
              (onboardingSteps[currentStep].id === 'interests' && selectedInterests.length < 3)
            }
          >
            {currentStep === onboardingSteps.length - 1 ? '完成引导' : '下一步'}
          </Button>
        </div>

        {/* New User Tasks */}
        <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-800">
          <CardBody className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Gift className="w-6 h-6 text-lime-400" />
              新手任务包
            </h2>
            <p className="text-gray-400 mb-6">完成以下任务获得额外奖励，总计可获得 1500 积分</p>
            
            <div className="space-y-3">
              {newUserTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    completedTasks.includes(task.id)
                      ? 'bg-green-500/20 border-green-500'
                      : 'bg-gray-800/50 border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{task.icon}</span>
                    <div>
                      <h3 className="text-white font-medium">{task.title}</h3>
                      <p className="text-gray-400 text-sm">{task.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Chip
                      size="sm"
                      className="bg-lime-400 text-black"
                    >
                      +{task.reward}
                    </Chip>
                    {completedTasks.includes(task.id) ? (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="bordered"
                        className="border-lime-400 text-lime-400"
                        onPress={() => completeTask(task.id)}
                      >
                        完成
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <Divider className="my-6" />
            
            <div className="text-center">
              <p className="text-gray-400 mb-4">
                已完成 {completedTasks.length} / {newUserTasks.length} 个任务
              </p>
              <Progress
                value={(completedTasks.length / newUserTasks.length) * 100}
                className="mb-4"
                classNames={{
                  indicator: "bg-lime-400"
                }}
              />
              <Button
                className="bg-gradient-to-r from-lime-400 to-green-400 text-black font-semibold"
                size="lg"
                isDisabled={completedTasks.length < newUserTasks.length}
              >
                领取新手大礼包 🎁
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}