'use client'

import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export default function UserProfileSidebar({ className = '' }) {
  const { user } = useAuth()

  const handleCopyId = () => {
    navigator.clipboard.writeText('8912345678912345679')
    toast.success('Mastera ID copied to clipboard')
  }

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText('ATZ56N5U')
    toast.success('Invite code copied to clipboard')
  }

  return (
    <div className={`w-[413px] bg-white overflow-y-auto ${className}`}>
      <div className="p-6 space-y-3">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 pb-6">
          <div className="w-[168px] h-[168px] rounded-full overflow-hidden bg-gray-200">
            <Avatar className="w-full h-full">
              <AvatarImage src={user?.image} />
              <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col items-center gap-1 w-full">
            <h2 className="text-2xl font-normal">{user?.name || 'Jacky Q'}</h2>
            <Badge variant="outline" className="rounded h-6">
              <img src="/path/to/badge.png" alt="Badge" className="h-full" />
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Mastera ID: 8912345678912345679</span>
              <button className="p-1 hover:bg-gray-100 rounded" onClick={handleCopyId}>
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-10 pb-6">
          <div className="flex flex-col items-center gap-3">
            <span className="text-base font-normal text-foreground">400</span>
            <span className="text-base text-muted-foreground">Following</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="text-base font-normal text-foreground">200</span>
            <span className="text-base text-muted-foreground">Followers</span>
          </div>
        </div>

        <Separator className="opacity-20" />

        {/* Mastera Points */}
        <div className="bg-[#F7F8FA] p-3 flex justify-between items-end">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Mastera Points</span>
            <span className="text-4xl font-normal text-[#7440DF]">1,257</span>
          </div>
          <Button className="bg-[#7440DF] text-white px-4 py-2 rounded h-10 flex items-center gap-2">
            Get more points
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Description */}
        <div className="pt-2">
          <p className="text-sm font-light text-muted-foreground leading-relaxed">
            Some description for the user him/herself
            Bright vixens jump; dozy fowl quack. Quick wafting zephyrs vex bold Jim. Pack my box with five dozen liquor jugs. The five boxing wizards jump quickly.
          </p>
        </div>

        <Separator className="opacity-20" />

        {/* Invite Code */}
        <div className="flex justify-between items-center py-3">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Personal invite code</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-normal">ATZ56N5U</span>
              <button className="p-1 hover:bg-gray-100 rounded" onClick={handleCopyInviteCode}>
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="w-[68px] h-[69px] bg-[#F7F8FA] rounded flex items-center justify-center">
            {/* QR Code placeholder */}
            <div className="w-12 h-12 bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
