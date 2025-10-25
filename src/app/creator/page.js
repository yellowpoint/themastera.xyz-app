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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  addToast
} from '@heroui/react'
import { Plus, Edit, BarChart, Trash, MoreVertical, DollarSign, Eye, Users, FileText, TrendingUp, Star, Calendar, Clock, Heart, Download, MessageSquare } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useWorks } from '@/hooks/useWorks'
import { useRouter } from 'next/navigation'

export default function CreatorPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const router = useRouter()

  const { user, loading: authLoading } = useAuth()
  const { works, loading: worksLoading, createWork, getWorkStats, deleteWork } = useWorks(user?.id)

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

  // Get creator statistics
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

  // If user is not logged in, show login prompt
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardBody className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Creator Center</h2>
            <p className="text-gray-600 mb-6">
              Please login to access creator features
            </p>
            <Button
              color="primary"
              size="lg"
              onPress={() => router.push('/auth/login')}
              className="w-full"
            >
              Login / Register
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  // Earnings history
  const earningsHistory = [
    { date: "2024-01-20", work: "AI Art Collection", amount: 299, type: "Sale" },
    { date: "2024-01-19", work: "Photography Preset Pack", amount: 199, type: "Sale" },
    { date: "2024-01-18", work: "Music Production Template", amount: 399, type: "Sale" },
    { date: "2024-01-17", work: "Creator Reward", amount: 500, type: "Reward" },
    { date: "2024-01-16", work: "AI Art Collection", amount: 299, type: "Sale" }
  ]

  // Fan interaction data
  const fanInteractions = [
    {
      id: 1,
      user: "Art Enthusiast",
      avatar: "/api/placeholder/40/40",
      action: "followed you",
      time: "2 hours ago",
      type: "follow"
    },
    {
      id: 2,
      user: "Designer Li",
      avatar: "/api/placeholder/40/40",
      action: "purchased 'AI Art Collection'",
      time: "4 hours ago",
      type: "purchase"
    },
    {
      id: 3,
      user: "Photo Novice",
      avatar: "/api/placeholder/40/40",
      action: "commented on 'Photography Preset Pack'",
      time: "6 hours ago",
      type: "comment",
      comment: "This preset pack is very useful, the effects are great!"
    }
  ]

  const categories = [
    { key: "visual", label: "Visual Arts" },
    { key: "photography", label: "Photography" },
    { key: "audio", label: "Audio" },
    { key: "video", label: "Video" },
    { key: "design", label: "Design" },
    { key: "other", label: "Other" }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'success'
      case 'Under Review': return 'warning'
      case 'Removed': return 'danger'
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

  // Handle work deletion
  const handleDeleteWork = (work) => {
    setWorkToDelete(work)
    onDeleteOpen()
  }

  // Confirm work deletion
  const confirmDeleteWork = async () => {
    if (!workToDelete || !deleteWork) return

    try {
      await deleteWork(workToDelete.id)
      onDeleteClose()
      setWorkToDelete(null)
      addToast({
        description: 'Work deleted successfully!',
        color: "success"
      })
    } catch (error) {
      console.error('Error deleting work:', error)
      addToast({
        description: 'Deletion failed, please try again',
        color: "danger"
      })
    }
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            Creator Center <span className="text-lime-400">Creator Hub</span>
          </h1>
          <p className="text-gray-400 text-base">
            Manage your works, track earnings, interact with fans
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            color="primary"
            onPress={() => router.push('/creator/upload')}
            startContent={<Plus size={16} />}
            size="sm"
          >
            Upload New Work
          </Button>
          <Button
            variant="flat"
            color="secondary"
            size="sm"
            startContent={<BarChart size={16} />}
          >
            View Analytics
          </Button>
          <Button
            variant="flat"
            color="success"
            size="sm"
            startContent={<DollarSign size={16} />}
          >
            Withdraw Earnings
          </Button>
        </div>

        {/* Content tabs */}
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          className="mb-6"
          color="primary"
          variant="underlined"
          size="md"
        >
          <Tab key="dashboard" title="Dashboard" />
          <Tab key="works" title="Works Management" />
          <Tab key="earnings" title="Earnings" />
          <Tab key="fans" title="Fan Interactions" />
        </Tabs>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Statistics cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Total Works</p>
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
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Total Earnings</p>
                      <p className="text-2xl font-bold">${creatorStats.totalEarnings.toLocaleString()}</p>
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
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Followers</p>
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
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Total Views</p>
                      <p className="text-2xl font-bold">{creatorStats.totalViews.toLocaleString()}</p>
                    </div>
                    <div className="text-gray-400">
                      <Eye size={24} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Monthly statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-content1 border-divider">
                <CardHeader>
                  <h3 className="text-xl font-semibold">Monthly Performance</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Monthly Earnings</span>
                    <span className="text-lg font-semibold text-green-400">
                      ${creatorStats.monthlyEarnings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Monthly Views</span>
                    <span className="text-lg font-semibold">
                      {creatorStats.monthlyViews.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Average Rating</span>
                    <span className="text-lg font-semibold text-yellow-400 flex items-center gap-1">
                      <Star size={16} /> {creatorStats.averageRating}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Completion Rate</span>
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
                  <h3 className="text-xl font-semibold">Recent Interactions</h3>
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

        {/* Works Management */}
        {activeTab === 'works' && (
          <div className="space-y-6">
            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader className="flex justify-between items-center py-3">
                <h3 className="text-lg font-medium">Works Management</h3>
                <Button
                  color="default"
                  size="sm"
                  onPress={() => router.push('/creator/upload')}
                  startContent={<Plus size={16} />}
                >
                  Add Work
                </Button>
              </CardHeader>
              <CardBody className="p-0">
                <Table
                  aria-label="Works management table"
                  className="w-full"
                  removeWrapper
                  shadow="none"
                >
                  <TableHeader>
                    <TableColumn>Cover</TableColumn>
                    <TableColumn>Title</TableColumn>
                    <TableColumn>Category</TableColumn>
                    <TableColumn>Price</TableColumn>
                    <TableColumn>Downloads</TableColumn>
                    <TableColumn>Earnings</TableColumn>
                    <TableColumn>Rating</TableColumn>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Actions</TableColumn>
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
                          <p className="font-medium">${work.price}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{work.downloads}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">
                            ${work.earnings.toLocaleString()}
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
                              aria-label="Action options"
                              onAction={(key) => {
                                if (key === 'delete') {
                                  handleDeleteWork(work)
                                }
                              }}
                            >
                              <DropdownItem key="edit" startContent={<Edit size={16} />}>Edit</DropdownItem>
                              <DropdownItem key="stats" startContent={<BarChart size={16} />}>Statistics</DropdownItem>
                              <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash size={16} />}>Delete</DropdownItem>
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

        {/* Earnings Statistics */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardBody className="p-6 text-center">
                  <div className="text-gray-400 mb-2">
                    <DollarSign size={24} />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Monthly Earnings</p>
                  <p className="text-2xl font-bold">${creatorStats.monthlyEarnings.toLocaleString()}</p>
                </CardBody>
              </Card>

              <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardBody className="p-6 text-center">
                  <div className="text-gray-400 mb-2">
                    <TrendingUp size={24} />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Total Earnings</p>
                  <p className="text-2xl font-bold">¥{creatorStats.totalEarnings.toLocaleString()}</p>
                </CardBody>
              </Card>

              <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardBody className="p-6 text-center">
                  <div className="text-gray-400 mb-2">
                    <Star size={24} />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Available for Withdrawal</p>
                  <p className="text-2xl font-bold">¥{(creatorStats.monthlyEarnings * 0.8).toLocaleString()}</p>
                </CardBody>
              </Card>
            </div>

            <Card className="bg-content1 border-divider">
              <CardHeader>
                <h3 className="text-xl font-semibold">Earnings History</h3>
              </CardHeader>
              <CardBody>
                <Table aria-label="Earnings history table">
                  <TableHeader>
                    <TableColumn>Date</TableColumn>
                    <TableColumn>Work/Project</TableColumn>
                    <TableColumn>Type</TableColumn>
                    <TableColumn>Amount</TableColumn>
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

        {/* Fan Interactions */}
        {activeTab === 'fans' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-content1 border-divider">
                <CardHeader>
                  <h3 className="text-xl font-semibold">Fan Statistics</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Followers</span>
                    <span className="text-2xl font-bold">{creatorStats.totalFollowers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">New This Month</span>
                    <span className="text-lg font-semibold text-green-400">+234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Active Fans</span>
                    <span className="text-lg font-semibold">8,765</span>
                  </div>
                </CardBody>
              </Card>

              <Card className="bg-content1 border-divider">
                <CardHeader>
                  <h3 className="text-xl font-semibold">Interaction Statistics</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Likes</span>
                    <span className="text-lg font-semibold">45,678</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Comments</span>
                    <span className="text-lg font-semibold">12,345</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Shares</span>
                    <span className="text-lg font-semibold">3,456</span>
                  </div>
                </CardBody>
              </Card>
            </div>

            <Card className="bg-content1 border-divider">
              <CardHeader>
                <h3 className="text-xl font-semibold">Recent Interactions</h3>
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

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Confirm Work Deletion</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-gray-100">"{workToDelete?.title}"</span>?
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-700 dark:text-red-400 text-sm">
                  ⚠️ This action cannot be undone. All data related to this work will be permanently deleted, including:
                </p>
                <ul className="text-red-600 dark:text-red-400 text-sm mt-2 ml-4 list-disc">
                  <li>Work files and thumbnails</li>
                  <li>All comments and ratings</li>
                  <li>Download records and earnings data</li>
                </ul>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={confirmDeleteWork}
              startContent={<Trash size={16} />}
            >
              Confirm Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}