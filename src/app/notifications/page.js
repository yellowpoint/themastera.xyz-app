'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Switch, Divider, Chip, Avatar, Badge } from '@heroui/react';
import { Bell, Mail, Smartphone, Monitor, User, Heart, MessageCircle, Gift } from 'lucide-react';

export default function NotificationsPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      newFollower: true,
      newComment: true,
      newLike: false,
      weeklyDigest: true,
      promotions: false,
      systemUpdates: true
    },
    push: {
      newFollower: true,
      newComment: true,
      newLike: false,
      liveStream: true,
      dailyTasks: true,
      promotions: false
    },
    inApp: {
      newFollower: true,
      newComment: true,
      newLike: true,
      newMessage: true,
      systemAnnouncements: true,
      pointsEarned: true
    }
  });

  const [notifications] = useState([
    {
      id: 1,
      type: 'follow',
      title: 'Alice_Creator 关注了您',
      message: '您有了一位新的关注者',
      time: '2 分钟前',
      read: false,
      avatar: 'A',
      action: 'follow_back'
    },
    {
      id: 2,
      type: 'like',
      title: '您的作品获得了点赞',
      message: 'Bob_Artist 点赞了您的摄影作品《城市夜景》',
      time: '15 分钟前',
      read: false,
      avatar: 'B',
      action: 'view_content'
    },
    {
      id: 3,
      type: 'comment',
      title: '新评论',
      message: 'Carol_Designer 评论了您的作品：太棒了！',
      time: '1 小时前',
      read: true,
      avatar: 'C',
      action: 'reply'
    },
    {
      id: 4,
      type: 'system',
      title: '每日任务完成',
      message: '恭喜您完成今日所有任务，获得 200 积分奖励',
      time: '2 小时前',
      read: true,
      avatar: null,
      action: 'view_rewards'
    },
    {
      id: 5,
      type: 'promotion',
      title: '限时活动',
      message: '创作者大赛正在进行中，参与即可获得丰厚奖励',
      time: '1 天前',
      read: true,
      avatar: null,
      action: 'join_event'
    }
  ]);

  const updateNotificationSetting = (category, setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow':
        return <User className="w-5 h-5 text-blue-400" />;
      case 'like':
        return <Heart className="w-5 h-5 text-red-400" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-green-400" />;
      case 'system':
        return <Bell className="w-5 h-5 text-yellow-400" />;
      case 'promotion':
        return <Gift className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getActionButton = (action, notificationId) => {
    switch (action) {
      case 'follow_back':
        return (
          <Button size="sm" className="bg-lime-400 text-black">
            回关
          </Button>
        );
      case 'view_content':
        return (
          <Button size="sm" variant="bordered" className="border-gray-600">
            查看作品
          </Button>
        );
      case 'reply':
        return (
          <Button size="sm" variant="bordered" className="border-gray-600">
            回复
          </Button>
        );
      case 'view_rewards':
        return (
          <Button size="sm" className="bg-green-500">
            查看奖励
          </Button>
        );
      case 'join_event':
        return (
          <Button size="sm" className="bg-purple-500">
            参与活动
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold mb-4">通知中心</h1>
          <p className="text-gray-400 text-lg">管理您的通知偏好和查看最新消息</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications List */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-content1 border-divider">
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Bell className="w-6 h-6 text-lime-400" />
                  最新通知
                </h2>
                <Button
                  size="sm"
                  variant="bordered"
                  className="border-gray-600"
                >
                  全部标记为已读
                </Button>
              </CardHeader>
              <CardBody className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border hover:border-lime-400/50 transition-colors cursor-pointer ${notification.read
                      ? 'bg-content2 border-divider'
                      : 'bg-blue-500/10 border-blue-500/30'
                      }`}

                  >
                    <div className="flex-shrink-0">
                      {notification.avatar ? (
                        <Badge
                          content=""
                          color="primary"
                          size="sm"
                          isInvisible={notification.read}
                        >
                          <Avatar
                            name={notification.avatar}
                            className="bg-lime-400 text-black"
                            size="sm"
                          />
                        </Badge>
                      ) : (
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-white font-medium text-sm">
                            {notification.title}
                          </h3>
                          <p className="text-gray-400 text-sm mt-1">
                            {notification.message}
                          </p>
                          <p className="text-gray-500 text-xs mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {getActionButton(notification.action, notification.id)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            {/* Email Notifications */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Mail className="w-5 h-5 text-lime-400" />
                  邮件通知
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm">新关注者</p>
                    <p className="text-gray-400 text-xs">有人关注您时发送邮件</p>
                  </div>
                  <Switch
                    isSelected={notificationSettings.email.newFollower}
                    onValueChange={(value) => updateNotificationSetting('email', 'newFollower', value)}
                    classNames={{
                      wrapper: "group-data-[selected=true]:bg-lime-400"
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm">新评论</p>
                    <p className="text-gray-400 text-xs">作品收到评论时通知</p>
                  </div>
                  <Switch
                    isSelected={notificationSettings.email.newComment}
                    onValueChange={(value) => updateNotificationSetting('email', 'newComment', value)}
                    classNames={{
                      wrapper: "group-data-[selected=true]:bg-lime-400"
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm">周报摘要</p>
                    <p className="text-gray-400 text-xs">每周活动总结</p>
                  </div>
                  <Switch
                    isSelected={notificationSettings.email.weeklyDigest}
                    onValueChange={(value) => updateNotificationSetting('email', 'weeklyDigest', value)}
                    classNames={{
                      wrapper: "group-data-[selected=true]:bg-lime-400"
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm">营销推广</p>
                    <p className="text-gray-400 text-xs">活动和优惠信息</p>
                  </div>
                  <Switch
                    isSelected={notificationSettings.email.promotions}
                    onValueChange={(value) => updateNotificationSetting('email', 'promotions', value)}
                    classNames={{
                      wrapper: "group-data-[selected=true]:bg-lime-400"
                    }}
                  />
                </div>
              </CardBody>
            </Card>

            {/* Push Notifications */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-lime-400" />
                  推送通知
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm">直播提醒</p>
                    <p className="text-gray-400 text-xs">关注的创作者开始直播</p>
                  </div>
                  <Switch
                    isSelected={notificationSettings.push.liveStream}
                    onValueChange={(value) => updateNotificationSetting('push', 'liveStream', value)}
                    classNames={{
                      wrapper: "group-data-[selected=true]:bg-lime-400"
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm">每日任务</p>
                    <p className="text-gray-400 text-xs">提醒完成每日任务</p>
                  </div>
                  <Switch
                    isSelected={notificationSettings.push.dailyTasks}
                    onValueChange={(value) => updateNotificationSetting('push', 'dailyTasks', value)}
                    classNames={{
                      wrapper: "group-data-[selected=true]:bg-lime-400"
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm">新关注者</p>
                    <p className="text-gray-400 text-xs">即时推送通知</p>
                  </div>
                  <Switch
                    isSelected={notificationSettings.push.newFollower}
                    onValueChange={(value) => updateNotificationSetting('push', 'newFollower', value)}
                    classNames={{
                      wrapper: "group-data-[selected=true]:bg-lime-400"
                    }}
                  />
                </div>
              </CardBody>
            </Card>

            {/* In-App Notifications */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-lime-400" />
                  站内通知
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm">积分获得</p>
                    <p className="text-gray-400 text-xs">获得积分时显示通知</p>
                  </div>
                  <Switch
                    isSelected={notificationSettings.inApp.pointsEarned}
                    onValueChange={(value) => updateNotificationSetting('inApp', 'pointsEarned', value)}
                    classNames={{
                      wrapper: "group-data-[selected=true]:bg-lime-400"
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm">系统公告</p>
                    <p className="text-gray-400 text-xs">重要系统消息</p>
                  </div>
                  <Switch
                    isSelected={notificationSettings.inApp.systemAnnouncements}
                    onValueChange={(value) => updateNotificationSetting('inApp', 'systemAnnouncements', value)}
                    classNames={{
                      wrapper: "group-data-[selected=true]:bg-lime-400"
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm">私信消息</p>
                    <p className="text-gray-400 text-xs">收到新私信时通知</p>
                  </div>
                  <Switch
                    isSelected={notificationSettings.inApp.newMessage}
                    onValueChange={(value) => updateNotificationSetting('inApp', 'newMessage', value)}
                    classNames={{
                      wrapper: "group-data-[selected=true]:bg-lime-400"
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gray-900/80 backdrop-blur-sm border border-gray-800">
          <CardBody className="p-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                variant="bordered"
                className="border-gray-600 hover:border-lime-400"
              >
                测试邮件通知
              </Button>
              <Button
                variant="bordered"
                className="border-gray-600 hover:border-lime-400"
              >
                测试推送通知
              </Button>
              <Button
                className="bg-lime-400 text-black font-semibold"
              >
                保存设置
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}