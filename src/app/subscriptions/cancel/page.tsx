import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'
import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-6 text-red-500">
        <XCircle size={64} />
      </div>
      <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Your payment was cancelled. No charges were made.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/subscriptions">Return to Subscriptions</Link>
        </Button>
      </div>
    </div>
  )
}
