type Props = {
  coord: [number, number] | undefined
  label: string
}

const isAppleMaps =
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS Safari reports as Mac; treat touch-Macs as iOS for the maps:// scheme.
    (/Mac/.test(navigator.userAgent) && navigator.maxTouchPoints > 1))

export default function MapsLink({ coord, label }: Props) {
  if (!coord) return null
  const [lng, lat] = coord
  const url = isAppleMaps
    ? `maps://?ll=${lat},${lng}&q=${encodeURIComponent(label)}`
    : `https://maps.google.com/?q=${lat},${lng}`
  return (
    <a className="gps-chip" href={url} rel="noopener">
      {lat.toFixed(5)}, {lng.toFixed(5)} →
    </a>
  )
}
