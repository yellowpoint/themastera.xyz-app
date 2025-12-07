/**
 * Sentry 错误监控配置
 *
 * 控制是否启用 Sentry 错误上报。
 * 逻辑：
 * 1. 优先读取环境变量 NEXT_PUBLIC_ENABLE_SENTRY
 *    - 如果为 'true'，则强制开启
 *    - 如果为 'false'，则强制关闭
 * 2. 如果未设置环境变量，则根据 NODE_ENV 判断
 *    - 开发环境 (development) 默认关闭
 *    - 其他环境 (production 等) 默认开启
 */
export const IS_SENTRY_ENABLED = process.env.NEXT_PUBLIC_ENABLE_SENTRY
  ? process.env.NEXT_PUBLIC_ENABLE_SENTRY === 'true'
  : process.env.NODE_ENV !== 'development'
