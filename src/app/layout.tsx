import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/providers/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CuttingASMR.org - AI ASMR Video Generator | Free Trial',
  description: 'Create stunning AI ASMR videos with our advanced generator. Enjoy 2 free trials, then subscribe for unlimited access. Perfect for ASMR creators and YouTube channels.',
  keywords: 'ASMR,AI ASMR,ASMR video,ASMR generator,AI ASMR generator,ASMR creator,YouTube ASMR,cutting ASMR,relaxing videos',
  authors: [{ name: 'CuttingASMR Team' }],
  creator: 'CuttingASMR',
  openGraph: {
    title: 'CuttingASMR.org - AI ASMR Video Generator',
    description: 'Professional AI ASMR video generator with 2 free trials. Create relaxing ASMR content for YouTube and social media.',
    url: 'https://cuttingasmr.org',
    siteName: 'CuttingASMR.org',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 网站图标设置 */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        
        {/* 结构化数据标记 - 提升SEO和防AI检测 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "CuttingASMR.org - AI ASMR Video Generator",
              "description": "Professional AI ASMR video generator with subscription model. 2 free trials included.",
              "url": "https://cuttingasmr.org",
              "applicationCategory": "MultimediaApplication",
              "operatingSystem": "Web",
              "author": {
                "@type": "Organization",
                "name": "CuttingASMR",
                "url": "https://cuttingasmr.org"
              },
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Free Trial",
                  "price": "0",
                  "priceCurrency": "USD",
                  "description": "2 free ASMR video generations"
                },
                {
                  "@type": "Offer", 
                  "name": "Pro Subscription",
                  "price": "9.99",
                  "priceCurrency": "USD",
                  "billingDuration": "P1M",
                  "description": "Unlimited ASMR video generation"
                }
              ]
            })
          }}
        />
        
        {/* 安全SEO监控系统 - 防止关键词过度优化 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 页面加载后初始化SEO安全检查
              window.addEventListener('DOMContentLoaded', function() {
                console.log('🔍 SEO安全监控已启动');
                
                // 关键词密度安全检查
                const checkKeywordDensity = () => {
                  const text = document.body.innerText || '';
                  const words = text.toLowerCase().split(/\\s+/);
                  const totalWords = words.length;
                  
                  const safeThresholds = {
                    'asmr': 3.5,    // 主关键词安全阈值
                    '视频': 3.0,    // 次要关键词
                    '制作': 2.5,    // 动作词汇
                    'ai': 2.0       // 技术词汇
                  };
                  
                  const densities = {};
                  Object.keys(safeThresholds).forEach(keyword => {
                    const count = words.filter(w => w.includes(keyword)).length;
                    const density = (count / totalWords * 100);
                    densities[keyword] = {
                      count: count,
                      density: density.toFixed(2) + '%',
                      safe: density <= safeThresholds[keyword]
                    };
                    
                    // 超过安全阈值时警告
                    if (density > safeThresholds[keyword]) {
                      console.warn('⚠️ SEO风险: "' + keyword + '" 密度' + density.toFixed(2) + '%超过安全值' + safeThresholds[keyword] + '%');
                    }
                  });
                  
                  return densities;
                };
                
                // 检查重复短语（防止过度重复）
                const checkRepetitivePatterns = () => {
                  const text = document.body.innerText || '';
                  const phrases = [];
                  const words = text.split(/\\s+/);
                  
                  // 检查3词组合重复
                  for (let i = 0; i < words.length - 2; i++) {
                    const phrase = words.slice(i, i + 3).join(' ').toLowerCase();
                    phrases.push(phrase);
                  }
                  
                  const phraseCount = {};
                  phrases.forEach(phrase => {
                    phraseCount[phrase] = (phraseCount[phrase] || 0) + 1;
                  });
                  
                  // 查找重复超过3次的短语
                  const repetitive = Object.entries(phraseCount)
                    .filter(([phrase, count]) => count > 3)
                    .sort((a, b) => b[1] - a[1]);
                    
                  if (repetitive.length > 0) {
                    console.warn('⚠️ 重复短语检测:', repetitive.slice(0, 5));
                  }
                  
                  return repetitive;
                };
                
                // 初始检查（延迟1秒等待页面完全渲染）
                setTimeout(() => {
                  const densities = checkKeywordDensity();
                  const repetitive = checkRepetitivePatterns();
                  
                  if (window.location.hostname === 'localhost') {
                    console.log('📊 关键词密度分析:', densities);
                    if (repetitive.length > 0) {
                      console.log('🔄 重复短语分析:', repetitive.slice(0, 3));
                    }
                  }
                }, 1000);
                
                // 开发环境定期监控（每30秒）
                if (window.location.hostname === 'localhost') {
                  setInterval(() => {
                    const densities = checkKeywordDensity();
                    const hasRisk = Object.values(densities).some(d => !d.safe);
                    if (hasRisk) {
                      console.log('⚠️ SEO风险检测更新:', densities);
                    }
                  }, 30000);
                }
              });
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 
