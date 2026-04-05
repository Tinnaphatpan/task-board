import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  async index({ request }: HttpContext) {
    const search = request.qs().search as string | undefined
    const query = User.query().select('id', 'full_name', 'email')
    if (search) {
      query.where((builder) => {
        builder
          .whereILike('full_name', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
      })
    }
    const users = await query.limit(20)
    return users.map((u) => ({ id: u.id, fullName: u.fullName, email: u.email }))
  }
}
