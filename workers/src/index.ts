import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env } from './env'
import { auth } from './routes/auth'
import { checkout } from './routes/checkout'
import { stripe } from './routes/stripe'

const app = new Hono<{ Bindings: Env }>()

app.use(
  '/api/*',
  cors({
    origin: (origin, c) => {
      // Allow editorial site, the PWA, and local dev.
      const allowed = new Set([
        c.env.APP_BASE_URL,
        c.env.EDITORIAL_BASE_URL,
        'http://localhost:5173',
        'http://localhost:8000',
      ])
      return allowed.has(origin) ? origin : c.env.APP_BASE_URL
    },
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Authorization', 'Content-Type', 'stripe-signature'],
    maxAge: 600,
  }),
)

app.get('/', (c) => c.text('Talus Field Guide API. See /api/inventory.'))

app.route('/api/auth', auth)
app.route('/api/checkout', checkout)
app.route('/api/stripe', stripe)

export default app
