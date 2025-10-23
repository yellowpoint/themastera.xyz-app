'use client'

import { useState } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Switch,
  Input,
  Select,
  SelectItem,
  Slider,
  Tabs,
  Tab,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Avatar,
  Textarea
} from '@heroui/react'
import { AlertTriangle } from 'lucide-react'
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account')
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const { isOpen: isPasswordOpen, onOpen: onPasswordOpen, onClose: onPasswordClose } = useDisclosure()

  // 账户设置
  const [accountSettings, setAccountSettings] = useState({
    username: "创作大师",
    email: "creator@mastera.com",
    phone: "+86 138****8888",
    bio: "热爱创作的数字艺术家",
    location: "上海, 中国",
    website: "https://myportfolio.com",
    language: "zh-CN",
    timezone: "Asia/Shanghai",
    profileVisibility: "public"
  })

  // 隐私设置
  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    allowFollows: true,
    showOnlineStatus: true,
    dataCollection: true,
    analyticsTracking: false,
    thirdPartySharing: false
  })

  // 通知设置
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newFollowers: true,
    newLikes: true,
    newComments: true,
    newMessages: true,
    systemUpdates: true,
    marketingEmails: false,
    weeklyDigest: true,
    notificationSound: true,
    quietHours: true,
    quietStart: "22:00",
    quietEnd: "08:00"
  })

  // 显示设置
  const [displaySettings, setDisplaySettings] = useState({
    theme: "dark",
    fontSize: 16,
    language: "zh-CN",
    autoPlay: true,
    highQuality: true,
    reducedMotion: false,
    colorBlindMode: false,
    compactMode: false
  })

  // 安全设置
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
    deviceTracking: true,
    suspiciousActivity: true,
    passwordStrength: "strong",
    lastPasswordChange: "2024-01-01",
    activeSessions: 3
  })

  const handleSaveSettings = (category) => {
    console.log(`保存${category}设置`)
    // 这里可以添加保存逻辑
  }

  const handleDeleteAccount = () => {
    console.log('删除账户')
    onDeleteClose()
  }

  const handleChangePassword = () => {
    console.log('修改密码')
    onPasswordClose()
  }

  const languages = [
    { key: "zh-CN", label: "简体中文" },
    { key: "zh-TW", label: "繁體中文" },
    { key: "en-US", label: "English" },
    { key: "ja-JP", label: "日本語" },
    { key: "ko-KR", label: "한국어" }
  ]

  const timezones = [
    { key: "Asia/Shanghai", label: "北京时间 (UTC+8)" },
    { key: "Asia/Tokyo", label: "东京时间 (UTC+9)" },
    { key: "America/New_York", label: "纽约时间 (UTC-5)" },
    { key: "Europe/London", label: "伦敦时间 (UTC+0)" },
    { key: "America/Los_Angeles", label: "洛杉矶时间 (UTC-8)" }
  ]

  return (
    <div className="min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">设置</h1>
          <p className="text-gray-400">管理您的账户设置和偏好</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边栏导航 */}
          <div className="lg:w-64">
            <Card className="bg-content1 border-divider">
              <CardBody className="p-0">
                <Tabs
                  selectedKey={activeTab}
                  onSelectionChange={setActiveTab}
                  orientation="vertical"
                  className="w-full"
                  color="primary"
                >
                  <Tab key="account" title="账户设置" />
                  <Tab key="privacy" title="隐私设置" />
                  <Tab key="notifications" title="通知设置" />
                  <Tab key="display" title="显示设置" />
                  <Tab key="security" title="安全设置" />
                </Tabs>
              </CardBody>
            </Card>
          </div>

          {/* 主要内容区域 */}
          <div className="flex-1">
            {/* 账户设置 */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <Card className="bg-content1 border-divider">
                   <CardHeader>
                     <h2 className="text-xl font-semibold">基本信息</h2>
                   </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar
                        src="/api/placeholder/80/80"
                        className="w-20 h-20"
                      />
                      <div>
                        <Button color="primary" variant="bordered" size="sm">
                          更换头像
                        </Button>
                        <p className="text-xs text-gray-400 mt-1">
                          支持 JPG、PNG 格式，最大 5MB
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="用户名"
                        value={accountSettings.username}
                        onChange={(e) => setAccountSettings({
                          ...accountSettings,
                          username: e.target.value
                        })}
                      />

                      <Input
                        label="邮箱地址"
                        type="email"
                        value={accountSettings.email}
                        onChange={(e) => setAccountSettings({
                          ...accountSettings,
                          email: e.target.value
                        })}
                      />

                      <Input
                        label="手机号码"
                        value={accountSettings.phone}
                        onChange={(e) => setAccountSettings({
                          ...accountSettings,
                          phone: e.target.value
                        })}
                      />

                      <Input
                        label="所在地"
                        value={accountSettings.location}
                        onChange={(e) => setAccountSettings({
                          ...accountSettings,
                          location: e.target.value
                        })}
                      />

                      <Input
                        label="个人网站"
                        value={accountSettings.website}
                        onChange={(e) => setAccountSettings({
                          ...accountSettings,
                          website: e.target.value
                        })}
                      />

                      <Select
                        label="语言"
                        selectedKeys={[accountSettings.language]}
                        onSelectionChange={(keys) => setAccountSettings({
                          ...accountSettings,
                          language: Array.from(keys)[0]
                        })}
                      >
                        {languages.map((lang) => (
                          <SelectItem key={lang.key} value={lang.key}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    <Textarea
                      label="个人简介"
                      value={accountSettings.bio}
                      onChange={(e) => setAccountSettings({
                        ...accountSettings,
                        bio: e.target.value
                      })}
                      minRows={3}
                    />

                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        onPress={() => handleSaveSettings('account')}
                      >
                        保存更改
                      </Button>
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-content1 border-divider">
                   <CardHeader>
                     <h2 className="text-xl font-semibold">账户操作</h2>
                   </CardHeader>
                   <CardBody className="space-y-4">
                     <div className="flex justify-between items-center">
                       <div>
                         <h3 className="font-semibold">修改密码</h3>
                         <p className="text-sm text-gray-400">定期更新密码以保护账户安全</p>
                       </div>
                       <Button
                         color="primary"
                         variant="bordered"
                         onPress={onPasswordOpen}
                       >
                         修改密码
                       </Button>
                     </div>

                     <Divider />

                     <div className="flex justify-between items-center">
                       <div>
                         <h3 className="font-semibold text-red-400">删除账户</h3>
                         <p className="text-sm text-gray-400">永久删除您的账户和所有数据</p>
                       </div>
                       <Button
                         color="danger"
                         variant="bordered"
                         onPress={onDeleteOpen}
                       >
                         删除账户
                       </Button>
                     </div>
                   </CardBody>
                 </Card>
               </div>
             )}

             {/* 隐私设置 */}
             {activeTab === 'privacy' && (
               <div className="space-y-6">
                 <Card className="bg-content1 border-divider">
                   <CardHeader>
                     <h2 className="text-xl font-semibold">个人资料隐私</h2>
                   </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">公开个人资料</h3>
                        <p className="text-sm text-gray-400">允许其他用户查看您的个人资料</p>
                      </div>
                      <Switch
                        isSelected={privacySettings.profilePublic}
                        onValueChange={(value) => setPrivacySettings({
                          ...privacySettings,
                          profilePublic: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">显示邮箱地址</h3>
                        <p className="text-sm text-gray-400">在个人资料中显示邮箱地址</p>
                      </div>
                      <Switch
                        isSelected={privacySettings.showEmail}
                        onValueChange={(value) => setPrivacySettings({
                          ...privacySettings,
                          showEmail: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">显示手机号码</h3>
                        <p className="text-sm text-gray-400">在个人资料中显示手机号码</p>
                      </div>
                      <Switch
                        isSelected={privacySettings.showPhone}
                        onValueChange={(value) => setPrivacySettings({
                          ...privacySettings,
                          showPhone: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">显示在线状态</h3>
                        <p className="text-sm text-gray-400">让其他用户看到您的在线状态</p>
                      </div>
                      <Switch
                        isSelected={privacySettings.showOnlineStatus}
                        onValueChange={(value) => setPrivacySettings({
                          ...privacySettings,
                          showOnlineStatus: value
                        })}
                      />
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-content1 border-divider">
                   <CardHeader>
                     <h2 className="text-xl font-semibold">互动权限</h2>
                   </CardHeader>
                   <CardBody className="space-y-4">
                     <div className="flex justify-between items-center">
                       <div>
                         <h3 className="font-semibold">允许私信</h3>
                         <p className="text-sm text-gray-400">允许其他用户向您发送私信</p>
                       </div>
                       <Switch
                         isSelected={privacySettings.allowMessages}
                         onValueChange={(value) => setPrivacySettings({
                           ...privacySettings,
                           allowMessages: value
                         })}
                       />
                     </div>

                     <div className="flex justify-between items-center">
                       <div>
                         <h3 className="font-semibold">允许关注</h3>
                         <p className="text-sm text-gray-400">允许其他用户关注您</p>
                       </div>
                       <Switch
                         isSelected={privacySettings.allowFollows}
                         onValueChange={(value) => setPrivacySettings({
                           ...privacySettings,
                           allowFollows: value
                         })}
                       />
                     </div>
                   </CardBody>
                 </Card>

                 <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">数据使用</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">数据收集</h3>
                        <p className="text-sm text-gray-400">允许收集使用数据以改善服务</p>
                      </div>
                      <Switch
                        isSelected={privacySettings.dataCollection}
                        onValueChange={(value) => setPrivacySettings({
                          ...privacySettings,
                          dataCollection: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">分析追踪</h3>
                        <p className="text-sm text-gray-400">允许使用分析工具追踪使用情况</p>
                      </div>
                      <Switch
                        isSelected={privacySettings.analyticsTracking}
                        onValueChange={(value) => setPrivacySettings({
                          ...privacySettings,
                          analyticsTracking: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">第三方共享</h3>
                        <p className="text-sm text-gray-400">允许与合作伙伴共享匿名数据</p>
                      </div>
                      <Switch
                        isSelected={privacySettings.thirdPartySharing}
                        onValueChange={(value) => setPrivacySettings({
                          ...privacySettings,
                          thirdPartySharing: value
                        })}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        onPress={() => handleSaveSettings('privacy')}
                      >
                        保存更改
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* 通知设置 */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">通知方式</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">邮件通知</h3>
                        <p className="text-sm text-gray-400">通过邮件接收通知</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.emailNotifications}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">推送通知</h3>
                        <p className="text-sm text-gray-400">通过浏览器推送接收通知</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.pushNotifications}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          pushNotifications: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">短信通知</h3>
                        <p className="text-sm text-gray-400">通过短信接收重要通知</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.smsNotifications}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          smsNotifications: value
                        })}
                      />
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">通知内容</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">新关注者</h3>
                        <p className="text-sm text-gray-400">有人关注您时通知</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.newFollowers}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          newFollowers: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">新点赞</h3>
                        <p className="text-sm text-gray-400">作品被点赞时通知</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.newLikes}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          newLikes: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">新评论</h3>
                        <p className="text-sm text-gray-400">作品被评论时通知</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.newComments}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          newComments: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">新消息</h3>
                        <p className="text-sm text-gray-400">收到私信时通知</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.newMessages}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          newMessages: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">系统更新</h3>
                        <p className="text-sm text-gray-400">系统更新和维护通知</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.systemUpdates}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          systemUpdates: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">营销邮件</h3>
                        <p className="text-sm text-gray-400">接收产品更新和优惠信息</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.marketingEmails}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          marketingEmails: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">每周摘要</h3>
                        <p className="text-sm text-gray-400">每周发送活动摘要邮件</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.weeklyDigest}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          weeklyDigest: value
                        })}
                      />
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">免打扰设置</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">通知声音</h3>
                        <p className="text-sm text-gray-400">播放通知提示音</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.notificationSound}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          notificationSound: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">免打扰时间</h3>
                        <p className="text-sm text-gray-400">在指定时间段内不接收通知</p>
                      </div>
                      <Switch
                        isSelected={notificationSettings.quietHours}
                        onValueChange={(value) => setNotificationSettings({
                          ...notificationSettings,
                          quietHours: value
                        })}
                      />
                    </div>

                    {notificationSettings.quietHours && (
                      <div className="grid grid-cols-2 gap-4 ml-4">
                        <Input
                          label="开始时间"
                          type="time"
                          value={notificationSettings.quietStart}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            quietStart: e.target.value
                          })}
                        />
                        <Input
                          label="结束时间"
                          type="time"
                          value={notificationSettings.quietEnd}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            quietEnd: e.target.value
                          })}
                        />
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        onPress={() => handleSaveSettings('notifications')}
                      >
                        保存更改
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* 显示设置 */}
            {activeTab === 'display' && (
              <div className="space-y-6">
                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">外观设置</h2>
                  </CardHeader>
                  <CardBody className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">主题</h3>
                      <div className="flex gap-4">
                        <Button
                          variant={displaySettings.theme === 'light' ? 'solid' : 'bordered'}
                          onPress={() => setDisplaySettings({ ...displaySettings, theme: 'light' })}
                        >
                          浅色主题
                        </Button>
                        <Button
                          variant={displaySettings.theme === 'dark' ? 'solid' : 'bordered'}
                          onPress={() => setDisplaySettings({ ...displaySettings, theme: 'dark' })}
                        >
                          深色主题
                        </Button>
                        <Button
                          variant={displaySettings.theme === 'auto' ? 'solid' : 'bordered'}
                          onPress={() => setDisplaySettings({ ...displaySettings, theme: 'auto' })}
                        >
                          跟随系统
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">字体大小: {displaySettings.fontSize}px</h3>
                      <Slider
                        value={displaySettings.fontSize}
                        onChange={(value) => setDisplaySettings({ ...displaySettings, fontSize: value })}
                        minValue={12}
                        maxValue={24}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <Select
                      label="界面语言"
                      selectedKeys={[displaySettings.language]}
                      onSelectionChange={(keys) => setDisplaySettings({
                        ...displaySettings,
                        language: Array.from(keys)[0]
                      })}
                    >
                      {languages.map((lang) => (
                        <SelectItem key={lang.key} value={lang.key}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </CardBody>
                </Card>

                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">内容显示</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">自动播放视频</h3>
                        <p className="text-sm text-gray-400">在浏览时自动播放视频内容</p>
                      </div>
                      <Switch
                        isSelected={displaySettings.autoPlay}
                        onValueChange={(value) => setDisplaySettings({
                          ...displaySettings,
                          autoPlay: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">高质量图片</h3>
                        <p className="text-sm text-gray-400">优先加载高质量图片</p>
                      </div>
                      <Switch
                        isSelected={displaySettings.highQuality}
                        onValueChange={(value) => setDisplaySettings({
                          ...displaySettings,
                          highQuality: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">紧凑模式</h3>
                        <p className="text-sm text-gray-400">使用更紧凑的界面布局</p>
                      </div>
                      <Switch
                        isSelected={displaySettings.compactMode}
                        onValueChange={(value) => setDisplaySettings({
                          ...displaySettings,
                          compactMode: value
                        })}
                      />
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">无障碍设置</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">减少动画</h3>
                        <p className="text-sm text-gray-400">减少界面动画效果</p>
                      </div>
                      <Switch
                        isSelected={displaySettings.reducedMotion}
                        onValueChange={(value) => setDisplaySettings({
                          ...displaySettings,
                          reducedMotion: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">色盲友好模式</h3>
                        <p className="text-sm text-gray-400">启用色盲友好的颜色方案</p>
                      </div>
                      <Switch
                        isSelected={displaySettings.colorBlindMode}
                        onValueChange={(value) => setDisplaySettings({
                          ...displaySettings,
                          colorBlindMode: value
                        })}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        onPress={() => handleSaveSettings('display')}
                      >
                        保存更改
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* 安全设置 */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">账户安全</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">双重认证</h3>
                        <p className="text-sm text-gray-400">为账户添加额外的安全保护</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Chip
                          color={securitySettings.twoFactorAuth ? "success" : "default"}
                          variant="flat"
                          size="sm"
                        >
                          {securitySettings.twoFactorAuth ? "已启用" : "未启用"}
                        </Chip>
                        <Button
                          color="primary"
                          variant="bordered"
                          size="sm"
                        >
                          {securitySettings.twoFactorAuth ? "管理" : "启用"}
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">登录提醒</h3>
                        <p className="text-sm text-gray-400">新设备登录时发送提醒</p>
                      </div>
                      <Switch
                        isSelected={securitySettings.loginAlerts}
                        onValueChange={(value) => setSecuritySettings({
                          ...securitySettings,
                          loginAlerts: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">设备追踪</h3>
                        <p className="text-sm text-gray-400">记录登录设备信息</p>
                      </div>
                      <Switch
                        isSelected={securitySettings.deviceTracking}
                        onValueChange={(value) => setSecuritySettings({
                          ...securitySettings,
                          deviceTracking: value
                        })}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">异常活动监控</h3>
                        <p className="text-sm text-gray-400">监控并提醒异常登录活动</p>
                      </div>
                      <Switch
                        isSelected={securitySettings.suspiciousActivity}
                        onValueChange={(value) => setSecuritySettings({
                          ...securitySettings,
                          suspiciousActivity: value
                        })}
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">会话超时时间</h3>
                      <Select
                        selectedKeys={[securitySettings.sessionTimeout.toString()]}
                        onSelectionChange={(keys) => setSecuritySettings({
                          ...securitySettings,
                          sessionTimeout: parseInt(Array.from(keys)[0])
                        })}
                      >
                        <SelectItem key="15" value="15">15分钟</SelectItem>
                        <SelectItem key="30" value="30">30分钟</SelectItem>
                        <SelectItem key="60" value="60">1小时</SelectItem>
                        <SelectItem key="240" value="240">4小时</SelectItem>
                        <SelectItem key="480" value="480">8小时</SelectItem>
                      </Select>
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">密码安全</h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">密码强度</h3>
                        <p className="text-sm text-gray-400">当前密码安全等级</p>
                      </div>
                      <Chip
                        color={securitySettings.passwordStrength === 'strong' ? 'success' : 'warning'}
                        variant="flat"
                      >
                        {securitySettings.passwordStrength === 'strong' ? '强' : '中等'}
                      </Chip>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">上次修改密码</h3>
                        <p className="text-sm text-gray-400">{securitySettings.lastPasswordChange}</p>
                      </div>
                      <Button
                        color="primary"
                        variant="bordered"
                        onPress={onPasswordOpen}
                      >
                        修改密码
                      </Button>
                    </div>
                  </CardBody>
                </Card>

                <Card className="bg-content1 border-divider">
                  <CardHeader>
                    <h2 className="text-xl font-semibold">活跃会话</h2>
                  </CardHeader>
                  <CardBody>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-gray-400">
                        当前有 {securitySettings.activeSessions} 个活跃会话
                      </p>
                      <Button color="danger" variant="bordered" size="sm">
                        终止所有会话
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-content2 rounded-lg">
                        <div>
                          <p className="font-semibold">当前设备 (Windows)</p>
                          <p className="text-sm text-gray-400">上海, 中国 • 刚刚活跃</p>
                        </div>
                        <Chip color="success" variant="flat" size="sm">
                          当前
                        </Chip>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-content2 rounded-lg">
                        <div>
                          <p className="font-semibold">iPhone</p>
                          <p className="text-sm text-gray-400">上海, 中国 • 2小时前</p>
                        </div>
                        <Button color="danger" variant="light" size="sm">
                          终止
                        </Button>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-content2 rounded-lg">
                        <div>
                          <p className="font-semibold">Chrome (Mac)</p>
                          <p className="text-sm text-gray-400">北京, 中国 • 1天前</p>
                        </div>
                        <Button color="danger" variant="light" size="sm">
                          终止
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button
                        color="primary"
                        onPress={() => handleSaveSettings('security')}
                      >
                        保存更改
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      <Modal
        isOpen={isPasswordOpen}
        onClose={onPasswordClose}
        className="bg-content1"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">修改密码</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="当前密码"
                type="password"
                placeholder="请输入当前密码"
              />

              <Input
                label="新密码"
                type="password"
                placeholder="请输入新密码"
              />

              <Input
                label="确认新密码"
                type="password"
                placeholder="请再次输入新密码"
              />

              <div className="text-sm text-gray-400">
                <p>密码要求：</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>至少8个字符</li>
                  <li>包含大小写字母</li>
                  <li>包含数字</li>
                  <li>包含特殊字符</li>
                </ul>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onPasswordClose}>
              取消
            </Button>
            <Button color="primary" onPress={handleChangePassword}>
              确认修改
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 删除账户模态框 */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        className="bg-content1"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold text-red-400">删除账户</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                <h3 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  警告
                </h3>
                <p className="text-sm text-gray-300">
                  删除账户是不可逆的操作。您将失去：
                </p>
                <ul className="list-disc list-inside mt-2 text-sm text-gray-300 space-y-1">
                  <li>所有个人资料和设置</li>
                  <li>所有创作的内容和作品</li>
                  <li>所有关注者和关注关系</li>
                  <li>所有积分和等级进度</li>
                  <li>所有历史记录和数据</li>
                </ul>
              </div>

              <Input
                label="确认删除"
                placeholder="请输入 '删除我的账户' 来确认"
              />

              <Input
                label="密码确认"
                type="password"
                placeholder="请输入您的密码"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              取消
            </Button>
            <Button color="danger" onPress={handleDeleteAccount}>
              确认删除
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}