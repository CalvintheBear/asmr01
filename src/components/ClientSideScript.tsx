'use client'

import { useEffect } from 'react'

export default function ClientSideScript() {
  useEffect(() => {
    // 确保在客户端运行
    if (typeof window === 'undefined') return

    console.log('🔍 SEO安全监控已启动')
    
    // 关键词密度安全检查
    const checkKeywordDensity = () => {
      const text = document.body.innerText || ''
      const words = text.toLowerCase().split(/\s+/)
      const totalWords = words.length
      
      const safeThresholds = {
        'asmr': 3.5,    // 主关键词安全阈值
        '视频': 3.0,    // 次要关键词
        '制作': 2.5,    // 动作词汇
        'ai': 2.0       // 技术词汇
      }
      
      const densities: Record<string, { count: number; density: string; safe: boolean }> = {}
      Object.keys(safeThresholds).forEach(keyword => {
        const count = words.filter(w => w.includes(keyword)).length
        const density = (count / totalWords * 100)
        densities[keyword] = {
          count: count,
          density: density.toFixed(2) + '%',
          safe: density <= safeThresholds[keyword as keyof typeof safeThresholds]
        }
        
        // 超过安全阈值时警告
        if (density > safeThresholds[keyword as keyof typeof safeThresholds]) {
          console.warn(`⚠️ SEO风险: "${keyword}" 密度${density.toFixed(2)}%超过安全值${safeThresholds[keyword as keyof typeof safeThresholds]}%`)
        }
      })
      
      return densities
    }
    
    // 检查重复短语（防止过度重复）
    const checkRepetitivePatterns = () => {
      const text = document.body.innerText || ''
      const phrases: string[] = []
      const words = text.split(/\s+/)
      
      // 检查3词组合重复
      for (let i = 0; i < words.length - 2; i++) {
        const phrase = words.slice(i, i + 3).join(' ').toLowerCase()
        phrases.push(phrase)
      }
      
      const phraseCount: Record<string, number> = {}
      phrases.forEach(phrase => {
        phraseCount[phrase] = (phraseCount[phrase] || 0) + 1
      })
      
      // 查找重复超过3次的短语
      const repetitive = Object.entries(phraseCount)
        .filter(([, count]) => count > 3)
        .sort((a, b) => b[1] - a[1])
        
      if (repetitive.length > 0) {
        console.warn('⚠️ 重复短语检测:', repetitive.slice(0, 5))
      }
      
      return repetitive
    }
    
    // 初始检查（延迟1秒等待页面完全渲染）
    const initialCheck = setTimeout(() => {
      const densities = checkKeywordDensity()
      const repetitive = checkRepetitivePatterns()
      
      if (window.location.hostname === 'localhost') {
        console.log('📊 关键词密度分析:', densities)
        if (repetitive.length > 0) {
          console.log('🔄 重复短语分析:', repetitive.slice(0, 3))
        }
      }
    }, 1000)
    
    // 开发环境定期监控（每30秒）
    let intervalId: NodeJS.Timeout | null = null
    if (window.location.hostname === 'localhost') {
      intervalId = setInterval(() => {
        const densities = checkKeywordDensity()
        const hasRisk = Object.values(densities).some(d => !d.safe)
        if (hasRisk) {
          console.log('⚠️ SEO风险检测更新:', densities)
        }
      }, 30000)
    }
    
    // 清理函数
    return () => {
      clearTimeout(initialCheck)
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [])

  return null // 这个组件不渲染任何内容
} 