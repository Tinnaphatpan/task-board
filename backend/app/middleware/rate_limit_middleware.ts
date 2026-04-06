import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export default class RateLimitMiddleware {
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests = 10, windowMs = 60_000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  async handle({ request, response }: HttpContext, next: NextFn) {
    const ip = request.ip()
    const key = `${ip}:${request.url()}`
    const now = Date.now()

    const entry = store.get(key)

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + this.windowMs })
      return next()
    }

    entry.count++

    if (entry.count > this.maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
      response.header('Retry-After', String(retryAfter))
      response.header('X-RateLimit-Limit', String(this.maxRequests))
      response.header('X-RateLimit-Remaining', '0')
      return response.tooManyRequests({
        error: 'คำขอมากเกินไป กรุณาลองใหม่ในอีกสักครู่',
      })
    }

    response.header('X-RateLimit-Limit', String(this.maxRequests))
    response.header('X-RateLimit-Remaining', String(this.maxRequests - entry.count))
    return next()
  }
}
