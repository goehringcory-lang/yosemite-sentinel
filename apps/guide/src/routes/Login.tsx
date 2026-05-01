import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch, ApiError } from '../lib/api'
import { useAuth } from '../auth/AuthGate'

type LoginResponse = { jwt: string }

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await apiFetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: code.trim() }),
      })
      signIn(res.jwt)
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError('Too many attempts. Try again in an hour.')
      } else if (err instanceof ApiError && err.status === 401) {
        setError("That code doesn't match. Check the email we sent you.")
      } else {
        setError(err instanceof Error ? err.message : 'Sign-in failed.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app-shell">
      <main className="wrap wrap--narrow" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide
        </div>
        <h1 style={{ marginBottom: 18 }}>Sign in</h1>
        <p style={{ color: 'var(--ink-2)', marginBottom: 36 }}>
          Enter the email you bought the guide with and the 6-digit code from your purchase email.
        </p>

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 18, maxWidth: 420 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span className="eyebrow">Email</span>
            <input
              className="input"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span className="eyebrow">6-digit code</span>
            <input
              className="input"
              type="text"
              required
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />
          </label>

          {error && (
            <div style={{ color: 'var(--moss)', fontSize: 14 }}>{error}</div>
          )}

          <button className="btn" type="submit" disabled={busy}>
            {busy ? 'Checking…' : 'Sign in →'}
          </button>
        </form>
      </main>
    </div>
  )
}
