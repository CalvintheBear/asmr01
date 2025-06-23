'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { AlertCircle, CheckCircle, RefreshCw, Mail, CreditCard } from 'lucide-react'

interface UnmatchedPayment {
  id: string
  customerEmail: string
  orderId: string
  productId: string
  amount: number
  creditsToAdd: number
  createdAt: string
  suggestion: string
}

export default function CreditsRecoveryPage() {
  const { user } = useUser()
  const [unmatchedPayments, setUnmatchedPayments] = useState<UnmatchedPayment[]>([])
  const [loading, setLoading] = useState(false)
  const [recovering, setRecovering] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchUnmatchedPayments()
    }
  }, [user])

  const fetchUnmatchedPayments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/manual-credits-recovery')
      const data = await response.json()

      if (data.success) {
        setUnmatchedPayments(data.unmatchedPayments)
      } else {
        setError(data.error || '获取未匹配支付失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
      console.error('获取未匹配支付失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRecovery = async (payment: UnmatchedPayment) => {
    try {
      setRecovering(payment.id)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/manual-credits-recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: payment.orderId,
          customerEmail: payment.customerEmail,
          amount: payment.amount
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(`成功恢复 ${data.details.creditsAdded} 积分！`)
        // 刷新未匹配支付列表
        fetchUnmatchedPayments()
      } else {
        setError(data.error || '恢复积分失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
      console.error('恢复积分失败:', err)
    } finally {
      setRecovering(null)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
          <p className="text-gray-600">需要登录才能恢复积分</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💎 积分恢复中心</h1>
          <p className="text-gray-600">
            如果您支付成功但积分未同步，可能是因为支付邮箱与登录邮箱不一致。在这里您可以手动恢复积分。
          </p>
        </div>

        {/* 用户信息 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            当前登录用户
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-medium text-blue-800">
              登录邮箱: {user.primaryEmailAddress?.emailAddress}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              积分将恢复到此账户
            </p>
          </div>
        </div>

        {/* 错误/成功消息 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* 刷新按钮 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">未匹配的支付记录</h2>
          <button
            onClick={fetchUnmatchedPayments}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </button>
        </div>

        {/* 未匹配支付列表 */}
        <div className="space-y-4">
          {loading && unmatchedPayments.length === 0 ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">加载中...</p>
            </div>
          ) : unmatchedPayments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">没有未匹配的支付</h3>
              <p className="text-gray-600">
                所有支付都已正确匹配，或者没有需要恢复的积分。
              </p>
            </div>
          ) : (
            unmatchedPayments.map((payment) => (
              <div key={payment.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <CreditCard className="w-5 h-5 text-purple-600 mr-2" />
                      <h3 className="text-lg font-semibold">
                        未匹配支付 - ${payment.amount}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">支付邮箱</p>
                        <p className="font-medium">{payment.customerEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">订单ID</p>
                        <p className="font-mono text-sm">{payment.orderId || '无'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">积分数量</p>
                        <p className="font-medium text-purple-600">{payment.creditsToAdd} Credits</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">支付时间</p>
                        <p className="text-sm">{new Date(payment.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                      <p className="text-sm text-yellow-800">
                        <strong>问题：</strong>支付邮箱 ({payment.customerEmail}) 与当前登录邮箱不一致
                      </p>
                    </div>
                  </div>

                  <div className="ml-4">
                    <button
                      onClick={() => handleRecovery(payment)}
                      disabled={recovering === payment.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                    >
                      {recovering === payment.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />
                          恢复中...
                        </>
                      ) : (
                        '恢复积分'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 使用说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-blue-800 mb-3">💡 如何避免此问题</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• 支付时请使用与网站登录相同的邮箱地址</li>
            <li>• 如果必须使用不同邮箱，请在支付后联系客服</li>
            <li>• 积分恢复后会立即显示在您的账户中</li>
                          <li>• 如有疑问，请联系 j2983236233@gmail.com</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 