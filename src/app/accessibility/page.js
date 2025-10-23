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
  Select,
  SelectItem,
  Slider
} from '@heroui/react'
export default function AccessibilityPage() {
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure()
  const { isOpen: isFeedbackOpen, onOpen: onFeedbackOpen, onClose: onFeedbackClose } = useDisclosure()
  const { isOpen: isSupportOpen, onOpen: onSupportOpen, onClose: onSupportClose } = useDisclosure()

  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNav: true,
    audioDescriptions: false,
    fontSize: 16,
    lineHeight: 1.5
  })

  const lastUpdated = "2024年1月15日"

  const accessibilityFeatures = [
    {
      id: 'visual',
      title: '视觉辅助功能',
      icon: '👁️',
      features: [
        {
          name: '高对比度模式',
          description: '提供高对比度的颜色方案，帮助视力障碍用户更好地识别内容',
          status: 'available',
          wcag: 'AA'
        },
        {
          name: '字体大小调节',
          description: '支持调整字体大小，最大可放大到200%',
          status: 'available',
          wcag: 'AA'
        },
        {
          name: '颜色识别',
          description: '不仅依赖颜色传达信息，同时使用图标和文字说明',
          status: 'available',
          wcag: 'AA'
        },
        {
          name: '焦点指示器',
          description: '清晰的焦点指示器，帮助键盘用户导航',
          status: 'available',
          wcag: 'AA'
        }
      ]
    },
    {
      id: 'auditory',
      title: '听觉辅助功能',
      icon: '🔊',
      features: [
        {
          name: '字幕支持',
          description: '为所有视频内容提供准确的字幕',
          status: 'available',
          wcag: 'AA'
        },
        {
          name: '音频描述',
          description: '为视频内容提供音频描述，帮助视障用户理解视觉内容',
          status: 'planned',
          wcag: 'AA'
        },
        {
          name: '静音选项',
          description: '允许用户控制自动播放的音频内容',
          status: 'available',
          wcag: 'A'
        },
        {
          name: '音量控制',
          description: '独立的音量控制，不依赖系统音量',
          status: 'available',
          wcag: 'A'
        }
      ]
    },
    {
      id: 'motor',
      title: '运动辅助功能',
      icon: '⌨️',
      features: [
        {
          name: '键盘导航',
          description: '完整的键盘导航支持，无需鼠标即可使用所有功能',
          status: 'available',
          wcag: 'A'
        },
        {
          name: '点击目标大小',
          description: '所有可点击元素至少44x44像素，便于操作',
          status: 'available',
          wcag: 'AA'
        },
        {
          name: '拖拽替代方案',
          description: '为拖拽操作提供键盘和按钮替代方案',
          status: 'available',
          wcag: 'AA'
        },
        {
          name: '超时控制',
          description: '允许用户延长或取消会话超时',
          status: 'available',
          wcag: 'A'
        }
      ]
    },
    {
      id: 'cognitive',
      title: '认知辅助功能',
      icon: '🧠',
      features: [
        {
          name: '简化界面',
          description: '提供简化的界面选项，减少认知负担',
          status: 'planned',
          wcag: 'AAA'
        },
        {
          name: '错误预防',
          description: '在用户提交重要操作前提供确认机制',
          status: 'available',
          wcag: 'AA'
        },
        {
          name: '帮助文档',
          description: '为复杂功能提供上下文帮助和说明',
          status: 'available',
          wcag: 'AAA'
        },
        {
          name: '减少动画',
          description: '尊重用户的减少动画偏好设置',
          status: 'available',
          wcag: 'AAA'
        }
      ]
    }
  ]

  const screenReaderSupport = [
    {
      name: 'NVDA',
      compatibility: '完全支持',
      version: '2023.1+',
      notes: '推荐使用最新版本以获得最佳体验'
    },
    {
      name: 'JAWS',
      compatibility: '完全支持',
      version: '2022+',
      notes: '支持所有主要功能和导航'
    },
    {
      name: 'VoiceOver',
      compatibility: '完全支持',
      version: 'macOS 12+',
      notes: 'Safari浏览器中体验最佳'
    },
    {
      name: 'TalkBack',
      compatibility: '基本支持',
      version: 'Android 10+',
      notes: '移动端功能持续优化中'
    }
  ]

  const keyboardShortcuts = [
    { key: 'Tab', action: '在可聚焦元素间导航' },
    { key: 'Shift + Tab', action: '反向导航' },
    { key: 'Enter', action: '激活按钮或链接' },
    { key: 'Space', action: '激活按钮或复选框' },
    { key: 'Esc', action: '关闭模态框或菜单' },
    { key: 'Arrow Keys', action: '在菜单或选项间导航' },
    { key: 'Home', action: '跳转到页面或列表开头' },
    { key: 'End', action: '跳转到页面或列表结尾' },
    { key: 'Ctrl + F', action: '页面内搜索' },
    { key: 'Alt + 1-6', action: '跳转到对应级别的标题' }
  ]

  const handleSettingToggle = (setting) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const handleSliderChange = (setting, value) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const handleSaveSettings = () => {
    console.log('保存无障碍设置:', accessibilitySettings)
    onSettingsClose()
  }

  const handleFeedbackSubmit = () => {
    console.log('提交无障碍反馈')
    onFeedbackClose()
  }

  const handleSupportRequest = () => {
    console.log('请求无障碍支持')
    onSupportClose()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success'
      case 'planned': return 'warning'
      case 'development': return 'primary'
      default: return 'default'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return '已实现'
      case 'planned': return '计划中'
      case 'development': return '开发中'
      default: return '未知'
    }
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">♿</div>
          <h1 className="text-4xl font-bold mb-4">无障碍访问</h1>
          <p className="text-xl text-gray-400 mb-6">
            我们致力于为所有用户提供平等、便利的数字体验
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Chip color="success" variant="flat" size="sm">WCAG 2.1</Chip>
              <span>AA级别合规</span>
            </div>
            <div className="flex items-center gap-2">
              <Chip color="primary" variant="flat" size="sm">最后更新</Chip>
              <span>{lastUpdated}</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button color="primary" onPress={onSettingsOpen}>
              个性化设置
            </Button>
            <Button variant="bordered" onPress={onFeedbackOpen}>
              反馈建议
            </Button>
            <Button color="success" variant="bordered" onPress={onSupportOpen}>
              获取支持
            </Button>
          </div>
        </div>

        {/* 无障碍承诺 */}
        <Card className="bg-gradient-to-r from-blue-400/10 to-green-400/10 border-blue-400/20 mb-8">
          <CardBody className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🤝</div>
              <div>
                <h2 className="text-xl font-bold text-blue-400 mb-3">我们的承诺</h2>
                <p className="text-gray-300 mb-4">
                  Mastera致力于确保我们的平台对所有用户都是可访问的，无论其能力或使用的技术如何。
                  我们遵循Web内容无障碍指南(WCAG) 2.1 AA级别标准。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                    <div className="text-2xl mb-1">👁️</div>
                    <h4 className="font-semibold text-sm">视觉</h4>
                    <p className="text-xs text-gray-400">视力障碍支持</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                    <div className="text-2xl mb-1">🔊</div>
                    <h4 className="font-semibold text-sm">听觉</h4>
                    <p className="text-xs text-gray-400">听力障碍支持</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                    <div className="text-2xl mb-1">⌨️</div>
                    <h4 className="font-semibold text-sm">运动</h4>
                    <p className="text-xs text-gray-400">运动障碍支持</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg text-center">
                    <div className="text-2xl mb-1">🧠</div>
                    <h4 className="font-semibold text-sm">认知</h4>
                    <p className="text-xs text-gray-400">认知障碍支持</p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 无障碍功能详情 */}
        <Card className="bg-content1 border-divider mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold">🛠️ 无障碍功能</h2>
          </CardHeader>
          <CardBody>
            <Accordion variant="splitted" className="space-y-4">
              {accessibilityFeatures.map((category) => (
                <AccordionItem
                  key={category.id}
                  title={
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-semibold">{category.title}</span>
                      <Chip size="sm" color="primary" variant="flat">
                        {category.features.length} 项功能
                      </Chip>
                    </div>
                  }
                  className="bg-gray-800 border-gray-700"
                >
                  <div className="pb-4 space-y-4">
                    {category.features.map((feature, index) => (
                      <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{feature.name}</h4>
                          <div className="flex gap-2">
                            <Chip
                              size="sm"
                              color={getStatusColor(feature.status)}
                              variant="flat"
                            >
                              {getStatusText(feature.status)}
                            </Chip>
                            <Chip size="sm" variant="bordered">
                              WCAG {feature.wcag}
                            </Chip>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </CardBody>
        </Card>

        {/* 屏幕阅读器支持 */}
        <Card className="bg-content1 border-divider mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold">📱 屏幕阅读器支持</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-400 mb-4">
              我们测试并支持以下主流屏幕阅读器：
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {screenReaderSupport.map((reader, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{reader.name}</h4>
                    <Chip
                      size="sm"
                      color={reader.compatibility === '完全支持' ? 'success' : 'warning'}
                      variant="flat"
                    >
                      {reader.compatibility}
                    </Chip>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">版本要求: {reader.version}</p>
                  <p className="text-xs text-gray-500">{reader.notes}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* 键盘快捷键 */}
        <Card className="bg-content1 border-divider mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold">⌨️ 键盘快捷键</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-400 mb-4">
              以下是平台支持的键盘快捷键，帮助您更高效地导航：
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keyboardShortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Chip size="sm" variant="bordered" className="font-mono">
                      {shortcut.key}
                    </Chip>
                    <span className="text-sm text-gray-300">{shortcut.action}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-blue-400/10 border border-blue-400/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-400 mb-2">💡 导航提示</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• 使用Tab键在页面元素间导航</li>
                <li>• 按Enter键激活链接和按钮</li>
                <li>• 使用箭头键在菜单和列表中导航</li>
                <li>• 按Esc键关闭弹出窗口</li>
              </ul>
            </div>
          </CardBody>
        </Card>

        {/* 技术规范 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-400/10 to-blue-400/10 border-green-400/20">
            <CardHeader>
              <h3 className="text-lg font-bold text-green-400">✅ 合规标准</h3>
            </CardHeader>
            <CardBody>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• WCAG 2.1 AA级别合规</li>
                <li>• Section 508标准支持</li>
                <li>• EN 301 549欧盟标准</li>
                <li>• ADA美国残疾人法案</li>
                <li>• 定期无障碍审计</li>
                <li>• 用户测试验证</li>
              </ul>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-purple-400/10 to-pink-400/10 border-purple-400/20">
            <CardHeader>
              <h3 className="text-lg font-bold text-purple-400">🔧 技术实现</h3>
            </CardHeader>
            <CardBody>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• 语义化HTML结构</li>
                <li>• ARIA标签和属性</li>
                <li>• 键盘导航支持</li>
                <li>• 屏幕阅读器优化</li>
                <li>• 响应式设计</li>
                <li>• 性能优化</li>
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* 持续改进 */}
        <Card className="bg-gradient-to-r from-orange-400/10 to-red-400/10 border-orange-400/20 mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold text-orange-400">🚀 持续改进</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <p className="text-gray-300">
                我们持续努力改进平台的无障碍性，包括：
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🔍</div>
                  <h4 className="font-semibold mb-2">定期审计</h4>
                  <p className="text-sm text-gray-400">每季度进行无障碍审计</p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">👥</div>
                  <h4 className="font-semibold mb-2">用户反馈</h4>
                  <p className="text-sm text-gray-400">收集并响应用户建议</p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">📚</div>
                  <h4 className="font-semibold mb-2">团队培训</h4>
                  <p className="text-sm text-gray-400">定期进行无障碍培训</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 联系支持 */}
        <Card className="bg-content1 border-divider">
          <CardHeader>
            <h2 className="text-xl font-bold">📞 获取支持</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-300 mb-4">
              如果您在使用过程中遇到无障碍问题，请联系我们：
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">📧</div>
                <h4 className="font-semibold mb-1">邮箱支持</h4>
                <p className="text-sm text-gray-400">accessibility@mastera.xyz</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">💬</div>
                <h4 className="font-semibold mb-1">在线客服</h4>
                <p className="text-sm text-gray-400">24/7 无障碍支持</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">📱</div>
                <h4 className="font-semibold mb-1">专线电话</h4>
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
        className="bg-gray-900"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">⚙️ 无障碍个性化设置</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <div className="bg-blue-400/10 border border-blue-400/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-400 mb-2">ℹ️ 设置说明</h4>
                <p className="text-sm text-gray-300">
                  根据您的需求调整以下设置，以获得最佳的使用体验。
                </p>
              </div>

              <div className="space-y-6">
                {/* 视觉设置 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-400">👁️ 视觉设置</h3>

                  <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">高对比度模式</h4>
                        <p className="text-sm text-gray-400">增强颜色对比度，提高可读性</p>
                      </div>
                      <Switch
                        isSelected={accessibilitySettings.highContrast}
                        onValueChange={() => handleSettingToggle('highContrast')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">大字体模式</h4>
                        <p className="text-sm text-gray-400">使用更大的字体显示</p>
                      </div>
                      <Switch
                        isSelected={accessibilitySettings.largeText}
                        onValueChange={() => handleSettingToggle('largeText')}
                      />
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">字体大小</h4>
                      <Slider
                        size="sm"
                        step={2}
                        minValue={12}
                        maxValue={24}
                        value={accessibilitySettings.fontSize}
                        onChange={(value) => handleSliderChange('fontSize', value)}
                        className="max-w-md"
                      />
                      <p className="text-sm text-gray-400">{accessibilitySettings.fontSize}px</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">行高</h4>
                      <Slider
                        size="sm"
                        step={0.1}
                        minValue={1.0}
                        maxValue={2.0}
                        value={accessibilitySettings.lineHeight}
                        onChange={(value) => handleSliderChange('lineHeight', value)}
                        className="max-w-md"
                      />
                      <p className="text-sm text-gray-400">{accessibilitySettings.lineHeight}</p>
                    </div>
                  </div>
                </div>

                {/* 运动设置 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400">⌨️ 运动设置</h3>

                  <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">减少动画</h4>
                        <p className="text-sm text-gray-400">减少或禁用页面动画效果</p>
                      </div>
                      <Switch
                        isSelected={accessibilitySettings.reducedMotion}
                        onValueChange={() => handleSettingToggle('reducedMotion')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">键盘导航增强</h4>
                        <p className="text-sm text-gray-400">增强键盘导航的视觉反馈</p>
                      </div>
                      <Switch
                        isSelected={accessibilitySettings.keyboardNav}
                        onValueChange={() => handleSettingToggle('keyboardNav')}
                      />
                    </div>
                  </div>
                </div>

                {/* 辅助技术 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-400">🔊 辅助技术</h3>

                  <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">屏幕阅读器优化</h4>
                        <p className="text-sm text-gray-400">优化屏幕阅读器的使用体验</p>
                      </div>
                      <Switch
                        isSelected={accessibilitySettings.screenReader}
                        onValueChange={() => handleSettingToggle('screenReader')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">音频描述</h4>
                        <p className="text-sm text-gray-400">为视频内容启用音频描述</p>
                      </div>
                      <Switch
                        isSelected={accessibilitySettings.audioDescriptions}
                        onValueChange={() => handleSettingToggle('audioDescriptions')}
                      />
                    </div>
                  </div>
                </div>
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

      {/* 反馈建议模态框 */}
      <Modal
        isOpen={isFeedbackOpen}
        onClose={onFeedbackClose}
        size="2xl"
        className="bg-gray-900"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">💬 无障碍反馈</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="bg-green-400/10 border border-green-400/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-400 mb-2">🙏 感谢您的反馈</h4>
                <p className="text-sm text-gray-300">
                  您的反馈对我们改进无障碍功能非常重要，请详细描述您遇到的问题或建议。
                </p>
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

              <Select
                label="反馈类型"
                placeholder="请选择反馈类型"
              >
                <SelectItem key="bug" value="bug">功能问题</SelectItem>
                <SelectItem key="suggestion" value="suggestion">改进建议</SelectItem>
                <SelectItem key="accessibility" value="accessibility">无障碍问题</SelectItem>
                <SelectItem key="other" value="other">其他</SelectItem>
              </Select>

              <Select
                label="使用的辅助技术"
                placeholder="请选择您使用的辅助技术（可选）"
              >
                <SelectItem key="nvda" value="nvda">NVDA</SelectItem>
                <SelectItem key="jaws" value="jaws">JAWS</SelectItem>
                <SelectItem key="voiceover" value="voiceover">VoiceOver</SelectItem>
                <SelectItem key="talkback" value="talkback">TalkBack</SelectItem>
                <SelectItem key="keyboard" value="keyboard">仅键盘导航</SelectItem>
                <SelectItem key="other" value="other">其他</SelectItem>
              </Select>

              <Textarea
                label="详细描述"
                placeholder="请详细描述您遇到的问题或建议"
                minRows={4}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onFeedbackClose}>
              取消
            </Button>
            <Button color="primary" onPress={handleFeedbackSubmit}>
              提交反馈
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 获取支持模态框 */}
      <Modal
        isOpen={isSupportOpen}
        onClose={onSupportClose}
        size="2xl"
        className="bg-gray-900"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">🆘 无障碍支持</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="bg-blue-400/10 border border-blue-400/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-400 mb-2">📋 支持服务</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 无障碍功能使用指导</li>
                  <li>• 辅助技术配置帮助</li>
                  <li>• 个性化设置建议</li>
                  <li>• 技术问题解决</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="姓名"
                  placeholder="请输入您的姓名"
                />
                <Input
                  label="联系电话"
                  placeholder="请输入您的联系电话"
                />
              </div>

              <Input
                label="邮箱"
                placeholder="请输入您的邮箱"
                type="email"
              />

              <Select
                label="需要支持的类型"
                placeholder="请选择您需要的支持类型"
              >
                <SelectItem key="setup" value="setup">功能设置指导</SelectItem>
                <SelectItem key="technical" value="technical">技术问题解决</SelectItem>
                <SelectItem key="training" value="training">使用培训</SelectItem>
                <SelectItem key="consultation" value="consultation">无障碍咨询</SelectItem>
              </Select>

              <Textarea
                label="详细说明"
                placeholder="请详细说明您需要的支持或遇到的问题"
                minRows={4}
              />

              <div className="bg-yellow-400/10 border border-yellow-400/20 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-400 mb-2">⏰ 响应时间</h4>
                <p className="text-sm text-gray-300">
                  我们会在24小时内回复您的支持请求，紧急问题请直接拨打客服热线。
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onSupportClose}>
              取消
            </Button>
            <Button color="success" onPress={handleSupportRequest}>
              提交请求
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}