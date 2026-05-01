import { stops } from './stops'
import type { StopT, Trip } from './schema'

export { Stop, Stops, TripEnum, StopKindEnum } from './schema'
export type { StopT, Trip, StopKind } from './schema'
export { stops } from './stops'

function byDayThenOrder(a: StopT, b: StopT): number {
  return a.day - b.day || a.order - b.order
}

export function getStopsByTrip(trip: Trip): StopT[] {
  return stops.filter((s) => s.trip === trip).sort(byDayThenOrder)
}

export function getStopsByDay(trip: Trip, day: number): StopT[] {
  return stops
    .filter((s) => s.trip === trip && s.day === day)
    .sort((a, b) => a.order - b.order)
}

export function getStopById(id: string): StopT | undefined {
  return stops.find((s) => s.id === id)
}

export function getDayCount(trip: Trip): number {
  const tripStops = stops.filter((s) => s.trip === trip)
  if (tripStops.length === 0) return 0
  return tripStops.reduce((max, s) => Math.max(max, s.day), 0)
}
