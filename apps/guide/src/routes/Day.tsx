import { Link, Navigate, useParams } from 'react-router-dom'
import { TripEnum, getDayCount, getStopsByDay } from '../content'
import GatedChrome from '../components/GatedChrome'
import DayBar from '../components/DayBar'
import StopCard from '../components/StopCard'

export default function Day() {
  const params = useParams<{ tripId: string; dayN: string }>()
  const parsedTrip = TripEnum.safeParse(params.tripId)
  const dayN = Number.parseInt(params.dayN ?? '', 10)

  if (!parsedTrip.success || Number.isNaN(dayN) || dayN < 1) {
    return <Navigate to="/" replace />
  }
  const trip = parsedTrip.data
  const totalDays = getDayCount(trip)
  if (dayN > totalDays) {
    return <Navigate to={`/trip/${trip}`} replace />
  }

  const stops = getStopsByDay(trip, dayN)

  return (
    <GatedChrome>
      <DayBar trip={trip} day={dayN} totalDays={totalDays} />
      <main className="wrap wrap--narrow" style={{ paddingTop: 36, paddingBottom: 96 }}>
        {stops.length === 0 ? (
          <p style={{ color: 'var(--ink-3)', fontStyle: 'italic' }}>No stops yet for this day.</p>
        ) : (
          stops.map((stop, i) => (
            <div key={stop.id}>
              <StopCard stop={stop} />
              {i < stops.length - 1 && <hr className="stop-divider" />}
            </div>
          ))
        )}

        <p style={{ marginTop: 56 }}>
          <Link
            to={`/trip/${trip}`}
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              fontWeight: 600,
            }}
          >
            ← Back to trip overview
          </Link>
        </p>
      </main>
    </GatedChrome>
  )
}
