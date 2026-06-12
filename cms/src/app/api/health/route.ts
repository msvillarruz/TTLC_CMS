import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'ttlc-cms',
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Service unavailable' },
      { status: 500 }
    )
  }
}
