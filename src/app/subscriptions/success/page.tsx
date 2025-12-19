import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-6 text-green-500">
        <CheckCircle2 size={64} />
      </div>
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Thank you for your purchase. You will receive a confirmation email
        shortly.
        {session_id && (
          <span className="block mt-2 text-xs text-muted-foreground/50">
            Order ID: {session_id}
          </span>
        )}
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/subscriptions">Back to Subscriptions</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
