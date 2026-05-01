// =============================================================================
// SEED STOPS — placeholder content for Phase 2.
// TODO: real bodies + coordinates land in the authoring slice after Phase 3.
// All `body` text below is placeholder. All `coord` fields are intentionally
// omitted; tappable GPS chips will simply not render until coords are added.
// =============================================================================

import { z } from 'zod'
import { Stops, type StopT } from './schema'

type StopInput = z.input<typeof Stops>[number]

const seed: StopInput[] = [
  {
    id: 'tunnel-view-arrival',
    title: 'Tunnel View, on arrival',
    trip: '1day',
    day: 1,
    order: 1,
    kind: 'viewpoint',
    timeBudgetMin: 20,
    body:
      'The first stop after coming through the Wawona Tunnel. The whole valley opens at once: El Cap on the left, Bridalveil Fall on the right, Half Dome anchoring the back. Pull over here before doing anything else, regardless of the time of day. The light will not look like the postcards if you arrive at noon, and that is fine — you are getting your bearings, not your photo.',
    photos: [
      { src: '/photos/tunnel-view.jpg', caption: 'Looking east into the valley.' },
    ],
  },
  {
    id: 'valley-loop-drive',
    title: 'Valley loop drive, Tunnel View to Curry Village',
    trip: '1day',
    day: 1,
    order: 2,
    kind: 'drive',
    timeBudgetMin: 40,
    body:
      'A slow drive east on Southside Drive. Three short pullouts worth taking: Bridalveil Fall parking, Cathedral Beach for the El Capitan view, and the Swinging Bridge. Do not commit to a hike yet. You are previewing.',
  },
  {
    id: 'lower-yosemite-fall',
    title: 'Lower Yosemite Fall trailhead',
    trip: '1day',
    day: 1,
    order: 3,
    kind: 'trailhead',
    elevationFt: 4035,
    timeBudgetMin: 60,
    body:
      'Half-mile flat loop to the base of Lower Yosemite Fall. Loud and wet in spring, dry and atmospheric by August. Best done first thing in the morning before the parking lot fills.',
    swap: 'If the lot is full, park at Yosemite Village and walk in via the bike path. Adds ten minutes each way.',
  },
  {
    id: 'curry-village-stay',
    title: 'Curry Village, night one',
    trip: '3day',
    day: 1,
    order: 1,
    kind: 'lodging',
    body:
      'Tent cabins or wood cabins, your call. The location is what you are paying for: walking distance to the shuttle, the dining hall, and the trailhead for Mist Trail in the morning. Reservations open thirteen months out and the good months sell in minutes.',
  },
  {
    id: 'el-portal-dinner',
    title: 'Dinner in El Portal',
    trip: '3day',
    day: 2,
    order: 4,
    kind: 'meal',
    body:
      'Forty minutes out of the valley but a real meal at the end of a long park day. Park at the lodge, walk across the bridge.',
  },
  {
    id: 'tuolumne-meadows-overlook',
    title: 'Pothole Dome, Tuolumne Meadows',
    trip: '5day',
    day: 3,
    order: 1,
    kind: 'viewpoint',
    elevationFt: 8593,
    timeBudgetMin: 45,
    body:
      'Short scramble up a granite dome at the western end of the meadows. The reward is a 360-degree look at the high country: Cathedral Range to the south, Lembert Dome to the east, the Tuolumne River winding through the meadow floor. Best at golden hour.',
  },
]

// Validate the entire collection at module-load. Any schema violation throws
// here and Vite surfaces it in the browser overlay or fails the build in CI.
export const stops: StopT[] = Stops.parse(seed)
