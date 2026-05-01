import { Link, Navigate, useParams } from 'react-router-dom'
import { TripEnum, getDayCount, getStopsByDay } from '../content'
import GatedChrome from '../components/GatedChrome'

const TRIP_TITLES: Record<string, string> = {
  '1day': 'The One-Day Plan',
  '3day': 'The Three-Day Plan',
  '5day': 'The Five-Day Plan',
}

const TRIP_SUBTITLES: Record<string, string> = {
  '1day': 'A complete strategy for a single day in the park.',
  '3day': 'The most common Yosemite trip. Balanced across the Valley and Glacier Point.',
  '5day': 'The trip that actually shows you what the park is.',
}

export default function Trip() {
  const params = useParams<{ tripId: string }>()
  const parsed = TripEnum.safeParse(params.tripId)
  if (!parsed.success) return <Navigate to="/" replace />
  const trip = parsed.data

  const totalDays = getDayCount(trip)
  const days = Array.from({ length: totalDays }, (_, i) => i + 1)

  return (
    <GatedChrome>
      <main className="wrap wrap--narrow" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div className="eyebrow eyebrow--moss" style={{ marginBottom: 14 }}>
          The Field Guide · 2026 Edition
        </div>
        <h1 style={{ marginBottom: 18 }}>{TRIP_TITLES[trip]}</h1>
        <p style={{ color: 'var(--ink-2)', marginBottom: 36 }}>{TRIP_SUBTITLES[trip]}</p>

        {totalDays === 0 ? (
          <p style={{ color: 'var(--ink-3)', fontStyle: 'italic' }}>Coming soon.</p>
        ) : (
          <nav>
            {days.map((d) => {
              const stopCount = getStopsByDay(trip, d).length
              return (
                <Link key={d} to={`/trip/${trip}/day/${d}`} className="day-row">
                  <span className="day-row__label">Day {d}</span>
                  <span className="day-row__count">
                    {stopCount} {stopCount === 1 ? 'stop' : 'stops'}
                  </span>
                </Link>
              )
            })}
          </nav>
        )}

        <p style={{ marginTop: 48 }}>
          <Link to="/" style={{ fontFamily: 'var(--sans)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600 }}>
            ← Back to trips
          </Link>
        </p>
      </main>
    </GatedChrome>
  )
}
