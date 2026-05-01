import { Hono } from 'hono'
import type { Env } from '../env'
import {
  clearLoginAttempts,
  getBuyer,
  getEmailByAccessToken,
  recordLoginAttempt,
} from '../lib/kv'
import { signAccessJwt } from '../lib/jwt'
import { constantTimeEquals } from '../lib/tokens'

const MAX_LOGIN_ATTEMPTS_PER_HOUR = 5

export const auth = new Hono<{ Bindings: Env }>()

auth.post('/exchange', async (c) => {
  const body = await c.req.json<{ token?: string }>().catch(() => ({} as { token?: string }))
  const token = body.token?.trim()
  if (!token) return c.json({ error: 'Missing token' }, 400)

  const email = await getEmailByAccessToken(c.env, token)
  if (!email) return c.json({ error: 'Unknown or expired token' }, 401)

  const buyer = await getBuyer(c.env, email)
  if (!buyer) return c.json({ error: 'Buyer record missing' }, 401)
  if (buyer.expiresAt * 1000 < Date.now()) {
    return c.json({ error: 'Access has expired' }, 401)
  }

  const jwt = await signAccessJwt(email, c.env.MAGIC_LINK_SIGNING_SECRET)
  return c.json({ jwt })
})

auth.post('/login', async (c) => {
  const body = await c.req
    .json<{ email?: string; code?: string }>()
    .catch(() => ({} as { email?: string; code?: string }))
  const email = body.email?.trim().toLowerCase()
  const code = body.code?.trim()
  if (!email || !code) return c.json({ error: 'Missing email or code' }, 400)

  const attempts = await recordLoginAttempt(c.env, email)
  if (attempts > MAX_LOGIN_ATTEMPTS_PER_HOUR) {
    return c.json({ error: 'Too many attempts. Try again later.' }, 429)
  }

  const buyer = await getBuyer(c.env, email)
  if (!buyer) return c.json({ error: 'Email not recognized' }, 401)
  if (!constantTimeEquals(buyer.accessCode, code)) {
    return c.json({ error: 'Code does not match' }, 401)
  }
  if (buyer.expiresAt * 1000 < Date.now()) {
    return c.json({ error: 'Access has expired' }, 401)
  }

  await clearLoginAttempts(c.env, email)
  const jwt = await signAccessJwt(email, c.env.MAGIC_LINK_SIGNING_SECRET)
  return c.json({ jwt })
})
