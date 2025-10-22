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
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@heroui/react'
import { useAuth } from '@/hooks/useAuth'
import { useWorks } from '@/hooks/useWorks'
import FileUpload from '@/components/FileUpload'
import AuthModal from '@/components/AuthModal'

export default function CreatorPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure()
  const { isOpen: isAuthOpen, onOpen: onAuthOpen, onClose: onAuthClose } = useDisclosure()

  const { user, loading: authLoading } = useAuth()
  const { works, loading: worksLoading, createWork, getWorkStats } = useWorks(user?.id)

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    tags: ''
  })

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
      setUploadForm(prev => ({
        ...prev,
        fileUrl: firstFile.publicUrl,
        thumbnail: firstFile.publicUrl,
        fileName: firstFile.originalName || firstFile.fileName
      }))
      console.log('Updated uploadForm with:', firstFile) // 添加调试日志
    }
  }

  // 提交新作品
  const handleSubmitWork = async () => {
    if (!uploadForm.title || !uploadForm.category || !uploadForm.price) {
      alert('请填写必要信息')
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
        thumbnail: uploadForm.thumbnail,
        status: 'reviewing'
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
        thumbnail: ''
      })

      onUploadClose()
      alert('作品提交成功，正在审核中')
    } catch (error) {
      console.error('Error submitting work:', error)
      alert('提交失败，请重试')
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
      case 'follow': return '👤'
      case 'purchase': return '💰'
      case 'comment': return '💬'
      case 'like': return '❤️'
      default: return '📝'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            创作者中心 <span className="text-lime-400">Creator Hub</span>
          </h1>
          <p className="text-gray-300 text-lg">
            管理你的作品，追踪收益，与粉丝互动
          </p>
        </div>

        {/* 快速操作 */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            color="primary"
            onPress={onUploadOpen}
            startContent={<span>📤</span>}
          >
            上传新作品
          </Button>
          <Button
            variant="bordered"
            className="border-lime-400 text-lime-400"
            startContent={<span>📊</span>}
          >
            查看分析
          </Button>
          <Button
            variant="bordered"
            className="border-gray-600 text-gray-300"
            startContent={<span>💰</span>}
          >
            提现收益
          </Button>
        </div>

        {/* 内容标签页 */}
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          className="mb-8"
          color="primary"
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
              <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-300 text-sm">总作品数</p>
                      <p className="text-2xl font-bold">{creatorStats.totalWorks}</p>
                    </div>
                    <div className="text-3xl">🎨</div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-300 text-sm">总收益</p>
                      <p className="text-2xl font-bold">¥{creatorStats.totalEarnings.toLocaleString()}</p>
                    </div>
                    <div className="text-3xl">💰</div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-300 text-sm">粉丝数量</p>
                      <p className="text-2xl font-bold">{creatorStats.totalFollowers.toLocaleString()}</p>
                    </div>
                    <div className="text-3xl">👥</div>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-700">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-300 text-sm">总浏览量</p>
                      <p className="text-2xl font-bold">{creatorStats.totalViews.toLocaleString()}</p>
                    </div>
                    <div className="text-3xl">👁️</div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* 月度统计 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
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
                    <span className="text-lg font-semibold text-yellow-400">
                      ⭐ {creatorStats.averageRating}
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

              <Card className="bg-gray-900 border-gray-800">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {works.map((work) => (
                <Card
                  key={work.id}
                  className="bg-gray-900 border-gray-800 hover:border-lime-400/50 transition-all"
                >
                  <CardHeader className="p-0">
                    <img
                      src={work.thumbnail}
                      alt={work.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardBody className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold line-clamp-1">{work.title}</h3>
                      <Chip
                        size="sm"
                        color={getStatusColor(work.status)}
                        variant="flat"
                      >
                        {work.status}
                      </Chip>
                    </div>

                    <p className="text-gray-400 text-sm mb-3">{work.category}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">价格</span>
                        <span className="font-semibold">¥{work.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">下载量</span>
                        <span>{work.downloads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">收益</span>
                        <span className="text-green-400 font-semibold">
                          ¥{work.earnings.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">评分</span>
                        <span className="text-yellow-400">⭐ {work.rating}</span>
                      </div>
                    </div>

                    <Divider className="my-3" />

                    <div className="flex gap-2">
                      <Button size="sm" variant="bordered" className="flex-1">
                        编辑
                      </Button>
                      <Button size="sm" variant="bordered" className="flex-1">
                        统计
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 收益统计 */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700">
                <CardBody className="p-6 text-center">
                  <div className="text-3xl mb-2">💰</div>
                  <p className="text-green-300 text-sm">本月收益</p>
                  <p className="text-2xl font-bold">¥{creatorStats.monthlyEarnings.toLocaleString()}</p>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700">
                <CardBody className="p-6 text-center">
                  <div className="text-3xl mb-2">📈</div>
                  <p className="text-blue-300 text-sm">总收益</p>
                  <p className="text-2xl font-bold">¥{creatorStats.totalEarnings.toLocaleString()}</p>
                </CardBody>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700">
                <CardBody className="p-6 text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <p className="text-purple-300 text-sm">可提现</p>
                  <p className="text-2xl font-bold">¥{(creatorStats.monthlyEarnings * 0.8).toLocaleString()}</p>
                </CardBody>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-800">
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
              <Card className="bg-gray-900 border-gray-800">
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

              <Card className="bg-gray-900 border-gray-800">
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

            <Card className="bg-gray-900 border-gray-800">
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
                      <div className="text-2xl">
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

      <Modal
        isOpen={isUploadOpen}
        onClose={onUploadClose}
        size="2xl"
        className="bg-gray-900 text-white"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">上传新作品</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
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
                  maxSize={100 * 1024 * 1024} // 100MB
                  bucket="data"
                />

                {/* 显示当前选择的文件信息 */}
                {uploadForm.fileUrl && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-sm font-medium text-green-800">
                        文件已选择: {uploadForm.fileName || '未知文件'}
                      </span>
                    </div>
                    <a
                      href={uploadForm.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline mt-1 block"
                    >
                      预览文件
                    </a>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
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
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}