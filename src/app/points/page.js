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
  Badge,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@heroui/react'
import { Gem, Crown, Gift, Flame, Check } from 'lucide-react'
export default function PointsPage() {
  const [activeTab, setActiveTab] = useState('shop')
  const [selectedItem, setSelectedItem] = useState(null)
  const { isOpen: isExchangeOpen, onOpen: onExchangeOpen, onClose: onExchangeClose } = useDisclosure()

  // 模拟用户数据
  const userProfile = {
    name: "积分达人",
    email: "user@mastera.com",
    avatar: "/api/placeholder/40/40",
    level: "GoldMember",
    points: 15680,
    totalEarned: 45230,
    nextLevelPoints: 20000
  }

  // 用户等级信息
  const levelInfo = {
    current: "GoldMember",
    currentLevel: 3,
    nextLevel: "PlatinumMember",
    progress: (userProfile.points / userProfile.nextLevelPoints) * 100,
    benefits: [
      "每日签到 +20 积分",
      "购买折扣 95折",
      "专属客服支持",
      "优先体验新功能"
    ]
  }

  // 商城商品数据
  const shopItems = [
    {
      id: 1,
      name: "高级会员 1个月",
      description: "享受高级会员特权，无限下载",
      points: 2000,
      originalPrice: 99,
      category: "会员",
      image: "/api/placeholder/200/150",
      stock: 999,
      hot: true
    },
    {
      id: 2,
      name: "创作工具包",
      description: "专业创作工具集合，提升创作效率",
      points: 1500,
      originalPrice: 299,
      category: "工具",
      image: "/api/placeholder/200/150",
      stock: 50,
      hot: false
    },
    {
      id: 3,
      name: "设计素材包",
      description: "精选设计素材，商用无忧",
      points: 800,
      originalPrice: 199,
      category: "素材",
      image: "/api/placeholder/200/150",
      stock: 100,
      hot: true
    },
    {
      id: 4,
      name: "在线课程券",
      description: "任选一门在线课程免费学习",
      points: 1200,
      originalPrice: 399,
      category: "教育",
      image: "/api/placeholder/200/150",
      stock: 30,
      hot: false
    },
    {
      id: 5,
      name: "实物礼品卡",
      description: "可兑换精美实物礼品",
      points: 3000,
      originalPrice: 500,
      category: "礼品",
      image: "/api/placeholder/200/150",
      stock: 20,
      hot: false
    },
    {
      id: 6,
      name: "积分加速卡",
      description: "7天内获得积分翻倍",
      points: 500,
      originalPrice: 50,
      category: "道具",
      image: "/api/placeholder/200/150",
      stock: 200,
      hot: true
    }
  ]

  // 积分记录数据
  const pointsHistory = [
    { date: "2024-01-20", action: "每日签到", points: 20, type: "earn" },
    { date: "2024-01-20", action: "兑换高级会员", points: -2000, type: "spend" },
    { date: "2024-01-19", action: "完成任务", points: 100, type: "earn" },
    { date: "2024-01-19", action: "邀请好友", points: 500, type: "earn" },
    { date: "2024-01-18", action: "发布作品", points: 200, type: "earn" },
    { date: "2024-01-18", action: "兑换素材包", points: -800, type: "spend" },
    { date: "2024-01-17", action: "每日签到", points: 20, type: "earn" },
    { date: "2024-01-16", action: "获得点赞", points: 50, type: "earn" }
  ]

  // 任务数据
  const dailyTasks = [
    {
      id: 1,
      title: "每日签到",
      description: "连续签到获得积分奖励",
      points: 20,
      completed: true,
      progress: 1,
      total: 1
    },
    {
      id: 2,
      title: "浏览内容",
      description: "浏览10个内容获得积分",
      points: 50,
      completed: false,
      progress: 7,
      total: 10
    },
    {
      id: 3,
      title: "点赞互动",
      description: "为5个作品点赞",
      points: 30,
      completed: false,
      progress: 3,
      total: 5
    },
    {
      id: 4,
      title: "分享内容",
      description: "分享1个内容到社交媒体",
      points: 100,
      completed: false,
      progress: 0,
      total: 1
    }
  ]

  const categories = ["全部", "会员", "工具", "素材", "教育", "礼品", "道具"]
  const [selectedCategory, setSelectedCategory] = useState("全部")

  const filteredItems = selectedCategory === "全部"
    ? shopItems
    : shopItems.filter(item => item.category === selectedCategory)

  const handleExchange = (item) => {
    setSelectedItem(item)
    onExchangeOpen()
  }

  const confirmExchange = () => {
    if (selectedItem && userProfile.points >= selectedItem.points) {
      console.log(`兑换商品: ${selectedItem.name}`)
      onExchangeClose()
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      "会员": "primary",
      "工具": "secondary",
      "素材": "success",
      "教育": "warning",
      "礼品": "danger",
      "道具": "default"
    }
    return colors[category] || "default"
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            积分商城 <span className="text-lime-400">Points Mall</span>
          </h1>
          <p className="text-gray-300 text-lg">
            用积分兑换精彩奖励，享受更多特权
          </p>
        </div>

        {/* 用户积分信息 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-lime-900/50 to-lime-800/30 border-lime-700">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lime-300 text-sm">当前积分</p>
                  <p className="text-3xl font-bold">{userProfile.points.toLocaleString()}</p>
                </div>
                <div className="text-4xl text-lime-400">
                  <Gem size={48} />
                </div>
              </div>
              <p className="text-lime-200 text-sm">
                累计获得: {userProfile.totalEarned.toLocaleString()} 积分
              </p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-purple-300 text-sm">当前等级</p>
                  <p className="text-xl font-bold">{levelInfo.current}</p>
                </div>
                <div className="text-4xl text-purple-400">
                  <Crown size={48} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>升级进度</span>
                  <span>{userProfile.points}/{userProfile.nextLevelPoints}</span>
                </div>
                <Progress
                  value={levelInfo.progress}
                  color="secondary"
                  className="w-full"
                />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-300 text-sm">会员特权</p>
                  <p className="text-xl font-bold">专享福利</p>
                </div>
                <div className="text-4xl text-blue-400">
                  <Gift size={48} />
                </div>
              </div>
              <div className="space-y-1">
                {levelInfo.benefits.slice(0, 2).map((benefit, index) => (
                  <p key={index} className="text-blue-200 text-xs">
                    • {benefit}
                  </p>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 内容标签页 */}
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          className="mb-8"
          color="primary"
        >
          <Tab key="shop" title="积分商城" />
          <Tab key="history" title="积分记录" />
          <Tab key="tasks" title="每日任务" />
          <Tab key="level" title="等级特权" />
        </Tabs>

        {/* 积分商城 */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
            {/* 分类筛选 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <Button
                  key={category}
                  size="sm"
                  variant={selectedCategory === category ? "solid" : "bordered"}
                  color={selectedCategory === category ? "primary" : "default"}
                  onPress={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* 商品网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="bg-content1 border-divider hover:border-lime-400/50 transition-all"
                >
                  <CardHeader className="p-0 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {item.hot && (
                      <div className="absolute top-2 left-2">
                        <Chip color="danger" size="sm" variant="solid">
                          <Flame size={16} className="mr-1" />
                          热门
                        </Chip>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Chip
                        color={getCategoryColor(item.category)}
                        size="sm"
                        variant="flat"
                      >
                        {item.category}
                      </Chip>
                    </div>
                  </CardHeader>
                  <CardBody className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                      {item.name}
                    </h3>

                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-lime-400">
                          {item.points}
                        </span>
                        <span className="text-lime-400 text-sm">积分</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 line-through">
                          原价 ¥{item.originalPrice}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400 text-sm">
                        库存: {item.stock}
                      </span>
                      {item.stock < 50 && (
                        <Chip color="warning" size="sm" variant="flat">
                          库存紧张
                        </Chip>
                      )}
                    </div>

                    <Button
                      color="primary"
                      className="w-full"
                      onPress={() => handleExchange(item)}
                      isDisabled={userProfile.points < item.points || item.stock === 0}
                    >
                      {userProfile.points < item.points ? "积分不足" :
                        item.stock === 0 ? "已售罄" : "立即兑换"}
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 积分记录 */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <Card className="bg-content1 border-divider">
               <CardHeader>
                 <h3 className="text-xl font-semibold">积分记录</h3>
               </CardHeader>
              <CardBody>
                <Table aria-label="积分记录表格">
                  <TableHeader>
                    <TableColumn>日期</TableColumn>
                    <TableColumn>操作</TableColumn>
                    <TableColumn>积分变化</TableColumn>
                    <TableColumn>类型</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {pointsHistory.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.action}</TableCell>
                        <TableCell>
                          <span className={record.type === 'earn' ? 'text-green-400' : 'text-red-400'}>
                            {record.type === 'earn' ? '+' : ''}{record.points}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="sm"
                            color={record.type === 'earn' ? 'success' : 'danger'}
                            variant="flat"
                          >
                            {record.type === 'earn' ? '获得' : '消费'}
                          </Chip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </div>
        )}

        {/* 每日任务 */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dailyTasks.map((task) => (
                <Card
                  key={task.id}
                  className={`border-divider ${task.completed ? 'bg-green-900/20 border-green-700' : 'bg-content1'}`}
                >
                  <CardBody className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{task.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-lime-400 font-bold">+{task.points}</span>
                          <span className="text-lime-400 text-sm">积分</span>
                        </div>
                        {task.completed && (
                          <Chip color="success" size="sm" variant="flat">
                            <Check size={16} className="mr-1" />
                            已完成
                          </Chip>
                        )}
                      </div>
                    </div>

                    {!task.completed && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>进度</span>
                          <span>{task.progress}/{task.total}</span>
                        </div>
                        <Progress
                          value={(task.progress / task.total) * 100}
                          color="primary"
                          className="w-full"
                        />
                      </div>
                    )}

                    {!task.completed && (
                      <Button
                        color="primary"
                        size="sm"
                        className="w-full mt-4"
                        variant="bordered"
                      >
                        去完成
                      </Button>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 等级特权 */}
        {activeTab === 'level' && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700">
              <CardHeader>
                <h3 className="text-xl font-semibold">当前等级特权</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl text-purple-400">
                    <Crown size={48} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold">{levelInfo.current}</h4>
                    <p className="text-purple-300">等级 {levelInfo.currentLevel}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {levelInfo.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check size={16} className="text-lime-400" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card className="bg-content1 border-divider">
               <CardHeader>
                 <h3 className="text-xl font-semibold">升级进度</h3>
               </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>距离下一等级</span>
                  <span className="font-semibold">
                    {userProfile.nextLevelPoints - userProfile.points} 积分
                  </span>
                </div>

                <Progress
                  value={levelInfo.progress}
                  color="secondary"
                  className="w-full"
                />

                <div className="flex justify-between text-sm text-gray-400">
                  <span>{levelInfo.current}</span>
                  <span>{levelInfo.nextLevel}</span>
                </div>

                <Button color="primary" variant="bordered" className="w-full">
                  查看所有等级
                </Button>
              </CardBody>
            </Card>
          </div>
        )}
      </main>

      <Modal
        isOpen={isExchangeOpen}
        onClose={onExchangeClose}
        className="bg-content1"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">确认兑换</h2>
          </ModalHeader>
          <ModalBody>
            {selectedItem && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{selectedItem.name}</h3>
                    <p className="text-gray-400 text-sm">{selectedItem.description}</p>
                  </div>
                </div>

                <Divider />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>兑换商品</span>
                    <span>{selectedItem.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>所需积分</span>
                    <span className="text-lime-400 font-bold">{selectedItem.points}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>当前积分</span>
                    <span>{userProfile.points.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>兑换后余额</span>
                    <span className="font-bold">
                      {(userProfile.points - selectedItem.points).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onExchangeClose}>
              取消
            </Button>
            <Button
              color="primary"
              onPress={confirmExchange}
              isDisabled={!selectedItem || userProfile.points < selectedItem.points}
            >
              确认兑换
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}