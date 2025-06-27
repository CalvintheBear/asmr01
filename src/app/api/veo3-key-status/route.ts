import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const veoKeys = [
      process.env.VEO3_API_KEY,
      process.env.VEO3_API_KEY_2,
      process.env.VEO3_API_KEY_3,
      process.env.VEO3_API_KEY_4,
      process.env.VEO3_API_KEY_5
    ].filter(Boolean);

    return NextResponse.json({
      totalKeys: veoKeys.length,
      keysConfigured: veoKeys.map((key, index) => ({
        keyNumber: index + 1,
        configured: true,
        keyPreview: key ? key.substring(0, 10) + '...' : 'N/A'
      })),
      baseUrl: process.env.VEO3_API_BASE_URL || 'https://api.kie.ai',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check VEO3 API keys',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 