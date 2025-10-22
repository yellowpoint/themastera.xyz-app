'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Divider, Progress, Chip, Avatar } from '@heroui/react';
import { Share, Gift, UserPlus, Clipboard } from 'lucide-react';

export default function ReferralPage() {
  const [referralCode] = useState('MASTERA2024XYZ');
  const [copied, setCopied] = useState(false);
  
  const referralStats = {
    totalInvites: 12,
    successfulSignups: 8,
    totalEarned: 4000,
    pendingRewards: 1500
  };

  const referralHistory = [
    { id: 1, username: 'Alice_Creator', joinDate: '2024-01-15', status: 'active', reward: 500 },
    { id: 2, username: 'Bob_Artist', joinDate: '2024-01-12', status: 'active', reward: 500 },
    { id: 3, username: 'Carol_Designer', joinDate: '2024-01-10', status: 'pending', reward: 500 },
    { id: 4, username: 'David_Musician', joinDate: '2024-01-08', status: 'active', reward: 500 }
  ];

  const rewardTiers = [
    { invites: 5, reward: 2500, bonus: '额外徽章', achieved: true },
    { invites: 10, reward: 5000, bonus: 'VIP 体验', achieved: true },
    { invites: 25, reward: 15000, bonus: '专属头像框', achieved: false },
    { invites: 50, reward: 35000, bonus: '创作者认证', achieved: false }
  ];

  const copyReferralCode = () => {
    navigator.clipboard.writeText(`https://mastera.xyz/register?ref=${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    { name: 'Twitter', icon: '🐦', color: 'bg-blue-500' },
    { name: 'Discord', icon: '💬', color: 'bg-indigo-500' },
    { name: 'Telegram', icon: '✈️', color: 'bg-sky-500' },
    { name: 'WeChat', icon: '💚', color: 'bg-green-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-4">邀请好友，共享收益</h1>
          <p className="text-gray-400 text-lg">每成功邀请一位好友注册，您和好友都将获得 500 Mastera Points</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-3xl font-bold text-lime-400">{referralStats.totalInvites}</div>
              <div className="text-gray-400 text-sm">总邀请数</div>
            </CardBody>
          </Card>
          
          <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-3xl font-bold text-blue-400">{referralStats.successfulSignups}</div>
              <div className="text-gray-400 text-sm">成功注册</div>
            </CardBody>
          </Card>
          
          <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-3xl font-bold text-green-400">{referralStats.totalEarned}</div>
              <div className="text-gray-400 text-sm">已获得积分</div>
            </CardBody>
          </Card>
          
          <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-800">
            <CardBody className="text-center p-6">
              <div className="text-3xl font-bold text-yellow-400">{referralStats.pendingRewards}</div>
              <div className="text-gray-400 text-sm">待发放积分</div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Referral Code & Sharing */}
          <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-800">
            <CardHeader>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Share className="w-6 h-6 text-lime-400" />
                分享您的邀请码
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-2">
                <label className="text-gray-300 text-sm">您的专属邀请码</label>
                <div className="flex gap-2">
                  <Input
                    value={`https://mastera.xyz/register?ref=${referralCode}`}
                    readOnly
                    classNames={{
                      input: "text-white",
                      inputWrapper: "bg-gray-800 border-gray-700"
                    }}
                  />
                  <Button
                    isIconOnly
                    className={`${copied ? 'bg-green-500' : 'bg-lime-400'} text-black`}
                    onPress={copyReferralCode}
                  >
                    <Clipboard className="w-5 h-5" />
                  </Button>
                </div>
                {copied && <p className="text-green-400 text-sm">链接已复制到剪贴板！</p>}
              </div>
              
              <Divider />
              
              <div className="space-y-3">
                <h3 className="text-white font-semibold">快速分享到</h3>
                <div className="grid grid-cols-2 gap-3">
                  {shareOptions.map((option) => (
                    <Button
                      key={option.name}
                      variant="bordered"
                      className="border-gray-700 text-white hover:border-lime-400"
                      startContent={<span className="text-lg">{option.icon}</span>}
                    >
                      {option.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Reward Tiers */}
          <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-800">
            <CardHeader>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Gift className="w-6 h-6 text-lime-400" />
                奖励等级
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {rewardTiers.map((tier, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{tier.invites} 位好友</span>
                    <Chip
                      size="sm"
                      className={tier.achieved ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}
                    >
                      {tier.achieved ? '已达成' : '未达成'}
                    </Chip>
                  </div>
                  <div className="text-sm text-gray-400">
                    奖励: {tier.reward} 积分 + {tier.bonus}
                  </div>
                  <Progress
                    value={tier.achieved ? 100 : (referralStats.successfulSignups / tier.invites) * 100}
                    className="max-w-full"
                    classNames={{
                      indicator: tier.achieved ? "bg-green-500" : "bg-lime-400"
                    }}
                  />
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Referral History */}
        <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-800">
          <CardHeader>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-lime-400" />
              邀请记录
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {referralHistory.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={referral.username.charAt(0)}
                      className="bg-lime-400 text-black"
                    />
                    <div>
                      <div className="text-white font-medium">{referral.username}</div>
                      <div className="text-gray-400 text-sm">加入时间: {referral.joinDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Chip
                      size="sm"
                      className={
                        referral.status === 'active' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-yellow-500 text-black'
                      }
                    >
                      {referral.status === 'active' ? '已激活' : '待激活'}
                    </Chip>
                    <div className="text-lime-400 font-semibold">+{referral.reward}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* How it Works */}
        <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-800">
          <CardHeader>
            <h2 className="text-xl font-bold text-white">邀请机制说明</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-black font-bold text-xl">1</span>
                </div>
                <h3 className="text-white font-semibold">分享邀请链接</h3>
                <p className="text-gray-400 text-sm">将您的专属邀请链接分享给好友</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-black font-bold text-xl">2</span>
                </div>
                <h3 className="text-white font-semibold">好友注册激活</h3>
                <p className="text-gray-400 text-sm">好友通过链接注册并完成账户激活</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-black font-bold text-xl">3</span>
                </div>
                <h3 className="text-white font-semibold">获得奖励</h3>
                <p className="text-gray-400 text-sm">您和好友各获得 500 Mastera Points</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}