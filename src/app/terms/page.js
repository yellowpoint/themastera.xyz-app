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
  Textarea,
  Checkbox
} from '@heroui/react'
export default function TermsPage() {
  const { isOpen: isContactOpen, onOpen: onContactOpen, onClose: onContactClose } = useDisclosure()
  const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure()
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const lastUpdated = "2024年1月15日"
  const effectiveDate = "2024年1月15日"

  const termsSections = [
    {
      id: 'acceptance',
      title: '条款接受',
      icon: '✅',
      content: `
        欢迎使用Mastera平台！通过访问或使用我们的服务，您同意受本服务条款的约束。
        如果您不同意这些条款，请不要使用我们的服务。
        
        本条款构成您与Mastera之间具有法律约束力的协议。我们保留随时修改这些条款的权利，
        修改后的条款将在发布后生效。继续使用我们的服务即表示您接受修改后的条款。
      `
    },
    {
      id: 'services',
      title: '服务描述',
      icon: '🎯',
      content: `
        Mastera是一个创意内容分享和交流平台，提供以下服务：
        
        1. 内容创作与分享：用户可以上传、发布和分享各类创意作品
        2. 社区互动：用户可以关注创作者、加入圈子、参与讨论
        3. 积分系统：通过平台活动获得积分，兑换各种权益
        4. 创作者工具：为创作者提供作品管理、数据分析等工具
        5. 推荐系统：基于用户偏好推荐相关内容和创作者
        
        我们保留随时修改、暂停或终止任何服务的权利。
      `
    },
    {
      id: 'registration',
      title: '用户注册',
      icon: '📝',
      content: `
        使用我们的服务需要注册账户，您需要：
        
        1. 提供真实、准确、完整的注册信息
        2. 及时更新您的账户信息以保持准确性
        3. 保护您的账户安全，不与他人共享登录凭据
        4. 对您账户下的所有活动承担责任
        5. 年满18周岁或在监护人同意下使用服务
        
        我们保留拒绝注册申请或终止账户的权利。
      `
    },
    {
      id: 'conduct',
      title: '用户行为规范',
      icon: '⚖️',
      content: `
        使用我们的服务时，您同意不会：
        
        1. 上传违法、有害、威胁、辱骂、骚扰、诽谤的内容
        2. 侵犯他人的知识产权、隐私权或其他权利
        3. 传播垃圾信息、恶意软件或进行欺诈活动
        4. 干扰或破坏服务的正常运行
        5. 使用自动化工具进行大量操作
        6. 冒充他人或虚假陈述身份
        7. 从事任何违反法律法规的活动
        
        违反这些规定可能导致账户被暂停或终止。
      `
    },
    {
      id: 'content',
      title: '内容政策',
      icon: '📋',
      content: `
        关于您在平台上发布的内容：
        
        1. 内容所有权：您保留对自己创作内容的所有权
        2. 使用许可：您授予我们使用、展示、分发您内容的许可
        3. 内容审核：我们有权审核、编辑或删除不当内容
        4. 版权保护：我们尊重知识产权，建立了版权投诉机制
        5. 用户责任：您对自己发布的内容承担全部责任
        
        我们不对用户生成的内容承担责任，但会努力维护平台的内容质量。
      `
    },
    {
      id: 'intellectual',
      title: '知识产权',
      icon: '🔐',
      content: `
        知识产权保护是我们的重要原则：
        
        1. 平台权利：Mastera平台的设计、功能、商标等归我们所有
        2. 用户内容：用户保留其原创内容的知识产权
        3. 侵权处理：我们建立了完善的侵权投诉和处理机制
        4. 合理使用：用户可以在合理范围内使用平台功能
        5. 第三方内容：尊重第三方的知识产权，不得侵权使用
        
        如发现侵权行为，请及时联系我们处理。
      `
    },
    {
      id: 'payment',
      title: '付费服务',
      icon: '💳',
      content: `
        关于平台的付费服务：
        
        1. 付费内容：部分优质内容需要付费购买或会员权限
        2. 会员服务：提供不同等级的会员服务和特权
        3. 积分系统：可以使用积分兑换部分付费内容
        4. 退款政策：在特定条件下提供退款服务
        5. 价格变更：我们保留调整服务价格的权利
        
        所有付费交易都会提供相应的收据和记录。
      `
    },
    {
      id: 'privacy',
      title: '隐私保护',
      icon: '🛡️',
      content: `
        我们重视您的隐私保护：
        
        1. 信息收集：仅收集提供服务所必需的信息
        2. 信息使用：按照隐私政策使用您的个人信息
        3. 信息保护：采用先进技术保护您的数据安全
        4. 信息共享：不会未经授权分享您的个人信息
        5. 用户控制：您可以管理自己的隐私设置
        
        详细信息请查看我们的隐私政策。
      `
    },
    {
      id: 'liability',
      title: '责任限制',
      icon: '⚠️',
      content: `
        关于服务责任的重要说明：
        
        1. 服务现状：服务按"现状"提供，不保证完全无错误
        2. 可用性：我们努力保持服务可用，但不保证100%正常运行
        3. 内容责任：用户对自己发布的内容承担责任
        4. 损失限制：我们的责任限于直接损失，不承担间接损失
        5. 第三方：不对第三方服务或链接承担责任
        
        使用服务即表示您理解并接受这些限制。
      `
    },
    {
      id: 'termination',
      title: '服务终止',
      icon: '🚪',
      content: `
        关于服务终止的规定：
        
        1. 用户终止：您可以随时停止使用我们的服务
        2. 平台终止：我们可能因违规行为终止用户账户
        3. 数据处理：终止后我们会按照隐私政策处理您的数据
        4. 服务变更：我们可能会修改或停止某些服务功能
        5. 通知义务：重大变更会提前通知用户
        
        终止不影响已产生的权利和义务。
      `
    }
  ]

  const keyPoints = [
    {
      icon: '🎯',
      title: '服务目标',
      description: '为创作者和用户提供优质的内容分享平台'
    },
    {
      icon: '🛡️',
      title: '安全保障',
      description: '采用先进技术保护用户数据和隐私安全'
    },
    {
      icon: '⚖️',
      title: '公平原则',
      description: '建立公平、透明的平台规则和争议解决机制'
    },
    {
      icon: '🤝',
      title: '用户权益',
      description: '保护用户的合法权益和知识产权'
    }
  ]

  const handleContactSubmit = () => {
    console.log('提交法律咨询')
    onContactClose()
  }

  const handleReportSubmit = () => {
    console.log('提交违规举报')
    onReportClose()
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📜</div>
          <h1 className="text-4xl font-bold mb-4">服务条款</h1>
          <p className="text-xl text-gray-400 mb-6">
            使用Mastera平台前，请仔细阅读并理解以下条款
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

        {/* 核心要点 */}
        <Card className="bg-content1 border-divider mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold">🎯 核心要点</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="text-2xl">{point.icon}</div>
                  <div>
                    <h3 className="font-semibold mb-1">{point.title}</h3>
                    <p className="text-gray-400 text-sm">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* 条款详情 */}
        <Card className="bg-content1 border-divider mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold">📋 详细条款</h2>
          </CardHeader>
          <CardBody>
            <Accordion variant="splitted" className="space-y-4">
              {termsSections.map((section) => (
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

        {/* 用户权利与义务 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-400/10 to-blue-400/10 border-green-400/20">
            <CardHeader>
              <h3 className="text-lg font-bold text-green-400">✅ 您的权利</h3>
            </CardHeader>
            <CardBody>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• 自由创作和分享内容</li>
                <li>• 保护个人隐私和数据</li>
                <li>• 获得平等的服务机会</li>
                <li>• 参与平台治理和反馈</li>
                <li>• 随时终止服务使用</li>
                <li>• 获得客户支持服务</li>
              </ul>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-orange-400/10 to-red-400/10 border-orange-400/20">
            <CardHeader>
              <h3 className="text-lg font-bold text-orange-400">📋 您的义务</h3>
            </CardHeader>
            <CardBody>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• 遵守平台规则和法律法规</li>
                <li>• 提供真实准确的信息</li>
                <li>• 尊重他人权利和隐私</li>
                <li>• 维护平台社区环境</li>
                <li>• 保护账户安全</li>
                <li>• 承担内容发布责任</li>
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* 争议解决 */}
         <Card className="bg-content1 border-divider mb-8">
          <CardHeader>
            <h2 className="text-xl font-bold">⚖️ 争议解决</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <p className="text-gray-300">
                如果您对我们的服务有任何争议或投诉，我们建议按以下步骤解决：
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-content2 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">1️⃣</div>
                  <h4 className="font-semibold mb-2">友好协商</h4>
                  <p className="text-sm text-gray-400">首先通过客服渠道进行沟通</p>
                </div>

                <div className="bg-content2 p-4 rounded-lg text-center">
                   <div className="text-2xl mb-2">2️⃣</div>
                   <h4 className="font-semibold mb-2">调解处理</h4>
                   <p className="text-sm text-gray-400">通过第三方调解机构处理</p>
                 </div>
 
                 <div className="bg-content2 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">3️⃣</div>
                  <h4 className="font-semibold mb-2">法律途径</h4>
                  <p className="text-sm text-gray-400">通过法院诉讼解决争议</p>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button color="primary" onPress={onContactOpen}>
                  法律咨询
                </Button>
                <Button color="warning" variant="bordered" onPress={onReportOpen}>
                  违规举报
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 条款确认 */}
        <Card className="bg-gradient-to-r from-lime-400/10 to-green-400/10 border-lime-400/20">
          <CardBody className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">📝</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-lime-400 mb-3">条款确认</h3>
                <div className="space-y-3">
                  <Checkbox
                    isSelected={acceptedTerms}
                    onValueChange={setAcceptedTerms}
                  >
                    <span className="text-gray-300">
                      我已仔细阅读并完全理解上述服务条款，同意受其约束
                    </span>
                  </Checkbox>

                  <p className="text-sm text-gray-400">
                    继续使用Mastera平台即表示您接受这些条款。如有疑问，请联系我们的客服团队。
                  </p>

                  <div className="flex gap-3 mt-4">
                    <Button
                      color="primary"
                      disabled={!acceptedTerms}
                      className={!acceptedTerms ? 'opacity-50' : ''}
                    >
                      接受条款
                    </Button>
                    <Button variant="bordered">
                      下载PDF版本
                    </Button>
                  </div>
                </div>
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
            <h2 className="text-xl font-bold">⚖️ 法律咨询</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="bg-blue-400/10 border border-blue-400/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-400 mb-2">📋 常见法律问题</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 知识产权保护相关问题</li>
                  <li>• 用户协议条款解释</li>
                  <li>• 争议解决流程咨询</li>
                  <li>• 平台责任范围说明</li>
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
                placeholder="请简要描述您的法律问题"
              />

              <Textarea
                label="详细描述"
                placeholder="请详细描述您遇到的法律问题或需要咨询的条款"
                minRows={4}
              />

              <div className="bg-content2 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">⚠️ 重要提醒</h4>
                <p className="text-sm text-gray-400">
                  我们的客服团队会为您提供基本的条款解释，复杂的法律问题建议咨询专业律师。
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

      {/* 违规举报模态框 */}
      <Modal
        isOpen={isReportOpen}
        onClose={onReportClose}
        size="2xl"
        className="bg-content1"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold">🚨 违规举报</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="bg-red-400/10 border border-red-400/20 p-4 rounded-lg">
                <h4 className="font-semibold text-red-400 mb-2">🚨 举报类型</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 侵犯知识产权</li>
                  <li>• 发布违法违规内容</li>
                  <li>• 恶意骚扰或诽谤</li>
                  <li>• 欺诈或虚假信息</li>
                  <li>• 其他违反服务条款的行为</li>
                </ul>
              </div>

              <Input
                label="举报对象"
                placeholder="请输入被举报的用户名或内容链接"
              />

              <Input
                label="违规类型"
                placeholder="请选择或描述违规类型"
              />

              <Textarea
                label="详细说明"
                placeholder="请详细描述违规行为，并提供相关证据"
                minRows={4}
              />

              <Input
                label="联系方式"
                placeholder="请留下您的联系方式以便后续沟通"
              />

              <div className="bg-content2 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📋 处理流程</h4>
                <p className="text-sm text-gray-400">
                  我们会在24小时内审核您的举报，并在3-5个工作日内给出处理结果。
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onReportClose}>
              取消
            </Button>
            <Button color="danger" onPress={handleReportSubmit}>
              提交举报
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}