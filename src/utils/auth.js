/**
 * 生成邮箱验证的回调URL
 * @param {string} email - 用户邮箱地址
 * @param {string} baseURL - 基础URL，默认为当前域名
 * @returns {string} 完整的验证回调URL
 */
export const generateVerifyEmailCallbackURL = (email, baseURL = null) => {
  // 如果在浏览器环境且没有提供baseURL，使用window.location.origin
  const origin = baseURL || (typeof window !== 'undefined' ? window.location.origin : '')

  // 对邮箱地址进行双重编码以确保在URL路径中正确传输
  const encodedEmail = encodeURIComponent(encodeURIComponent(email))

  return `${origin}/auth/verify-email/${encodedEmail}`
}

