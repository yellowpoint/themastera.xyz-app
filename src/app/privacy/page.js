'use client'

import { useState } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Accordion,
  AccordionItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea
} from '@heroui/react'
export default function PrivacyPage() {
  const { isOpen: isContactOpen, onOpen: onContactOpen, onClose: onContactClose } = useDisclosure()
  const [activeSection, setActiveSection] = useState(null)

  const lastUpdated = "2024年1月15日"
  const effectiveDate = "2024年1月15日"

  const privacySections = [
    {
      id: 'overview',
      title: '隐私政策概述',
      icon: '🛡️',
      content: `
        欢迎使用Mastera平台！我们深知个人信息对您的重要性，并会尽力保护您的个人信息安全可靠。
        我们致力于维持您对我们的信任，恪守以下原则，保护您的个人信息：权责一致原则、目的明确原则、
        选择同意原则、最少够用原则、确保安全原则、主体参与原则、公开透明原则等。
        
        本隐私政策适用于您通过计算机设备、移动终端以及其他设备访问和使用我们的产品与/或服务。
      `
    },
    {
      id: 'collection',
      title: '我们收集的信息',
      icon: '📊',
      content: `
        为了向您提供更好的服务，我们可能会收集以下类型的信息：
        
        1. 账户信息：用户名、邮箱地址、手机号码、头像等基本资料
        2. 身份信息：实名认证时提供的姓名、身份证号等
        3. 设备信息：设备型号、操作系统、浏览器类型、IP地址等
        4. 使用信息：访问时间、浏览记录、搜索历史、互动行为等
        5. 位置信息：基于您的授权获取的地理位置信息
        6. 内容信息：您上传、发布、分享的作品、评论、消息等
      `
    },
    {
      id: 'usage',
      title: '信息使用方式',
      icon: '🎯',
      content: `
        我们会基于以下目的使用收集到的信息：
        
        1. 提供服务：创建和管理您的账户，提供平台功能和服务
        2. 改进体验：个性化推荐内容，优化用户界面和功能
        3. 安全保障：防范欺诈、滥用和其他有害活动
        4. 沟通联系：发送重要通知、更新信息和客户服务
        5. 法律合规：遵守适用的法律法规和监管要求
        6. 数据分析：进行匿名化的数据分析以改进我们的服务
      `
    },
    {
      id: 'sharing',
      title: '信息共享与披露',
      icon: '🤝',
      content: `
        我们不会出售、出租或以其他方式披露您的个人信息，除非：
        
        1. 获得您的明确同意
        2. 基于法律要求或政府部门的合法要求
        3. 为保护我们或他人的权利、财产或安全
        4. 与我们的服务提供商共享（仅限于提供服务所需）
        5. 在企业重组、合并或收购中转移
        
        在任何情况下，我们都会要求第三方遵守严格的保密义务。
      `
    },
    {
      id: 'storage',
      title: '信息存储与保护',
      icon: '🔒',
      content: `
        我们采用行业标准的安全措施保护您的个人信息：
        
        1. 数据加密：使用SSL/TLS加密传输，AES加密存储
        2. 访问控制：严格限制员工访问权限，实行最小权限原则
        3. 安全监控：24/7安全监控，及时发现和应对安全威胁
        4. 定期审计：定期进行安全评估和漏洞扫描
        5. 数据备份：建立完善的数据备份和恢复机制
        
        您的个人信息将存储在中国境内的安全服务器上。
      `
    },
    {
      id: 'rights',
      title: '您的权利',
      icon: '⚖️',
      content: `
        根据相关法律法规，您享有以下权利：
        
        1. 知情权：了解我们如何收集、使用您的个人信息
        2. 决定权：选择是否提供个人信息，撤回已给出的同意
        3. 查询权：查询我们持有的您的个人信息
        4. 更正权：要求我们更正不准确或不完整的个人信息
        5. 删除权：在特定情况下要求我们删除您的个人信息
        6. 可携权：要求我们以结构化、通用格式提供您的个人信息
      `
    },
    {
      id: 'cookies',
      title: 'Cookie和类似技术',
      icon: '🍪',
      content: `
        我们使用Cookie和类似技术来改善您的体验：
        
        1. 必要Cookie：确保网站正常运行的基本功能
        2. 性能Cookie：收集网站使用情况的匿名信息
        3. 功能Cookie：记住您的偏好设置和选择
        4. 广告Cookie：提供相关的广告内容
        
        您可以通过浏览器设置管理Cookie偏好，但这可能影响某些功能的使用。
      `
    },
    {
      id: 'minors',
      title: '未成年人保护',
      icon: '👶',
      content: `
        我们非常重视未成年人的个人信息保护：
        
        1. 年龄限制：我们的服务主要面向18岁以上用户
        2. 监护人同意：未满18岁的用户需要监护人同意才能使用我们的服务
        3. 特殊保护：对未成年人的个人信息采用更严格的保护措施
        4. 内容过滤：提供适合未成年人的内容过滤功能
        5. 举报机制：建立便捷的举报渠道保护未成年人权益
      `
    },
    {
      id: 'updates',
      title: '政策更新',
      icon: '🔄',
      content: `
        我们可能会不时更新本隐私政策：
        
        1. 更新通知：重大变更会通过邮件、站内信等方式通知您
        2. 生效时间：更新后的政策将在发布后30天生效
        3. 继续使用：继续使用我们的服务即表示您接受更新后的政策
        4. 版本管理：我们会保留政策的历史版本供您查阅
        
        建议您定期查看本政策以了解最新信息。
      `
    }
  ]

  const quickActions = [
    {
      id: 'download',
      title: '下载我的数据',
      description: '获取我们持有的您的个人信息副本',
      icon: '📥',
      action: '申请下载'
    },
    {
      id: 'delete',
      title: '删除我的账户',
      description: '永久删除您的账户和相关数据',
      icon: '🗑️',
      action: '申请删除'
    },
    {
      id: 'settings',
      title: '隐私设置',
      description: '管理您的隐私偏好和权限',
      icon: '⚙️',
      action: '前往设置'
    },
    {
      id: 'contact',
      title: '联系我们',
      description: '就隐私问题联系我们的团队',
      icon: '📞',
      action: '立即联系'
    }
  ]

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'download':
        console.log('申请下载数据')
        break
      case 'delete':
        console.log('申请删除账户')
        break
      case 'settings':
        console.log('前往隐私设置')
        break
      case 'contact':
        onContactOpen()
        break
      default:
        break
    }
  }

  const handleContactSubmit = () => {
    console.log('提交隐私咨询')
    onContactClose()
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🛡️</div>
          <h1 className="text-4xl font-bold mb-4">隐私政策</h1>
          <p className="text-xl text-gray-400 mb-6">
            我们承诺保护您的隐私和个人信息安全
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Chip color="success" variant="flat" size="sm">生效日期</Chip>
              <span>{effectiveDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Chip color="primary" variant="flat" size="sm">最后更新</Chip>
              <span>{lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <Card className="bg-content1 border-divider mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold">⚡ 快速操作</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <div
                  key={action.id}
                  className="bg-content2 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => handleQuickAction(action.id)}
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{action.description}</p>
                  <Button size="sm" color="primary" variant="bordered" className="w-full">
                    {action.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* 政策内容 */}
        <Card className="bg-content1 border-divider mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold">📋 政策详情</h2>
          </CardHeader>
          <CardBody>
            <Accordion variant="splitted" className="space-y-4">
              {privacySections.map((section) => (
                <AccordionItem
                  key={section.id}
                  title={
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{section.icon}</span>
                      <span className="font-semibold">{section.title}</span>
                    </div>
                  }
                  className="bg-content2 border-divider"
                >
                  <div className="pb-4">
                    <div className="prose prose-invert max-w-none">
                      {section.content.split('\n').map((paragraph, index) => (
                        paragraph.trim() && (
                          <p key={index} className="text-gray-300 mb-3 leading-relaxed">
                            {paragraph.trim()}
                          </p>
                        )
                      ))}
                    </div>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </CardBody>
        </Card>

        {/* 重要提醒 */}
        <Card className="bg-gradient-to-r from-lime-400/10 to-green-400/10 border-lime-400/20 mb-8">
          <CardBody className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">💡</div>
              <div>
                <h3 className="text-lg font-semibold text-lime-400 mb-2">重要提醒</h3>
                <div className="space-y-2 text-gray-300">
                  <p>• 我们承诺不会出售您的个人信息给第三方</p>
                  <p>• 您可以随时查看、修改或删除您的个人信息</p>
                  <p>• 我们使用行业领先的安全技术保护您的数据</p>
                  <p>• 如有隐私相关问题，请随时联系我们</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 联系信息 */}
        <Card className="bg-content1 border-divider">
          <CardHeader>
            <h2 className="text-xl font-bold">📞 联系我们</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">📧</div>
                <h3 className="font-semibold mb-1">邮件咨询</h3>
                <p className="text-gray-400 text-sm mb-2">privacy@mastera.xyz</p>
                <p className="text-xs text-gray-500">24小时内回复</p>
              </div>

              <div className="text-center">
                <div className="text-3xl mb-2">💬</div>
                <h3 className="font-semibold mb-1">在线客服</h3>
                <p className="text-gray-400 text-sm mb-2">工作时间：9:00-21:00</p>
                <Button size="sm" color="primary" onPress={onContactOpen}>
                  立即咨询
                </Button>
              </div>

              <div className="text-center">
                <div className="text-3xl mb-2">📍</div>
                <h3 className="font-semibold mb-1">公司地址</h3>
                <p className="text-gray-400 text-sm mb-2">北京市朝阳区xxx大厦</p>
                <p className="text-xs text-gray-500">邮编：100000</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </main>

      <Modal
        isOpen={isContactOpen}
        onClose={onContactClose}
        size="2xl"
        className="bg-content1"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">🛡️ 隐私咨询</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="bg-lime-400/10 border border-lime-400/20 p-4 rounded-lg">
                <h4 className="font-semibold text-lime-400 mb-2">📋 常见隐私问题</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 如何查看我的个人信息？</li>
                  <li>• 如何删除我的账户数据？</li>
                  <li>• 你们会与第三方分享我的信息吗？</li>
                  <li>• 如何修改我的隐私设置？</li>
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
                placeholder="请简要描述您的隐私问题"
              />

              <Textarea
                label="详细描述"
                placeholder="请详细描述您的隐私相关问题或需求"
                minRows={4}
              />

              <div className="bg-content2 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">⏰ 响应时间</h4>
                <p className="text-sm text-gray-400">
                  我们承诺在收到您的隐私咨询后24小时内给予回复，复杂问题可能需要3-5个工作日。
                </p>
              </div>
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