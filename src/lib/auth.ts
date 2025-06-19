import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // 手动配置端点，避免discovery超时
      authorization: {
        url: "https://accounts.google.com/o/oauth2/v2/auth",
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      },
      token: "https://oauth2.googleapis.com/token",
      userinfo: "https://openidconnect.googleapis.com/v1/userinfo",
      // 禁用自动发现，使用手动配置
      wellKnown: undefined,
      // 超大超时时间来解决Token交换超时问题
      httpOptions: {
        timeout: 120000, // 120秒超时（2分钟），确保能处理极慢的网络
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        console.log('✅ OAuth Sign In Success - User:', user.email)
        // 简化：直接允许登录，不进行数据库操作
        return true
      }
      return true
    },
    async session({ session, token }) {
      // 简化session处理
      if (session.user && token.sub) {
        session.user.id = token.sub
        // 临时设置默认积分值
        session.user.credits = {
          total: 10,
          used: 0,
          remaining: 10
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      console.log('🔄 Redirect callback:', { url, baseUrl })
      
      // 如果是相对路径，添加baseUrl
      if (url.startsWith('/')) {
        console.log('📍 Redirecting to relative path:', `${baseUrl}${url}`)
        return `${baseUrl}${url}`
      }
      
      // 如果是同域名的完整URL，直接使用
      if (new URL(url).origin === baseUrl) {
        console.log('📍 Redirecting to same origin:', url)
        return url
      }
      
      // 登录成功后，重定向到首页
      console.log('🏠 Redirecting to home page')
      return `${baseUrl}/`
    }
  },
  pages: {
    signIn: '/dashboard',
    error: '/dashboard',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt', // 改为JWT策略，不需要数据库
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  // 添加事件监听来调试流程
  events: {
    async signIn(message) {
      console.log('🎉 User signed in successfully:', message.user.email)
    },
    async session(message) {
      console.log('📱 Session accessed:', message.session.user?.email)
    }
  }
}

// 扩展NextAuth类型
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      credits?: {
        total: number
        used: number
        remaining: number
      }
    }
  }
} 