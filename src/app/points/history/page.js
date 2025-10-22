'use client'

import { useState } from 'react'
import { 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Chip,
  Select,
  SelectItem,
  DateRangePicker,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination
} from '@heroui/react'
import Navigation from '../../../components/Navigation'
import Footer from '../../../components/Footer'

export default function PointsHistoryPage() {
  const [filterType, setFilterType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // 模拟用户数据
  const userProfile = {
    name: "积分达人",
    email: "user@mastera.com",
    avatar: "/api/placeholder/40/40",
    level: "GoldMember",
    points: 15680
  }

  // 详细积分记录数据
  const allPointsHistory = [
    { id: 1, date: "2024-01-20 14:30", action: "每日签到", points: 20, type: "earn", category: "签到", balance: 15680 },
    { id: 2, date: "2024-01-20 10:15", action: "兑换高级会员", points: -2000, type: "spend", category: "兑换", balance: 15660 },
    { id: 3, date: "2024-01-19 16:45", action: "完成每日任务", points: 100, type: "earn", category: "任务", balance: 17660 },
    { id: 4, date: "2024-01-19 12:20", action: "邀请好友注册", points: 500, type: "earn", category: "邀请", balance: 17560 },
    { id: 5, date: "2024-01-18 09:30", action: "发布优质作品", points: 200, type: "earn", category: "创作", balance: 17060 },
    { id: 6, date: "2024-01-18 15:10", action: "兑换设计素材包", points: -800, type: "spend", category: "兑换", balance: 16860 },
    { id: 7, date: "2024-01-17 14:25", action: "每日签到", points: 20, type: "earn", category: "签到", balance: 17660 },
    { id: 8, date: "2024-01-16 11:40", action: "作品获得点赞", points: 50, type: "earn", category: "互动", balance: 17640 },
    { id: 9, date: "2024-01-16 08:15", action: "参与社区讨论", points: 30, type: "earn", category: "社区", balance: 17590 },
    { id: 10, date: "2024-01-15 16:30", action: "兑换在线课程", points: -1200, type: "spend", category: "兑换", balance: 17560 },
    { id: 11, date: "2024-01-15 13:20", action: "完成新手任务", points: 300, type: "earn", category: "任务", balance: 18760 },
    { id: 12, date: "2024-01-14 10:45", action: "每日签到", points: 20, type: "earn", category: "签到", balance: 18460 },
    { id: 13, date: "2024-01-13 17:15", action: "分享内容获得奖励", points: 80, type: "earn", category: "分享", balance: 18440 },
    { id: 14, date: "2024-01-12 14:50", action: "购买会员折扣", points: -150, type: "spend", category: "优惠", balance: 18360 },
    { id: 15, date: "2024-01-12 09:25", action: "评论获得积分", points: 25, type: "earn", category: "互动", balance: 18510 }
  ]

  const filterTypes = [
    { key: 'all', label: '全部记录' },
    { key: 'earn', label: '积分获得' },
    { key: 'spend', label: '积分消费' }
  ]

  const categories = [
    { key: 'all', label: '全部分类' },
    { key: '签到', label: '每日签到' },
    { key: '任务', label: '任务奖励' },
    { key: '邀请', label: '邀请奖励' },
    { key: '创作', label: '创作奖励' },
    { key: '兑换', label: '商品兑换' },
    { key: '互动', label: '社区互动' },
    { key: '分享', label: '分享奖励' },
    { key: '社区', label: '社区参与' },
    { key: '优惠', label: '优惠活动' }
  ]

  // 筛选数据
  const filteredHistory = allPointsHistory.filter(record => {
    if (filterType === 'all') return true
    return record.type === filterType
  })

  // 分页数据
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // 统计数据
  const stats = {
    totalEarned: allPointsHistory.filter(r => r.type === 'earn').reduce((sum, r) => sum + r.points, 0),
    totalSpent: Math.abs(allPointsHistory.filter(r => r.type === 'spend').reduce((sum, r) => sum + r.points, 0)),
    thisMonthEarned: allPointsHistory.filter(r => r.type === 'earn' && r.date.startsWith('2024-01')).reduce((sum, r) => sum + r.points, 0),
    thisMonthSpent: Math.abs(allPointsHistory.filter(r => r.type === 'spend' && r.date.startsWith('2024-01')).reduce((sum, r) => sum + r.points, 0))
  }

  const getCategoryColor = (category) => {
    const colors = {
      '签到': 'primary',
      '任务': 'success',
      '邀请': 'secondary',
      '创作': 'warning',
      '兑换': 'danger',
      '互动': 'default',
      '分享': 'primary',
      '社区': 'success',
      '优惠': 'warning'
    }
    return colors[category] || 'default'
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation userProfile={userProfile} isLoggedIn={true} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            积分记录 <span className="text-lime-400">Points History</span>
          </h1>
          <p className="text-gray-300 text-lg">
            查看详细的积分获得和消费记录
          </p>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700">
            <CardBody className="p-6 text-center">
              <div className="text-3xl mb-2">📈</div>
              <p className="text-green-300 text-sm">累计获得</p>
              <p className="text-2xl font-bold">{stats.totalEarned.toLocaleString()}</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-700">
            <CardBody className="p-6 text-center">
              <div className="text-3xl mb-2">📉</div>
              <p className="text-red-300 text-sm">累计消费</p>
              <p className="text-2xl font-bold">{stats.totalSpent.toLocaleString()}</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700">
            <CardBody className="p-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-blue-300 text-sm">本月获得</p>
              <p className="text-2xl font-bold">{stats.thisMonthEarned.toLocaleString()}</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700">
            <CardBody className="p-6 text-center">
              <div className="text-3xl mb-2">💸</div>
              <p className="text-purple-300 text-sm">本月消费</p>
              <p className="text-2xl font-bold">{stats.thisMonthSpent.toLocaleString()}</p>
            </CardBody>
          </Card>
        </div>

        {/* 筛选控件 */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardBody className="p-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-48">
                <Select
                  label="记录类型"
                  selectedKeys={[filterType]}
                  onSelectionChange={(keys) => setFilterType(Array.from(keys)[0])}
                >
                  {filterTypes.map((type) => (
                    <SelectItem key={type.key} value={type.key}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              
              <Button color="primary" variant="bordered">
                导出记录
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* 积分记录表格 */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <h3 className="text-xl font-semibold">积分记录详情</h3>
          </CardHeader>
          <CardBody>
            <Table aria-label="积分记录表格">
              <TableHeader>
                <TableColumn>时间</TableColumn>
                <TableColumn>操作</TableColumn>
                <TableColumn>分类</TableColumn>
                <TableColumn>积分变化</TableColumn>
                <TableColumn>余额</TableColumn>
              </TableHeader>
              <TableBody>
                {paginatedHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="text-sm">
                        <div>{record.date.split(' ')[0]}</div>
                        <div className="text-gray-400 text-xs">{record.date.split(' ')[1]}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{record.action}</div>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        size="sm" 
                        color={getCategoryColor(record.category)}
                        variant="flat"
                      >
                        {record.category}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${record.type === 'earn' ? 'text-green-400' : 'text-red-400'}`}>
                        {record.type === 'earn' ? '+' : ''}{record.points}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{record.balance.toLocaleString()}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  total={totalPages}
                  page={currentPage}
                  onChange={setCurrentPage}
                  color="primary"
                />
              </div>
            )}
          </CardBody>
        </Card>

        {/* 积分获得提示 */}
        <Card className="bg-gradient-to-r from-lime-900/30 to-green-900/30 border-lime-700 mt-8">
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">获得更多积分</h3>
                <p className="text-gray-300 mb-4">
                  完成每日任务、发布优质内容、邀请好友等方式都可以获得积分奖励
                </p>
                <div className="flex gap-2">
                  <Button color="primary" size="sm">
                    查看任务
                  </Button>
                  <Button variant="bordered" size="sm">
                    邀请好友
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </main>

      <Footer />
    </div>
  )
}