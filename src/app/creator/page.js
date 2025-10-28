'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, BarChart, Trash, MoreVertical, DollarSign, Eye, Users, FileText } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useWorks } from '@/hooks/useWorks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// shadcn/ui components
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

export default function CreatorPage() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [workToDelete, setWorkToDelete] = useState(null)
  const router = useRouter()

  const { user, loading: authLoading } = useAuth()
  const { works, loading: worksLoading, getWorkStats, deleteWork } = useWorks(user?.id)

  const [creatorStats, setCreatorStats] = useState({
    totalWorks: 0,
    totalEarnings: 0,
    totalFollowers: 0,
    totalViews: 0,
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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 shadow-lg border">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Creator Center</h2>
            <p className="text-muted-foreground mb-6">
              Please login to access creator features
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/auth/login')}
              className="w-full"
            >
              Login / Register
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Handle work deletion
  const handleDeleteWork = (work) => {
    setWorkToDelete(work)
    setIsDeleteOpen(true)
  }

  // Confirm work deletion
  const confirmDeleteWork = async () => {
    if (!workToDelete || !deleteWork) return

    try {
      await deleteWork(workToDelete.id)
      setIsDeleteOpen(false)
      setWorkToDelete(null)
      toast.success('Work deleted successfully!')
    } catch (error) {
      console.error('Error deleting work:', error)
      toast.error('Deletion failed, please try again')
    }
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Creator Center
          </h1>
          <p className="text-muted-foreground text-base">
            Manage your works and track performance
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            onClick={() => router.push('/creator/upload')}
            className="shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Upload New Work
          </Button>
          <Button
            variant="outline"
          >
            <BarChart className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Works</p>
                  <p className="text-2xl font-bold">{creatorStats.totalWorks}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <FileText size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold">${creatorStats.totalEarnings.toLocaleString()}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <DollarSign size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Followers</p>
                  <p className="text-2xl font-bold">{creatorStats.totalFollowers.toLocaleString()}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <Users size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Views</p>
                  <p className="text-2xl font-bold">{creatorStats.totalViews.toLocaleString()}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                  <Eye size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Works Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-medium">Works Management</h3>
            <Button
              size="sm"
              onClick={() => router.push('/creator/upload')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Work
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {works.map((work) => (
                  <TableRow key={work.id}>
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
                      <p className="text-muted-foreground text-sm">{work.category}</p>
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
                      <Badge variant="outline">
                        {work.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart className="mr-2 h-4 w-4" />
                            Statistics
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteWork(work)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Delete confirmation dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Work</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{workToDelete?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteWork}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}