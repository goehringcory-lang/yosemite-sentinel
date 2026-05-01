import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'tfg.install.dismissed'

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
}

export default function InstallPrompt() {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [hidden, setHidden] = useState(
    () => isStandalone() || localStorage.getItem(DISMISS_KEY) === '1',
  )

  useEffect(() => {
    if (hidden) return
    function handler(e: Event) {
      e.preventDefault()
      setEvent(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [hidden])

  if (hidden || !event) return null

  async function install() {
    if (!event) return
    await event.prompt()
    setEvent(null)
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1')
    setHidden(true)
  }

  return (
    <div
      role="dialog"
      aria-label="Install The Field Guide"
      style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        maxWidth: 480,
        margin: '0 auto',
        background: 'var(--paper)',
        border: '1px solid var(--rule)',
        borderRadius: 8,
        padding: '14px 16px',
        boxShadow: '0 8px 24px rgba(20, 17, 12, 0.12)',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        zIndex: 50,
      }}
    >
      <div style={{ flex: 1, fontFamily: 'var(--serif)', fontSize: 14, lineHeight: 1.4 }}>
        Add to home screen for offline access.
      </div>
      <button
        type="button"
        className="btn btn--ghost"
        onClick={dismiss}
        style={{ padding: '6px 10px', fontSize: 13 }}
      >
        Not now
      </button>
      <button
        type="button"
        className="btn"
        onClick={install}
        style={{ padding: '6px 14px', fontSize: 13 }}
      >
        Install
      </button>
    </div>
  )
}
