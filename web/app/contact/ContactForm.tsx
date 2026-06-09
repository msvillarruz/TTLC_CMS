'use client'

import { useState } from 'react'
import type { Program } from '@/lib/api'
import { submitTrialRequest } from '@/lib/api'

const inputStyle = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  border: '1.5px solid #e5e7eb',
  borderRadius: '10px',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
  color: 'var(--color-ink)',
  background: '#fff',
}

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'rgba(26,26,46,0.6)',
  marginBottom: '0.375rem',
  fontFamily: 'var(--font-display)',
}

export default function ContactForm({ programs }: { programs: Program[] }) {
  const [form, setForm] = useState({
    childName: '',
    childBirthday: '',
    parentName: '',
    email: '',
    preferredDate: '',
    preferredProgram: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await submitTrialRequest({
      childName: form.childName,
      childBirthday: form.childBirthday,
      parentName: form.parentName,
      email: form.email,
      preferredDate: form.preferredDate,
      preferredProgram: Number(form.preferredProgram),
    })
    setLoading(false)
    if (result.ok) {
      setSuccess(true)
    } else {
      setError(result.message || 'Something went wrong. Please try again.')
    }
  }

  if (success) {
    return (
      <div
        className="rounded-3xl p-10 text-center"
        style={{ background: 'linear-gradient(135deg, #F0FFF8 0%, #FFF5FB 100%)', boxShadow: '0 4px 24px rgba(26,26,46,0.07)' }}
      >
        <div className="text-5xl mb-5">🎉</div>
        <h2
          className="text-2xl font-900 text-ink mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          You're all set!
        </h2>
        <p className="text-ink/60 leading-relaxed">
          We've received your trial request. Our team will reach out within 24 hours to confirm your schedule.
        </p>
        <p className="text-sm text-teal font-700 mt-4" style={{ fontFamily: 'var(--font-display)' }}>
          Can't wait to meet your little thinker! 🌟
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-8"
      style={{ boxShadow: '0 4px 24px rgba(26,26,46,0.07)' }}
    >
      <h2
        className="text-xl font-900 text-ink mb-6"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Trial Request Form
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label style={labelStyle}>Child&apos;s Full Name *</label>
          <input
            type="text"
            required
            value={form.childName}
            onChange={(e) => set('childName', e.target.value)}
            placeholder="e.g. Sofia dela Cruz"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Child&apos;s Birthday *</label>
          <input
            type="date"
            required
            value={form.childBirthday}
            onChange={(e) => set('childBirthday', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Parent / Guardian Name *</label>
          <input
            type="text"
            required
            value={form.parentName}
            onChange={(e) => set('parentName', e.target.value)}
            placeholder="e.g. Maria dela Cruz"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Email Address *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="maria@email.com"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Preferred Trial Date *</label>
          <input
            type="date"
            required
            value={form.preferredDate}
            onChange={(e) => set('preferredDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Preferred Program *</label>
          <select
            required
            value={form.preferredProgram}
            onChange={(e) => set('preferredProgram', e.target.value)}
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
          >
            <option value="">Select a program…</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Ages {p.ageMin}–{p.ageMax})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-500 font-600" style={{ fontFamily: 'var(--font-display)' }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-7 w-full py-4 rounded-2xl text-base font-800 text-white transition-opacity"
        style={{
          background: 'var(--color-pink)',
          fontFamily: 'var(--font-display)',
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 18px rgba(233,30,140,0.25)',
        }}
      >
        {loading ? 'Submitting…' : 'Submit Trial Request'}
      </button>

      <p className="text-center text-xs text-ink/30 mt-3">
        Free trial · No commitment · We&apos;ll confirm within 24 hours
      </p>
    </form>
  )
}
