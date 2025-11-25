'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ListVideo, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Manage Works</div>
              <div className="text-sm text-muted-foreground">
                Review, publish and curate works.
              </div>
            </div>
            <Link href="/admin/works">
              <Button variant="outline">
                <ListVideo className="h-4 w-4 mr-2" /> Go to Works
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Beta Applications</div>
              <div className="text-sm text-muted-foreground">
                Approve or reject beta access requests.
              </div>
            </div>
            <Link href="/admin/beta-applications">
              <Button variant="outline">
                <Sparkles className="h-4 w-4 mr-2" /> Manage Beta
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
