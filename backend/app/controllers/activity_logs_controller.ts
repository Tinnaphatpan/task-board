import type { HttpContext } from '@adonisjs/core/http'
import { ActivityLogService } from '#services/activity_log_service'

const activityLogService = new ActivityLogService()

export default class ActivityLogsController {
  async index({ params }: HttpContext) {
    const logs = await activityLogService.listForBoard(Number(params.boardId))
    return logs.map((log) => ({
      id: log.id,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      description: log.description,
      createdAt: log.createdAt,
      user: log.user
        ? { id: log.user.id, fullName: log.user.fullName, email: log.user.email }
        : null,
    }))
  }
}
