'use client'

import { useState, useEffect } from 'react'
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
  useDisclosure,
  Input,
  Textarea,
  Select,
  SelectItem,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  toast
} from '@heroui/react'
import { Plus, Edit, BarChart, Trash, MoreVertical, DollarSign, Eye, Users, FileText, TrendingUp, Star, Calendar, Clock, Heart, Download, MessageSquare } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useWorks } from '@/hooks/useWorks'
import FileUpload from '@/components/FileUpload'
import AuthModal from '@/components/AuthModal'

export default function CreatorPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure()
  const { isOpen: isAuthOpen, onOpen: onAuthOpen, onClose: onAuthClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

  const { user, loading: authLoading } = useAuth()
  const { works, loading: worksLoading, createWork, getWorkStats, deleteWork } = useWorks(user?.id)

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    tags: ''
  })

  const [workToDelete, setWorkToDelete] = useState(null)

  const [creatorStats, setCreatorStats] = useState({
    totalWorks: 0,
    totalEarnings: 0,
    totalFollowers: 0,
    totalViews: 0,
    monthlyEarnings: 0,
    monthlyViews: 0,
    averageRating: 0,
    completionRate: 96
  })

  // 获取创作者统计数据
  useEffect(() => {
    if (user?.id && getWorkStats) {
      getWorkStats(user.id).then(stats => {
        if (stats) {
          setCreatorStats(prev => ({
            ...prev,
            ...stats
          }))
        }
      }).catch(error => {
        console.error('Failed to fetch work stats:', error)
      })
    }
  }, [user?.id, getWorkStats])

  // 如果用户未登录，显示登录提示
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardBody className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">创作者中心</h2>
            <p className="text-gray-600 mb-6">
              请先登录以访问创作者功能
            </p>
            <Button
              color="primary"
              size="lg"
              onPress={onAuthOpen}
              className="w-full"
            >
              登录 / 注册
            </Button>
          </CardBody>
        </Card>
        <AuthModal isOpen={isAuthOpen} onClose={onAuthClose} />
      </div>
    )
  }

  // 处理文件上传完成
  const handleUploadComplete = (uploadResults) => {
    console.log('Upload results:', uploadResults) // 添加调试日志
    if (uploadResults && uploadResults.length > 0) {
      const firstFile = uploadResults[0]
      // 使用fileUrls字段，支持逗号分隔的多文件URL
      const fileUrls = uploadResults.map(file => file.fileUrl).join(',')
      setUploadForm(prev => ({
        ...prev,
        fileUrl: fileUrls, // 使用可能包含多个URL的字段
        thumbnailUrl: firstFile.fileUrl, // 缩略图仍使用第一个文件
      }))
    }
  }

  // 提交新作品
  const handleSubmitWork = async () => {
    if (!uploadForm.title || !uploadForm.category || !uploadForm.price) {
      toast.error('请填写必要信息')
      return
    }

    try {
      const workData = {
        title: uploadForm.title,
        description: uploadForm.description,
        category: uploadForm.category,
        price: parseFloat(uploadForm.price),
        tags: uploadForm.tags,
        userId: user.id,
        fileUrl: uploadForm.fileUrl,
        thumbnailUrl: uploadForm.thumbnailUrl,
        status: 'published'
      }

      await createWork(workData)

      // 重置表单
      setUploadForm({
        title: '',
        description: '',
        category: '',
        price: '',
        tags: '',
        fileUrl: '',
        thumbnailUrl: ''
      })

      onUploadClose()
      toast.success('作品发布成功！')
    } catch (error) {
      console.error('Error submitting work:', error)
      toast.error('提交失败，请重试')
    }
  }

  // 收益记录
  const earningsHistory = [
    { date: "2024-01-20", work: "AI艺术作品集", amount: 299, type: "销售" },
    { date: "2024-01-19", work: "摄影后期预设包", amount: 199, type: "销售" },
    { date: "2024-01-18", work: "音乐制作模板", amount: 399, type: "销售" },
    { date: "2024-01-17", work: "创作者奖励", amount: 500, type: "奖励" },
    { date: "2024-01-16", work: "AI艺术作品集", amount: 299, type: "销售" }
  ]

  // 粉丝互动数据
  const fanInteractions = [
    {
      id: 1,
      user: "艺术爱好者",
      avatar: "/api/placeholder/40/40",
      action: "关注了你",
      time: "2小时前",
      type: "follow"
    },
    {
      id: 2,
      user: "设计师小王",
      avatar: "/api/placeholder/40/40",
      action: "购买了《AI艺术作品集》",
      time: "4小时前",
      type: "purchase"
    },
    {
      id: 3,
      user: "摄影新手",
      avatar: "/api/placeholder/40/40",
      action: "评论了《摄影后期预设包》",
      time: "6小时前",
      type: "comment",
      comment: "非常实用的预设包，效果很棒！"
    }
  ]

  const categories = [
    { key: "visual", label: "视觉艺术" },
    { key: "photography", label: "摄影" },
    { key: "audio", label: "音频" },
    { key: "video", label: "视频" },
    { key: "design", label: "设计" },
    { key: "other", label: "其他" }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case '已发布': return 'success'
      case '审核中': return 'warning'
      case '已下架': return 'danger'
      default: return 'default'
    }
  }

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'follow': return <Users size={16} />
      case 'purchase': return <DollarSign size={16} />
      case 'comment': return <MessageSquare size={16} />
      case 'like': return <Heart size={16} />
      default: return <FileText size={16} />
    }
  }

  // 处理删除作品
  const handleDeleteWork = (work) => {
    setWorkToDelete(work)
    onDeleteOpen()
  }

  // 确认删除作品
  const confirmDeleteWork = async () => {
    if (!workToDelete || !deleteWork) return

    try {
      await deleteWork(workToDelete.id)
      onDeleteClose()
      setWorkToDelete(null)
      toast.success('作品删除成功！')
    } catch (error) {
      console.error('Error deleting work:', error)
      toast.error('删除失败，请重试')
    }
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            创作者中心 <span className="text-lime-400">Creator Hub</span>
          </h1>
          <p className="text-gray-400 text-base">
            管理你的作品，追踪收益，与粉丝互动
          </p>
        </div>

        {/* 快速操作 */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            color="primary"
            onPress={onUploadOpen}
            startContent={<Plus size={16} />}
            size="sm"
          >
            上传新作品
          </Button>
          <Button
            variant="flat"
            color="secondary"
            size="sm"
            startContent={<BarChart size={16} />}
          >
            查看分析
          </Button>
          <Button
            variant="flat"
            color="success"
            size="sm"
            startContent={<DollarSign size={16} />}
          >
            提现收益
          </Button>
        </div>

        {/* 内容标签页 */}
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          className="mb-6"
          color="primary"
          variant="underlined"
          size="md"
        >
          <Tab key="dashboard" title="数据概览" />
          <Tab key="works" title="作品管理" />
          <Tab key="earnings" title="收益统计" />
          <Tab key="fans" title="粉丝互动" />
        </Tabs>

        {/* 数据概览 */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">总作品数</p>
                      <p className="text-2xl font-bold">{creatorStats.totalWorks}</p>
                    </div>
                    <div className="text-gray-400">
                      <FileText size={24} />
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">总收益</p>
                      <p className="text-2xl font-bold">¥{creatorStats.totalEarnings.toLocaleString()}</p>
                    </div>
                    <div className="text-gray-400">
                      <DollarSign size={24} />
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">粉丝数量</p>
                      <p className="text-2xl font-bold">{creatorStats.totalFollowers.toLocaleString()}</p>
                    </div>
                    <div className="text-gray-400">
                      <Users size={24} />
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">总浏览量</p>
                      <p className="text-2xl font-bold">{creatorStats.totalViews.toLocaleString()}</p>
                    </div>
                    <div className="text-gray-400">
                      <Eye size={24} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* 月度统计 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-content1 border-divider">
                <CardHeader>
                  <h3 className="text-xl font-semibold">本月表现</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">月收益</span>
                    <span className="text-lg font-semibold text-green-400">
                      ¥{creatorStats.monthlyEarnings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">月浏览量</span>
                    <span className="text-lg font-semibold">
                      {creatorStats.monthlyViews.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">平均评分</span>
                    <span className="text-lg font-semibold text-yellow-400 flex items-center gap-1">
                      <Star size={16} /> {creatorStats.averageRating}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">完成率</span>
                      <span className="text-lg font-semibold">{creatorStats.completionRate}%</span>
                    </div>
                    <Progress
                      value={creatorStats.completionRate}
                      color="success"
                      className="w-full"
                    />
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-content1 border-divider">
                <CardHeader>
                  <h3 className="text-xl font-semibold">最新互动</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {fanInteractions.slice(0, 4).map((interaction) => (
                      <div key={interaction.id} className="flex items-center gap-3">
                        <Avatar src={interaction.avatar} size="sm" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-semibold">{interaction.user}</span>
                            <span className="text-gray-400 ml-1">{interaction.action}</span>
                          </p>
                          <p className="text-xs text-gray-500">{interaction.time}</p>
                        </div>
                        <div className="text-lg">
                          {getInteractionIcon(interaction.type)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* 作品管理 */}
        {activeTab === 'works' && (
          <div className="space-y-6">
            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader className="flex justify-between items-center py-3">
                <h3 className="text-lg font-medium">作品管理</h3>
                <Button
                  color="default"
                  size="sm"
                  onPress={onUploadOpen}
                  startContent={<Plus size={16} />}
                >
                  添加作品
                </Button>
              </CardHeader>
              <CardBody className="p-0">
                <Table
                  aria-label="作品管理表格"
                  className="w-full"
                  removeWrapper
                  shadow="none"
                >
                  <TableHeader>
                    <TableColumn>封面</TableColumn>
                    <TableColumn>作品名称</TableColumn>
                    <TableColumn>分类</TableColumn>
                    <TableColumn>价格</TableColumn>
                    <TableColumn>下载量</TableColumn>
                    <TableColumn>收益</TableColumn>
                    <TableColumn>评分</TableColumn>
                    <TableColumn>状态</TableColumn>
                    <TableColumn>操作</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {works.map((work) => (
                      <TableRow key={work.id} className="hover:bg-gray-100 dark:hover:bg-gray-800/50">
                        <TableCell>
                          <img
                            src={work.thumbnailUrl}
                            alt={work.title}
                            className="w-10 h-10 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell>
                          <p className="font-medium line-clamp-1">{work.title}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">{work.category}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">¥{work.price}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{work.downloads}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">
                            ¥{work.earnings.toLocaleString()}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{work.rating}</p>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="sm"
                            color="default"
                            variant="flat"
                          >
                            {work.status}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Dropdown>
                            <DropdownTrigger>
                              <Button size="sm" variant="light" isIconOnly>
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu 
                              aria-label="操作选项"
                              onAction={(key) => {
                                if (key === 'delete') {
                                  handleDeleteWork(work)
                                }
                              }}
                            >
                              <DropdownItem key="edit" startContent={<Edit size={16} />}>编辑</DropdownItem>
                              <DropdownItem key="stats" startContent={<BarChart size={16} />}>统计</DropdownItem>
                              <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash size={16} />}>删除</DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </div>
        )}

        {/* 收益统计 */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardBody className="p-6 text-center">
                  <div className="text-gray-400 mb-2">
                    <DollarSign size={24} />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">本月收益</p>
                  <p className="text-2xl font-bold">¥{creatorStats.monthlyEarnings.toLocaleString()}</p>
                </CardBody>
              </Card>

              <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardBody className="p-6 text-center">
                  <div className="text-gray-400 mb-2">
                    <TrendingUp size={24} />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">总收益</p>
                  <p className="text-2xl font-bold">¥{creatorStats.totalEarnings.toLocaleString()}</p>
                </CardBody>
              </Card>

              <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardBody className="p-6 text-center">
                  <div className="text-gray-400 mb-2">
                    <Star size={24} />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">可提现</p>
                  <p className="text-2xl font-bold">¥{(creatorStats.monthlyEarnings * 0.8).toLocaleString()}</p>
                </CardBody>
              </Card>
            </div>

            <Card className="bg-content1 border-divider">
              <CardHeader>
                <h3 className="text-xl font-semibold">收益记录</h3>
              </CardHeader>
              <CardBody>
                <Table aria-label="收益记录表格">
                  <TableHeader>
                    <TableColumn>日期</TableColumn>
                    <TableColumn>作品/项目</TableColumn>
                    <TableColumn>类型</TableColumn>
                    <TableColumn>金额</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {earningsHistory.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.work}</TableCell>
                        <TableCell>
                          <Chip
                            size="sm"
                            color={record.type === '销售' ? 'success' : 'primary'}
                            variant="flat"
                          >
                            {record.type}
                          </Chip>
                        </TableCell>
                        <TableCell className="text-green-400 font-semibold">
                          +¥{record.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </div>
        )}

        {/* 粉丝互动 */}
        {activeTab === 'fans' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-content1 border-divider">
                <CardHeader>
                  <h3 className="text-xl font-semibold">粉丝统计</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">总粉丝数</span>
                    <span className="text-2xl font-bold">{creatorStats.totalFollowers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">本月新增</span>
                    <span className="text-lg font-semibold text-green-400">+234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">活跃粉丝</span>
                    <span className="text-lg font-semibold">8,765</span>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-content1 border-divider">
                <CardHeader>
                  <h3 className="text-xl font-semibold">互动统计</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">总点赞数</span>
                    <span className="text-lg font-semibold">45,678</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">总评论数</span>
                    <span className="text-lg font-semibold">12,345</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">分享次数</span>
                    <span className="text-lg font-semibold">3,456</span>
                  </div>
                </CardBody>
              </Card>
            </div>

            <Card className="bg-content1 border-divider">
              <CardHeader>
                <h3 className="text-xl font-semibold">最新互动</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {fanInteractions.map((interaction) => (
                    <div key={interaction.id} className="flex items-start gap-4 p-4 rounded-lg bg-gray-800/50">
                      <Avatar src={interaction.avatar} size="md" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{interaction.user}</span>
                          <span className="text-gray-400 text-sm">{interaction.action}</span>
                          <span className="text-xs text-gray-500">{interaction.time}</span>
                        </div>
                        {interaction.comment && (
                          <p className="text-gray-300 text-sm bg-gray-700/50 p-2 rounded">
                            {interaction.comment}
                          </p>
                        )}
                      </div>
                      <div className="text-gray-400">
                        {getInteractionIcon(interaction.type)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </main>

      <Drawer
        isOpen={isUploadOpen}
        onClose={onUploadClose}
        placement="right"
        size="md"
        className="bg-gray-900"
      >
        <DrawerContent>
          <DrawerHeader className="border-b border-gray-800">
            <h2 className="text-xl font-bold">上传新作品</h2>
          </DrawerHeader>
          <DrawerBody>
            <div className="space-y-4 py-4">
              <Input
                label="作品标题"
                placeholder="输入作品标题..."
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              />

              <Textarea
                label="作品描述"
                placeholder="描述你的作品..."
                minRows={4}
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              />

              <Select
                label="作品分类"
                placeholder="选择分类"
                selectedKeys={uploadForm.category ? [uploadForm.category] : []}
                onSelectionChange={(keys) => setUploadForm({ ...uploadForm, category: Array.from(keys)[0] })}
              >
                {categories.map((category) => (
                  <SelectItem key={category.key} value={category.key}>
                    {category.label}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="作品价格"
                placeholder="设置价格（元）"
                type="number"
                value={uploadForm.price}
                onChange={(e) => setUploadForm({ ...uploadForm, price: e.target.value })}
              />

              <Input
                label="标签"
                placeholder="输入标签，用逗号分隔"
                value={uploadForm.tags}
                onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium mb-2">上传文件</label>
                <FileUpload
                  onUploadComplete={handleUploadComplete}
                  acceptedTypes={['image/*', 'video/*', 'audio/*', '.zip', '.rar', '.pdf']}
                />
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter className="border-t border-gray-800">
            <Button variant="light" onPress={onUploadClose}>
              取消
            </Button>
            <Button
              color="primary"
              onPress={handleSubmitWork}
              isDisabled={!uploadForm.title || !uploadForm.description || !uploadForm.category}
            >
              上传作品
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* 删除确认模态框 */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">确认删除作品</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                您确定要删除作品 <span className="font-semibold text-gray-900 dark:text-gray-100">"{workToDelete?.title}"</span> 吗？
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-700 dark:text-red-400 text-sm">
                  ⚠️ 此操作不可撤销，删除后将无法恢复该作品的所有数据，包括：
                </p>
                <ul className="text-red-600 dark:text-red-400 text-sm mt-2 ml-4 list-disc">
                  <li>作品文件和缩略图</li>
                  <li>所有评论和评分</li>
                  <li>下载记录和收益数据</li>
                </ul>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              取消
            </Button>
            <Button 
              color="danger" 
              onPress={confirmDeleteWork}
              startContent={<Trash size={16} />}
            >
              确认删除
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}