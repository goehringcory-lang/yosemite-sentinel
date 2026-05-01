import { useEffect, useState } from 'react'
import { triggerUpdate } from '../pwa/registerSW'

export default function UpdateBanner() {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<ServiceWorkerRegistration>).detail
      if (detail) setRegistration(detail)
    }
    window.addEventListener('tfg:update-ready', handler)
    return () => window.removeEventListener('tfg:update-ready', handler)
  }, [])

  if (!registration) return null

  return (
    <button
      type="button"
      onClick={() => triggerUpdate(registration)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'var(--moss)',
        color: 'var(--paper)',
        border: 0,
        padding: '10px 16px',
        fontFamily: 'var(--sans)',
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.04em',
        cursor: 'pointer',
        textAlign: 'center',
        zIndex: 60,
      }}
    >
      Updated — tap to refresh.
    </button>
  )
}
