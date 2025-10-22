'use client'

import { useState } from 'react'
import { 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Tabs,
  Tab,
  Input,
  Accordion,
  AccordionItem,
  Chip,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Select,
  SelectItem
} from '@heroui/react'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState('faq')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { isOpen: isContactOpen, onOpen: onContactOpen, onClose: onContactClose } = useDisclosure()
  const { isOpen: isFeedbackOpen, onOpen: onFeedbackOpen, onClose: onFeedbackClose } = useDisclosure()

  // 常见问题
  const faqs = [
    {
      id: 1,
      category: 'account',
      question: '如何注册账户？',
      answer: '点击页面右上角的"注册"按钮，填写邮箱和密码即可完成注册。我们支持邮箱注册和第三方登录（微信、QQ、微博）。',
      tags: ['注册', '账户', '登录']
    },
    {
      id: 2,
      category: 'account',
      question: '忘记密码怎么办？',
      answer: '在登录页面点击"忘记密码"，输入注册邮箱，我们会发送重置密码的链接到您的邮箱。请检查垃圾邮件文件夹。',
      tags: ['密码', '重置', '邮箱']
    },
    {
      id: 3,
      category: 'content',
      question: '如何上传作品？',
      answer: '登录后进入创作者中心，点击"上传作品"按钮。支持图片、视频、音频等多种格式。请确保作品符合我们的内容规范。',
      tags: ['上传', '作品', '创作']
    },
    {
      id: 4,
      category: 'content',
      question: '作品审核需要多长时间？',
      answer: '一般情况下，作品会在24小时内完成审核。如果作品涉及敏感内容或需要人工审核，可能需要2-3个工作日。',
      tags: ['审核', '时间', '作品']
    },
    {
      id: 5,
      category: 'points',
      question: '如何获得积分？',
      answer: '您可以通过以下方式获得积分：每日签到、上传优质作品、参与社区互动、完成任务、邀请好友等。',
      tags: ['积分', '获得', '任务']
    },
    {
      id: 6,
      category: 'points',
      question: '积分可以用来做什么？',
      answer: '积分可以用于：兑换会员特权、购买付费内容、参与抽奖活动、提升账户等级等。详情请查看积分商城。',
      tags: ['积分', '兑换', '会员']
    },
    {
      id: 7,
      category: 'community',
      question: '如何加入圈子？',
      answer: '浏览社区页面，找到感兴趣的圈子，点击"加入"按钮。部分圈子可能需要管理员审核或满足特定条件。',
      tags: ['圈子', '加入', '社区']
    },
    {
      id: 8,
      category: 'community',
      question: '可以创建自己的圈子吗？',
      answer: '当您的账户等级达到Lv.3或以上时，就可以创建自己的圈子。创建圈子需要消耗一定积分。',
      tags: ['创建', '圈子', '等级']
    },
    {
      id: 9,
      category: 'payment',
      question: '支持哪些支付方式？',
      answer: '我们支持微信支付、支付宝、银行卡支付等多种方式。所有支付都经过加密处理，确保安全。',
      tags: ['支付', '方式', '安全']
    },
    {
      id: 10,
      category: 'payment',
      question: '如何申请退款？',
      answer: '如果您对购买的内容不满意，可在购买后7天内申请退款。请联系客服并提供订单号和退款原因。',
      tags: ['退款', '申请', '客服']
    }
  ]

  // 使用指南
  const guides = [
    {
      id: 1,
      title: '新手入门指南',
      description: '从注册到发布第一个作品的完整流程',
      icon: '🚀',
      steps: [
        '注册账户并完善个人信息',
        '浏览平台内容，了解社区规则',
        '关注感兴趣的创作者和圈子',
        '上传您的第一个作品',
        '参与社区互动，获得反馈'
      ],
      duration: '10分钟',
      difficulty: '简单'
    },
    {
      id: 2,
      title: '创作者进阶教程',
      description: '如何成为优秀的内容创作者',
      icon: '🎨',
      steps: [
        '了解平台内容规范和推荐机制',
        '学习优质内容的创作技巧',
        '建立个人品牌和粉丝群体',
        '参与创作者激励计划',
        '利用数据分析优化内容策略'
      ],
      duration: '30分钟',
      difficulty: '中等'
    },
    {
      id: 3,
      title: '积分系统详解',
      description: '全面了解积分获取和使用方法',
      icon: '💎',
      steps: [
        '了解积分获取的各种途径',
        '学习如何高效完成每日任务',
        '掌握积分兑换的最佳策略',
        '参与积分活动获得额外奖励',
        '提升等级解锁更多特权'
      ],
      duration: '15分钟',
      difficulty: '简单'
    },
    {
      id: 4,
      title: '社区互动技巧',
      description: '如何在社区中建立良好的人际关系',
      icon: '👥',
      steps: [
        '学习社区礼仪和互动规范',
        '参与有意义的讨论和交流',
        '建立和维护创作者关系',
        '组织或参与线上活动',
        '成为社区的积极贡献者'
      ],
      duration: '20分钟',
      difficulty: '中等'
    }
  ]

  // 联系方式
  const contactMethods = [
    {
      id: 1,
      name: '在线客服',
      description: '工作时间：9:00-21:00',
      icon: '💬',
      action: '开始对话',
      available: true
    },
    {
      id: 2,
      name: '邮件支持',
      description: 'support@mastera.xyz',
      icon: '📧',
      action: '发送邮件',
      available: true
    },
    {
      id: 3,
      name: '电话支持',
      description: '400-123-4567',
      icon: '📞',
      action: '拨打电话',
      available: false
    },
    {
      id: 4,
      name: '社区论坛',
      description: '与其他用户交流讨论',
      icon: '🏛️',
      action: '访问论坛',
      available: true
    }
  ]

  // 筛选FAQ
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryName = (category) => {
    const names = {
      'all': '全部',
      'account': '账户相关',
      'content': '内容创作',
      'points': '积分系统',
      'community': '社区互动',
      'payment': '支付相关'
    }
    return names[category] || category
  }

  const getCategoryColor = (category) => {
    const colors = {
      'account': 'primary',
      'content': 'secondary',
      'points': 'warning',
      'community': 'success',
      'payment': 'danger'
    }
    return colors[category] || 'default'
  }

  const handleContactSubmit = () => {
    console.log('提交联系表单')
    onContactClose()
  }

  const handleFeedbackSubmit = () => {
    console.log('提交反馈')
    onFeedbackClose()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation isLoggedIn={true} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">帮助中心</h1>
          <p className="text-xl text-gray-400 mb-8">
            我们随时为您提供帮助和支持
          </p>
          
          {/* 快速搜索 */}
          <div className="max-w-2xl mx-auto">
            <Input
              placeholder="搜索问题、关键词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="lg"
              startContent="🔍"
              className="mb-6"
            />
          </div>
        </div>

        {/* 标签页导航 */}
        <Tabs 
          selectedKey={activeTab} 
          onSelectionChange={setActiveTab}
          className="mb-8"
          color="primary"
        >
          <Tab key="faq" title="常见问题" />
          <Tab key="guides" title="使用指南" />
          <Tab key="contact" title="联系我们" />
        </Tabs>

        {/* 常见问题 */}
        {activeTab === 'faq' && (
          <div>
            {/* 分类筛选 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['all', 'account', 'content', 'points', 'community', 'payment'].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'solid' : 'bordered'}
                  color={selectedCategory === category ? 'primary' : 'default'}
                  size="sm"
                  onPress={() => setSelectedCategory(category)}
                >
                  {getCategoryName(category)}
                </Button>
              ))}
            </div>

            {/* FAQ列表 */}
            <Accordion variant="splitted" className="space-y-4">
              {filteredFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  title={
                    <div className="flex items-center gap-3">
                      <Chip 
                        color={getCategoryColor(faq.category)} 
                        variant="flat" 
                        size="sm"
                      >
                        {getCategoryName(faq.category)}
                      </Chip>
                      <span className="font-medium">{faq.question}</span>
                    </div>
                  }
                  className="bg-gray-900 border-gray-800"
                >
                  <div className="pb-4">
                    <p className="text-gray-300 mb-4">{faq.answer}</p>
                    <div className="flex flex-wrap gap-2">
                      {faq.tags.map((tag, index) => (
                        <Chip key={index} size="sm" variant="flat" color="default">
                          #{tag}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">未找到相关问题</h3>
                <p className="text-gray-400 mb-4">
                  尝试使用其他关键词搜索，或者联系我们的客服团队
                </p>
                <Button color="primary" onPress={onContactOpen}>
                  联系客服
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 使用指南 */}
        {activeTab === 'guides' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <Card 
                key={guide.id} 
                className="bg-gray-900 border-gray-800 hover:border-lime-400/50 transition-all"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{guide.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold">{guide.title}</h3>
                      <p className="text-gray-400 text-sm">{guide.description}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardBody className="pt-2">
                  <div className="flex gap-4 mb-4 text-sm">
                    <Chip color="primary" variant="flat" size="sm">
                      ⏱️ {guide.duration}
                    </Chip>
                    <Chip 
                      color={guide.difficulty === '简单' ? 'success' : 'warning'} 
                      variant="flat" 
                      size="sm"
                    >
                      📊 {guide.difficulty}
                    </Chip>
                  </div>

                  <div className="space-y-2 mb-4">
                    {guide.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-lime-400 text-black rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-300 flex-1">{step}</p>
                      </div>
                    ))}
                  </div>

                  <Button color="primary" className="w-full">
                    开始学习
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* 联系我们 */}
        {activeTab === 'contact' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {contactMethods.map((method) => (
                <Card 
                  key={method.id} 
                  className={`bg-gray-900 border-gray-800 transition-all ${
                    method.available ? 'hover:border-lime-400/50 cursor-pointer' : 'opacity-50'
                  }`}
                  isPressable={method.available}
                >
                  <CardBody className="text-center p-6">
                    <div className="text-4xl mb-3">{method.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{method.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{method.description}</p>
                    <Button 
                      color="primary" 
                      size="sm" 
                      disabled={!method.available}
                      onPress={method.id === 1 ? onContactOpen : undefined}
                    >
                      {method.action}
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* 反馈建议 */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <h2 className="text-xl font-bold">💡 意见反馈</h2>
              </CardHeader>
              <CardBody>
                <p className="text-gray-400 mb-4">
                  您的建议对我们非常重要，帮助我们不断改进产品和服务
                </p>
                <Button color="secondary" onPress={onFeedbackOpen}>
                  提交反馈
                </Button>
              </CardBody>
            </Card>
          </div>
        )}
      </main>

      <Footer />

      {/* 联系客服模态框 */}
      <Modal 
        isOpen={isContactOpen} 
        onClose={onContactClose}
        size="2xl"
        className="bg-gray-900 text-white"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">联系客服</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="姓名"
                  placeholder="请输入您的姓名"
                />
                <Input
                  label="邮箱"
                  placeholder="请输入您的邮箱"
                  type="email"
                />
              </div>
              
              <Select
                label="问题类型"
                placeholder="请选择问题类型"
              >
                <SelectItem key="account" value="account">账户问题</SelectItem>
                <SelectItem key="content" value="content">内容相关</SelectItem>
                <SelectItem key="payment" value="payment">支付问题</SelectItem>
                <SelectItem key="technical" value="technical">技术故障</SelectItem>
                <SelectItem key="other" value="other">其他问题</SelectItem>
              </Select>

              <Input
                label="问题标题"
                placeholder="简要描述您的问题"
              />
              
              <Textarea
                label="详细描述"
                placeholder="请详细描述您遇到的问题，我们会尽快为您解决"
                minRows={4}
              />

              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📋 提交前请确认：</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• 已尝试在常见问题中寻找答案</li>
                  <li>• 提供了详细的问题描述</li>
                  <li>• 留下了有效的联系方式</li>
                </ul>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onContactClose}>
              取消
            </Button>
            <Button color="primary" onPress={handleContactSubmit}>
              提交问题
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 反馈建议模态框 */}
      <Modal 
        isOpen={isFeedbackOpen} 
        onClose={onFeedbackClose}
        size="2xl"
        className="bg-gray-900 text-white"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">💡 意见反馈</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Select
                label="反馈类型"
                placeholder="请选择反馈类型"
              >
                <SelectItem key="feature" value="feature">功能建议</SelectItem>
                <SelectItem key="bug" value="bug">问题反馈</SelectItem>
                <SelectItem key="ui" value="ui">界面优化</SelectItem>
                <SelectItem key="performance" value="performance">性能问题</SelectItem>
                <SelectItem key="other" value="other">其他建议</SelectItem>
              </Select>

              <Input
                label="反馈标题"
                placeholder="简要概括您的建议"
              />
              
              <Textarea
                label="详细内容"
                placeholder="请详细描述您的建议或遇到的问题"
                minRows={4}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="联系邮箱（可选）"
                  placeholder="如需回复请留下邮箱"
                  type="email"
                />
                <Select
                  label="优先级"
                  placeholder="选择优先级"
                >
                  <SelectItem key="low" value="low">低</SelectItem>
                  <SelectItem key="medium" value="medium">中</SelectItem>
                  <SelectItem key="high" value="high">高</SelectItem>
                  <SelectItem key="urgent" value="urgent">紧急</SelectItem>
                </Select>
              </div>

              <div className="bg-lime-400/10 border border-lime-400/20 p-4 rounded-lg">
                <h4 className="font-semibold text-lime-400 mb-2">🎁 反馈奖励</h4>
                <p className="text-sm text-gray-300">
                  每个有效的反馈建议都将获得积分奖励，优秀建议还有机会获得额外奖品！
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onFeedbackClose}>
              取消
            </Button>
            <Button color="primary" onPress={handleFeedbackSubmit}>
              提交反馈
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}