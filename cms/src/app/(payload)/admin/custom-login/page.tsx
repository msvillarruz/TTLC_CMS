'use client'

import { useState } from 'react'

export default function CustomLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.errors?.[0]?.message || data?.message || 'Login failed')
        return
      }

      const token = data?.token
      if (!token) {
        setError('Login failed: no token returned')
        return
      }

      const setAuth = await fetch('/api/set-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
        credentials: 'include',
      })

      if (!setAuth.ok) {
        setError('Failed to set auth cookie')
        return
      }

      window.location.href = '/admin'
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0d0d0d' }}>
      <div style={{ background: '#1a1a1a', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
        <h1 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#aaa', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{ width: '100%', padding: '0.625rem 0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: '#aaa', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ width: '100%', padding: '0.625rem 0.75rem', background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>
          {error && (
            <p style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '0.625rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
