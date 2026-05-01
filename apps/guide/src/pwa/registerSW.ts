type UpdateHandler = (registration: ServiceWorkerRegistration) => void

export function registerServiceWorker(onUpdate: UpdateHandler): void {
  if (!import.meta.env.PROD) return
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      registration.addEventListener('updatefound', () => {
        const installing = registration.installing
        if (!installing) return
        installing.addEventListener('statechange', () => {
          if (
            installing.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            onUpdate(registration)
          }
        })
      })
    })
  })
}

export async function triggerUpdate(
  registration: ServiceWorkerRegistration,
): Promise<void> {
  const waiting = registration.waiting
  if (!waiting) {
    window.location.reload()
    return
  }
  const reloaded = new Promise<void>((resolve) => {
    navigator.serviceWorker.addEventListener(
      'controllerchange',
      () => resolve(),
      { once: true },
    )
  })
  waiting.postMessage({ type: 'SKIP_WAITING' })
  await reloaded
  window.location.reload()
}
