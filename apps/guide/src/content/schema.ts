import { z } from 'zod'

export const TripEnum = z.enum(['1day', '3day', '5day'])
export type Trip = z.infer<typeof TripEnum>

export const StopKindEnum = z.enum([
  'viewpoint',
  'trailhead',
  'parking',
  'lodging',
  'meal',
  'drive',
])
export type StopKind = z.infer<typeof StopKindEnum>

export const Stop = z.object({
  id: z.string(),                         // "tunnel-view-arrival"
  title: z.string(),
  trip: TripEnum,
  day: z.number(),                        // 1-indexed within the trip
  order: z.number(),                      // sort within day
  kind: StopKindEnum,
  coord: z.tuple([z.number(), z.number()]).optional(),  // [lng, lat]
  elevationFt: z.number().optional(),
  timeBudgetMin: z.number().optional(),
  body: z.string(),                       // markdown
  photos: z
    .array(
      z.object({
        src: z.string(),                  // "/photos/tunnel-view.jpg"
        caption: z.string().optional(),
      }),
    )
    .default([]),
  swap: z.string().optional(),            // "If full, drive to Valley View"
})

export type StopT = z.infer<typeof Stop>

export const Stops = z.array(Stop)
