// 主题样式配置
export const themeStyles = {
  // 页面背景
  pageBackground: "bg-background text-foreground",
  
  // 卡片样式
  card: {
    primary: "bg-content1 border-divider",
    secondary: "bg-content2 border-divider",
    glass: "bg-content1/80 backdrop-blur-sm border-divider",
    hover: "hover:border-primary/50 transition-all",
  },
  
  // 导航样式
  navbar: {
    background: "bg-background/95 backdrop-blur-md border-b border-divider",
    menu: "bg-background/95 backdrop-blur-md",
  },
  
  // 模态框样式
  modal: {
    background: "bg-content1 text-foreground",
  },
  
  // 覆盖层样式
  overlay: {
    dark: "bg-background/60",
    light: "bg-background/50",
  },
  
  // 按钮样式
  button: {
    glass: "bg-background/20 backdrop-blur-sm",
  },
  
  // 标签样式
  chip: {
    dark: "bg-background/70",
  },
  
  // 边框样式
  border: {
    default: "border-divider",
    hover: "hover:border-primary/50",
  }
}

// 获取样式类名的辅助函数
export const getThemeClass = (category, variant = 'primary') => {
  const styles = themeStyles[category]
  if (typeof styles === 'string') {
    return styles
  }
  return styles[variant] || styles.primary || ''
}

// 组合样式类名的辅助函数
export const combineThemeClasses = (...classes) => {
  return classes.filter(Boolean).join(' ')
}