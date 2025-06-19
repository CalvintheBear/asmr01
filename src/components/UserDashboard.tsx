'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      console.log('🚀 Starting Google sign in...')
      
      await signIn('google', { 
        callbackUrl: '/',
        redirect: true
      })
    } catch (error) {
      console.error('❌ Sign in error:', error)
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      console.log('👋 Signing out...')
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('❌ Sign out error:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {session.user.image && (
                  <img 
                    src={session.user.image} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome, {session.user.name || session.user.email}!
                  </h1>
                  <p className="text-gray-600">{session.user.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="font-semibold text-purple-800 mb-2">Total Credits</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {session.user.credits?.total || 10}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-2">Used</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {session.user.credits?.used || 0}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-2">Remaining</h3>
                <p className="text-2xl font-bold text-green-600">
                  {session.user.credits?.remaining || 10}
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link 
                href="/"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Start Creating ASMR Videos
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-xl overflow-hidden">
              <img src="/logo.png" alt="CuttingASMR Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
          <p className="text-gray-600">Access your CuttingASMR account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 mr-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <div className="text-center mt-6">
            <Link 
              href="/"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 