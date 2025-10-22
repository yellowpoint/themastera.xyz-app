'use client'

import { Button, Link, Divider } from '@heroui/react'
import { Twitter, MessageCircle, Send, Instagram, Star, Target, Rocket } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: '平台功能',
      links: [
        { name: '内容中心', href: '/content' },
        { name: '社区圈子', href: '/community' },
        { name: '创作者中心', href: '/creator' },
        { name: '积分系统', href: '/points' },
      ]
    },
    {
      title: '用户服务',
      links: [
        { name: '新手引导', href: '/onboarding' },
        { name: '邀请好友', href: '/referral' },
        { name: '个性化推荐', href: '/recommendations' },
        { name: '通知中心', href: '/notifications' },
      ]
    },
    {
      title: '帮助支持',
      links: [
        { name: '使用帮助', href: '/help' },
        { name: '联系我们', href: '/contact' },
        { name: '意见反馈', href: '/feedback' },
        { name: '常见问题', href: '/faq' },
      ]
    },
    {
      title: '关于我们',
      links: [
        { name: '平台介绍', href: '/about' },
        { name: '隐私政策', href: '/privacy' },
        { name: '服务条款', href: '/terms' },
        { name: '加入我们', href: '/careers' },
      ]
    }
  ]

  return (
    <footer className="bg-black border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* 品牌信息 */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">Mastera</h3>
            <p className="text-gray-400 text-sm mb-6">
              连接创作者与粉丝的创意平台，让每个人都能发现和分享精彩内容。
            </p>
            <div className="flex space-x-4">
              <Button
                isIconOnly
                variant="light"
                className="text-gray-400 hover:text-lime-400"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </Button>
              <Button
                isIconOnly
                variant="light"
                className="text-gray-400 hover:text-lime-400"
                aria-label="Discord"
              >
                <MessageCircle size={20} />
              </Button>
              <Button
                isIconOnly
                variant="light"
                className="text-gray-400 hover:text-lime-400"
                aria-label="Telegram"
              >
                <Send size={20} />
              </Button>
              <Button
                isIconOnly
                variant="light"
                className="text-gray-400 hover:text-lime-400"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </Button>
            </div>
          </div>

          {/* 链接区域 */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-lime-400 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Divider className="my-8 bg-gray-800" />

        {/* 底部信息 */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Mastera Platform. 保留所有权利。
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-lime-400">
              隐私政策
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-lime-400">
              服务条款
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-lime-400">
              Cookie 政策
            </Link>
            <Link href="/accessibility" className="text-gray-400 hover:text-lime-400">
              无障碍声明
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}