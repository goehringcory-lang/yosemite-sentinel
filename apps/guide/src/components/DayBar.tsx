import { Link } from 'react-router-dom'
import type { Trip } from '../content'

type Props = {
  trip: Trip
  day: number
  totalDays: number
}

export default function DayBar({ trip, day, totalDays }: Props) {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1)
  return (
    <div className="daybar">
      <div className="wrap daybar__inner">
        <span className="daybar__label">
          Day {day} of {totalDays}
        </span>
        <span className="daybar__dots">
          {days.map((d) => (
            <Link
              key={d}
              to={`/trip/${trip}/day/${d}`}
              aria-label={`Go to day ${d}`}
              aria-current={d === day ? 'page' : undefined}
              className={`daybar__dot ${d === day ? 'daybar__dot--active' : ''}`.trim()}
            />
          ))}
        </span>
      </div>
    </div>
  )
}
