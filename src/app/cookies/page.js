'use client'

import { useState } from 'react'
import { 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Chip,
  Switch,
  Accordion,
  AccordionItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@heroui/react'
export default function CookiesPage() {
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure()
  const { isOpen: isContactOpen, onOpen: onContactOpen, onClose: onContactClose } = useDisclosure()
  
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true, // 必要Cookie不能关闭
    functional: true,
    analytics: true,
    marketing: false,
    social: true
  })

  const lastUpdated = "2024年1月15日"

  const cookieTypes = [
    {
      id: 'necessary',
      name: '必要Cookie',
      icon: '🔒',
      required: true,
      description: '这些Cookie对网站正常运行是必需的，无法禁用',
      purpose: '用户身份验证、安全防护、基本功能实现',
      examples: ['登录状态', '安全令牌', '语言设置', '主题偏好'],
      retention: '会话期间或最长30天',
      thirdParty: false
    },
    {
      id: 'functional',
      name: '功能Cookie',
      icon: '⚙️',
      required: false,
      description: '这些Cookie用于增强网站功能和用户体验',
      purpose: '记住用户偏好、提供个性化功能',
      examples: ['界面布局', '搜索历史', '播放设置', '通知偏好'],
      retention: '最长1年',
      thirdParty: false
    },
    {
      id: 'analytics',
      name: '分析Cookie',
      icon: '📊',
      required: false,
      description: '帮助我们了解用户如何使用网站，以改进服务',
      purpose: '网站性能分析、用户行为统计、错误监控',
      examples: ['页面访问量', '用户路径', '停留时间', '设备信息'],
      retention: '最长2年',
      thirdParty: true
    },
    {
      id: 'marketing',
      name: '营销Cookie',
      icon: '📢',
      required: false,
      description: '用于投放相关广告和营销内容',
      purpose: '个性化广告、营销效果追踪',
      examples: ['广告偏好', '转化追踪', '重定向', '推荐内容'],
      retention: '最长1年',
      thirdParty: true
    },
    {
      id: 'social',
      name: '社交媒体Cookie',
      icon: '🌐',
      required: false,
      description: '用于社交媒体功能和内容分享',
      purpose: '社交分享、第三方登录、嵌入内容',
      examples: ['分享按钮', '社交登录', '嵌入视频', '评论系统'],
      retention: '最长6个月',
      thirdParty: true
    }
  ]

  const thirdPartyCookies = [
    {
      provider: 'Google Analytics',
      purpose: '网站分析',
      cookies: ['_ga', '_gid', '_gat'],
      retention: '2年',
      privacy: 'https://policies.google.com/privacy'
    },
    {
      provider: 'YouTube',
      purpose: '视频播放',
      cookies: ['VISITOR_INFO1_LIVE', 'YSC'],
      retention: '6个月',
      privacy: 'https://policies.google.com/privacy'
    },
    {
      provider: 'Facebook',
      purpose: '社交功能',
      cookies: ['_fbp', 'fr'],
      retention: '3个月',
      privacy: 'https://www.facebook.com/privacy/policy'
    },
    {
      provider: 'Twitter',
      purpose: '社交分享',
      cookies: ['personalization_id', 'guest_id'],
      retention: '2年',
      privacy: 'https://twitter.com/privacy'
    }
  ]

  const handleCookieToggle = (type) => {
    if (type === 'necessary') return // 必要Cookie不能关闭
    
    setCookieSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const handleSaveSettings = () => {
    console.log('保存Cookie设置:', cookieSettings)
    onSettingsClose()
  }

  const handleContactSubmit = () => {
    console.log('提交Cookie相关咨询')
    onContactClose()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🍪</div>
          <h1 className="text-4xl font-bold mb-4">Cookie政策</h1>
          <p className="text-xl text-gray-400 mb-6">
            了解我们如何使用Cookie来改善您的浏览体验
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Chip color="primary" variant="flat" size="sm">最后更新</Chip>
              <span>{lastUpdated}</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button color="primary" onPress={onSettingsOpen}>
              管理Cookie设置
            </Button>
            <Button variant="bordered" onPress={onContactOpen}>
              联系我们
            </Button>
          </div>
        </div>

        {/* Cookie简介 */}
        <Card className="bg-gradient-to-r from-blue-400/10 to-purple-400/10 border-blue-400/20 mb-8">
          <CardBody className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">ℹ️</div>
              <div>
                <h2 className="text-xl font-bold text-blue-400 mb-3">什么是Cookie？</h2>
                <p className="text-gray-300 mb-4">
                  Cookie是存储在您设备上的小型文本文件，用于记住您的偏好设置和浏览行为。
                  它们帮助我们提供更好的用户体验，并了解网站的使用情况。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-1">✅ 改善体验</h4>
                    <p className="text-sm text-gray-400">记住您的偏好和设置</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-1">📊 分析使用</h4>
                    <p className="text-sm text-gray-400">了解网站使用情况</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <h4 className="font-semibold text-purple-400 mb-1">🎯 个性化</h4>
                    <p className="text-sm text-gray-400">提供相关内容推荐</p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Cookie类型详情 */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold">🍪 Cookie类型详情</h2>
          </CardHeader>
          <CardBody>
            <Accordion variant="splitted" className="space-y-4">
              {cookieTypes.map((type) => (
                <AccordionItem
                  key={type.id}
                  title={
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{type.icon}</span>
                        <div>
                          <span className="font-semibold">{type.name}</span>
                          {type.required && (
                            <Chip color="danger" size="sm" className="ml-2">必需</Chip>
                          )}
                          {type.thirdParty && (
                            <Chip color="warning" size="sm" className="ml-2">第三方</Chip>
                          )}
                        </div>
                      </div>
                      <Switch
                        isSelected={cookieSettings[type.id]}
                        onValueChange={() => handleCookieToggle(type.id)}
                        isDisabled={type.required}
                        size="sm"
                      />
                    </div>
                  }
                  className="bg-gray-800 border-gray-700"
                >
                  <div className="pb-4 space-y-4">
                    <p className="text-gray-300">{type.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">🎯 用途</h4>
                        <p className="text-sm text-gray-400">{type.purpose}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-400 mb-2">⏰ 保留期限</h4>
                        <p className="text-sm text-gray-400">{type.retention}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-purple-400 mb-2">📋 示例</h4>
                      <div className="flex flex-wrap gap-2">
                        {type.examples.map((example, index) => (
                          <Chip key={index} size="sm" variant="flat" color="secondary">
                            {example}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </CardBody>
        </Card>

        {/* 第三方Cookie */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold">🌐 第三方Cookie</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-400 mb-4">
              我们使用以下第三方服务，它们可能会设置自己的Cookie：
            </p>
            
            <Table 
              aria-label="第三方Cookie表格"
              className="bg-gray-800"
              removeWrapper
            >
              <TableHeader>
                <TableColumn>服务提供商</TableColumn>
                <TableColumn>用途</TableColumn>
                <TableColumn>Cookie名称</TableColumn>
                <TableColumn>保留期限</TableColumn>
                <TableColumn>隐私政策</TableColumn>
              </TableHeader>
              <TableBody>
                {thirdPartyCookies.map((provider, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-semibold">{provider.provider}</TableCell>
                    <TableCell>{provider.purpose}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {provider.cookies.map((cookie, i) => (
                          <Chip key={i} size="sm" variant="flat">
                            {cookie}
                          </Chip>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{provider.retention}</TableCell>
                    <TableCell>
                      <Button
                        as="a"
                        href={provider.privacy}
                        target="_blank"
                        size="sm"
                        variant="light"
                        color="primary"
                      >
                        查看
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Cookie管理 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-400/10 to-blue-400/10 border-green-400/20">
            <CardHeader>
              <h3 className="text-lg font-bold text-green-400">⚙️ 浏览器设置</h3>
            </CardHeader>
            <CardBody>
              <p className="text-gray-300 mb-4">
                您可以通过浏览器设置来管理Cookie：
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Chrome: 设置 → 隐私和安全 → Cookie</li>
                <li>• Firefox: 选项 → 隐私与安全 → Cookie</li>
                <li>• Safari: 偏好设置 → 隐私 → Cookie</li>
                <li>• Edge: 设置 → Cookie和网站权限</li>
              </ul>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-orange-400/10 to-red-400/10 border-orange-400/20">
            <CardHeader>
              <h3 className="text-lg font-bold text-orange-400">⚠️ 重要提醒</h3>
            </CardHeader>
            <CardBody>
              <p className="text-gray-300 mb-4">
                禁用某些Cookie可能会影响网站功能：
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• 无法保持登录状态</li>
                <li>• 丢失个人偏好设置</li>
                <li>• 某些功能可能无法正常工作</li>
                <li>• 无法获得个性化体验</li>
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* 用户权利 */}
        <Card className="bg-gradient-to-r from-purple-400/10 to-pink-400/10 border-purple-400/20 mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold text-purple-400">👤 您的权利</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">✅ 您有权利：</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• 了解我们使用哪些Cookie</li>
                  <li>• 选择接受或拒绝非必要Cookie</li>
                  <li>• 随时更改Cookie设置</li>
                  <li>• 删除已存储的Cookie</li>
                  <li>• 获得Cookie使用的详细信息</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">📋 如何行使权利：</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• 使用我们的Cookie设置工具</li>
                  <li>• 通过浏览器设置管理Cookie</li>
                  <li>• 联系我们的客服团队</li>
                  <li>• 定期检查和更新设置</li>
                  <li>• 查看我们的隐私政策</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 联系信息 */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <h2 className="text-xl font-bold">📞 联系我们</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-300 mb-4">
              如果您对我们的Cookie政策有任何疑问，请随时联系我们：
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">📧</div>
                <h4 className="font-semibold mb-1">邮箱咨询</h4>
                <p className="text-sm text-gray-400">privacy@mastera.xyz</p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">💬</div>
                <h4 className="font-semibold mb-1">在线客服</h4>
                <p className="text-sm text-gray-400">工作日 9:00-18:00</p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">📱</div>
                <h4 className="font-semibold mb-1">客服热线</h4>
                <p className="text-sm text-gray-400">400-123-4567</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </main>

      <Modal 
        isOpen={isSettingsOpen} 
        onClose={onSettingsClose}
        size="3xl"
        className="bg-gray-900 text-white"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">🍪 Cookie设置</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <div className="bg-blue-400/10 border border-blue-400/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-400 mb-2">ℹ️ 设置说明</h4>
                <p className="text-sm text-gray-300">
                  您可以选择接受或拒绝不同类型的Cookie。请注意，禁用某些Cookie可能会影响网站的正常功能。
                </p>
              </div>

              <div className="space-y-4">
                {cookieTypes.map((type) => (
                  <div key={type.id} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{type.icon}</span>
                        <div>
                          <h4 className="font-semibold">{type.name}</h4>
                          {type.required && (
                            <Chip color="danger" size="sm" className="mt-1">必需</Chip>
                          )}
                        </div>
                      </div>
                      <Switch
                        isSelected={cookieSettings[type.id]}
                        onValueChange={() => handleCookieToggle(type.id)}
                        isDisabled={type.required}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{type.description}</p>
                    <p className="text-xs text-gray-500">保留期限: {type.retention}</p>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-400/10 border border-yellow-400/20 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-400 mb-2">⚠️ 重要提醒</h4>
                <p className="text-sm text-gray-300">
                  更改Cookie设置后，您可能需要重新登录或重新配置某些偏好设置。
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onSettingsClose}>
              取消
            </Button>
            <Button color="primary" onPress={handleSaveSettings}>
              保存设置
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 联系咨询模态框 */}
      <Modal 
        isOpen={isContactOpen} 
        onClose={onContactClose}
        size="2xl"
        className="bg-gray-900 text-white"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">📞 Cookie相关咨询</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="bg-green-400/10 border border-green-400/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-400 mb-2">💡 常见问题</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Cookie的具体用途和作用</li>
                  <li>• 如何管理和删除Cookie</li>
                  <li>• 第三方Cookie的隐私影响</li>
                  <li>• Cookie设置对功能的影响</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="姓名"
                  placeholder="请输入您的姓名"
                />
                <Input
                  label="邮箱"
                  placeholder="请输入您的邮箱"
                  type="email"
                />
              </div>
              
              <Input
                label="咨询主题"
                placeholder="请简要描述您的Cookie相关问题"
              />
              
              <Textarea
                label="详细描述"
                placeholder="请详细描述您的问题或需要了解的内容"
                minRows={4}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onContactClose}>
              取消
            </Button>
            <Button color="primary" onPress={handleContactSubmit}>
              提交咨询
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}