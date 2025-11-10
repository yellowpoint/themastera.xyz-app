'use client'

import { useState } from 'react'
import { api } from '@/lib/request'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { buttonVariants } from '@/components/ui/button'
import { Loader2, Trash } from 'lucide-react'

type DeleteWorkDialogProps = {
  workId: string
  // Optional callback after successful deletion
  onDeleted?: (id: string) => void
  // Optional override for trigger label
  triggerLabel?: string
}

export function DeleteWorkDialog({
  workId,
  onDeleted,
  triggerLabel = 'Delete',
}: DeleteWorkDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (loading) return
    try {
      setLoading(true)
      const res = await api.delete(`/api/works/${workId}`)
      const result = res.data
      if (res.ok === false || result?.success === false) {
        const msg = result?.error?.message || 'Failed to delete work'
        throw new Error(msg)
      }
      toast.success('Work deleted successfully!')
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('work-deleted', { detail: { id: workId } }))
      }
      onDeleted?.(workId)
      setOpen(false)
    } catch (error) {
      console.error('Error deleting work:', error)
      toast.error('Failed to delete work')
      // Keep dialog open so user can retry or cancel
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          variant="destructive"
          onSelect={(e) => {
            e.preventDefault()
            setOpen(true)
          }}
        >
          {triggerLabel}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete work</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the work and remove its data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash className="mr-2 h-4 w-4" /> Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}