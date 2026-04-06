import type { HttpContext } from '@adonisjs/core/http'
import Notification from '#models/notification'

export default class NotificationsController {
  async index({ auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = request.input('page', 1)
    const notifications = await Notification.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .paginate(page, 30)
    return notifications
  }

  async markRead({ params, auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const notification = await Notification.find(Number(params.id))
    if (!notification || notification.userId !== user.id) {
      return response.notFound({ error: 'Notification not found' })
    }
    notification.read = true
    await notification.save()
    return notification
  }

  async markAllRead({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    await Notification.query().where('user_id', user.id).where('read', false).update({ read: true })
    return { success: true }
  }

  async unreadCount({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const count = await Notification.query()
      .where('user_id', user.id)
      .where('read', false)
      .count('* as total')
    return { count: Number((count[0] as any).$extras.total) }
  }
}
