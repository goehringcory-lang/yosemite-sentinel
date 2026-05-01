import { Link } from 'react-router-dom'
import type { Trip } from '../content'

type Props = {
  trip: Trip
  title: string
  teaser: string
  dayCount: number
  stopCount: number
}

export default function TripPickerCard({ trip, title, teaser, dayCount, stopCount }: Props) {
  return (
    <Link to={`/trip/${trip}`} className="trip-picker-card">
      <div className="eyebrow eyebrow--moss">The Field Guide</div>
      <h2 className="trip-picker-card__title">{title}</h2>
      <p className="trip-picker-card__teaser">{teaser}</p>
      <div className="dateline">
        {dayCount} {dayCount === 1 ? 'day' : 'days'} · {stopCount} {stopCount === 1 ? 'stop' : 'stops'}
      </div>
    </Link>
  )
}
