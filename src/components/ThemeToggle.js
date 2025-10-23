'use client'

import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme()

  if (!mounted) {
    return (
      <Button
        variant="light"
        isIconOnly
        className="text-foreground-500"
      >
        <Monitor size={20} />
      </Button>
    )
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={20} />
      case 'dark':
        return <Moon size={20} />
      case 'system':
        return <Monitor size={20} />
      default:
        return <Moon size={20} />
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return '浅色主题'
      case 'dark':
        return '深色主题'
      case 'system':
        return '跟随系统'
      default:
        return '深色主题'
    }
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          variant="light"
          isIconOnly
          className="text-foreground-500 hover:text-lime-400 transition-colors"
          aria-label={`当前主题: ${getThemeLabel()}`}
        >
          {getThemeIcon()}
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="主题选择"
        selectedKeys={[theme]}
        selectionMode="single"
        onSelectionChange={(keys) => {
          const selectedTheme = Array.from(keys)[0]
          setTheme(selectedTheme)
        }}
      >
        <DropdownItem 
          key="light" 
          startContent={<Sun size={16} />}
        >
          浅色主题
        </DropdownItem>
        <DropdownItem 
          key="dark" 
          startContent={<Moon size={16} />}
        >
          深色主题
        </DropdownItem>
        <DropdownItem 
          key="system" 
          startContent={<Monitor size={16} />}
        >
          跟随系统
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}