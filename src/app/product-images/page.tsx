'use client'

import { Play, Zap, Crown, Sparkles } from 'lucide-react'

export default function ProductImagesPage() {
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$9.9',
      originalPrice: '$12',
      credits: 115,
      videos: 11,
      icon: Play,
      bgGradient: 'from-gray-50 to-white',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      border: 'border-gray-200'
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '$30',
      originalPrice: '$40',
      credits: 355,
      videos: 35,
      icon: Zap,
      bgGradient: 'from-purple-50 to-white',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      border: 'border-purple-500',
      badge: 'Most Popular'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$99',
      originalPrice: '$120',
      credits: 1450,
      videos: 145,
      icon: Crown,
      bgGradient: 'from-amber-50 to-white',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      border: 'border-amber-400',
      badge: 'Best Value'
    }
  ]

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          CuttingASMR.org Product Images for Creem
        </h1>
        
        <p className="text-center text-gray-600 mb-12">
          右键点击图片保存，用于Creem产品配置
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.id} className="relative">
                              {/* 产品图片卡片 */}
                <div 
                  id={`product-${plan.id}`}
                  className={`relative bg-gradient-to-br ${plan.bgGradient} rounded-2xl shadow-xl p-6 ${plan.border} border-2 w-full aspect-[3/4] transform hover:scale-105 transition-all duration-300`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className={`px-6 py-2 rounded-full text-sm font-bold flex items-center text-white shadow-lg ${
                        plan.id === 'standard' ? 'bg-purple-600' : 'bg-amber-500'
                      }`}>
                        <Sparkles className="w-4 h-4 mr-1" />
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  {/* 图标和标题 */}
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg ${plan.iconBg}`}>
                      <plan.icon className={`w-8 h-8 ${plan.iconColor}`} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                    <p className="text-sm text-gray-600 font-medium">
                      {plan.id === 'starter' && 'Perfect for getting started'}
                      {plan.id === 'standard' && 'Most popular choice'}
                      {plan.id === 'premium' && 'Ultimate professional toolkit'}
                    </p>
                  </div>

                  {/* 价格 */}
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center mb-1">
                      <span className="text-gray-400 line-through text-lg mr-2">{plan.originalPrice}</span>
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-1 text-base">USD</span>
                    </div>
                    <div className="text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full text-sm inline-block">
                      💰 Save ${(parseFloat(plan.originalPrice.replace('$', '')) - parseFloat(plan.price.replace('$', ''))).toFixed(1)}
                    </div>
                  </div>

                  {/* Credits */}
                  <div className={`rounded-xl p-4 text-center mb-4 shadow-md ${
                    plan.id === 'standard' ? 'bg-purple-100 border-2 border-purple-300' : 
                    plan.id === 'premium' ? 'bg-amber-100 border-2 border-amber-300' : 
                    'bg-gray-100 border-2 border-gray-300'
                  }`}>
                    <div className="flex items-center justify-center mb-2">
                      <Sparkles className={`w-5 h-5 mr-2 ${plan.iconColor}`} />
                      <span className="font-bold text-xl text-gray-900">{plan.credits} Credits</span>
                    </div>
                    <div className="text-base font-semibold text-gray-700 mb-1">
                      Generate {plan.videos}+ stunning ASMR videos
                    </div>
                    <div className="text-xs text-gray-500">
                      Credits never expire • 1080p quality
                    </div>
                  </div>

                  {/* 核心特色 */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>50+ ASMR templates</span>
                    </div>
                    {plan.id !== 'starter' && (
                      <div className="flex items-center text-xs text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>Faster processing</span>
                      </div>
                    )}
                    {plan.id === 'premium' && (
                      <div className="flex items-center text-xs text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>Early access to new features</span>
                      </div>
                    )}
                  </div>

                  {/* CTA按钮样式 */}
                  <div className={`w-full py-3 rounded-xl font-bold text-sm text-center transition-all shadow-lg ${
                    plan.id === 'standard'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                      : plan.id === 'premium'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
                  }`}>
                    🚀 Get Started Now
                  </div>

                  {/* 安全认证 */}
                  <div className="text-center mt-2">
                    <div className="text-xs text-gray-500">🔒 Secure payment by Creem</div>
                  </div>

                  {/* 品牌标识 */}
                  <div className="absolute top-4 right-4">
                    <div className="text-xs font-bold text-gray-400 bg-white/80 px-2 py-1 rounded">
                      CuttingASMR.org
                    </div>
                  </div>

                  {/* Google Veo3 标识 */}
                  <div className="absolute bottom-2 left-4">
                    <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      ⚡ Google Veo3 AI
                    </div>
                  </div>
                </div>

              {/* 下载提示 */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  右键保存为: <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {plan.name.toLowerCase()}-plan.png
                  </code>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 使用说明 */}
        <div className="mt-16 bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">使用说明</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">步骤1: 保存图片</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>右键点击每个产品图片</li>
                <li>选择"图片另存为"</li>
                <li>建议文件名：starter-plan.png, standard-plan.png, premium-plan.png</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">步骤2: 上传到Creem</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>在Creem产品配置页面上传对应图片</li>
                <li>图片尺寸：已优化为3:4比例</li>
                <li>文件大小：通常小于500KB</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 返回URL信息 */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">📋 Creem配置信息</h3>
          <div className="text-sm text-blue-800">
            <p><strong>返回URL:</strong> <code className="bg-blue-100 px-2 py-1 rounded">https://cuttingasmr.org/payment/success</code></p>
            <p className="mt-2"><strong>Webhook URL:</strong> <code className="bg-blue-100 px-2 py-1 rounded">https://cuttingasmr.org/api/webhooks/creem</code></p>
          </div>
        </div>
      </div>
    </div>
  )
} 