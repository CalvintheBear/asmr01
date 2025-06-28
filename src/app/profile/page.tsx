'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import { useCredits } from '@/hooks/useCredits'
import { CREDITS_CONFIG } from '@/lib/credits-config'
import { useEffect, useState } from 'react'

// 在Cloudflare Pages中必须使用Edge Runtime
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

interface Purchase {
  id: string
  packageType: string
  packageName: string
  amount: number
  currency: string
  creditsAdded: number
  orderId: string
  status: string
  formattedDate: string
}

interface Video {
  id: string
  taskId: string | null
  title: string
  type: string
  prompt: string
  status: string
  videoUrl: string | null
  videoUrl1080p: string | null
  thumbnailUrl: string | null
  creditsUsed: number
  createdAt: string
  completedAt: string | null
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const { credits, loading, error, refetch } = useCredits(false) // Don't auto-fetch
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [purchasesLoading, setPurchasesLoading] = useState(false)
  const [purchasesError, setPurchasesError] = useState<string | null>(null)
  
  // Video history related states
  const [videos, setVideos] = useState<Video[]>([])
  const [videosLoading, setVideosLoading] = useState(false)
  const [videosError, setVideosError] = useState<string | null>(null)

  // Fetch purchase history
  const fetchPurchases = async () => {
    try {
      setPurchasesLoading(true)
      setPurchasesError(null)
      
      const response = await fetch('/api/user/purchases')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setPurchases(result.data.purchases)
        } else {
          setPurchasesError(result.error)
        }
      } else {
        setPurchasesError('Failed to fetch purchase history')
      }
    } catch (error) {
      console.error('Failed to fetch purchase history:', error)
      setPurchasesError('Network error')
    } finally {
      setPurchasesLoading(false)
    }
  }

  // Fetch video history
  const fetchVideos = async () => {
    try {
      setVideosLoading(true)
      setVideosError(null)
      
      const response = await fetch('/api/user/videos')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setVideos(result.data.videos)
        } else {
          setVideosError(result.error)
        }
      } else {
        setVideosError('Failed to fetch video history')
      }
    } catch (error) {
      console.error('Failed to fetch video history:', error)
      setVideosError('Network error')
    } finally {
      setVideosLoading(false)
    }
  }

  // Auto sync user to database after user loads and fetch latest data
  useEffect(() => {
    let isMounted = true
    let lastSyncTime = 0
    const SYNC_COOLDOWN = 30000 // 30 seconds cooldown
    
    const syncUserAndFetchData = async () => {
      if (!isLoaded || !user || !isMounted) return
      
      // Check cooldown
      const now = Date.now()
      if (now - lastSyncTime < SYNC_COOLDOWN) {
        console.log('⏰ Sync on cooldown, fetching data directly...')
        // Even during cooldown, fetch latest data
        if (isMounted) {
          refetch()
          fetchPurchases()
          fetchVideos()
        }
        return
      }
      
      try {
        setSyncing(true)
        setSyncError(null)
        lastSyncTime = now
        
        console.log('🔄 Starting user sync to database...')
        const response = await fetch('/api/user/sync', {
          method: 'POST'
        })
        
        if (!response.ok) {
          // Handle rate limit errors silently
          if (response.status === 429) {
            console.log('⚠️ Clerk API rate limit, will retry automatically')
            // Fetch credits directly as user might already exist
            if (isMounted) {
              refetch()
              fetchPurchases()
            }
            return
          }
          
          const errorData = await response.json()
          throw new Error(errorData.error || 'User sync failed')
        }
        
        const result = await response.json()
        console.log('✅ User sync successful:', result)
        
        // After successful sync, fetch latest credits and purchase history
        if (isMounted) {
          console.log('📊 Fetching latest credits, purchases and video history...')
          refetch()
          fetchPurchases()
          fetchVideos()
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'User sync failed'
          setSyncError(errorMessage)
          console.error('User sync failed:', err)
          
          // Even if sync fails, try to fetch data
          refetch()
          fetchPurchases()
          fetchVideos()
        }
      } finally {
        if (isMounted) {
          setSyncing(false)
        }
      }
    }

    syncUserAndFetchData()
    
    // Cleanup function
    return () => {
      isMounted = false
    }
  }, [isLoaded, user]) // Remove refetch dependency

  if (!isLoaded || syncing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-white to-amber-50 flex items-center justify-center">
        <div className="text-gray-800 text-lg">
          {syncing ? 'Syncing user information...' : 'Loading...'}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-white to-amber-50 flex items-center justify-center">
        <div className="text-gray-800 text-lg">Please sign in first</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-white to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}
          />
        </div>

        {/* Error notification */}
        {syncError && (
          <div className="mb-6 bg-amber-100 border border-amber-300 rounded-xl p-4">
            <p className="text-amber-800">⚠️ {syncError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User info card */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">👤</span>
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Display Name</label>
                <p className="text-gray-800 font-medium">
                  {user.fullName || user.firstName || 'Not set'}
                </p>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Email Address</label>
                <p className="text-gray-800 font-medium">
                  {user.primaryEmailAddress?.emailAddress || 'Not set'}
                </p>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Registration Date</label>
                <p className="text-gray-800 font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US') : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Credits info card */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">💎</span>
              Credits Information
              <button 
                onClick={refetch}
                disabled={loading}
                className="ml-auto text-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-3 py-1 rounded-lg transition-colors"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </h2>

            {error ? (
              <div className="text-amber-800 text-sm mb-4 bg-amber-100 p-3 rounded-lg">
                {error}
                <button 
                  onClick={refetch}
                  className="ml-2 text-emerald-600 hover:text-emerald-700 underline"
                >
                  Retry
                </button>
              </div>
            ) : credits ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-2xl font-bold text-emerald-600">
                      {credits.remainingCredits}
                    </p>
                    <p className="text-sm text-gray-600">Remaining Credits</p>
                  </div>
                  
                  <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-2xl font-bold text-amber-600">
                      {credits.totalCredits}
                    </p>
                    <p className="text-sm text-gray-600">Total Credits</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-stone-50 rounded-lg border border-stone-200">
                    <p className="text-2xl font-bold text-stone-600">
                      {credits.usedCredits}
                    </p>
                    <p className="text-sm text-gray-600">Used Credits</p>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-2xl font-bold text-orange-600">
                      {credits.videosCount}
                    </p>
                    <p className="text-sm text-gray-600">Videos Created</p>
                  </div>
                </div>

                <div className="text-sm text-gray-700 bg-stone-50 p-3 rounded-lg border border-stone-200">
                  <p>💡 Each video generation costs {CREDITS_CONFIG.VIDEO_COST} credits</p>
                  <p>💡 You can create approximately {CREDITS_CONFIG.getVideoCount(credits.remainingCredits)} videos</p>
                </div>
              </div>
            ) : loading ? (
              <div className="text-gray-600">Loading credits information...</div>
            ) : (
              <div className="text-gray-600">
                <p>Credits information not loaded yet</p>
                <button 
                  onClick={refetch}
                  className="mt-2 text-emerald-600 hover:text-emerald-700 underline"
                >
                  Click to load
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Generated videos history */}
        <div className="mt-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🎬</span>
            Generated Videos History
            <button 
              onClick={fetchVideos}
              disabled={videosLoading}
              className="ml-auto text-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-3 py-1 rounded-lg transition-colors"
            >
              {videosLoading ? 'Loading...' : 'Refresh'}
            </button>
          </h2>

          {videosError ? (
            <div className="text-amber-800 text-sm mb-4 bg-amber-100 p-3 rounded-lg">
              {videosError}
              <button 
                onClick={fetchVideos}
                className="ml-2 text-emerald-600 hover:text-emerald-700 underline"
              >
                Retry
              </button>
            </div>
          ) : videos.length > 0 ? (
            <div className="space-y-4">
              {videos.map((video) => (
                <div key={video.id} className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-lg font-semibold text-gray-800">
                          {video.title}
                        </span>
                        <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                          video.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : video.status === 'failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {video.status === 'completed' ? 'Completed' : 
                           video.status === 'failed' ? 'Failed' : 'Processing'}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-gray-600 text-sm mb-1">Prompt:</p>
                        <p className="text-gray-800 text-sm bg-white p-2 rounded border border-stone-200">
                          {video.prompt.length > 100 ? 
                            `${video.prompt.substring(0, 100)}...` : 
                            video.prompt
                          }
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">TaskID</p>
                          <p className="text-gray-800 font-mono text-xs">
                            {video.taskId || 'None'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Credits Used</p>
                          <p className="text-orange-400 font-medium">
                            -{video.creditsUsed}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Created At</p>
                          <p className="text-white">
                            {new Date(video.createdAt).toLocaleString('en-US')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Video Status</p>
                          <div className="flex flex-col gap-1">
                            {video.videoUrl && (
                              <a 
                                href={video.videoUrl1080p || video.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-xs underline"
                              >
                                📥 Download Video {video.videoUrl1080p ? '(1080p)' : '(720p)'}
                              </a>
                            )}
                            {video.taskId && (
                              <p className="text-gray-500 text-xs">
                                🔗 TaskID: {video.taskId.substring(0, 8)}...
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : videosLoading ? (
            <div className="text-gray-300 text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full mx-auto mb-2"></div>
              Loading video history...
            </div>
          ) : (
            <div className="text-gray-300 text-center py-8">
              <p>No generation history yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Go to <a href="/" className="text-blue-400 hover:text-blue-300 underline">homepage</a> to start generating your first AI ASMR video
              </p>
            </div>
          )}
        </div>

        {/* Purchase history */}
        <div className="mt-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🛒</span>
            Purchase History
            <button 
              onClick={fetchPurchases}
              disabled={purchasesLoading}
              className="ml-auto text-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-3 py-1 rounded-lg transition-colors"
            >
              {purchasesLoading ? 'Loading...' : 'Refresh'}
            </button>
          </h2>

          {purchasesError ? (
            <div className="text-amber-800 text-sm mb-4 bg-amber-100 p-3 rounded-lg">
              {purchasesError}
              <button 
                onClick={fetchPurchases}
                className="ml-2 text-emerald-600 hover:text-emerald-700 underline"
              >
                Retry
              </button>
            </div>
          ) : purchases.length > 0 ? (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-lg font-semibold text-gray-800 capitalize">
                          {purchase.packageName}
                        </span>
                        <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                          purchase.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {purchase.status === 'completed' ? 'Completed' : 'Processing'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Payment Amount</p>
                          <p className="text-gray-800 font-medium">
                            ${purchase.amount.toFixed(2)} {purchase.currency}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Credits Received</p>
                          <p className="text-emerald-600 font-medium">
                            +{purchase.creditsAdded}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Order ID</p>
                          <p className="text-gray-800 font-mono text-xs">
                            {purchase.orderId || 'None'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Purchase Date</p>
                          <p className="text-gray-800">
                            {purchase.formattedDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : purchasesLoading ? (
            <div className="text-gray-600 text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-stone-300 border-t-emerald-600 rounded-full mx-auto mb-2"></div>
              Loading purchase history...
            </div>
          ) : (
            <div className="text-gray-600 text-center py-8">
              <p>No purchase history yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Go to <a href="/pricing" className="text-emerald-600 hover:text-emerald-700 underline">buy credits</a> to start your creative journey
              </p>
            </div>
          )}
        </div>

        {/* Account management - Creem Compliance */}
        <div className="mt-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">💳</span>
            Account Management
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Manage payments and subscriptions */}
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/creem-portal')
                  const data = await response.json()
                  
                  if (data.success && data.portalUrl) {
                    // Open Creem Customer Portal in new tab
                    window.open(data.portalUrl, '_blank', 'noopener,noreferrer')
                  } else {
                    // Fallback: directly open Creem customer portal
                    window.open('https://www.creem.io/customer-portal', '_blank', 'noopener,noreferrer')
                  }
                } catch (error) {
                  console.error('Failed to open customer portal:', error)
                  // Fallback: directly open Creem customer portal
                  window.open('https://www.creem.io/customer-portal', '_blank', 'noopener,noreferrer')
                }
              }}
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-300 px-4 py-3 rounded-lg transition-colors text-left"
            >
              <div className="font-medium">💳 Manage Payment Methods</div>
              <div className="text-sm text-gray-600 mt-1">
                Update payment methods, view billing history
              </div>
            </button>

            {/* Customer support */}
            <a
              href="mailto:supportadmin@cuttingasmr.org"
              className="bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-300 px-4 py-3 rounded-lg transition-colors text-left block"
            >
              <div className="font-medium">📧 Contact Support</div>
              <div className="text-sm text-gray-600 mt-1">
                Need help? We respond within 3 business days
              </div>
            </a>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
            <p className="text-emerald-800 text-sm">
              <strong>💡 Payment Management:</strong> Clicking "Manage Payment Methods" will open the Creem customer portal where you can safely manage your payment methods, view detailed billing history, and handle any payment-related matters.
            </p>
          </div>
        </div>

        {/* Data management */}
        <div className="mt-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🔒</span>
            Data Management
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export data */}
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/user/export-data')
                  if (response.ok) {
                    const data = await response.json()
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `cuttingasmr-data-${new Date().toISOString().split('T')[0]}.json`
                    a.click()
                    URL.revokeObjectURL(url)
                  } else {
                    alert('Export failed, please try again later')
                  }
                } catch (error) {
                  console.error('Export data failed:', error)
                  alert('Export failed, please try again later')
                }
              }}
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 px-4 py-3 rounded-lg transition-colors text-left"
            >
              <div className="font-medium">📥 Export My Data</div>
              <div className="text-sm text-gray-600 mt-1">
                Download a JSON file containing all your data
              </div>
            </button>

            {/* Clear video history */}
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to clear all video generation history? This action cannot be undone.')) {
                  try {
                    const response = await fetch('/api/user/clear-videos', { method: 'DELETE' })
                    if (response.ok) {
                      setVideos([])
                      alert('Video history cleared')
                    } else {
                      alert('Clear failed, please try again later')
                    }
                  } catch (error) {
                    console.error('Clear video history failed:', error)
                    alert('Clear failed, please try again later')
                  }
                }
              }}
              className="bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-300 px-4 py-3 rounded-lg transition-colors text-left"
            >
              <div className="font-medium">🗑️ Clear Video History</div>
              <div className="text-sm text-gray-600 mt-1">
                Delete all video generation records
              </div>
            </button>
            
            {/* Clear preferences */}
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to reset all preferences? This will clear your ASMR type preferences.')) {
                  try {
                    const response = await fetch('/api/user/clear-preferences', { method: 'DELETE' })
                    if (response.ok) {
                      alert('Preferences reset successfully')
                    } else {
                      alert('Reset failed, please try again later')
                    }
                  } catch (error) {
                    console.error('Reset preferences failed:', error)
                    alert('Reset failed, please try again later')
                  }
                }
              }}
              className="bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-300 px-4 py-3 rounded-lg transition-colors text-left"
            >
              <div className="font-medium">🔄 Reset Preferences</div>
              <div className="text-sm text-gray-600 mt-1">
                Clear ASMR type preferences and settings
              </div>
            </button>

            {/* Delete account */}
            <button
              onClick={async () => {
                const confirmation = prompt('Account deletion is irreversible. Please type "DELETE" to confirm:')
                if (confirmation === 'DELETE') {
                  try {
                    const response = await fetch('/api/user/delete-account', { method: 'DELETE' })
                    if (response.ok) {
                      alert('Account deletion request submitted. We will process your request within 24 hours.')
                      window.location.href = '/'
                    } else {
                      alert('Deletion request failed, please contact support')
                    }
                  } catch (error) {
                    console.error('Delete account failed:', error)
                    alert('Deletion request failed, please contact support')
                  }
                }
              }}
              className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 px-4 py-3 rounded-lg transition-colors text-left"
            >
              <div className="font-medium">⚠️ Delete Account</div>
              <div className="text-sm text-gray-600 mt-1">
                Permanently delete account and all data
              </div>
            </button>
          </div>

          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-emerald-800 text-sm">
              💡 <strong>Data Protection</strong>: According to our privacy policy, you have the right to access, correct, delete, or export your personal data.
              For assistance, please contact <a href="mailto:supportadmin@cuttingasmr.org" className="underline text-emerald-700 hover:text-emerald-600">supportadmin@cuttingasmr.org</a>
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="/pricing"
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            Buy Credits
          </a>
          
          <a
            href="/"
            className="bg-stone-200 hover:bg-stone-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors border border-stone-300"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
} 