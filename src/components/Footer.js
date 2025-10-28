'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Twitter, MessageCircle, Send, Instagram, Star, Target, Rocket } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Platform Features',
      links: [
        { name: 'Content Center', href: '/' },
        { name: 'Community', href: '/community' },
        { name: 'Creator Center', href: '/creator' },
        { name: 'Points System', href: '/points' },
      ]
    },
    {
      title: 'User Services',
      links: [
        { name: 'Getting Started', href: '/onboarding' },
        { name: 'Invite Friends', href: '/referral' },
        { name: 'Recommendations', href: '/recommendations' },
        { name: 'Notifications', href: '/notifications' },
      ]
    },
    {
      title: 'Help & Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Feedback', href: '/feedback' },
        { name: 'FAQ', href: '/faq' },
      ]
    },
    {
      title: 'About Us',
      links: [
        { name: 'About Platform', href: '/about' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Careers', href: '/careers' },
      ]
    }
  ]

  return (
    <footer className="bg-content1 border-t border-divider mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main content area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand information */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-foreground mb-4">Mastera</h3>
            <p className="text-foreground-500 text-sm mb-6">
              A creative platform connecting creators and fans, allowing everyone to discover and share amazing content.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                className="p-0 size-10 text-foreground-500 hover:text-lime-400"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </Button>
              <Button
                variant="ghost"
                className="p-0 size-10 text-foreground-500 hover:text-lime-400"
                aria-label="Discord"
              >
                <MessageCircle size={20} />
              </Button>
              <Button
                variant="ghost"
                className="p-0 size-10 text-foreground-500 hover:text-lime-400"
                aria-label="Telegram"
              >
                <Send size={20} />
              </Button>
              <Button
                variant="ghost"
                className="p-0 size-10 text-foreground-500 hover:text-lime-400"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </Button>
            </div>
          </div>

          {/* Links area */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-foreground font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-foreground-500 hover:text-lime-400 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-divider" />

        {/* Footer information */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-foreground-500 text-sm mb-4 md:mb-0">
            © {currentYear} Mastera Platform. All rights reserved.
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/privacy" className="text-foreground-500 hover:text-lime-400">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-foreground-500 hover:text-lime-400">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-foreground-500 hover:text-lime-400">
              Cookie Policy
            </Link>
            <Link href="/accessibility" className="text-foreground-500 hover:text-lime-400">
              Accessibility Statement
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}