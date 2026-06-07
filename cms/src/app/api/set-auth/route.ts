import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { token } = await request.json()

  const response = NextResponse.json({ ok: true })

  response.cookies.set('payload-token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 604800,
    path: '/',
  })

  return response
}
